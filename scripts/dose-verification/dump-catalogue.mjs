/**
 * Dumps the drug catalogue to JSON. The catalogue is TypeScript, so it is
 * loaded through Jest (the project's only TS runtime) via a throwaway test.
 *
 * Usage: node scripts/dose-verification/dump-catalogue.mjs <out.json>
 */
import { writeFileSync, rmSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import { join, dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..', '..');
const out = resolve(process.argv[2] ?? 'catalogue.json');
const probe = join(ROOT, 'src', '__catalogue_dump__.test.ts');

writeFileSync(
  probe,
  `import { writeFileSync } from 'node:fs';
import { sampleDrugs } from './data/drugs';
it('dumps the catalogue', () => {
  writeFileSync(process.env.DUMP_PATH as string, JSON.stringify(sampleDrugs, null, 1));
  expect(sampleDrugs.length).toBeGreaterThan(0);
});
`
);
try {
  execFileSync('npx', ['jest', probe, '--silent'], {
    cwd: ROOT,
    stdio: 'inherit',
    env: { ...process.env, DUMP_PATH: out },
  });
  console.log(`catalogue written to ${out}`);
} finally {
  rmSync(probe, { force: true });
}
