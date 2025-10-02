export interface Patient {
  id: string;
  age: number;
  weight: number; // kg
  height: number; // cm
  gender: 'male' | 'female';
  patientType: 'adult' | 'child' | 'neonate' | 'elderly';
  bsa?: number; // Body Surface Area (m²)
  crcl?: number; // Creatinine Clearance (mL/min)
}

export interface Drug {
  id: string;
  name: string;
  genericName: string;
  category: string;
  unit: 'mg' | 'g' | 'mcg' | 'ml' | 'units';
  concentration?: number; // mg/ml for liquid forms
  maxDailyDose?: number;
  contraindications: string[];
  sideEffects: string[];
  dosageForm: 'tablet' | 'capsule' | 'syrup' | 'injection' | 'cream' | 'drops';
  calculationMethod: 'weight' | 'bsa' | 'age' | 'fixed';
  dosageFormula: DosageFormula;
  productInfo?: ProductInfo;
}

export interface ProductInfo {
  // Kısa Ürün Bilgisi (KUB) - Short Product Information
  activeIngredient: string;
  mechanismOfAction: string;
  pharmacokinetics: {
    absorption: string;
    distribution: string;
    metabolism: string;
    elimination: string;
    halfLife: string;
  };
  administration: {
    route: string;
    method: string;
    duration: string; // infusion duration
    diluent: string; // what to dilute with
    concentration: string; // final concentration
    compatibility: string[]; // compatible drugs/solutions
    incompatibility: string[]; // incompatible drugs/solutions
  };
  indications: string[];
  contraindications: string[];
  warnings: string[];
  interactions: {
    drugInteractions: string[];
    foodInteractions: string[];
    labInteractions: string[];
  };
  monitoring: {
    parameters: string[];
    frequency: string;
    specialConsiderations: string[];
  };
  storage: {
    temperature: string;
    light: string;
    stability: string;
  };
  pregnancyCategory: string;
  lactation: string;
  pediatricUse: string;
  geriatricUse: string;
  renalAdjustment: string;
  hepaticAdjustment: string;
}

export interface DosageFormula {
  method: 'weight' | 'bsa' | 'age' | 'fixed';
  dosePerKg?: number; // mg/kg
  dosePerM2?: number; // mg/m²
  fixedDose?: number; // mg
  frequency: string; // e.g., "q6h", "q8h", "bid", "tid"
  maxSingleDose?: number; // mg
  maxDailyDose?: number; // mg
  ageAdjustments?: AgeAdjustment[];
}

export interface AgeAdjustment {
  minAge: number;
  maxAge: number;
  adjustmentFactor: number; // multiplier for base dose
}

export interface DosageCalculation {
  id: string;
  patientId: string;
  drugId: string;
  calculatedDose: number;
  unit: string;
  frequency: string;
  maxDailyDose: number;
  maxSingleDose?: number;
  warnings: string[];
  timestamp: Date;
  parameters: CalculationParameters;
}

export interface CalculationParameters {
  patientWeight: number;
  patientAge: number;
  patientBsa?: number;
  patientCrcl?: number;
  drugDosePerKg?: number;
  drugDosePerM2?: number;
  drugFixedDose?: number;
}

export interface DosageResult {
  singleDose: number;
  unit: string;
  frequency: string;
  maxDailyDose: number;
  maxSingleDose?: number;
  warnings: string[];
  isWithinLimits: boolean;
}

export type RootStackParamList = {
  Home: undefined;
  PatientInfo: undefined;
  DrugSelection: { patientId: string };
  DosageCalculation: { patientId: string; drugId: string };
  ProductInfo: undefined;
  Chemotherapy: undefined;
  ChemotherapyDose: undefined;
  History: undefined;
  Settings: undefined;
};

export type TabParamList = {
  Calculator: undefined;
  History: undefined;
  Settings: undefined;
};
