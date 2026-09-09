import { calculateDosage } from '../calculations';
import { Patient, Drug } from '../../../types';
import goldenData from './golden-dataset.json';

// Define the dummy drug database for testing purposes
const dummyDatabase: Record<string, Drug> = {
  'paracetamol-001': {
    id: 'paracetamol-001',
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
    },
    contraindications: [],
    sideEffects: [],
  },
  'extra-001': {
    id: 'extra-001',
    name: 'Ibuprofen Pediatrik Şurup',
    genericName: 'Ibuprofen',
    category: 'Analgesics',
    unit: 'mg',
    dosageForm: 'syrup',
    calculationMethod: 'age',
    concentration: 20, // 100mg/5mL = 20mg/mL
    dosageFormula: {
      method: 'age',
      fixedDose: 100, // base dose
      maxSingleDose: 400,
      maxDailyDose: 1200,
      frequency: 'q8h',
      ageAdjustments: [
        { minAge: 0, maxAge: 2, adjustmentFactor: 1.0 },
        { minAge: 3, maxAge: 6, adjustmentFactor: 2.0 }, // e.g. 5yo gets 200mg
      ],
    },
    contraindications: [],
    sideEffects: [],
  },
  'chemo-001': {
    id: 'chemo-001',
    name: 'Sisplatin',
    genericName: 'Cisplatin',
    category: 'Oncology',
    unit: 'mg',
    dosageForm: 'injection',
    calculationMethod: 'bsa',
    dosageFormula: {
      method: 'bsa',
      dosePerM2: 120, // 120 mg/m2
      frequency: 'variable',
    },
    contraindications: [],
    sideEffects: [],
  },
};

describe('Golden Dataset Verification', () => {
  goldenData.forEach(testCase => {
    it(`should correctly verify: ${testCase.description}`, () => {
      const patient = testCase.inputs.patient as Patient;
      const drug = dummyDatabase[testCase.inputs.drugId];

      expect(drug).toBeDefined();

      const result = calculateDosage(patient, drug);

      expect(result.status).toBe(testCase.expectedResult.status);

      if (
        result.status === 'success' &&
        testCase.expectedResult.status === 'success'
      ) {
        expect(result.doseMg).toBeCloseTo(
          testCase.expectedResult.doseMg as number,
          1
        );
        expect(result.cappedByMaximumDose).toBe(
          testCase.expectedResult.cappedByMaximumDose
        );

        if (testCase.expectedResult.volumeMl) {
          expect(result.volumeMl).toBeCloseTo(
            testCase.expectedResult.volumeMl as number,
            1
          );
        }
      } else if (
        result.status === 'blocked' &&
        testCase.expectedResult.status === 'blocked'
      ) {
        expect(result.reason).toBe(testCase.expectedResult.reason);
      }
    });
  });
});
