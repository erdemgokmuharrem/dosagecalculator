import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';

/**
 * Guards HTML built inside template literals (the PDF export) against JSX-style
 * interpolation.
 *
 * Inside a template literal `{t('key')}` is plain text; only `${t('key')}`
 * interpolates. A bulk JSX-oriented i18n pass once rewrote headings in the
 * drug-detail PDF template to `<h2>{t('vademecum.warnings')}</h2>`, so the
 * exported PDF would have printed the braces literally instead of a heading.
 *
 * React Native JSX in this codebase never uses lowercase HTML tags, so a line
 * that contains one alongside an un-prefixed `{t(` can only be template HTML
 * with a broken interpolation.
 */

const SRC = join(__dirname, '..');
const HTML_TAG =
  /<\/?(h[1-6]|p|li|ul|ol|div|span|td|th|tr|table|strong|b|em|br)\b[^>]*>/;
const JSX_STYLE_CALL = /(?<!\$)\{t\(/;

const walk = (dir: string): string[] =>
  readdirSync(dir).flatMap(entry => {
    const full = join(dir, entry);
    if (statSync(full).isDirectory()) {
      return entry === '__tests__' ? [] : walk(full);
    }
    return /\.tsx?$/.test(entry) ? [full] : [];
  });

describe('HTML template interpolation', () => {
  it('never uses JSX-style {t(...)} inside template HTML', () => {
    const broken: string[] = [];
    for (const file of walk(SRC)) {
      readFileSync(file, 'utf8')
        .split('\n')
        .forEach((line, index) => {
          if (HTML_TAG.test(line) && JSX_STYLE_CALL.test(line)) {
            broken.push(
              `${file.replace(`${SRC}/`, '')}:${index + 1}: ${line.trim()}`
            );
          }
        });
    }
    expect(broken).toEqual([]);
  });

  it('still recognises a broken interpolation (scanner self-check)', () => {
    const sample = "<h2>{t('vademecum.warnings')}</h2>";
    expect(HTML_TAG.test(sample) && JSX_STYLE_CALL.test(sample)).toBe(true);
    const fixed = "<h2>${t('vademecum.warnings')}</h2>";
    expect(HTML_TAG.test(fixed) && JSX_STYLE_CALL.test(fixed)).toBe(false);
  });
});
