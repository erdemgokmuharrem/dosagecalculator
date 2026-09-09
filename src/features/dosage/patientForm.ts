import { z } from 'zod';
import type { Patient } from '../../types';
import {
  PATIENT_LIMITS,
  calculateBSA,
  estimateRenalFunction,
} from './calculations';

/**
 * Input validation for the patient form.
 *
 * The calculation engine refuses implausible values, but a clinician should be
 * told *at the field* rather than after pressing Calculate. This schema is the
 * single source of truth for those bounds and mirrors `PATIENT_LIMITS`, so the
 * UI and the engine can never drift apart.
 */

export type PatientFormState = {
  age: string;
  weight: string;
  height: string;
  gender: 'male' | 'female';
  patientType: 'adult' | 'child' | 'neonate' | 'elderly';
  serumCreatinine: string;
};

export type PatientFieldErrors = Partial<
  Record<keyof PatientFormState, string>
>;

/**
 * Parses a decimal typed on a numeric keypad. Accepts a comma as the decimal
 * separator (every locale this app ships in uses one except English) and rejects
 * anything else outright rather than letting `parseFloat` silently truncate
 * "70kg" to 70 or "1.2.3" to 1.2.
 */
export const parseDecimal = (raw: string): number | null => {
  const trimmed = raw.trim().replace(',', '.');
  if (trimmed === '') return null;
  if (!/^\d*\.?\d+$/.test(trimmed)) return null;
  const value = Number(trimmed);
  return Number.isFinite(value) ? value : null;
};

const requiredNumber = (
  requiredKey: string,
  rangeKey: string,
  min: number,
  max: number
) =>
  z
    .string()
    .transform(raw => raw.trim())
    .superRefine((raw, ctx) => {
      if (raw === '') {
        ctx.addIssue({ code: z.ZodIssueCode.custom, message: requiredKey });
        return;
      }
      const value = parseDecimal(raw);
      if (value === null) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'validation.numberOnly',
        });
        return;
      }
      if (value < min || value > max) {
        ctx.addIssue({ code: z.ZodIssueCode.custom, message: rangeKey });
      }
    });

export const patientFormSchema = z.object({
  age: requiredNumber(
    'validation.ageRequired',
    'validation.ageRange',
    PATIENT_LIMITS.age.min,
    PATIENT_LIMITS.age.max
  ),
  weight: requiredNumber(
    'validation.weightRequired',
    'validation.weightRange',
    PATIENT_LIMITS.weight.min,
    PATIENT_LIMITS.weight.max
  ),
  height: requiredNumber(
    'validation.heightRequired',
    'validation.heightRange',
    PATIENT_LIMITS.height.min,
    PATIENT_LIMITS.height.max
  ),
  gender: z.enum(['male', 'female']),
  patientType: z.enum(['adult', 'child', 'neonate', 'elderly']),
  // Optional: an empty field means "not measured", which the engine reports as
  // "renal function not assessed" rather than assuming a normal creatinine.
  serumCreatinine: z.string().superRefine((raw, ctx) => {
    const trimmed = raw.trim();
    if (trimmed === '') return;
    const value = parseDecimal(trimmed);
    if (value === null) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'validation.numberOnly',
      });
      return;
    }
    if (
      value < PATIENT_LIMITS.serumCreatinine.min ||
      value > PATIENT_LIMITS.serumCreatinine.max
    ) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'validation.creatinineRange',
      });
    }
  }),
});

/** Field-level errors, keyed by field name. Values are i18n keys. */
export const validatePatientForm = (
  form: PatientFormState
): PatientFieldErrors => {
  const parsed = patientFormSchema.safeParse(form);
  if (parsed.success) return {};

  const errors: PatientFieldErrors = {};
  for (const issue of parsed.error.issues) {
    const field = issue.path[0] as keyof PatientFormState | undefined;
    if (field && !errors[field]) errors[field] = issue.message;
  }
  return errors;
};

/**
 * Builds the domain `Patient` from validated form state.
 * Returns null when the form is invalid, so a calculation can never run on
 * half-parsed input.
 */
export const buildPatient = (form: PatientFormState): Patient | null => {
  if (Object.keys(validatePatientForm(form)).length > 0) return null;

  const age = parseDecimal(form.age);
  const weight = parseDecimal(form.weight);
  const height = parseDecimal(form.height);
  if (age === null || weight === null || height === null) return null;

  const serumCreatinine = parseDecimal(form.serumCreatinine);

  return {
    id: 'current',
    age,
    weight,
    height,
    gender: form.gender,
    patientType: form.patientType,
    bsa: calculateBSA(height, weight),
    // Left undefined when not measured — never defaulted to 1.0 mg/dL, which
    // would fabricate a normal renal function the clinician never entered.
    ...(serumCreatinine !== null ? { serumCreatinine } : {}),
  };
};

/** Derived values shown alongside the form (BSA, BMI, renal estimate). */
export const derivePatientMetrics = (form: PatientFormState) => {
  const patient = buildPatient(form);
  if (!patient) return { bsa: null, bmi: null, renal: null };

  const bmi =
    patient.height > 0 ? patient.weight / (patient.height / 100) ** 2 : null;
  const renal = estimateRenalFunction(patient);

  return {
    bsa: Math.round(calculateBSA(patient.height, patient.weight) * 100) / 100,
    bmi: bmi === null ? null : Math.round(bmi * 10) / 10,
    renal: renal
      ? { ...renal, value: Math.round(renal.value * 10) / 10 }
      : null,
  };
};
