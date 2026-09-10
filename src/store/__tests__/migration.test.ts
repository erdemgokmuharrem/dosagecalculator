import i18n from '../../locales/i18n';
import { migrateState, STORE_VERSION } from '../index';
import { formatWarning, LEGACY_WARNING } from '../../features/dosage/warnings';
import type { DoseWarning } from '../../types';

/**
 * Persisted-state migration.
 *
 * Two things went wrong here before and both destroy user data quietly:
 * persistence fell back to `localStorage` (absent in React Native) so nothing
 * was ever saved, and the warning shape changed from `string[]` to structured
 * `DoseWarning[]`. A migration that drops or mangles saved calculations is worse
 * than one that fails loudly, so these tests assert records survive intact.
 */

const v1Calculation = (over: Record<string, unknown> = {}) => ({
  id: '1',
  patientId: 'p1',
  drugId: 'd1',
  calculatedDose: 500,
  unit: 'mg',
  frequency: 'q6h',
  timestamp: '2026-01-15T10:00:00.000Z',
  parameters: { patientWeight: 70, patientAge: 40 },
  drugName: 'Paracetamol',
  warnings: ['DİKKAT: Günlük toplam doz sınırı aşıldı.'],
  ...over,
});

describe('store migration v1 → v2', () => {
  it('preserves every calculation', () => {
    const state = migrateState(
      {
        calculations: [v1Calculation({ id: 'a' }), v1Calculation({ id: 'b' })],
      },
      1
    );
    expect(state.calculations).toHaveLength(2);
    expect(state.calculations?.map(c => c.id)).toEqual(['a', 'b']);
  });

  it('keeps every non-warning field untouched', () => {
    const [migrated] = migrateState(
      { calculations: [v1Calculation()] },
      1
    ).calculations!;
    expect(migrated.calculatedDose).toBe(500);
    expect(migrated.unit).toBe('mg');
    expect(migrated.frequency).toBe('q6h');
    expect(migrated.drugName).toBe('Paracetamol');
    expect(migrated.parameters).toEqual({ patientWeight: 70, patientAge: 40 });
  });

  it('wraps legacy string warnings as structured warnings', () => {
    const [migrated] = migrateState(
      { calculations: [v1Calculation()] },
      1
    ).calculations!;
    const warnings = migrated.warnings as unknown as DoseWarning[];
    expect(warnings).toHaveLength(1);
    expect(warnings[0].code).toBe(LEGACY_WARNING);
    expect(warnings[0].params.text).toBe(
      'DİKKAT: Günlük toplam doz sınırı aşıldı.'
    );
  });

  it('renders a migrated warning verbatim, punctuation and all', () => {
    const [migrated] = migrateState(
      { calculations: [v1Calculation()] },
      1
    ).calculations!;
    const warnings = migrated.warnings as unknown as DoseWarning[];
    // Rendered verbatim, without an i18next lookup keyed by the old prose.
    expect(formatWarning(i18n.t.bind(i18n), warnings[0])).toBe(
      'DİKKAT: Günlük toplam doz sınırı aşıldı.'
    );
  });

  it('tolerates a record with no warnings field', () => {
    const [migrated] = migrateState(
      { calculations: [v1Calculation({ warnings: undefined })] },
      1
    ).calculations!;
    expect(migrated.warnings).toEqual([]);
  });

  it('tolerates a corrupted warnings field', () => {
    const [migrated] = migrateState(
      { calculations: [v1Calculation({ warnings: 'not an array' })] },
      1
    ).calculations!;
    expect(migrated.warnings).toEqual([]);
  });

  it('leaves already-structured warnings alone', () => {
    const structured: DoseWarning = {
      code: 'safety.exceedsDailyMax',
      severity: 'critical',
      params: { daily: 4800, max: 4000, unit: 'mg' },
    };
    const [migrated] = migrateState(
      { calculations: [v1Calculation({ warnings: [structured] })] },
      1
    ).calculations!;
    expect((migrated.warnings as unknown as DoseWarning[])[0]).toEqual(
      structured
    );
  });

  it('is a no-op at the current version', () => {
    const input = { calculations: [v1Calculation()] };
    expect(migrateState(input, STORE_VERSION)).toBe(input);
  });

  it('survives an empty or missing persisted payload', () => {
    expect(migrateState(undefined, 1).calculations).toEqual([]);
    expect(migrateState(null, 1).calculations).toEqual([]);
    expect(migrateState({}, 1).calculations).toEqual([]);
  });

  it('preserves saved patients', () => {
    const patients = [
      {
        id: 'p1',
        age: 40,
        weight: 70,
        height: 175,
        gender: 'male' as const,
        patientType: 'adult' as const,
      },
    ];
    expect(migrateState({ patients, calculations: [] }, 1).patients).toEqual(
      patients
    );
  });
});
