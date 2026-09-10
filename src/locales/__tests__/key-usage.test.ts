import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';
import tr from '../tr.json';

/**
 * Verifies that every translation key referenced in source actually exists.
 *
 * i18next resolves a missing key to the key string itself, so a typo renders
 * "vademecum.contraindicatons" on screen instead of a label — silently, and only
 * on the screen nobody opened during testing. That risk grew sharply when ~85
 * hardcoded labels were converted to `t()` calls in bulk.
 */

const SRC = join(__dirname, '..', '..');

const walk = (dir: string): string[] =>
  readdirSync(dir).flatMap(entry => {
    const full = join(dir, entry);
    if (statSync(full).isDirectory()) {
      return entry === '__tests__' || entry === 'locales' ? [] : walk(full);
    }
    return /\.tsx?$/.test(entry) ? [full] : [];
  });

type Json = { [key: string]: string | Json };

const resolve = (path: string): unknown =>
  path.split('.').reduce<unknown>((acc, part) => {
    if (acc && typeof acc === 'object' && part in (acc as Json)) {
      return (acc as Json)[part];
    }
    return undefined;
  }, tr as Json);

/**
 * Matches `t('some.key')` and `t("some.key")`. Deliberately ignores dynamic
 * keys such as t(`patient.${gender}`) and t(warning.code), which cannot be
 * checked statically — those are covered by the engine's own key list in
 * locale-parity.test.ts.
 */
const T_CALL = /\bt\(\s*['"]([A-Za-z][\w.]*)['"]/g;

const collectUsages = (): Array<{ file: string; key: string }> => {
  const usages: Array<{ file: string; key: string }> = [];
  for (const file of walk(SRC)) {
    const source = readFileSync(file, 'utf8');
    for (const match of source.matchAll(T_CALL)) {
      usages.push({ file: file.replace(`${SRC}/`, ''), key: match[1] });
    }
  }
  return usages;
};

describe('translation key usage', () => {
  const usages = collectUsages();

  it('finds t() calls to check', () => {
    // Guards the scanner itself: a broken regex would make this suite vacuous.
    expect(usages.length).toBeGreaterThan(100);
  });

  it('resolves every statically referenced key to a string', () => {
    const missing = usages
      .filter(({ key }) => typeof resolve(key) !== 'string')
      .map(({ file, key }) => `${file}: ${key}`);

    // Deduplicate so one bad key used in five places reports once.
    expect([...new Set(missing)]).toEqual([]);
  });

  it('never points a label at a whole namespace instead of a leaf', () => {
    const namespaces = usages
      .filter(({ key }) => {
        const value = resolve(key);
        return value !== undefined && typeof value === 'object';
      })
      .map(({ file, key }) => `${file}: ${key}`);

    expect([...new Set(namespaces)]).toEqual([]);
  });
});
