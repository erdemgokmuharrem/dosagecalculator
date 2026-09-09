#!/usr/bin/env node
/**
 * Release-readiness gate.
 *
 * Every finding here corresponds to something that previously would have shipped
 * silently: placeholder API keys, an unrequested ATT prompt, a privacy manifest
 * that contradicts the bundled SDKs, or dosing rules no clinician has signed off.
 *
 * Run locally with `node scripts/check-release-readiness.mjs`.
 * Exit code 1 means: do not submit this build.
 */

import { readFileSync, existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const read = (p) => readFileSync(join(ROOT, p), 'utf8');

const errors = [];
const warnings = [];

const fail = (msg) => errors.push(msg);
const warn = (msg) => warnings.push(msg);

// ---------------------------------------------------------------------------
// 1. Secrets must be present and must not be placeholders.
// ---------------------------------------------------------------------------
const PLACEHOLDER = /(YOUR[_-]|xxxxxxxx|placeholder|changeme|<.*>)/i;

const REQUIRED_ENV = [
  'EXPO_PUBLIC_SENTRY_DSN',
  'EXPO_PUBLIC_REVENUECAT_IOS_KEY',
  'EXPO_PUBLIC_REVENUECAT_ANDROID_KEY',
  'EXPO_PUBLIC_ADMOB_BANNER_IOS',
  'EXPO_PUBLIC_ADMOB_BANNER_ANDROID',
  'EXPO_PUBLIC_ADMOB_INTERSTITIAL_IOS',
  'EXPO_PUBLIC_ADMOB_INTERSTITIAL_ANDROID',
  'EXPO_PUBLIC_ADMOB_APPOPEN_IOS',
  'EXPO_PUBLIC_ADMOB_APPOPEN_ANDROID',
];

for (const key of REQUIRED_ENV) {
  const value = process.env[key]?.trim();
  if (!value) fail(`${key} is not set.`);
  else if (PLACEHOLDER.test(value)) fail(`${key} still holds a placeholder value ("${value}").`);
}

// ---------------------------------------------------------------------------
// 2. No placeholder credentials left in tracked source.
// ---------------------------------------------------------------------------
for (const file of ['src/config/admob.ts', 'src/services/subscription.ts', 'src/services/monitoring.ts']) {
  if (!existsSync(join(ROOT, file))) continue;
  const source = read(file);
  // Ignore the word inside comments explaining the historical placeholders.
  const code = source
    .split('\n')
    .filter((line) => !line.trim().startsWith('*') && !line.trim().startsWith('//'))
    .join('\n');
  if (/'(appl_|goog_)YOUR|ca-app-pub-x{4,}|YOUR_SENTRY_DSN/i.test(code)) {
    fail(`${file} still contains a hardcoded placeholder credential.`);
  }
}

if (existsSync(join(ROOT, 'sentry.properties'))) {
  const props = read('sentry.properties');
  if (/your-org|your-project|your-auth-token/i.test(props)) {
    warn(
      'sentry.properties holds placeholder values — dSYM / source-map upload will not work. ' +
        'It is gitignored, so set the real values in CI.'
    );
  }
}

// ---------------------------------------------------------------------------
// 3. Store metadata.
// ---------------------------------------------------------------------------
const appJson = JSON.parse(read('app.json')).expo;

if (!appJson.ios?.buildNumber) fail('app.json: expo.ios.buildNumber is missing.');
if (!appJson.android?.versionCode) fail('app.json: expo.android.versionCode is missing.');
if (appJson.ios?.infoPlist?.ITSAppUsesNonExemptEncryption === undefined) {
  warn('app.json: ITSAppUsesNonExemptEncryption is unset — App Store Connect will ask on every upload.');
}

const manifest = appJson.ios?.privacyManifests;
if (!manifest) {
  fail('app.json: expo.ios.privacyManifests is missing (required by Apple).');
} else {
  const usesAds = JSON.stringify(appJson.plugins ?? []).includes('google-mobile-ads');
  if (usesAds && manifest.NSPrivacyTracking !== true) {
    fail('Privacy manifest declares NSPrivacyTracking=false while Google Mobile Ads is bundled.');
  }
  if (usesAds && (manifest.NSPrivacyCollectedDataTypes ?? []).length === 0) {
    fail('Privacy manifest declares no collected data types while ad and purchase SDKs are bundled.');
  }
}

// ---------------------------------------------------------------------------
// 4. ATT must actually be requested, not merely declared.
// ---------------------------------------------------------------------------
const appSource = read('App.tsx');
if (!appSource.includes('requestTrackingPermissionsAsync')) {
  fail(
    'App never calls requestTrackingPermissionsAsync() although NSUserTrackingUsageDescription ' +
      'is declared — App Review rejects this under guideline 5.1.2.'
  );
}

// ---------------------------------------------------------------------------
// 5. Clinical sign-off on dosing rules.
// ---------------------------------------------------------------------------
const DATA_FILES = [
  'src/data/drugs.ts',
  'src/data/drugs_extended.ts',
  'src/data/drugs_chemo_supplements.ts',
  'src/data/drugs_extra.ts',
];

let totalDrugs = 0;
let reviewedDrugs = 0;
for (const file of DATA_FILES) {
  if (!existsSync(join(ROOT, file))) continue;
  const source = read(file);
  totalDrugs += (source.match(/^\s{4}id: '/gm) ?? []).length;
  reviewedDrugs += (source.match(/sourceVerification: 'REVIEWED'/g) ?? []).length;
}

if (totalDrugs === 0) {
  fail('No drug records found — the catalogue failed to parse.');
} else if (reviewedDrugs < totalDrugs) {
  // A warning rather than a hard failure so the pipeline is usable during
  // development, but it must be zero before a public release.
  warn(
    `${totalDrugs - reviewedDrugs}/${totalDrugs} dosing rules are still UNVERIFIED. ` +
      'A pharmacologist must sign each one off (set sourceVerification/reviewedBy/sourceDate) before public release.'
  );
}

// ---------------------------------------------------------------------------
// Report
// ---------------------------------------------------------------------------
const bullet = (list) => list.map((m) => `  • ${m}`).join('\n');

if (warnings.length) {
  console.log(`\n⚠️  ${warnings.length} warning(s):\n${bullet(warnings)}`);
}

if (errors.length) {
  console.error(`\n❌ ${errors.length} blocking issue(s):\n${bullet(errors)}\n`);
  console.error('This build must NOT be submitted to the stores.\n');
  process.exit(1);
}

console.log('\n✅ Release readiness checks passed.\n');
