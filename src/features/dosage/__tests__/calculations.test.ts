import {
  calculateBSA,
  calculateCrCl,
  calculateDosage,
  calculateDailyDose,
  validatePatientForCalculation,
  validateDrugForCalculation,
  getAgeAdjustmentFactor,
} from '../calculations';
import { Patient, Drug } from '../../../types';

describe('Dosage Calculations', () => {
  const mockPatient: Patient = {
    id: '1',
    age: 30,
    weight: 70,
    height: 170,
    gender: 'male',
    patientType: 'adult',
  };

  const mockDrug: Drug = {
    id: '1',
    name: 'Paracetamol',
    genericName: 'Acetaminophen',
    category: 'Analgesics',
    unit: 'mg',
    maxDailyDose: 4000,
    contraindications: [],
    sideEffects: [],
    dosageForm: 'tablet',
    calculationMethod: 'weight',
    dosageFormula: {
      method: 'weight',
      dosePerKg: 15,
      frequency: 'q6h',
      maxSingleDose: 1000,
      maxDailyDose: 4000,
    },
  };

  describe('calculateBSA', () => {
    it('should calculate BSA correctly', () => {
      const bsa = calculateBSA(170, 70);
      expect(bsa).toBeCloseTo(1.82, 2);
    });

    it('should throw error for invalid inputs', () => {
      expect(() => calculateBSA(0, 70)).toThrow(
        'Height and weight must be positive values'
      );
      expect(() => calculateBSA(170, -5)).toThrow(
        'Height and weight must be positive values'
      );
    });
  });

  describe('calculateCrCl', () => {
    it('should calculate CrCl correctly for male', () => {
      const crcl = calculateCrCl(30, 70, 'male', 1.0);
      expect(crcl).toBeCloseTo(106.94, 2);
    });

    it('should calculate CrCl correctly for female', () => {
      const crcl = calculateCrCl(30, 70, 'female', 1.0);
      expect(crcl).toBeCloseTo(90.9, 2);
    });

    it('should throw error for invalid inputs', () => {
      expect(() => calculateCrCl(0, 70, 'male', 1.0)).toThrow();
      expect(() => calculateCrCl(30, -5, 'male', 1.0)).toThrow();
    });
  });

  describe('getAgeAdjustmentFactor', () => {
    it('should return correct adjustment factors', () => {
      expect(
        getAgeAdjustmentFactor({ ...mockPatient, patientType: 'adult' })
      ).toBe(1.0);
      expect(
        getAgeAdjustmentFactor({ ...mockPatient, patientType: 'elderly' })
      ).toBe(0.9);
      expect(
        getAgeAdjustmentFactor({ ...mockPatient, patientType: 'child' })
      ).toBe(0.8);
      expect(
        getAgeAdjustmentFactor({ ...mockPatient, patientType: 'neonate' })
      ).toBe(0.5);
    });
  });

  describe('calculateDosage', () => {
    it('should calculate weight-based dosage correctly', () => {
      const result = calculateDosage(mockPatient, mockDrug);
      expect(result.singleDose).toBe(1050); // 70kg * 15mg/kg * 1.0
      expect(result.unit).toBe('mg');
      expect(result.frequency).toBe('q6h');
      expect(result.isWithinLimits).toBe(false); // Exceeds max single dose
    });

    it('should calculate BSA-based dosage correctly', () => {
      const bsaDrug: Drug = {
        ...mockDrug,
        dosageFormula: {
          method: 'bsa',
          dosePerM2: 500,
          frequency: 'q8h',
          maxSingleDose: 1000,
        },
      };

      const result = calculateDosage(mockPatient, bsaDrug);
      expect(result.singleDose).toBeCloseTo(909, 0); // 1.82 * 500 * 1.0
      expect(result.frequency).toBe('q8h');
    });

    it('should calculate fixed dosage correctly', () => {
      const fixedDrug: Drug = {
        ...mockDrug,
        dosageFormula: {
          method: 'fixed',
          fixedDose: 500,
          frequency: 'bid',
        },
      };

      const result = calculateDosage(mockPatient, fixedDrug);
      expect(result.singleDose).toBe(500);
      expect(result.frequency).toBe('bid');
    });

    it('should generate warnings for neonates', () => {
      const neonatePatient = {
        ...mockPatient,
        patientType: 'neonate' as const,
      };
      const result = calculateDosage(neonatePatient, mockDrug);
      expect(result.warnings).toContain(
        'Neonate dosing - monitor closely for adverse effects'
      );
    });

    it('should generate warnings for elderly', () => {
      const elderlyPatient = {
        ...mockPatient,
        patientType: 'elderly' as const,
      };
      const result = calculateDosage(elderlyPatient, mockDrug);
      expect(result.warnings).toContain(
        'Elderly patient - consider reduced dosing and monitor for side effects'
      );
    });

    it('should throw error for invalid calculation method', () => {
      const invalidDrug = {
        ...mockDrug,
        dosageFormula: {
          method: 'invalid' as any,
          frequency: 'q6h',
        },
      };

      expect(() => calculateDosage(mockPatient, invalidDrug)).toThrow(
        'Unknown calculation method: invalid'
      );
    });
  });

  describe('calculateDailyDose', () => {
    it('should calculate daily dose correctly for different frequencies', () => {
      expect(calculateDailyDose(500, 'q6h')).toBe(2000); // 4 times daily
      expect(calculateDailyDose(500, 'q8h')).toBe(1500); // 3 times daily
      expect(calculateDailyDose(500, 'bid')).toBe(1000); // 2 times daily
      expect(calculateDailyDose(500, 'q24h')).toBe(500); // 1 time daily
    });
  });

  describe('validatePatientForCalculation', () => {
    it('should return no errors for valid patient', () => {
      const errors = validatePatientForCalculation(mockPatient);
      expect(errors).toHaveLength(0);
    });

    it('should return errors for invalid patient data', () => {
      const invalidPatient = { ...mockPatient, age: 0, weight: -5, height: 0 };
      const errors = validatePatientForCalculation(invalidPatient);
      expect(errors).toContain('Age must be greater than 0');
      expect(errors).toContain('Weight must be greater than 0');
      expect(errors).toContain('Height must be greater than 0');
    });

    it('should return errors for unrealistic values', () => {
      const unrealisticPatient = {
        ...mockPatient,
        age: 150,
        weight: 400,
        height: 300,
      };
      const errors = validatePatientForCalculation(unrealisticPatient);
      expect(errors).toContain('Age seems unrealistic (>120 years)');
      expect(errors).toContain('Weight seems unrealistic (>300 kg)');
      expect(errors).toContain('Height seems unrealistic (>250 cm)');
    });
  });

  describe('validateDrugForCalculation', () => {
    it('should return no errors for valid drug', () => {
      const errors = validateDrugForCalculation(mockDrug);
      expect(errors).toHaveLength(0);
    });

    it('should return errors for drug without dosage formula', () => {
      const invalidDrug = { ...mockDrug, dosageFormula: undefined as any };
      const errors = validateDrugForCalculation(invalidDrug);
      expect(errors).toContain('Drug dosage formula is missing');
    });

    it('should return errors for weight-based drug without dose per kg', () => {
      const invalidDrug = {
        ...mockDrug,
        dosageFormula: {
          method: 'weight' as const,
          frequency: 'q6h',
        },
      };
      const errors = validateDrugForCalculation(invalidDrug);
      expect(errors).toContain(
        'Dose per kg must be greater than 0 for weight-based calculation'
      );
    });

    it('should return errors for drug without frequency', () => {
      const invalidDrug = {
        ...mockDrug,
        dosageFormula: {
          method: 'weight' as const,
          dosePerKg: 15,
          // frequency is missing
        } as any,
      };
      const errors = validateDrugForCalculation(invalidDrug);
      expect(errors).toContain('Dosage frequency is required');
    });
  });
});
