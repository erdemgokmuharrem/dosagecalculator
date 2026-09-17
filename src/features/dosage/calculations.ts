import { Patient, Drug, DoseCalculationResult, DoseWarning } from '../../types';

/**
 * Pure clinical calculation layer.
 *
 * DESIGN RULES (do not break these):
 *  1. This module MUST stay free of i18n, React and platform imports so it can be
 *     unit-tested in isolation and reasoned about by a clinical reviewer.
 *     Warnings are returned as structured codes; the UI layer translates them
 *     (see `src/features/dosage/warnings.ts`).
 *  2. Safety checks MUST fail closed. If a rule cannot be evaluated we say so
 *     explicitly instead of silently assuming a safe default.
 *  3. This module MUST NOT invent clinical rules. Any adjustment applied here has
 *     to come from the drug record itself (`dosageFormula.ageAdjustments`,
 *     `dosageFormula.renalAdjustments`). When a rule is absent we surface that
 *     absence to the clinician rather than approximating it.
 */

/** Physiologically plausible input ranges. Values outside these are rejected. */
export const PATIENT_LIMITS = {
  age: { min: 0, max: 120 },
  weight: { min: 0.3, max: 500 },
  height: { min: 20, max: 250 },
  serumCreatinine: { min: 0.1, max: 25 },
} as const;

/**
 * Administrations per 24 hours for every frequency code used by the drug data set.
 * Keys are lowercase. Anything absent from this map is treated as UNKNOWN and
 * disables the daily-maximum check (with an explicit warning) rather than
 * silently defaulting to 1 — a silent default would suppress overdose warnings.
 */
const DOSES_PER_DAY: Readonly<Record<string, number>> = Object.freeze({
  q1h: 24,
  q2h: 12,
  q3h: 8,
  q4h: 6,
  q6h: 4,
  q8h: 3,
  q12h: 2,
  q24h: 1,
  q48h: 1 / 2,
  q72h: 1 / 3,
  q7d: 1 / 7,
  q14d: 1 / 14,
  q21d: 1 / 21,
  q28d: 1 / 28,
  qd: 1,
  od: 1,
  daily: 1,
  bid: 2,
  tid: 3,
  qid: 4,
  // "as needed" has no fixed schedule; 1 is the conservative floor used only to
  // report a per-administration figure. It is flagged so the clinician knows the
  // daily ceiling was not machine-verified.
  prn: 1,
});

/** Frequencies whose daily total is indicative only and must not be trusted as a ceiling. */
const UNSCHEDULED_FREQUENCIES: ReadonlySet<string> = new Set(['prn']);

const isFiniteNumber = (value: unknown): value is number =>
  typeof value === 'number' && Number.isFinite(value);

const roundTo = (value: number, decimals: number): number => {
  const factor = 10 ** decimals;
  return Math.round(value * factor) / factor;
};

/**
 * Number of administrations per 24h for a frequency code.
 * Returns `null` when the code is not recognised — callers must treat null as
 * "cannot verify", never as 1.
 */
export const getDosesPerDay = (frequency?: string | null): number | null => {
  if (typeof frequency !== 'string') return null;
  const key = frequency.trim().toLowerCase();
  if (!key) return null;
  const value = DOSES_PER_DAY[key];
  return isFiniteNumber(value) ? value : null;
};

/** True when the frequency has no fixed schedule (e.g. PRN). */
export const isUnscheduledFrequency = (frequency?: string | null): boolean =>
  typeof frequency === 'string' &&
  UNSCHEDULED_FREQUENCIES.has(frequency.trim().toLowerCase());

/**
 * Body Surface Area — Mosteller formula.
 * BSA (m²) = √((height[cm] × weight[kg]) / 3600)
 *
 * This is the single source of truth for BSA in the app. Do not re-implement it.
 */
export const calculateBSA = (height: number, weight: number): number => {
  if (!isFiniteNumber(height) || !isFiniteNumber(weight)) return 0;
  if (height <= 0 || weight <= 0) return 0;
  return Math.sqrt((height * weight) / 3600);
};

/** Body Mass Index — kg/m². */
export const calculateBMI = (height: number, weight: number): number => {
  if (!isFiniteNumber(height) || !isFiniteNumber(weight)) return 0;
  if (height <= 0 || weight <= 0) return 0;
  return weight / (height / 100) ** 2;
};

/**
 * Creatinine clearance — Cockcroft-Gault.
 * CrCl (mL/min) = ((140 − age) × weight × [0.85 if female]) / (72 × SCr)
 *
 * Validated for adults only. Uses total body weight, which overestimates
 * clearance in obesity — `estimateRenalFunction` flags that case.
 */
export const calculateCrCl = (
  age: number,
  weight: number,
  gender: 'male' | 'female',
  serumCreatinine: number = 1.0
): number => {
  if (
    !isFiniteNumber(age) ||
    !isFiniteNumber(weight) ||
    !isFiniteNumber(serumCreatinine)
  )
    return 0;
  if (age <= 0 || weight <= 0 || serumCreatinine <= 0) return 0;
  const genderFactor = gender === 'female' ? 0.85 : 1.0;
  return Math.max(
    0,
    ((140 - age) * weight * genderFactor) / (72 * serumCreatinine)
  );
};

/**
 * Bedside Schwartz estimated GFR for patients under 18.
 * eGFR (mL/min/1.73m²) = k × height[cm] / SCr[mg/dL]
 */
export const calculateSchwartzEGFR = (
  height: number,
  serumCreatinine: number,
  age: number
): number => {
  if (!isFiniteNumber(height) || !isFiniteNumber(serumCreatinine)) return 0;
  if (height <= 0 || serumCreatinine <= 0) return 0;
  // 0.45 for infants under 1 year, 0.413 (bedside Schwartz) thereafter.
  const k = isFiniteNumber(age) && age < 1 ? 0.45 : 0.413;
  return Math.max(0, (k * height) / serumCreatinine);
};

export interface RenalEstimate {
  /** mL/min (Cockcroft-Gault) or mL/min/1.73m² (Schwartz). */
  value: number;
  method: 'cockcroft-gault' | 'schwartz';
  /** Units differ by method; carried so the UI never mislabels the figure. */
  unit: 'mL/min' | 'mL/min/1.73m²';
}

/**
 * Age-appropriate renal function estimate: Schwartz under 18, Cockcroft-Gault at
 * or above 18. Cockcroft-Gault is not validated in children, so it is never used
 * there.
 */
export const estimateRenalFunction = (
  patient: Patient
): RenalEstimate | null => {
  const scr = patient.serumCreatinine;
  if (!isFiniteNumber(scr) || scr <= 0) return null;

  if (isFiniteNumber(patient.age) && patient.age < 18) {
    const value = calculateSchwartzEGFR(patient.height, scr, patient.age);
    if (value <= 0) return null;
    return { value, method: 'schwartz', unit: 'mL/min/1.73m²' };
  }

  const value = calculateCrCl(patient.age, patient.weight, patient.gender, scr);
  if (value <= 0) return null;
  return { value, method: 'cockcroft-gault', unit: 'mL/min' };
};

/**
 * Total dose per 24 hours.
 * Returns `null` when the frequency is unknown, so the caller cannot mistake an
 * unverifiable schedule for a verified one.
 */
export const calculateDailyDose = (
  singleDose: number,
  frequency?: string | null
): number | null => {
  if (!isFiniteNumber(singleDose)) return null;
  const perDay = getDosesPerDay(frequency);
  if (perDay === null) return null;
  return singleDose * perDay;
};

/**
 * Age adjustment taken strictly from the drug's own data.
 *
 * `applied: false` with `hasBands: true` means the drug defines age bands but
 * none cover this patient — the caller must warn instead of silently using 1.0.
 *
 * An `adjustmentFactor` of 0 is the data set's marker for "contraindicated at
 * this age" (e.g. aspirin under 12 — Reye's syndrome). It must NEVER be applied
 * as a multiplier: that would render a perfectly plausible-looking "0 mg" dose
 * instead of refusing to dose the patient at all.
 */
const resolveAgeAdjustment = (
  patient: Patient,
  drug: Drug
): {
  factor: number;
  applied: boolean;
  hasBands: boolean;
  contraindicated: boolean;
  overlapping: boolean;
} => {
  const bands = drug.dosageFormula.ageAdjustments;
  const base = {
    factor: 1.0,
    applied: false,
    hasBands: false,
    contraindicated: false,
    overlapping: false,
  };

  if (!bands || bands.length === 0) return base;

  const matches = bands.filter(
    adj => patient.age >= adj.minAge && patient.age <= adj.maxAge
  );
  const overlapping = matches.length > 1;

  if (matches.length === 0) {
    return { ...base, hasBands: true, overlapping };
  }

  // With overlapping bands the most restrictive rule wins — never the most permissive.
  const band = matches.reduce((lowest, current) =>
    current.adjustmentFactor < lowest.adjustmentFactor ? current : lowest
  );

  if (!isFiniteNumber(band.adjustmentFactor) || band.adjustmentFactor < 0) {
    return { ...base, hasBands: true, overlapping };
  }

  if (band.adjustmentFactor === 0) {
    return {
      factor: 0,
      applied: true,
      hasBands: true,
      contraindicated: true,
      overlapping,
    };
  }

  return {
    factor: band.adjustmentFactor,
    applied: true,
    hasBands: true,
    contraindicated: false,
    overlapping,
  };
};

/**
 * Renal adjustment taken strictly from the drug's own data. No factor is
 * invented when the drug carries no renal rules.
 */
const resolveRenalAdjustment = (
  drug: Drug,
  renal: RenalEstimate | null
): {
  factor: number;
  applied: boolean;
  hasRules: boolean;
  frequencyOverride?: string;
} => {
  const rules = drug.dosageFormula.renalAdjustments;
  if (!rules || rules.length === 0) {
    return { factor: 1.0, applied: false, hasRules: false };
  }
  if (!renal) {
    return { factor: 1.0, applied: false, hasRules: true };
  }
  const rule = rules.find(
    r => renal.value >= r.minGFR && renal.value < r.maxGFR
  );
  if (!rule || !isFiniteNumber(rule.adjustmentFactor)) {
    return { factor: 1.0, applied: false, hasRules: true };
  }
  return {
    factor: rule.adjustmentFactor,
    applied: true,
    hasRules: true,
    frequencyOverride: rule.frequencyOverride,
  };
};

/** Validates raw patient inputs against physiologically plausible ranges. */
export const validatePatientForCalculation = (patient: Patient): string[] => {
  const errors: string[] = [];

  if (!isFiniteNumber(patient.age)) errors.push('AGE_NOT_A_NUMBER');
  else if (patient.age < PATIENT_LIMITS.age.min) errors.push('AGE_NEGATIVE');
  else if (patient.age > PATIENT_LIMITS.age.max)
    errors.push('AGE_OUT_OF_RANGE');

  if (!isFiniteNumber(patient.weight)) errors.push('WEIGHT_NOT_A_NUMBER');
  else if (patient.weight < 0) errors.push('WEIGHT_NEGATIVE');
  else if (patient.weight > PATIENT_LIMITS.weight.max)
    errors.push('WEIGHT_OUT_OF_RANGE');

  if (!isFiniteNumber(patient.height)) errors.push('HEIGHT_NOT_A_NUMBER');
  else if (patient.height < 0) errors.push('HEIGHT_NEGATIVE');
  else if (patient.height > PATIENT_LIMITS.height.max)
    errors.push('HEIGHT_OUT_OF_RANGE');

  if (patient.serumCreatinine !== undefined) {
    if (!isFiniteNumber(patient.serumCreatinine))
      errors.push('SCR_NOT_A_NUMBER');
    else if (patient.serumCreatinine < 0) errors.push('SCR_NEGATIVE');
    else if (patient.serumCreatinine > PATIENT_LIMITS.serumCreatinine.max)
      errors.push('SCR_OUT_OF_RANGE');
  }

  return errors;
};

export const validateDrugForCalculation = (drug: Drug): string[] => {
  const errors: string[] = [];
  if (!drug || !drug.dosageFormula) errors.push('MISSING_DOSAGE_FORMULA');
  return errors;
};

/**
 * Main dose calculation.
 *
 * Returns either a `success` result carrying every figure the UI renders, or a
 * `blocked` result naming the reason. It never returns a partially-formed dose.
 * The input `patient` object is not mutated.
 */
export const calculateDosage = (
  patient: Patient,
  drug: Drug,
  customFrequency?: string
): DoseCalculationResult => {
  const warnings: DoseWarning[] = [];

  if (!drug || !drug.dosageFormula) {
    return {
      status: 'blocked',
      reason: 'UNVERIFIED_RULE',
      messageCode: 'blocked.missingFormula',
    };
  }

  const formula = drug.dosageFormula;
  const method = formula.method;

  // ---- Input plausibility -------------------------------------------------
  if (
    !isFiniteNumber(patient.age) ||
    !isFiniteNumber(patient.weight) ||
    !isFiniteNumber(patient.height)
  ) {
    return {
      status: 'blocked',
      reason: 'MISSING_PATIENT_DATA',
      messageCode: 'blocked.nonNumericInput',
    };
  }

  if (
    patient.age < PATIENT_LIMITS.age.min ||
    patient.age > PATIENT_LIMITS.age.max
  ) {
    return {
      status: 'blocked',
      reason: 'UNSUPPORTED_AGE',
      messageCode: 'blocked.unsupportedAge',
      messageParams: {
        min: PATIENT_LIMITS.age.min,
        max: PATIENT_LIMITS.age.max,
      },
    };
  }

  if (patient.weight < 0 || patient.height < 0) {
    return {
      status: 'blocked',
      reason: 'MISSING_PATIENT_DATA',
      messageCode: 'blocked.negativeInput',
    };
  }

  if (patient.weight > PATIENT_LIMITS.weight.max) {
    return {
      status: 'blocked',
      reason: 'UNSUPPORTED_WEIGHT',
      messageCode: 'blocked.unsupportedWeight',
      messageParams: { max: PATIENT_LIMITS.weight.max },
    };
  }

  if (patient.height > PATIENT_LIMITS.height.max) {
    return {
      status: 'blocked',
      reason: 'MISSING_PATIENT_DATA',
      messageCode: 'blocked.unsupportedHeight',
      messageParams: { max: PATIENT_LIMITS.height.max },
    };
  }

  if (
    patient.serumCreatinine !== undefined &&
    patient.serumCreatinine !== null
  ) {
    if (
      !isFiniteNumber(patient.serumCreatinine) ||
      patient.serumCreatinine < 0 ||
      patient.serumCreatinine > PATIENT_LIMITS.serumCreatinine.max
    ) {
      return {
        status: 'blocked',
        reason: 'MISSING_RENAL_DATA',
        messageCode: 'blocked.unsupportedCreatinine',
        messageParams: { max: PATIENT_LIMITS.serumCreatinine.max },
      };
    }
  }

  if (patient.weight <= 0 && method === 'weight') {
    return {
      status: 'blocked',
      reason: 'MISSING_PATIENT_DATA',
      messageCode: 'blocked.weightRequired',
    };
  }

  // BSA is derived, never written back onto the caller's patient object.
  const bsa =
    isFiniteNumber(patient.bsa) && patient.bsa > 0
      ? patient.bsa
      : calculateBSA(patient.height, patient.weight);

  if (bsa <= 0 && method === 'bsa') {
    return {
      status: 'blocked',
      reason: 'MISSING_PATIENT_DATA',
      messageCode: 'blocked.bsaRequired',
    };
  }

  // ---- Renal function -----------------------------------------------------
  const renal = estimateRenalFunction({ ...patient, bsa });
  const renalAdjustment = resolveRenalAdjustment(drug, renal);

  if (renalAdjustment.hasRules && !renal) {
    // The drug carries renal dosing rules but we have no creatinine to apply them.
    return {
      status: 'blocked',
      reason: 'MISSING_RENAL_DATA',
      messageCode: 'blocked.renalDataRequired',
    };
  }

  // ---- Contraindications --------------------------------------------------
  // A renal band with factor 0 means the drug must not be given at that level
  // of kidney function. It used to be multiplied in like any other factor, so
  // the result was a "0 mg" dose instead of a refusal.
  if (renal && renalAdjustment.applied && renalAdjustment.factor === 0) {
    return {
      status: 'blocked',
      reason: 'CLINICAL_REVIEW_REQUIRED',
      messageCode: 'blocked.contraindicatedRenal',
      messageParams: {
        drug: drug.name,
        value: Math.round(renal.value),
        unit: renal.unit,
      },
    };
  }

  const ageAdjustment = resolveAgeAdjustment(patient, drug);

  if (ageAdjustment.contraindicated) {
    // Refuse to produce a number. A "0 mg" result reads as a dose, not a refusal.
    return {
      status: 'blocked',
      reason: 'CLINICAL_REVIEW_REQUIRED',
      messageCode: 'blocked.contraindicatedAge',
      messageParams: { age: patient.age, drug: drug.name },
    };
  }

  if (drug.requiresClinicalReview) {
    return {
      status: 'blocked',
      reason: 'CLINICAL_REVIEW_REQUIRED',
      messageCode: 'blocked.clinicalReviewRequired',
      messageParams: { drug: drug.name, note: drug.clinicalReviewNote ?? '' },
    };
  }

  // ---- Base dose ----------------------------------------------------------
  const ageFactor = ageAdjustment.factor;
  const renalFactor = renalAdjustment.factor;

  let calculatedDose = 0;
  let formulaUsed = '';

  switch (method) {
    case 'weight': {
      if (!isFiniteNumber(formula.dosePerKg) || formula.dosePerKg <= 0) {
        return {
          status: 'blocked',
          reason: 'UNVERIFIED_RULE',
          messageCode: 'blocked.missingDosePerKg',
        };
      }
      calculatedDose =
        patient.weight * formula.dosePerKg * ageFactor * renalFactor;
      formulaUsed = `${patient.weight} kg × ${formula.dosePerKg} ${drug.unit}/kg × ${ageFactor} (age) × ${renalFactor} (renal)`;
      break;
    }

    case 'bsa': {
      if (!isFiniteNumber(formula.dosePerM2) || formula.dosePerM2 <= 0) {
        return {
          status: 'blocked',
          reason: 'UNVERIFIED_RULE',
          messageCode: 'blocked.missingDosePerM2',
        };
      }
      calculatedDose = bsa * formula.dosePerM2 * ageFactor * renalFactor;
      formulaUsed = `${roundTo(bsa, 2)} m² × ${formula.dosePerM2} ${drug.unit}/m² × ${ageFactor} (age) × ${renalFactor} (renal)`;
      break;
    }

    case 'age':
    case 'fixed': {
      if (!isFiniteNumber(formula.fixedDose) || formula.fixedDose <= 0) {
        return {
          status: 'blocked',
          reason: 'UNVERIFIED_RULE',
          messageCode: 'blocked.missingFixedDose',
        };
      }
      calculatedDose = formula.fixedDose * ageFactor * renalFactor;
      formulaUsed = `${formula.fixedDose} ${drug.unit} × ${ageFactor} (age) × ${renalFactor} (renal)`;
      break;
    }

    default:
      return {
        status: 'blocked',
        reason: 'UNVERIFIED_RULE',
        messageCode: 'blocked.unknownMethod',
      };
  }

  if (!isFiniteNumber(calculatedDose) || calculatedDose < 0) {
    return {
      status: 'blocked',
      reason: 'UNVERIFIED_RULE',
      messageCode: 'blocked.nonFiniteResult',
    };
  }

  // ---- Single-dose ceiling ------------------------------------------------
  const maxSingleDose = isFiniteNumber(formula.maxSingleDose)
    ? formula.maxSingleDose
    : undefined;
  let cappedByMaximumDose = false;

  if (maxSingleDose !== undefined && calculatedDose > maxSingleDose) {
    warnings.push({
      code: 'safety.cappedSingleDose',
      severity: 'critical',
      params: {
        calculated: roundTo(calculatedDose, 2),
        max: maxSingleDose,
        unit: drug.unit,
      },
    });
    calculatedDose = maxSingleDose;
    cappedByMaximumDose = true;
  } else if (maxSingleDose === undefined) {
    warnings.push({
      code: 'safety.noSingleDoseCeiling',
      severity: 'warning',
      params: {},
    });
  }

  calculatedDose = roundTo(calculatedDose, 2);

  // ---- Volume -------------------------------------------------------------
  let volumeMl: number | undefined;
  if (isFiniteNumber(drug.concentration) && drug.concentration > 0) {
    volumeMl = roundTo(calculatedDose / drug.concentration, 2);
  }

  // ---- Daily ceiling ------------------------------------------------------
  const frequency =
    customFrequency ?? renalAdjustment.frequencyOverride ?? formula.frequency;
  const maxDailyDose = isFiniteNumber(formula.maxDailyDose)
    ? formula.maxDailyDose
    : isFiniteNumber(drug.maxDailyDose)
      ? drug.maxDailyDose
      : undefined;

  const dosesPerDay = getDosesPerDay(frequency);
  let dailyTotalMg: number | undefined;
  let exceedsDailyMax = false;
  let dailyCheckPerformed = false;

  if (dosesPerDay === null) {
    // Fail closed: we could not verify the daily ceiling, and we say so.
    warnings.push({
      code: 'safety.unknownFrequency',
      severity: 'critical',
      params: { frequency: frequency ?? '—' },
    });
  } else {
    dailyTotalMg = roundTo(calculatedDose * dosesPerDay, 2);

    if (isUnscheduledFrequency(frequency)) {
      warnings.push({
        code: 'safety.unscheduledFrequency',
        severity: 'warning',
        params: { frequency: frequency ?? '—' },
      });
    } else if (maxDailyDose !== undefined) {
      dailyCheckPerformed = true;
      if (dailyTotalMg > maxDailyDose) {
        exceedsDailyMax = true;
        warnings.push({
          code: 'safety.exceedsDailyMax',
          severity: 'critical',
          params: { daily: dailyTotalMg, max: maxDailyDose, unit: drug.unit },
        });
      }
    }

    if (maxDailyDose === undefined) {
      warnings.push({
        code: 'safety.noDailyCeiling',
        severity: 'warning',
        params: {},
      });
    }
  }

  // ---- Transparency about rules we did NOT apply --------------------------
  if (ageAdjustment.hasBands && !ageAdjustment.applied) {
    warnings.push({
      code: 'safety.noMatchingAgeBand',
      severity: 'warning',
      params: { age: patient.age },
    });
  }

  if (ageAdjustment.overlapping) {
    // Ambiguous data. The most restrictive band was used, but the record needs fixing.
    warnings.push({
      code: 'safety.overlappingAgeBands',
      severity: 'warning',
      params: { age: patient.age },
    });
  }

  if (renal) {
    const impaired = renal.value < 60;
    if (renalAdjustment.applied) {
      warnings.push({
        code: 'safety.renalAdjustmentApplied',
        severity: 'info',
        params: {
          value: roundTo(renal.value, 1),
          unit: renal.unit,
          factor: renalFactor,
        },
      });
    } else if (impaired) {
      // We have evidence of impairment but no verified rule for this drug.
      // We do NOT invent a factor — we escalate to the clinician.
      warnings.push({
        code: 'safety.renalImpairmentNoRule',
        severity: 'critical',
        params: { value: roundTo(renal.value, 1), unit: renal.unit },
      });
    }

    if (renal.method === 'schwartz') {
      warnings.push({
        code: 'safety.pediatricEgfr',
        severity: 'info',
        params: { value: roundTo(renal.value, 1) },
      });
    } else if (calculateBMI(patient.height, patient.weight) >= 30) {
      // Cockcroft-Gault on total body weight overestimates clearance in obesity.
      warnings.push({
        code: 'safety.crclObesityCaveat',
        severity: 'warning',
        params: {},
      });
    }
  } else if (
    patient.serumCreatinine === undefined ||
    patient.serumCreatinine === null
  ) {
    warnings.push({
      code: 'safety.renalNotAssessed',
      severity: 'warning',
      params: {},
    });
  }

  if (patient.age < 18) {
    warnings.push({
      code: 'safety.pediatricReview',
      severity: 'warning',
      params: {},
    });
  }

  // Provenance. Only a named clinical reviewer clears this warning; a rule that
  // was merely compared against a public label still says so on every result,
  // and names the source so the clinician can go and check it.
  const sourceVerification = drug.sourceVerification ?? 'UNVERIFIED';
  if (sourceVerification === 'UNVERIFIED') {
    warnings.push({
      code: 'safety.unverifiedSource',
      severity: 'warning',
      params: {},
    });
  } else if (sourceVerification === 'SOURCE_CHECKED') {
    warnings.push({
      code: 'safety.sourceCheckedOnly',
      severity: 'warning',
      params: {
        source: drug.sourceReference ?? '',
        date: drug.sourceDate ?? '',
      },
    });
  }

  const isWithinLimits =
    !cappedByMaximumDose && !exceedsDailyMax && dosesPerDay !== null;

  return {
    status: 'success',
    doseMg: calculatedDose,
    unit: drug.unit,
    volumeMl,
    frequency,
    dosesPerDay: dosesPerDay ?? undefined,
    dailyTotalMg,
    maxSingleDose,
    maxDailyDose,
    cappedByMaximumDose,
    exceedsDailyMax,
    dailyCheckPerformed,
    isWithinLimits,
    bsa: roundTo(bsa, 2),
    renalEstimate: renal
      ? {
          value: roundTo(renal.value, 1),
          method: renal.method,
          unit: renal.unit,
        }
      : undefined,
    ageFactor,
    renalFactor,
    formula: formulaUsed,
    inputsUsed: {
      weight: patient.weight,
      height: patient.height,
      age: patient.age,
      bsa: roundTo(bsa, 2),
      serumCreatinine: patient.serumCreatinine ?? 'not provided',
    },
    sourceId: drug.id,
    sourceTitle: drug.name,
    sourceSection: drug.productInfo?.indications?.[0] ?? 'Unknown',
    sourceDate: drug.sourceDate ?? 'UNVERIFIED',
    sourceVerification,
    warnings,
  };
};
