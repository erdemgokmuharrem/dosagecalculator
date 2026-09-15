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
import { lookup } from 'node:dns/promises';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const read = p => readFileSync(join(ROOT, p), 'utf8');

const errors = [];
const warnings = [];

const fail = msg => errors.push(msg);
const warn = msg => warnings.push(msg);

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
  else if (PLACEHOLDER.test(value))
    fail(`${key} still holds a placeholder value ("${value}").`);
}

// ---------------------------------------------------------------------------
// 2. No placeholder credentials left in tracked source.
// ---------------------------------------------------------------------------
for (const file of [
  'src/config/admob.ts',
  'src/services/subscription.ts',
  'src/services/monitoring.ts',
]) {
  if (!existsSync(join(ROOT, file))) continue;
  const source = read(file);
  // Ignore the word inside comments explaining the historical placeholders.
  const code = source
    .split('\n')
    .filter(
      line => !line.trim().startsWith('*') && !line.trim().startsWith('//')
    )
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

if (!appJson.ios?.buildNumber)
  fail('app.json: expo.ios.buildNumber is missing.');
if (!appJson.android?.versionCode)
  fail('app.json: expo.android.versionCode is missing.');
if (appJson.ios?.infoPlist?.ITSAppUsesNonExemptEncryption === undefined) {
  warn(
    'app.json: ITSAppUsesNonExemptEncryption is unset — App Store Connect will ask on every upload.'
  );
}

const manifest = appJson.ios?.privacyManifests;
if (!manifest) {
  fail('app.json: expo.ios.privacyManifests is missing (required by Apple).');
} else {
  const usesAds = JSON.stringify(appJson.plugins ?? []).includes(
    'google-mobile-ads'
  );
  if (usesAds && manifest.NSPrivacyTracking !== true) {
    fail(
      'Privacy manifest declares NSPrivacyTracking=false while Google Mobile Ads is bundled.'
    );
  }
  if (usesAds && (manifest.NSPrivacyCollectedDataTypes ?? []).length === 0) {
    fail(
      'Privacy manifest declares no collected data types while ad and purchase SDKs are bundled.'
    );
  }
}

// ---------------------------------------------------------------------------
// 3b. The committed native projects must reflect app.json.
//
// ios/ and android/ are committed, so EAS builds them as they are and never
// re-runs prebuild. When they drift, settings changed in app.json silently do
// not ship. This happened: the committed Info.plist still forced light mode,
// lacked ITSAppUsesNonExemptEncryption and the localised ATT strings, and the
// Podfile still linked two native modules that had been removed.
// ---------------------------------------------------------------------------
const drift = [];
const plistPath = 'ios/DosageCalculator/Info.plist';
if (existsSync(join(ROOT, plistPath))) {
  const plist = read(plistPath);
  const plistValue = key => {
    const m = plist.match(
      new RegExp(`<key>${key}</key>\\s*<(string|true|false)\\s*/?>([^<]*)`)
    );
    if (!m) return undefined;
    return m[1] === 'string' ? m[2] : m[1];
  };
  const literal = v => v !== undefined && !v.startsWith('$(');

  const style = { automatic: 'Automatic', light: 'Light', dark: 'Dark' }[
    appJson.userInterfaceStyle ?? 'light'
  ];
  if (plistValue('UIUserInterfaceStyle') !== style) {
    drift.push(
      `Info.plist UIUserInterfaceStyle is "${plistValue('UIUserInterfaceStyle')}", app.json expects "${style}"`
    );
  }
  const shortVersion = plistValue('CFBundleShortVersionString');
  if (literal(shortVersion) && shortVersion !== appJson.version) {
    drift.push(
      `Info.plist CFBundleShortVersionString is "${shortVersion}", app.json version is "${appJson.version}"`
    );
  }
  const buildNumber = plistValue('CFBundleVersion');
  if (
    literal(buildNumber) &&
    appJson.ios?.buildNumber &&
    buildNumber !== String(appJson.ios.buildNumber)
  ) {
    drift.push(
      `Info.plist CFBundleVersion is "${buildNumber}", app.json ios.buildNumber is "${appJson.ios.buildNumber}"`
    );
  }
  const encryption = appJson.ios?.infoPlist?.ITSAppUsesNonExemptEncryption;
  if (
    encryption !== undefined &&
    plistValue('ITSAppUsesNonExemptEncryption') !== String(encryption)
  ) {
    drift.push(
      'Info.plist is missing ITSAppUsesNonExemptEncryption as declared in app.json'
    );
  }
  // Ad measurement must wait for consent: the SDK is initialised only after UMP
  // and ATT, and this flag stops it measuring before that.
  const adsPlugin = (appJson.plugins ?? []).find(
    p => Array.isArray(p) && p[0] === 'react-native-google-mobile-ads'
  );
  const delayMeasurement = adsPlugin?.[1]?.delayAppMeasurementInit;
  if (adsPlugin && delayMeasurement !== true) {
    fail(
      'app.json: react-native-google-mobile-ads must set delayAppMeasurementInit: true so ad measurement waits for consent.'
    );
  }
  if (
    delayMeasurement !== undefined &&
    plistValue('GADDelayAppMeasurementInit') !== String(delayMeasurement)
  ) {
    drift.push(
      `Info.plist GADDelayAppMeasurementInit is "${plistValue('GADDelayAppMeasurementInit')}", app.json expects "${delayMeasurement}"`
    );
  }
  for (const lang of Object.keys(appJson.locales ?? {})) {
    if (
      !existsSync(
        join(
          ROOT,
          `ios/DosageCalculator/Supporting/${lang}.lproj/InfoPlist.strings`
        )
      )
    ) {
      drift.push(`localised Info.plist strings missing for "${lang}"`);
    }
  }
}
const gradlePath = 'android/app/build.gradle';
if (existsSync(join(ROOT, gradlePath))) {
  const gradle = read(gradlePath);
  const versionCode = gradle.match(/versionCode\s+(\d+)/)?.[1];
  const versionName = gradle.match(/versionName\s+"([^"]+)"/)?.[1];
  if (
    appJson.android?.versionCode &&
    versionCode !== String(appJson.android.versionCode)
  ) {
    drift.push(
      `build.gradle versionCode is ${versionCode}, app.json android.versionCode is ${appJson.android.versionCode}`
    );
  }
  if (versionName && versionName !== appJson.version) {
    drift.push(
      `build.gradle versionName is "${versionName}", app.json version is "${appJson.version}"`
    );
  }
}
for (const d of drift) {
  fail(
    `Native project out of sync with app.json: ${d}. Run \`npx expo prebuild --clean\` and commit the result.`
  );
}

// ---------------------------------------------------------------------------
// 3c. Public links must exist.
//
// App Review opens the privacy policy (5.1.1) and the support contact (1.5)
// from Settings. The domain in src/config/links.ts did not exist (NXDOMAIN)
// when first checked. Only a definite "no such host" blocks; being offline
// (EAI_AGAIN, timeouts) only warns, so the gate stays usable without network.
// ---------------------------------------------------------------------------
const linkHosts = [
  ...new Set(
    [
      ...read('src/config/links.ts').matchAll(
        /(?:https:\/\/|@)([a-z0-9.-]+\.[a-z]{2,})/gi
      ),
    ].map(m => m[1])
  ),
];
for (const host of linkHosts) {
  try {
    await lookup(host);
  } catch (error) {
    if (error.code === 'ENOTFOUND') {
      fail(
        `${host} (src/config/links.ts) does not resolve — the privacy policy, terms and support contact must be live before review.`
      );
    } else {
      warn(`Could not check ${host}: ${error.code ?? error.message}.`);
    }
  }
}
if (!process.env.EXPO_PUBLIC_APP_STORE_ID?.trim()) {
  warn(
    'EXPO_PUBLIC_APP_STORE_ID is not set — the "Rate the app" row stays hidden on iOS until it is.'
  );
}

// ---------------------------------------------------------------------------
// 4. ATT must actually be requested, not merely declared.
// ---------------------------------------------------------------------------
// ATT is requested by the consent flow, after the medical disclaimer.
const attSources = ['App.tsx', 'src/services/adConsent.ts']
  .filter(f => existsSync(join(ROOT, f)))
  .map(read)
  .join('\n');
if (!attSources.includes('requestTrackingPermissionsAsync')) {
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
let sourceCheckedDrugs = 0;
for (const file of DATA_FILES) {
  if (!existsSync(join(ROOT, file))) continue;
  const source = read(file);
  totalDrugs += (source.match(/^\s{4}id: '/gm) ?? []).length;
  reviewedDrugs += (source.match(/sourceVerification: 'REVIEWED'/g) ?? [])
    .length;
  sourceCheckedDrugs += (
    source.match(/sourceVerification: 'SOURCE_CHECKED'/g) ?? []
  ).length;
}

if (totalDrugs === 0) {
  fail('No drug records found — the catalogue failed to parse.');
} else if (reviewedDrugs < totalDrugs) {
  // A warning rather than a hard failure so the pipeline is usable during
  // development, but it must be zero before a public release.
  warn(
    `${totalDrugs - reviewedDrugs}/${totalDrugs} dosing rules lack clinical sign-off ` +
      `(${sourceCheckedDrugs} of them compared against a public source, the rest unchecked). ` +
      'Comparing a rule against a label is not sign-off: a pharmacologist or physician must ' +
      'set sourceVerification: REVIEWED with reviewedBy/sourceDate before public release.'
  );
}

// ---------------------------------------------------------------------------
// Report
// ---------------------------------------------------------------------------
const bullet = list => list.map(m => `  • ${m}`).join('\n');

if (warnings.length) {
  console.log(`\n⚠️  ${warnings.length} warning(s):\n${bullet(warnings)}`);
}

if (errors.length) {
  console.error(
    `\n❌ ${errors.length} blocking issue(s):\n${bullet(errors)}\n`
  );
  console.error('This build must NOT be submitted to the stores.\n');
  process.exit(1);
}

console.log('\n✅ Release readiness checks passed.\n');
