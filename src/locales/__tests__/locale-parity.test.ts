import en from '../en.json';
import tr from '../tr.json';
import de from '../de.json';
import ru from '../ru.json';
import zh from '../zh.json';

/**
 * A missing translation in this app is not cosmetic. The dose-capping and
 * daily-overdose messages are emitted by the calculation engine as i18n codes;
 * if a locale lacks the key, a clinician working in that language sees the raw
 * key instead of an overdose warning. These tests make that impossible to ship.
 */

type Json = { [key: string]: string | Json };

const flatten = (obj: Json, prefix = ''): string[] =>
  Object.entries(obj).flatMap(([key, value]) => {
    const path = prefix ? `${prefix}.${key}` : key;
    return typeof value === 'object' && value !== null
      ? flatten(value as Json, path)
      : [path];
  });

const LOCALES: Record<string, Json> = {
  en: en as Json,
  tr: tr as Json,
  de: de as Json,
  ru: ru as Json,
  zh: zh as Json,
};

const REFERENCE = 'tr';
const referenceKeys = flatten(LOCALES[REFERENCE]).sort();

/** Keys the calculation engine can emit. Every one must exist in every locale. */
const ENGINE_KEYS = [
  'safety.cappedSingleDose',
  'safety.noSingleDoseCeiling',
  'safety.exceedsDailyMax',
  'safety.noDailyCeiling',
  'safety.unknownFrequency',
  'safety.unscheduledFrequency',
  'safety.noMatchingAgeBand',
  'safety.renalAdjustmentApplied',
  'safety.renalImpairmentNoRule',
  'safety.renalNotAssessed',
  'safety.pediatricEgfr',
  'safety.crclObesityCaveat',
  'safety.pediatricReview',
  'safety.unverifiedSource',
  'blocked.missingFormula',
  'blocked.nonNumericInput',
  'blocked.unsupportedAge',
  'blocked.negativeInput',
  'blocked.unsupportedWeight',
  'blocked.unsupportedHeight',
  'blocked.unsupportedCreatinine',
  'blocked.weightRequired',
  'blocked.bsaRequired',
  'blocked.renalDataRequired',
  'blocked.missingDosePerKg',
  'blocked.missingDosePerM2',
  'blocked.missingFixedDose',
  'blocked.unknownMethod',
  'blocked.nonFiniteResult',
];

describe.each(Object.keys(LOCALES))('locale: %s', lang => {
  const keys = flatten(LOCALES[lang]).sort();

  it('has exactly the same keys as the reference locale', () => {
    expect(keys.filter(k => !referenceKeys.includes(k))).toEqual([]);
    expect(referenceKeys.filter(k => !keys.includes(k))).toEqual([]);
  });

  it('defines every message the calculation engine can emit', () => {
    expect(ENGINE_KEYS.filter(k => !keys.includes(k))).toEqual([]);
  });

  it('has no empty strings', () => {
    const empty = flatten(LOCALES[lang]).filter(path => {
      const value = path
        .split('.')
        .reduce<unknown>((acc, part) => (acc as Json)?.[part], LOCALES[lang]);
      return typeof value === 'string' && value.trim() === '';
    });
    expect(empty).toEqual([]);
  });
});

describe('interpolation placeholders', () => {
  const placeholders = (text: string): string[] =>
    (text.match(/\{\{\s*[\w.]+\s*\}\}/g) ?? [])
      .map(p => p.replace(/[{}\s]/g, ''))
      .sort();

  const read = (locale: Json, path: string): string | undefined => {
    const value = path
      .split('.')
      .reduce<unknown>((acc, part) => (acc as Json)?.[part], locale);
    return typeof value === 'string' ? value : undefined;
  };

  it.each(ENGINE_KEYS)(
    '%s uses identical placeholders in every language',
    key => {
      const expected = placeholders(read(LOCALES[REFERENCE], key) ?? '');
      for (const [lang, locale] of Object.entries(LOCALES)) {
        // A placeholder typo renders literal "{{max}}" text where a number belongs.
        expect({
          lang,
          placeholders: placeholders(read(locale, key) ?? ''),
        }).toEqual({
          lang,
          placeholders: expected,
        });
      }
    }
  );
});
