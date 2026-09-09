import { calculateDosage } from '../calculations';
import { Patient, Drug, DoseCalculationResult } from '../../../types';
import * as fc from 'fast-check';

// Dummy patient generator
const generatePatient = () =>
  fc.record({
    id: fc.constant('p1'),
    age: fc.integer({ min: -10, max: 120 }), // Testing negatives as well
    weight: fc.integer({ min: -20, max: 200 }),
    height: fc.integer({ min: -50, max: 250 }),
    gender: fc.constantFrom('male', 'female'),
    patientType: fc.constantFrom('adult', 'child', 'neonate', 'elderly'),
  }) as fc.Arbitrary<Patient>;

describe('Dosage Calculation Verification', () => {
  const dummyDrug: Drug = {
    id: 'test-001',
    name: 'Test Paracetamol',
    genericName: 'Paracetamol',
    category: 'Analgesics',
    unit: 'mg',
    dosageForm: 'tablet',
    calculationMethod: 'weight',
    dosageFormula: {
      method: 'weight',
      dosePerKg: 15,
      maxSingleDose: 1000,
      maxDailyDose: 4000,
      frequency: 'q6h',
      ageAdjustments: [
        { minAge: 0, maxAge: 12, adjustmentFactor: 0.8 },
        { minAge: 13, maxAge: 120, adjustmentFactor: 1.0 },
      ],
    },
    contraindications: [],
    sideEffects: [],
  };

  it('STATIC TEST: Should block negative weight', () => {
    const patient: Patient = {
      id: '1',
      age: 30,
      weight: -5,
      height: 170,
      gender: 'male',
      patientType: 'adult',
    };
    const result = calculateDosage(patient, dummyDrug);
    expect(result.status).toBe('blocked');
    if (result.status === 'blocked') {
      expect(result.reason).toBe('MISSING_PATIENT_DATA');
    }
  });

  it('STATIC TEST: Should calculate standard adult weight correctly without hitting max dose', () => {
    const patient: Patient = {
      id: '2',
      age: 30,
      weight: 60,
      height: 170,
      gender: 'male',
      patientType: 'adult',
    };
    // 60 kg * 15 mg/kg = 900 mg
    const result = calculateDosage(patient, dummyDrug) as Extract<
      DoseCalculationResult,
      { status: 'success' }
    >;
    expect(result.status).toBe('success');
    expect(result.doseMg).toBe(900);
    expect(result.cappedByMaximumDose).toBe(false);
  });

  it('STATIC TEST: Should hard-cap at maxSingleDose for heavy adults', () => {
    const patient: Patient = {
      id: '3',
      age: 40,
      weight: 100,
      height: 180,
      gender: 'male',
      patientType: 'adult',
    };
    // 100 kg * 15 mg/kg = 1500 mg -> should cap at 1000 mg
    const result = calculateDosage(patient, dummyDrug) as Extract<
      DoseCalculationResult,
      { status: 'success' }
    >;
    expect(result.status).toBe('success');
    expect(result.doseMg).toBe(1000);
    expect(result.cappedByMaximumDose).toBe(true);
  });

  it('PROPERTY-BASED TEST: Dose must NEVER exceed maxSingleDose for any weight/age combination', () => {
    fc.assert(
      fc.property(generatePatient(), patient => {
        const result = calculateDosage(patient, dummyDrug);
        if (result.status === 'success') {
          return result.doseMg <= 1000;
        }
        return true; // Blocked is also an acceptable safe state
      })
    );
  });

  it('PROPERTY-BASED TEST: Daily dose must mathematically equal single dose * frequency multiplier', () => {
    fc.assert(
      fc.property(generatePatient(), patient => {
        const result = calculateDosage(patient, dummyDrug);
        if (result.status === 'success' && result.dailyTotalMg) {
          return result.dailyTotalMg === result.doseMg * 4; // q6h = 4 times
        }
        return true;
      })
    );
  });

  it('PROPERTY-BASED TEST: Volume conversion must match concentration', () => {
    const liquidDrug: Drug = {
      ...dummyDrug,
      concentration: 20, // 20 mg/mL
    };

    fc.assert(
      fc.property(generatePatient(), patient => {
        const result = calculateDosage(patient, liquidDrug);
        if (result.status === 'success' && result.volumeMl) {
          // Volume should be dose / concentration
          const expectedVolume = Math.round((result.doseMg / 20) * 100) / 100;
          return result.volumeMl === expectedVolume;
        }
        return true;
      })
    );
  });
});
