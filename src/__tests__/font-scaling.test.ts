import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';

/**
 * Text must follow the system font size.
 *
 * iOS Dynamic Type and Android font size are how a clinician with low vision
 * reads a dose. React Native scales text by default, so the risk is a future
 * `allowFontScaling={false}` (or a multiplier of 1) added to "fix" a layout —
 * which silently freezes that text at the default size. App Review also checks
 * this for accessibility.
 */

const SRC = join(__dirname, '..');

const walk = (dir: string): string[] =>
  readdirSync(dir).flatMap(entry => {
    const full = join(dir, entry);
    if (statSync(full).isDirectory()) {
      return entry === '__tests__' ? [] : walk(full);
    }
    return entry.endsWith('.tsx') || entry.endsWith('.ts') ? [full] : [];
  });

const offences = (pattern: RegExp) => {
  const found: string[] = [];
  for (const file of walk(SRC)) {
    const source = readFileSync(file, 'utf8');
    for (const match of source.matchAll(pattern)) {
      const line = source.slice(0, match.index ?? 0).split('\n').length;
      found.push(`${file.replace(`${SRC}/`, '')}:${line}`);
    }
  }
  return found;
};

describe('font scaling', () => {
  it('is never switched off', () => {
    expect(offences(/allowFontScaling\s*=\s*\{\s*false\s*\}/g)).toEqual([]);
  });

  it('is never pinned to the default size by a multiplier of 1', () => {
    expect(offences(/maxFontSizeMultiplier\s*=\s*\{\s*1(\.0)?\s*\}/g)).toEqual(
      []
    );
  });
});
