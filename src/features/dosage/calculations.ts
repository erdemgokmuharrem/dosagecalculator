import {
  Patient,
  Drug,
  DosageResult,
} from '../../types';

/**
 * Calculate Body Surface Area (BSA) using Mosteller formula
 * BSA (m²) = √((height in cm × weight in kg) / 3600)
 */
export const calculateBSA = (height: number, weight: number): number => {
  if (height <= 0 || weight <= 0) {
    throw new Error('Height and weight must be positive values');
  }
  return Math.sqrt((height * weight) / 3600);
};

/**
 * Calculate creatinine clearance using Cockcroft-Gault equation
 * CrCl = ((140 - age) × weight × gender factor) / (72 × serum creatinine)
 * Gender factor: 1.0 for males, 0.85 for females
 */
export const calculateCrCl = (
  age: number,
  weight: number,
  gender: 'male' | 'female',
  serumCreatinine: number = 1.0
): number => {
  if (age <= 0 || weight <= 0 || serumCreatinine <= 0) {
    throw new Error(
      'Age, weight, and serum creatinine must be positive values'
    );
  }

  const genderFactor = gender === 'male' ? 1.0 : 0.85;
  return ((140 - age) * weight * genderFactor) / (72 * serumCreatinine);
};

/**
 * Calculate age-adjusted dose based on patient type
 */
export const getAgeAdjustmentFactor = (patient: Patient): number => {
  switch (patient.patientType) {
    case 'neonate':
      return 0.5; // Neonates typically need lower doses
    case 'child':
      return 0.8; // Children need adjusted doses
    case 'elderly':
      return 0.9; // Elderly may need reduced doses
    case 'adult':
    default:
      return 1.0;
  }
};

/**
 * Calculate dosage based on weight (mg/kg)
 */
export const calculateWeightBasedDose = (
  patient: Patient,
  drug: Drug,
  dosePerKg: number
): number => {
  const ageAdjustment = getAgeAdjustmentFactor(patient);
  return patient.weight * dosePerKg * ageAdjustment;
};

/**
 * Calculate dosage based on Body Surface Area (mg/m²)
 */
export const calculateBSABasedDose = (
  patient: Patient,
  drug: Drug,
  dosePerM2: number
): number => {
  const bsa = patient.bsa || calculateBSA(patient.height, patient.weight);
  const ageAdjustment = getAgeAdjustmentFactor(patient);
  return bsa * dosePerM2 * ageAdjustment;
};

/**
 * Calculate dosage based on age
 */
export const calculateAgeBasedDose = (
  patient: Patient,
  drug: Drug,
  baseDose: number
): number => {
  const ageAdjustment = getAgeAdjustmentFactor(patient);
  return baseDose * ageAdjustment;
};

/**
 * Main dosage calculation function
 */
export const calculateDosage = (patient: Patient, drug: Drug): DosageResult => {
  const warnings: string[] = [];
  let calculatedDose = 0;

  // Calculate BSA if not provided
  if (!patient.bsa) {
    patient.bsa = calculateBSA(patient.height, patient.weight);
  }

  // Calculate dose based on method
  switch (drug.dosageFormula.method) {
    case 'weight':
      if (!drug.dosageFormula.dosePerKg) {
        throw new Error('Dose per kg is required for weight-based calculation');
      }
      calculatedDose = calculateWeightBasedDose(
        patient,
        drug,
        drug.dosageFormula.dosePerKg
      );
      break;

    case 'bsa':
      if (!drug.dosageFormula.dosePerM2) {
        throw new Error('Dose per m² is required for BSA-based calculation');
      }
      calculatedDose = calculateBSABasedDose(
        patient,
        drug,
        drug.dosageFormula.dosePerM2
      );
      break;

    case 'age':
      if (!drug.dosageFormula.fixedDose) {
        throw new Error('Fixed dose is required for age-based calculation');
      }
      calculatedDose = calculateAgeBasedDose(
        patient,
        drug,
        drug.dosageFormula.fixedDose
      );
      break;

    case 'fixed':
      if (!drug.dosageFormula.fixedDose) {
        throw new Error('Fixed dose is required for fixed calculation');
      }
      calculatedDose = drug.dosageFormula.fixedDose;
      break;

    default:
      throw new Error(
        `Unknown calculation method: ${drug.dosageFormula.method}`
      );
  }

  // Round to 2 decimal places
  calculatedDose = Math.round(calculatedDose * 100) / 100;

  // Check against maximum single dose
  if (
    drug.dosageFormula.maxSingleDose &&
    calculatedDose > drug.dosageFormula.maxSingleDose
  ) {
    warnings.push(
      `Calculated dose (${calculatedDose}${drug.unit}) exceeds maximum single dose (${drug.dosageFormula.maxSingleDose}${drug.unit})`
    );
  }

  // Check against maximum daily dose
  const maxDailyDose = drug.dosageFormula.maxDailyDose || drug.maxDailyDose;
  if (maxDailyDose) {
    const dailyDose = calculateDailyDose(
      calculatedDose,
      drug.dosageFormula.frequency
    );
    if (dailyDose > maxDailyDose) {
      warnings.push(
        `Daily dose (${dailyDose}${drug.unit}) exceeds maximum daily dose (${maxDailyDose}${drug.unit})`
      );
    }
  }

  // Add patient-specific warnings
  if (patient.patientType === 'neonate') {
    warnings.push('Neonate dosing - monitor closely for adverse effects');
  }

  if (patient.patientType === 'elderly') {
    warnings.push(
      'Elderly patient - consider reduced dosing and monitor for side effects'
    );
  }

  // Check for contraindications
  if (drug.contraindications.length > 0) {
    warnings.push('Check contraindications before administration');
  }

  return {
    singleDose: calculatedDose,
    unit: drug.unit,
    frequency: drug.dosageFormula.frequency,
    maxDailyDose: maxDailyDose || 0,
    maxSingleDose: drug.dosageFormula.maxSingleDose,
    warnings,
    isWithinLimits: warnings.length === 0,
  };
};

/**
 * Calculate total daily dose based on frequency
 */
export const calculateDailyDose = (
  singleDose: number,
  frequency: string
): number => {
  const frequencyMap: Record<string, number> = {
    q4h: 6, // every 4 hours = 6 times daily
    q6h: 4, // every 6 hours = 4 times daily
    q8h: 3, // every 8 hours = 3 times daily
    q12h: 2, // every 12 hours = 2 times daily
    q24h: 1, // every 24 hours = 1 time daily
    bid: 2, // twice daily
    tid: 3, // three times daily
    qid: 4, // four times daily
    prn: 1, // as needed (count as 1 for max calculation)
  };

  const timesPerDay = frequencyMap[frequency.toLowerCase()] || 1;
  return singleDose * timesPerDay;
};

/**
 * Validate patient data for dosage calculation
 */
export const validatePatientForCalculation = (patient: Patient): string[] => {
  const errors: string[] = [];

  if (patient.age <= 0) {
    errors.push('Age must be greater than 0');
  }

  if (patient.weight <= 0) {
    errors.push('Weight must be greater than 0');
  }

  if (patient.height <= 0) {
    errors.push('Height must be greater than 0');
  }

  if (patient.age > 120) {
    errors.push('Age seems unrealistic (>120 years)');
  }

  if (patient.weight > 300) {
    errors.push('Weight seems unrealistic (>300 kg)');
  }

  if (patient.height > 250) {
    errors.push('Height seems unrealistic (>250 cm)');
  }

  return errors;
};

/**
 * Validate drug data for dosage calculation
 */
export const validateDrugForCalculation = (drug: Drug): string[] => {
  const errors: string[] = [];

  if (!drug.dosageFormula) {
    errors.push('Drug dosage formula is missing');
    return errors;
  }

  switch (drug.dosageFormula.method) {
    case 'weight':
      if (!drug.dosageFormula.dosePerKg || drug.dosageFormula.dosePerKg <= 0) {
        errors.push(
          'Dose per kg must be greater than 0 for weight-based calculation'
        );
      }
      break;

    case 'bsa':
      if (!drug.dosageFormula.dosePerM2 || drug.dosageFormula.dosePerM2 <= 0) {
        errors.push(
          'Dose per m² must be greater than 0 for BSA-based calculation'
        );
      }
      break;

    case 'age':
    case 'fixed':
      if (!drug.dosageFormula.fixedDose || drug.dosageFormula.fixedDose <= 0) {
        errors.push('Fixed dose must be greater than 0 for fixed calculation');
      }
      break;
  }

  if (!drug.dosageFormula.frequency) {
    errors.push('Dosage frequency is required');
  }

  return errors;
};
