import * as fc from 'fast-check';
import { calculateDosage } from '../calculations';
import type {
  Patient,
  Drug,
  DoseCalculationSuccess,
  RenalAdjustment,
} from '../../../types';

/**
 * Where age and renal factors sit relative to the single-dose ceiling, and how
 * renal bands resolve.
 *
 * Per-kg rules rely on `maxSingleDose` to produce the adult dose. A reduction
 * multiplied in before that ceiling was partly or wholly absorbed by it for any
 * adult whose dose came from the ceiling, while the result still said it had
 * been applied. A factor below 1 now scales the dose after the ceiling; a factor
 * above 1 raises the formula dose before it, so it can never breach it.
 *
 * All drugs here are fixtures, so catalogue fixes cannot break these tests.
 */

const patient = (over: Partial<Patient> = {}): Patient => ({
  id: 'p',
  age: 40,
  weight: 70,
  height: 175,
  gender: 'male',
  patientType: 'adult',
  ...over,
});

const drug = (formula: Partial<Drug['dosageFormula']>): Drug => ({
  id: 'd',
  name: 'Test Drug',
  genericName: 'test',
  category: 'Antibiotics',
  unit: 'mg',
  dosageForm: 'tablet',
  calculationMethod: 'weight',
  contraindications: [],
  sideEffects: [],
  dosageFormula: { method: 'weight', frequency: 'q12h', ...formula },
});

/**
 * Co-trimoxazole, trimethoprim component, per the FDA Bactrim label: 8 mg/kg/day
 * in two doses for children, 160 mg q12h for adults; CrCl above 30 the usual
 * regimen, 15-30 half the usual regimen, below 15 use not recommended.
 */
const cotrimoxazole = (
  renalAdjustments: RenalAdjustment[] = [
    { minGFR: 30, maxGFR: 1000, adjustmentFactor: 1 },
    { minGFR: 15, maxGFR: 30, adjustmentFactor: 0.5 },
    { minGFR: 0, maxGFR: 15, adjustmentFactor: 0 },
  ]
): Drug => ({
  ...drug({
    dosePerKg: 4,
    frequency: 'q12h',
    maxSingleDose: 160,
    maxDailyDose: 320,
    renalAdjustments,
  }),
  name: 'Co-trimoxazole',
});

/** Serum creatinine that gives `crcl` mL/min by Cockcroft-Gault for a man. */
const scrForCrCl = (crcl: number, age: number, weight: number) =>
  ((140 - age) * weight) / (72 * crcl);

/** Serum creatinine that gives `egfr` by bedside Schwartz (age 1 and over). */
const scrForSchwartz = (egfr: number, height: number) =>
  (0.413 * height) / egfr;

const ok = (r: ReturnType<typeof calculateDosage>): DoseCalculationSuccess => {
  if (r.status !== 'success')
    throw new Error(`expected success, got blocked: ${r.messageCode}`);
  return r;
};

const warning = (r: DoseCalculationSuccess, code: string) =>
  r.warnings.find(w => w.code === code);

// ---------------------------------------------------------------------------
describe('co-trimoxazole renal dosing (FDA label)', () => {
  it('gives half the usual adult regimen at CrCl 20: 80 mg, not 120 mg', () => {
    // 80 y, 60 kg, SCr 2.5 → CrCl (60 × 60) / (72 × 2.5) = 20 mL/min.
    const r = ok(
      calculateDosage(
        patient({ age: 80, weight: 60, height: 165, serumCreatinine: 2.5 }),
        cotrimoxazole()
      )
    );
    expect(r.renalEstimate?.value).toBe(20);
    expect(r.renalFactor).toBe(0.5);
    expect(r.doseMg).toBe(80);
    expect(r.frequency).toBe('q12h');
    expect(r.dailyTotalMg).toBe(160);
    expect(warning(r, 'safety.cappedSingleDose')?.params).toMatchObject({
      calculated: 240,
      max: 160,
    });
    expect(warning(r, 'safety.renalAdjustmentApplied')?.params).toMatchObject({
      factor: 0.5,
    });
    expect(r.formula).toBe(
      '60 kg × 4 mg/kg × 1 (age) → 160 mg (max) × 0.5 (renal)'
    );
  });

  it.each([80, 100, 140])(
    'gives a %s kg adult 80 mg at CrCl 15-30, never the full 160 mg',
    weight => {
      const usual = ok(
        calculateDosage(
          patient({ age: 50, weight, serumCreatinine: 1.0 }),
          cotrimoxazole()
        )
      );
      expect(usual.doseMg).toBe(160);

      for (const crcl of [16, 22, 29]) {
        const r = ok(
          calculateDosage(
            patient({
              age: 50,
              weight,
              serumCreatinine: scrForCrCl(crcl, 50, weight),
            }),
            cotrimoxazole()
          )
        );
        expect(r.renalEstimate?.value).toBeCloseTo(crcl, 5);
        expect(r.doseMg).toBe(80);
        expect(r.dailyTotalMg).toBe(160);
      }
    }
  );

  it('treats the bands as half-open: CrCl 30 is usual, CrCl 15 is halved', () => {
    // (140 − 68) × 60 = 4320, so SCr 2 → CrCl 30 and SCr 4 → CrCl 15 exactly.
    const at30 = ok(
      calculateDosage(
        patient({ age: 68, weight: 60, serumCreatinine: 2 }),
        cotrimoxazole()
      )
    );
    expect(at30.renalEstimate?.value).toBe(30);
    expect(at30.doseMg).toBe(160);

    const at15 = ok(
      calculateDosage(
        patient({ age: 68, weight: 60, serumCreatinine: 4 }),
        cotrimoxazole()
      )
    );
    expect(at15.renalEstimate?.value).toBe(15);
    expect(at15.doseMg).toBe(80);
  });

  it('refuses to dose below CrCl 15 instead of returning 0 mg', () => {
    // 80 y, 60 kg, SCr 5 → CrCl 10 mL/min: "use not recommended".
    const r = calculateDosage(
      patient({ age: 80, weight: 60, height: 165, serumCreatinine: 5 }),
      cotrimoxazole()
    );
    expect(r).toEqual({
      status: 'blocked',
      reason: 'CLINICAL_REVIEW_REQUIRED',
      messageCode: 'blocked.contraindicatedRenal',
      messageParams: { drug: 'Co-trimoxazole', value: 10, unit: 'mL/min' },
    });
  });

  describe('children', () => {
    const child = (over: Partial<Patient>) =>
      patient({
        age: 8,
        weight: 25,
        height: 128,
        patientType: 'child',
        ...over,
      });

    it('leaves a per-kg dose below the ceiling unchanged: 100 mg, or 50 mg at eGFR 20', () => {
      const normal = ok(
        calculateDosage(child({ serumCreatinine: 0.5 }), cotrimoxazole())
      );
      expect(normal.doseMg).toBe(100);

      const impaired = ok(
        calculateDosage(
          child({ serumCreatinine: scrForSchwartz(20, 128) }),
          cotrimoxazole()
        )
      );
      expect(impaired.renalEstimate?.method).toBe('schwartz');
      // 25 kg × 4 mg/kg × 0.5: the figure the engine gave before the fix.
      expect(impaired.doseMg).toBe(50);
      expect(impaired.cappedByMaximumDose).toBe(false);
    });

    it('halves the capped dose of an adolescent: 80 mg, not 140 mg', () => {
      // 16 y, 70 kg: 280 mg formula dose, capped to 160, then halved.
      const r = ok(
        calculateDosage(
          child({
            age: 16,
            weight: 70,
            height: 175,
            serumCreatinine: scrForSchwartz(20, 175),
          }),
          cotrimoxazole()
        )
      );
      expect(r.doseMg).toBe(80);
    });

    it('refuses below eGFR 15 and reports the Schwartz unit', () => {
      // 0.413 × 128 / 4 = 13.2 mL/min/1.73m².
      const r = calculateDosage(child({ serumCreatinine: 4 }), cotrimoxazole());
      expect(r.status).toBe('blocked');
      if (r.status === 'blocked') {
        expect(r.messageCode).toBe('blocked.contraindicatedRenal');
        expect(r.messageParams).toMatchObject({ unit: 'mL/min/1.73m²' });
      }
    });
  });
});

// ---------------------------------------------------------------------------
describe('overlapping renal bands', () => {
  it.each([
    [
      'reduction listed first',
      [
        { minGFR: 0, maxGFR: 30, adjustmentFactor: 0.5 },
        { minGFR: 0, maxGFR: 15, adjustmentFactor: 0 },
      ],
    ],
    [
      'contraindication listed first',
      [
        { minGFR: 0, maxGFR: 15, adjustmentFactor: 0 },
        { minGFR: 0, maxGFR: 30, adjustmentFactor: 0.5 },
      ],
    ],
  ])(
    'never hide a contraindication behind a permissive band (%s)',
    (_order, overlapping) => {
      const record = cotrimoxazole([
        { minGFR: 30, maxGFR: 1000, adjustmentFactor: 1 },
        ...overlapping,
      ]);
      const crcl10 = calculateDosage(
        patient({ age: 80, weight: 60, serumCreatinine: 5 }),
        record
      );
      expect(crcl10.status).toBe('blocked');
      if (crcl10.status === 'blocked')
        expect(crcl10.messageCode).toBe('blocked.contraindicatedRenal');

      const crcl20 = ok(
        calculateDosage(
          patient({ age: 80, weight: 60, serumCreatinine: 2.5 }),
          record
        )
      );
      expect(crcl20.doseMg).toBe(80);
    }
  );

  it('use the most restrictive valid band, ignoring an out-of-range one', () => {
    const record = cotrimoxazole([
      { minGFR: 0, maxGFR: 1000, adjustmentFactor: 1.5 },
      { minGFR: 0, maxGFR: 1000, adjustmentFactor: 0.5 },
    ]);
    const r = ok(
      calculateDosage(
        patient({ age: 80, weight: 60, serumCreatinine: 2.5 }),
        record
      )
    );
    expect(r.renalFactor).toBe(0.5);
    expect(r.doseMg).toBe(80);
  });
});

// ---------------------------------------------------------------------------
describe('age factors follow the same order', () => {
  // Shaped like paracetamol: 15 mg/kg q6h, max 1000 mg, reduced for infants,
  // children and the elderly.
  const paracetamol = drug({
    dosePerKg: 15,
    frequency: 'q6h',
    maxSingleDose: 1000,
    maxDailyDose: 4000,
    ageAdjustments: [
      { minAge: 0, maxAge: 1, adjustmentFactor: 0.7 },
      { minAge: 1, maxAge: 12, adjustmentFactor: 0.9 },
      { minAge: 12, maxAge: 65, adjustmentFactor: 1 },
      { minAge: 65, maxAge: 120, adjustmentFactor: 0.8 },
    ],
  });

  it('reduces a capped elderly dose: 800 mg, not 1000 mg', () => {
    const r = ok(
      calculateDosage(patient({ age: 70, weight: 90 }), paracetamol)
    );
    expect(r.ageFactor).toBe(0.8);
    expect(r.doseMg).toBe(800);
    expect(warning(r, 'safety.cappedSingleDose')?.params).toMatchObject({
      calculated: 1350,
      max: 1000,
    });
    expect(r.formula).toBe(
      '90 kg × 15 mg/kg → 1000 mg (max) × 0.8 (age) × 1 (renal)'
    );
  });

  it('leaves an elderly dose below the ceiling unchanged: 720 mg', () => {
    const r = ok(
      calculateDosage(patient({ age: 70, weight: 60 }), paracetamol)
    );
    expect(r.doseMg).toBe(720);
    expect(r.cappedByMaximumDose).toBe(false);
    expect(r.formula).toBe('60 kg × 15 mg/kg × 0.8 (age) × 1 (renal)');
  });

  it('leaves a child below the ceiling unchanged: 337.5 mg', () => {
    const r = ok(
      calculateDosage(
        patient({ age: 8, weight: 25, height: 128, patientType: 'child' }),
        paracetamol
      )
    );
    expect(r.doseMg).toBe(337.5);
  });

  it('gives a child heavy enough to reach the ceiling the band’s fraction of it', () => {
    // Deliberate: 11 y, 80 kg gets 0.9 × 1000 mg, not 13.5 mg/kg capped at 1000.
    const r = ok(
      calculateDosage(
        patient({ age: 11, weight: 80, height: 160, patientType: 'child' }),
        paracetamol
      )
    );
    expect(r.doseMg).toBe(900);
  });

  describe('a factor above 1', () => {
    // Shaped like isoniazid: 5 mg/kg, doubled under 15 years, max 300 mg.
    const isoniazid = (renalAdjustments?: RenalAdjustment[]) =>
      drug({
        dosePerKg: 5,
        frequency: 'q24h',
        maxSingleDose: 300,
        maxDailyDose: 300,
        ageAdjustments: [
          { minAge: 0, maxAge: 14.99, adjustmentFactor: 2 },
          { minAge: 15, maxAge: 120, adjustmentFactor: 1 },
        ],
        renalAdjustments,
      });
    const child = (weight: number, serumCreatinine?: number) =>
      patient({
        age: 10,
        weight,
        height: 145,
        patientType: 'child',
        serumCreatinine,
      });

    it('raises the formula dose below the ceiling', () => {
      const r = ok(calculateDosage(child(20), isoniazid()));
      expect(r.doseMg).toBe(200);
      expect(r.cappedByMaximumDose).toBe(false);
    });

    it('can never lift a dose above the ceiling', () => {
      const r = ok(calculateDosage(child(40), isoniazid()));
      expect(r.doseMg).toBe(300);
      expect(warning(r, 'safety.cappedSingleDose')?.params).toMatchObject({
        calculated: 400,
        max: 300,
      });
      expect(r.formula).toBe(
        '40 kg × 5 mg/kg × 2 (age) → 300 mg (max) × 1 (renal)'
      );
    });

    it('is followed by a renal reduction of the capped dose: 150 mg, not 200 mg', () => {
      const renal: RenalAdjustment[] = [
        { minGFR: 30, maxGFR: 1000, adjustmentFactor: 1 },
        { minGFR: 0, maxGFR: 30, adjustmentFactor: 0.5 },
      ];
      expect(ok(calculateDosage(child(40, 0.5), isoniazid(renal))).doseMg).toBe(
        300
      );
      expect(
        ok(
          calculateDosage(child(40, scrForSchwartz(20, 145)), isoniazid(renal))
        ).doseMg
      ).toBe(150);
    });
  });
});

// ---------------------------------------------------------------------------
describe('every combination of factors', () => {
  it('scales exactly as stated and never exceeds the ceiling', () => {
    const record = (dosePerKg: number, age: number, renal: number) =>
      drug({
        dosePerKg,
        maxSingleDose: 1000,
        maxDailyDose: 2000,
        ageAdjustments: [{ minAge: 0, maxAge: 120, adjustmentFactor: age }],
        renalAdjustments: [{ minGFR: 0, maxGFR: 1e6, adjustmentFactor: renal }],
      });
    fc.assert(
      fc.property(
        fc.integer({ min: 1, max: 250 }),
        fc.constantFrom(1, 5, 15, 40),
        fc.constantFrom(0.5, 0.8, 1, 1.5, 2),
        fc.constantFrom(0.25, 0.5, 1),
        (weight, dosePerKg, ageFactor, renalFactor) => {
          const p = patient({ weight, serumCreatinine: 1.0 });
          const r = ok(
            calculateDosage(p, record(dosePerKg, ageFactor, renalFactor))
          );
          // The dose with no adjustment is the formula dose, capped.
          const usual = Math.min(weight * dosePerKg, 1000);
          const expected =
            ageFactor >= 1
              ? Math.min(weight * dosePerKg * ageFactor, 1000) * renalFactor
              : usual * ageFactor * renalFactor;
          expect(r.doseMg).toBeCloseTo(expected, 1);
          expect(r.doseMg).toBeLessThanOrEqual(1000);
        }
      )
    );
  });
});
