import type { TFunction } from 'i18next';
import type { DoseWarning, DoseCalculationBlocked } from '../../types';

/**
 * i18n edge layer for the calculation engine.
 *
 * `src/features/dosage/calculations.ts` is deliberately i18n-free and emits
 * structured warning codes. Everything that renders those codes goes through
 * here so a clinician never sees a hardcoded Turkish string in an English UI —
 * a missed overdose warning is a patient-safety event, not a cosmetic bug.
 */

/** Severity ordering used to surface the most dangerous message first. */
const SEVERITY_RANK: Record<DoseWarning['severity'], number> = {
  critical: 0,
  warning: 1,
  info: 2,
};

export const ICON_BY_SEVERITY: Record<DoseWarning['severity'], string> = {
  critical: '🛑',
  warning: '⚠️',
  info: 'ℹ️',
};

/**
 * Translates a warning. Falls back to the raw code if the key is missing so a
 * translation gap degrades to a visible identifier rather than an empty banner.
 */
export const formatWarning = (t: TFunction, warning: DoseWarning): string =>
  t(warning.code, { ...warning.params, defaultValue: warning.code }) as string;

export const formatBlockedReason = (
  t: TFunction,
  result: DoseCalculationBlocked
): string =>
  t(result.messageCode, {
    ...(result.messageParams ?? {}),
    defaultValue: result.messageCode,
  }) as string;

/** Critical first, then warnings, then info. Stable within each band. */
export const sortWarnings = (warnings: readonly DoseWarning[]): DoseWarning[] =>
  [...warnings].sort(
    (a, b) => SEVERITY_RANK[a.severity] - SEVERITY_RANK[b.severity]
  );

export const hasCritical = (warnings: readonly DoseWarning[]): boolean =>
  warnings.some(w => w.severity === 'critical');
