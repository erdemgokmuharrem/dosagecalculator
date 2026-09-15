import {
  calculateDosage,
  calculateBSA,
  calculateBMI,
  calculateCrCl,
  calculateSchwartzEGFR,
  calculateDailyDose,
  getDosesPerDay,
  estimateRenalFunction,
  validatePatientForCalculation,
  PATIENT_LIMITS,
} from '../calculations';
import { hasCritical, sortWarnings } from '../warnings';
import type { Patient, Drug, DoseCalculationSuccess } from '../../../types';

const adult = (over: Partial<Patient> = {}): Patient => ({
  id: 'p',
  age: 40,
  weight: 70,
  height: 175,
  gender: 'male',
  patientType: 'adult',
  ...over,
});

const weightDrug = (
  over: Partial<Drug['dosageFormula']> = {},
  drugOver: Partial<Drug> = {}
): Drug => ({
  id: 'd1',
  name: 'Test Drug',
  genericName: 'test',
  category: 'Analgesics',
  unit: 'mg',
  dosageForm: 'tablet',
  calculationMethod: 'weight',
  contraindications: [],
  sideEffects: [],
  dosageFormula: {
    method: 'weight',
    dosePerKg: 10,
    frequency: 'q6h',
    maxSingleDose: 1000,
    maxDailyDose: 4000,
    ...over,
  },
  ...drugOver,
});

const ok = (r: ReturnType<typeof calculateDosage>): DoseCalculationSuccess => {
  if (r.status !== 'success')
    throw new Error(`expected success, got blocked: ${r.messageCode}`);
  return r;
};

const codes = (r: DoseCalculationSuccess) => r.warnings.map(w => w.code);

// ---------------------------------------------------------------------------
describe('frequency handling — must fail closed', () => {
  it.each([
    ['q4h', 6],
    ['q6h', 4],
    ['q8h', 3],
    ['q12h', 2],
    ['q24h', 1],
    ['q48h', 0.5],
    ['bid', 2],
    ['tid', 3],
    ['qid', 4],
    ['q7d', 1 / 7],
    ['q21d', 1 / 21],
  ])('maps %s to %s administrations per day', (freq, expected) => {
    expect(getDosesPerDay(freq)).toBeCloseTo(expected as number, 6);
  });

  it('is case- and whitespace-insensitive', () => {
    expect(getDosesPerDay('  Q8H ')).toBe(3);
  });

  it('returns null for an unrecognised frequency instead of defaulting to 1', () => {
    expect(getDosesPerDay('3x1')).toBeNull();
    expect(getDosesPerDay('günde 3')).toBeNull();
    expect(getDosesPerDay('variable')).toBeNull();
    expect(getDosesPerDay('')).toBeNull();
    expect(getDosesPerDay(undefined)).toBeNull();
  });

  it('covers every frequency present in the shipped drug data', () => {
    // Guards against a new drug introducing a code the engine cannot verify.
    const shipped = [
      'q24h',
      'q8h',
      'q12h',
      'q6h',
      'tid',
      'q21d',
      'prn',
      'bid',
      'q7d',
    ];
    for (const freq of shipped) {
      expect(getDosesPerDay(freq)).not.toBeNull();
    }
  });

  it('calculateDailyDose returns null (not a silent 1×) for unknown frequencies', () => {
    expect(calculateDailyDose(500, 'made-up')).toBeNull();
    expect(calculateDailyDose(500, 'q6h')).toBe(2000);
  });

  it('does NOT report a daily total, and flags it, when the frequency is unknown', () => {
    const r = ok(
      calculateDosage(adult(), weightDrug({ frequency: 'her 8 saatte' }))
    );
    expect(r.dailyTotalMg).toBeUndefined();
    expect(r.dailyCheckPerformed).toBe(false);
    expect(codes(r)).toContain('safety.unknownFrequency');
    // An unverifiable ceiling must never present as "within limits".
    expect(r.isWithinLimits).toBe(false);
    expect(hasCritical(r.warnings)).toBe(true);
  });

  it('flags PRN as unscheduled rather than silently treating it as once daily', () => {
    const r = ok(calculateDosage(adult(), weightDrug({ frequency: 'prn' })));
    expect(codes(r)).toContain('safety.unscheduledFrequency');
    expect(r.dailyCheckPerformed).toBe(false);
  });

  it('computes fractional daily totals for weekly schedules', () => {
    const r = ok(
      calculateDosage(
        adult(),
        weightDrug({ frequency: 'q7d', dosePerKg: 1, maxSingleDose: 1000 })
      )
    );
    expect(r.doseMg).toBe(70);
    expect(r.dailyTotalMg).toBeCloseTo(10, 1);
  });
});

// ---------------------------------------------------------------------------
describe('dose ceilings', () => {
  it('caps at maxSingleDose and reports the original value', () => {
    const r = ok(calculateDosage(adult({ weight: 200 }), weightDrug()));
    expect(r.doseMg).toBe(1000);
    expect(r.cappedByMaximumDose).toBe(true);
    expect(r.isWithinLimits).toBe(false);
    const capped = r.warnings.find(w => w.code === 'safety.cappedSingleDose');
    expect(capped?.severity).toBe('critical');
    expect(capped?.params.calculated).toBe(2000);
    expect(capped?.params.max).toBe(1000);
  });

  it('warns when the drug defines no single-dose ceiling at all', () => {
    const r = ok(
      calculateDosage(adult(), weightDrug({ maxSingleDose: undefined }))
    );
    expect(codes(r)).toContain('safety.noSingleDoseCeiling');
  });

  it('flags a daily-maximum breach as critical', () => {
    // 70 kg × 10 mg/kg = 700 mg q6h → 2800 mg/day against a 1000 mg/day ceiling.
    const r = ok(calculateDosage(adult(), weightDrug({ maxDailyDose: 1000 })));
    expect(r.dailyTotalMg).toBe(2800);
    expect(r.exceedsDailyMax).toBe(true);
    expect(r.dailyCheckPerformed).toBe(true);
    expect(r.isWithinLimits).toBe(false);
    expect(
      r.warnings.find(w => w.code === 'safety.exceedsDailyMax')?.severity
    ).toBe('critical');
  });

  it('reports a clean result as within limits', () => {
    const r = ok(
      calculateDosage(adult(), weightDrug({ dosePerKg: 5, maxDailyDose: 4000 }))
    );
    expect(r.doseMg).toBe(350);
    expect(r.dailyTotalMg).toBe(1400);
    expect(r.isWithinLimits).toBe(true);
    expect(r.exceedsDailyMax).toBe(false);
    expect(hasCritical(r.warnings)).toBe(false);
  });
});

// ---------------------------------------------------------------------------
describe('input bounds', () => {
  it('rejects an implausible weight', () => {
    const r = calculateDosage(
      adult({ weight: PATIENT_LIMITS.weight.max + 1 }),
      weightDrug()
    );
    expect(r.status).toBe('blocked');
    if (r.status === 'blocked') expect(r.reason).toBe('UNSUPPORTED_WEIGHT');
  });

  it('rejects an implausible height', () => {
    const r = calculateDosage(adult({ height: 300 }), weightDrug());
    expect(r.status).toBe('blocked');
    if (r.status === 'blocked')
      expect(r.messageCode).toBe('blocked.unsupportedHeight');
  });

  it('rejects an implausible age', () => {
    const r = calculateDosage(adult({ age: 150 }), weightDrug());
    expect(r.status).toBe('blocked');
    if (r.status === 'blocked') expect(r.reason).toBe('UNSUPPORTED_AGE');
  });

  it('rejects a negative age', () => {
    const r = calculateDosage(adult({ age: -1 }), weightDrug());
    expect(r.status).toBe('blocked');
    if (r.status === 'blocked') expect(r.reason).toBe('UNSUPPORTED_AGE');
  });

  it('rejects an implausible serum creatinine', () => {
    const r = calculateDosage(adult({ serumCreatinine: 99 }), weightDrug());
    expect(r.status).toBe('blocked');
    if (r.status === 'blocked') expect(r.reason).toBe('MISSING_RENAL_DATA');
  });

  it.each([NaN, Infinity, -Infinity])('rejects %p in a numeric field', bad => {
    const r = calculateDosage(adult({ weight: bad as number }), weightDrug());
    expect(r.status).toBe('blocked');
  });

  it('never returns a NaN dose', () => {
    for (const weight of [NaN, Infinity, 0, -1, 1e9]) {
      const r = calculateDosage(
        adult({ weight: weight as number }),
        weightDrug()
      );
      if (r.status === 'success') expect(Number.isFinite(r.doseMg)).toBe(true);
    }
  });

  it('validatePatientForCalculation catches non-numeric and out-of-range values', () => {
    expect(validatePatientForCalculation(adult({ weight: NaN }))).toContain(
      'WEIGHT_NOT_A_NUMBER'
    );
    expect(validatePatientForCalculation(adult({ age: 200 }))).toContain(
      'AGE_OUT_OF_RANGE'
    );
    expect(validatePatientForCalculation(adult({ height: -3 }))).toContain(
      'HEIGHT_NEGATIVE'
    );
    expect(validatePatientForCalculation(adult())).toEqual([]);
  });
});

// ---------------------------------------------------------------------------
describe('purity', () => {
  it('does not mutate the patient it is given', () => {
    const patient = adult();
    const snapshot = JSON.parse(JSON.stringify(patient));
    calculateDosage(patient, weightDrug());
    expect(patient).toEqual(snapshot);
    expect(patient.bsa).toBeUndefined();
  });

  it('recomputes BSA when the patient changes, rather than reusing a stale value', () => {
    const a = ok(
      calculateDosage(
        adult({ weight: 60 }),
        weightDrug({ method: 'bsa', dosePerM2: 100 })
      )
    );
    const b = ok(
      calculateDosage(
        adult({ weight: 90 }),
        weightDrug({ method: 'bsa', dosePerM2: 100 })
      )
    );
    expect(a.bsa).not.toBe(b.bsa);
  });

  it('is deterministic', () => {
    const p = adult();
    const d = weightDrug();
    expect(calculateDosage(p, d)).toEqual(calculateDosage(p, d));
  });
});

// ---------------------------------------------------------------------------
describe('renal function', () => {
  it('uses Cockcroft-Gault for adults', () => {
    const est = estimateRenalFunction(adult({ serumCreatinine: 1.0 }));
    expect(est?.method).toBe('cockcroft-gault');
    expect(est?.unit).toBe('mL/min');
    // ((140-40) × 70 × 1.0) / (72 × 1.0) = 97.22
    expect(est?.value).toBeCloseTo(97.22, 1);
  });

  it('applies the 0.85 factor for female patients', () => {
    const male = calculateCrCl(40, 70, 'male', 1.0);
    const female = calculateCrCl(40, 70, 'female', 1.0);
    expect(female).toBeCloseTo(male * 0.85, 5);
  });

  it('uses Schwartz — never Cockcroft-Gault — for patients under 18', () => {
    const est = estimateRenalFunction(
      adult({ age: 8, weight: 25, height: 130, serumCreatinine: 0.5 })
    );
    expect(est?.method).toBe('schwartz');
    expect(est?.unit).toBe('mL/min/1.73m²');
    // 0.413 × 130 / 0.5 = 107.38
    expect(est?.value).toBeCloseTo(107.38, 1);
  });

  it('uses the infant k constant below 1 year', () => {
    expect(calculateSchwartzEGFR(50, 0.3, 0.5)).toBeCloseTo(
      (0.45 * 50) / 0.3,
      3
    );
    expect(calculateSchwartzEGFR(50, 0.3, 5)).toBeCloseTo(
      (0.413 * 50) / 0.3,
      3
    );
  });

  it('never produces a negative clearance for an extreme age', () => {
    expect(calculateCrCl(119, 70, 'male', 1.0)).toBeGreaterThanOrEqual(0);
  });

  it('escalates renal impairment when the drug has no verified renal rule', () => {
    // 75y, 60 kg, SCr 3.0 → CrCl ≈ 18 mL/min
    const r = ok(
      calculateDosage(
        adult({ age: 75, weight: 60, serumCreatinine: 3.0 }),
        weightDrug()
      )
    );
    const warn = r.warnings.find(
      w => w.code === 'safety.renalImpairmentNoRule'
    );
    expect(warn?.severity).toBe('critical');
    // Crucially: no invented adjustment was applied.
    expect(r.renalFactor).toBe(1);
  });

  it('applies the drug’s own renal rule when one exists', () => {
    const drug = weightDrug({
      renalAdjustments: [
        { minGFR: 0, maxGFR: 30, adjustmentFactor: 0.5 },
        { minGFR: 30, maxGFR: 60, adjustmentFactor: 0.75 },
      ],
    });
    const r = ok(
      calculateDosage(
        adult({ age: 75, weight: 60, serumCreatinine: 3.0 }),
        drug
      )
    );
    expect(r.renalFactor).toBe(0.5);
    expect(codes(r)).toContain('safety.renalAdjustmentApplied');
    expect(codes(r)).not.toContain('safety.renalImpairmentNoRule');
  });

  it('blocks when a drug needs renal dosing but no creatinine was supplied', () => {
    const drug = weightDrug({
      renalAdjustments: [{ minGFR: 0, maxGFR: 30, adjustmentFactor: 0.5 }],
    });
    const r = calculateDosage(adult(), drug);
    expect(r.status).toBe('blocked');
    if (r.status === 'blocked') expect(r.reason).toBe('MISSING_RENAL_DATA');
  });

  it('notes that renal function was not assessed when creatinine is absent', () => {
    const r = ok(calculateDosage(adult(), weightDrug()));
    expect(codes(r)).toContain('safety.renalNotAssessed');
  });

  it('warns that Cockcroft-Gault overestimates clearance in obesity', () => {
    // BMI 40.8
    const r = ok(
      calculateDosage(
        adult({ weight: 125, height: 175, serumCreatinine: 1.0 }),
        weightDrug()
      )
    );
    expect(codes(r)).toContain('safety.crclObesityCaveat');
  });

  it('does NOT increase the dose for obesity', () => {
    const lean = ok(
      calculateDosage(
        adult({ weight: 70, serumCreatinine: 1.0 }),
        weightDrug({ dosePerKg: 1 })
      )
    );
    const obese = ok(
      calculateDosage(
        adult({ weight: 125, serumCreatinine: 1.0 }),
        weightDrug({ dosePerKg: 1 })
      )
    );
    // Dose scales with weight only — no extra obesity multiplier.
    expect(obese.doseMg).toBeCloseTo(125, 5);
    expect(lean.doseMg).toBeCloseTo(70, 5);
    expect(obese.renalFactor).toBe(1);
  });
});

// ---------------------------------------------------------------------------
describe('age adjustment', () => {
  const banded = weightDrug({
    ageAdjustments: [
      { minAge: 0, maxAge: 12, adjustmentFactor: 0.5 },
      { minAge: 18, maxAge: 65, adjustmentFactor: 1.0 },
    ],
  });

  it('applies a matching band', () => {
    const r = ok(calculateDosage(adult({ age: 10, weight: 30 }), banded));
    expect(r.ageFactor).toBe(0.5);
    expect(r.doseMg).toBe(150);
  });

  it('warns instead of silently using 1.0 when no band matches', () => {
    // Age 70 falls in the gap between the defined bands.
    const r = ok(calculateDosage(adult({ age: 70 }), banded));
    expect(r.ageFactor).toBe(1.0);
    expect(codes(r)).toContain('safety.noMatchingAgeBand');
  });

  it('stays silent when the drug defines no age policy at all', () => {
    const r = ok(calculateDosage(adult(), weightDrug()));
    expect(codes(r)).not.toContain('safety.noMatchingAgeBand');
  });
});

// ---------------------------------------------------------------------------
describe('provenance and paediatric escalation', () => {
  it('warns on every unverified dosing rule', () => {
    const r = ok(calculateDosage(adult(), weightDrug()));
    expect(codes(r)).toContain('safety.unverifiedSource');
    expect(r.sourceVerification).toBe('UNVERIFIED');
  });

  it('stops warning once a rule is marked REVIEWED', () => {
    const drug = weightDrug(
      {},
      { sourceVerification: 'REVIEWED', sourceDate: '2026-01-15' }
    );
    const r = ok(calculateDosage(adult(), drug));
    expect(codes(r)).not.toContain('safety.unverifiedSource');
    expect(r.sourceDate).toBe('2026-01-15');
  });

  it('keeps warning when a rule was only compared against a public source', () => {
    // Comparing a rule against a label is not clinical sign-off. The result says
    // so and names the source, so the clinician can go and check it.
    const drug = weightDrug(
      {},
      {
        sourceVerification: 'SOURCE_CHECKED',
        sourceReference: 'FDA label',
        sourceDate: '2026-09-15',
      }
    );
    const r = ok(calculateDosage(adult(), drug));
    expect(codes(r)).toContain('safety.sourceCheckedOnly');
    expect(codes(r)).not.toContain('safety.unverifiedSource');
    expect(r.sourceVerification).toBe('SOURCE_CHECKED');
    expect(
      r.warnings.find(w => w.code === 'safety.sourceCheckedOnly')?.params
    ).toEqual({ source: 'FDA label', date: '2026-09-15' });
  });

  it('always asks for a second check on paediatric patients', () => {
    const r = ok(
      calculateDosage(adult({ age: 6, weight: 20, height: 115 }), weightDrug())
    );
    expect(codes(r)).toContain('safety.pediatricReview');
  });
});

// ---------------------------------------------------------------------------
describe('anthropometrics', () => {
  it('computes BSA with the Mosteller formula', () => {
    expect(calculateBSA(175, 70)).toBeCloseTo(Math.sqrt((175 * 70) / 3600), 10);
    expect(calculateBSA(170, 60)).toBeCloseTo(1.6833, 3);
  });

  it('returns 0 rather than NaN for invalid anthropometrics', () => {
    expect(calculateBSA(0, 70)).toBe(0);
    expect(calculateBSA(NaN, 70)).toBe(0);
    expect(calculateBMI(0, 70)).toBe(0);
  });

  it('computes BMI in kg/m²', () => {
    expect(calculateBMI(175, 70)).toBeCloseTo(22.86, 2);
  });
});

// ---------------------------------------------------------------------------
describe('warning presentation', () => {
  it('sorts critical warnings ahead of warnings and info', () => {
    const sorted = sortWarnings([
      { code: 'a', severity: 'info', params: {} },
      { code: 'b', severity: 'critical', params: {} },
      { code: 'c', severity: 'warning', params: {} },
    ]);
    expect(sorted.map(w => w.code)).toEqual(['b', 'c', 'a']);
  });
});
