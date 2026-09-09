import {
  calculateDosage,
  calculateSchwartzEGFR,
  validatePatientForCalculation,
  validateDrugForCalculation,
  isUnscheduledFrequency,
  PATIENT_LIMITS,
} from '../calculations';
import type { Patient, Drug, DoseCalculationSuccess } from '../../../types';

/**
 * Refusal paths and boundary conditions.
 *
 * Every branch here is one where the engine declines to produce a number. Those
 * are the branches that matter most in a dosing tool: a wrong refusal is an
 * inconvenience, a wrong number is a patient-safety event.
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

const drug = (
  formula: Partial<Drug['dosageFormula']> = {},
  over: Partial<Drug> = {}
): Drug => ({
  id: 'd',
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
    ...formula,
  },
  ...over,
});

const expectBlocked = (
  result: ReturnType<typeof calculateDosage>,
  code: string
) => {
  expect(result.status).toBe('blocked');
  if (result.status === 'blocked') expect(result.messageCode).toBe(code);
};

describe('refuses to calculate on malformed drug records', () => {
  it('blocks when the dosage formula is missing entirely', () => {
    const broken = { ...drug(), dosageFormula: undefined } as unknown as Drug;
    expectBlocked(calculateDosage(patient(), broken), 'blocked.missingFormula');
  });

  it('blocks when the drug object itself is missing', () => {
    expectBlocked(
      calculateDosage(patient(), undefined as unknown as Drug),
      'blocked.missingFormula'
    );
  });

  it('blocks a weight-based drug with no mg/kg figure', () => {
    expectBlocked(
      calculateDosage(patient(), drug({ dosePerKg: undefined })),
      'blocked.missingDosePerKg'
    );
  });

  it('blocks a BSA-based drug with no mg/m² figure', () => {
    expectBlocked(
      calculateDosage(patient(), drug({ method: 'bsa', dosePerM2: undefined })),
      'blocked.missingDosePerM2'
    );
  });

  it('blocks a fixed-dose drug with no fixed dose', () => {
    expectBlocked(
      calculateDosage(
        patient(),
        drug({ method: 'fixed', fixedDose: undefined })
      ),
      'blocked.missingFixedDose'
    );
  });

  it('blocks an unrecognised calculation method', () => {
    const odd = drug({ method: 'volume' as unknown as 'weight' });
    expectBlocked(calculateDosage(patient(), odd), 'blocked.unknownMethod');
  });

  it('blocks a drug flagged for clinical review', () => {
    const flagged = drug(
      {},
      { requiresClinicalReview: true, clinicalReviewNote: 'AUC dosing' }
    );
    expectBlocked(
      calculateDosage(patient(), flagged),
      'blocked.clinicalReviewRequired'
    );
  });
});

describe('refuses to calculate on malformed patient input', () => {
  it('blocks non-numeric measurements', () => {
    expectBlocked(
      calculateDosage(patient({ height: NaN }), drug()),
      'blocked.nonNumericInput'
    );
  });

  it('blocks a negative height', () => {
    expectBlocked(
      calculateDosage(patient({ height: -10 }), drug()),
      'blocked.negativeInput'
    );
  });

  it('blocks zero weight for a weight-based drug', () => {
    expectBlocked(
      calculateDosage(patient({ weight: 0 }), drug()),
      'blocked.weightRequired'
    );
  });

  it('blocks a BSA drug when height and weight cannot yield a BSA', () => {
    expectBlocked(
      calculateDosage(
        patient({ height: 0, weight: 0 }),
        drug({ method: 'bsa', dosePerM2: 100 })
      ),
      'blocked.bsaRequired'
    );
  });

  it('blocks a negative serum creatinine', () => {
    expectBlocked(
      calculateDosage(patient({ serumCreatinine: -1 }), drug()),
      'blocked.unsupportedCreatinine'
    );
  });
});

describe('boundary values are accepted, not rejected', () => {
  it.each([
    ['minimum age', { age: PATIENT_LIMITS.age.min, weight: 3.5, height: 50 }],
    ['maximum age', { age: PATIENT_LIMITS.age.max }],
    ['maximum weight', { weight: PATIENT_LIMITS.weight.max }],
    ['maximum height', { height: PATIENT_LIMITS.height.max }],
  ])('accepts the %s boundary', (_label, over) => {
    const result = calculateDosage(patient(over as Partial<Patient>), drug());
    expect(result.status).toBe('success');
  });

  it('accepts the maximum serum creatinine', () => {
    const result = calculateDosage(
      patient({ serumCreatinine: PATIENT_LIMITS.serumCreatinine.max }),
      drug()
    );
    expect(result.status).toBe('success');
  });
});

describe('BSA and fixed-dose paths', () => {
  it('doses by body surface area', () => {
    const result = calculateDosage(
      patient(),
      drug({ method: 'bsa', dosePerM2: 100, maxSingleDose: 1000 })
    );
    expect(result.status).toBe('success');
    if (result.status === 'success') {
      // sqrt(175 * 70 / 3600) = 1.8447 m²
      expect(result.bsa).toBeCloseTo(1.84, 2);
      expect(result.doseMg).toBeCloseTo(184.47, 1);
      expect(result.formula).toContain('m²');
    }
  });

  it('doses at a fixed amount regardless of weight', () => {
    const fixed = drug({
      method: 'fixed',
      fixedDose: 500,
      dosePerKg: undefined,
    });
    const light = calculateDosage(
      patient({ weight: 45 }),
      fixed
    ) as DoseCalculationSuccess;
    const heavy = calculateDosage(
      patient({ weight: 110 }),
      fixed
    ) as DoseCalculationSuccess;
    expect(light.doseMg).toBe(500);
    expect(heavy.doseMg).toBe(500);
  });

  it('converts to a volume when a concentration is known', () => {
    const syrup = drug({ dosePerKg: 5 }, { concentration: 20 });
    const result = calculateDosage(
      patient({ weight: 20 }),
      syrup
    ) as DoseCalculationSuccess;
    expect(result.doseMg).toBe(100);
    expect(result.volumeMl).toBe(5);
  });

  it('omits the volume when no concentration is recorded', () => {
    const result = calculateDosage(patient(), drug()) as DoseCalculationSuccess;
    expect(result.volumeMl).toBeUndefined();
  });
});

describe('renal rules that do not match', () => {
  it('applies no factor when the estimate falls outside every band', () => {
    const banded = drug({
      renalAdjustments: [{ minGFR: 0, maxGFR: 30, adjustmentFactor: 0.5 }],
    });
    // Healthy adult: CrCl ≈ 97, outside the 0-30 band.
    const result = calculateDosage(
      patient({ serumCreatinine: 1.0 }),
      banded
    ) as DoseCalculationSuccess;
    expect(result.status).toBe('success');
    expect(result.renalFactor).toBe(1);
  });
});

describe('helpers', () => {
  it('flags PRN as unscheduled and fixed intervals as scheduled', () => {
    expect(isUnscheduledFrequency('prn')).toBe(true);
    expect(isUnscheduledFrequency(' PRN ')).toBe(true);
    expect(isUnscheduledFrequency('q8h')).toBe(false);
    expect(isUnscheduledFrequency(undefined)).toBe(false);
  });

  it('returns 0 from Schwartz for unusable inputs', () => {
    expect(calculateSchwartzEGFR(0, 1, 5)).toBe(0);
    expect(calculateSchwartzEGFR(120, 0, 5)).toBe(0);
    expect(calculateSchwartzEGFR(NaN, 1, 5)).toBe(0);
  });

  it('reports every out-of-range field from the validator', () => {
    const errors = validatePatientForCalculation(
      patient({ weight: 900, height: 400, serumCreatinine: 99 })
    );
    expect(errors).toEqual(
      expect.arrayContaining([
        'WEIGHT_OUT_OF_RANGE',
        'HEIGHT_OUT_OF_RANGE',
        'SCR_OUT_OF_RANGE',
      ])
    );
  });

  it('reports non-numeric and negative creatinine separately', () => {
    expect(
      validatePatientForCalculation(patient({ serumCreatinine: NaN }))
    ).toContain('SCR_NOT_A_NUMBER');
    expect(
      validatePatientForCalculation(patient({ serumCreatinine: -2 }))
    ).toContain('SCR_NEGATIVE');
    expect(validatePatientForCalculation(patient({ age: NaN }))).toContain(
      'AGE_NOT_A_NUMBER'
    );
    expect(validatePatientForCalculation(patient({ height: NaN }))).toContain(
      'HEIGHT_NOT_A_NUMBER'
    );
  });

  it('validates the drug record', () => {
    expect(validateDrugForCalculation(drug())).toEqual([]);
    expect(
      validateDrugForCalculation({
        ...drug(),
        dosageFormula: undefined,
      } as unknown as Drug)
    ).toContain('MISSING_DOSAGE_FORMULA');
  });
});
