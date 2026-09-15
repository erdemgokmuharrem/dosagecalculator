export interface Patient {
  id: string;
  age: number;
  weight: number; // kg
  height: number; // cm
  gender: 'male' | 'female';
  patientType: 'adult' | 'child' | 'neonate' | 'elderly';
  bsa?: number; // Body Surface Area (m²)
  crcl?: number; // Creatinine Clearance (mL/min)
  serumCreatinine?: number; // mg/dL
  diagnosis?: string;
  allergies?: string[];
  renalFunction?: 'normal' | 'mild' | 'moderate' | 'severe' | 'esrd';
  hepaticFunction?: 'normal' | 'mild' | 'moderate' | 'severe';
}

export interface SideEffect {
  effect: string;
  frequency: 'very_common' | 'common' | 'uncommon' | 'rare' | 'very_rare';
  // very_common: >10%, common: 1-10%, uncommon: 0.1-1%, rare: 0.01-0.1%, very_rare: <0.01%
}

export interface Drug {
  id: string;
  name: string;
  genericName: string;
  category: string;
  unit: 'mg' | 'g' | 'mcg' | 'ml' | 'units' | 'mEq';
  concentration?: number; // mg/ml for liquid forms
  maxDailyDose?: number;
  contraindications: string[];
  sideEffects: SideEffect[] | string[]; // supports both formats
  dosageForm:
    | 'tablet'
    | 'capsule'
    | 'syrup'
    | 'injection'
    | 'cream'
    | 'drops'
    | 'inhaler'
    | 'patch'
    | 'suppository'
    | 'powder';
  calculationMethod: 'weight' | 'bsa' | 'age' | 'fixed';
  dosageFormula: DosageFormula;
  productInfo?: ProductInfo;
  atcCode?: string;
  isFavorite?: boolean;

  // --- Clinical provenance (required before go-live) ---
  /**
   * Where this dosing rule came from, e.g. "TİTCK KÜB", "FDA label", "BNF-C".
   * Displayed to the clinician so the rule can be traced back to a source.
   */
  sourceReference?: string;
  /** ISO date the source was last checked, e.g. "2026-01-15". */
  sourceDate?: string;
  /**
   * How far this rule has been checked.
   *
   * - UNVERIFIED: nobody has checked it. The default.
   * - SOURCE_CHECKED: compared against a public authoritative source (the label
   *   named in `sourceReference`) and corrected where it disagreed. This is NOT
   *   clinical sign-off: no clinician has taken responsibility for it, so the
   *   calculator still warns on every result.
   * - REVIEWED: a named pharmacologist or physician (`reviewedBy`) has signed it
   *   off. Only this level clears the warning.
   */
  sourceVerification?: 'UNVERIFIED' | 'SOURCE_CHECKED' | 'REVIEWED';
  /** Name/title of the pharmacologist or physician who approved the rule. */
  reviewedBy?: string;
  /**
   * Set when the stored dosing model is known to be wrong or unsupported for
   * this drug (e.g. carboplatin, which is dosed by AUC via the Calvert equation,
   * not by BSA). The engine refuses to calculate rather than showing a dose
   * derived from the wrong model.
   */
  requiresClinicalReview?: boolean;
  /** Explains, for the clinician, why the calculation is withheld. */
  clinicalReviewNote?: string;
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
  renalAdjustments?: RenalAdjustment[];
}

export interface AgeAdjustment {
  minAge: number;
  maxAge: number;
  adjustmentFactor: number; // multiplier for base dose
}

export interface RenalAdjustment {
  minGFR: number;
  maxGFR: number;
  adjustmentFactor: number;
  frequencyOverride?: string;
}

export interface DosageCalculation {
  id: string;
  patientId: string;
  drugId: string;
  calculatedDose: number;
  unit: string;
  frequency?: string;
  dailyTotalMg?: number;
  maxDailyDose?: number;
  maxSingleDose?: number;
  cappedByMaximumDose?: boolean;
  exceedsDailyMax?: boolean;
  /** Structured warnings; translated at render time so history follows the UI language. */
  warnings: DoseWarning[];
  timestamp: Date;
  parameters: CalculationParameters;
  drugName?: string;
  patientSummary?: string;
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

export type Milligram = number & { readonly __unit: 'mg' };
export type Microgram = number & { readonly __unit: 'mcg' };
export type Milliliter = number & { readonly __unit: 'mL' };
export type Kilogram = number & { readonly __unit: 'kg' };
export type MilligramPerKilogram = number & { readonly __unit: 'mg/kg' };
export type MilligramPerMilliliter = number & { readonly __unit: 'mg/mL' };

/**
 * A safety message emitted by the calculation engine.
 *
 * The engine is i18n-free, so it returns a translation `code` plus interpolation
 * `params`. Render with `formatWarning` / `useWarningFormatter` from
 * `src/features/dosage/warnings.ts`.
 */
export interface DoseWarning {
  /** i18n key, e.g. "safety.exceedsDailyMax". */
  code: string;
  /**
   * critical → dose was capped, a ceiling was breached, or a safety check could
   *            not be performed. Must be visually dominant.
   * warning  → a rule was not applied and the clinician must verify manually.
   * info     → an adjustment was applied; shown for transparency.
   */
  severity: 'critical' | 'warning' | 'info';
  params: Record<string, string | number>;
}

export type BlockedReason =
  | 'MISSING_PATIENT_DATA'
  | 'MISSING_RENAL_DATA'
  | 'UNSUPPORTED_AGE'
  | 'UNSUPPORTED_WEIGHT'
  | 'UNKNOWN_CONCENTRATION'
  | 'UNKNOWN_ROUTE'
  | 'UNKNOWN_INDICATION'
  | 'UNVERIFIED_RULE'
  | 'CONFLICTING_SOURCES'
  | 'CLINICAL_REVIEW_REQUIRED';

export type DoseCalculationSuccess = {
  status: 'success';
  /** Dose per administration, in `unit`. */
  doseMg: number;
  unit: Drug['unit'];
  volumeMl?: number;
  frequency?: string;
  /** Administrations per 24h; undefined when the frequency is not recognised. */
  dosesPerDay?: number;
  /** Undefined when the frequency is not recognised — never assume 1. */
  dailyTotalMg?: number;
  maxSingleDose?: number;
  maxDailyDose?: number;
  cappedByMaximumDose: boolean;
  exceedsDailyMax: boolean;
  /** False when no daily ceiling could be checked (unknown frequency or no limit). */
  dailyCheckPerformed: boolean;
  isWithinLimits: boolean;
  bsa: number;
  renalEstimate?: {
    value: number;
    method: 'cockcroft-gault' | 'schwartz';
    unit: 'mL/min' | 'mL/min/1.73m²';
  };
  ageFactor: number;
  renalFactor: number;
  formula: string;
  inputsUsed: Record<string, number | string>;
  sourceId: string;
  sourceTitle: string;
  sourceSection: string;
  sourceDate: string;
  sourceVerification: 'UNVERIFIED' | 'SOURCE_CHECKED' | 'REVIEWED';
  warnings: DoseWarning[];
};

export type DoseCalculationBlocked = {
  status: 'blocked';
  reason: BlockedReason;
  /** i18n key describing why the calculation was refused. */
  messageCode: string;
  messageParams?: Record<string, string | number>;
};

export type DoseCalculationResult =
  | DoseCalculationSuccess
  | DoseCalculationBlocked;

// Subscription Types
export interface SubscriptionPlan {
  id: string;
  type: 'monthly' | 'lifetime';
  price: number;
  currency: string;
  productId: string; // App Store / Play Store product ID
}

export interface UserSubscription {
  isPro: boolean;
  plan?: 'monthly' | 'lifetime';
  expiresAt?: Date;
  purchasedAt?: Date;
}

export type SupportedLanguage = 'tr' | 'en' | 'de' | 'ru' | 'zh';

export type RootStackParamList = {
  Home: undefined;
  MainTabs: undefined;
  PatientInfo: undefined;
  DrugSelection: { patientId: string };
  DosageCalculation: { patientId: string; drugId: string };
  DrugVademecum: undefined;
  DrugDetail: { drugId: string };
  ProductInfo: undefined;
  Chemotherapy: undefined;
  ChemotherapyDose: undefined;
  History: undefined;
  Settings: undefined;
  Subscription: undefined;
  Calculator: undefined;
};

export type TabParamList = {
  CalculatorTab: undefined;
  VademecumTab: undefined;
  HistoryTab: undefined;
  SettingsTab: undefined;
};
