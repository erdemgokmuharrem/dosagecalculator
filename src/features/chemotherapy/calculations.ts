import { ChemotherapyDrug } from '../../data/chemotherapy';
import type { DoseWarning } from '../../types';
import {
  calculateBSA as sharedCalculateBSA,
  calculateCrCl,
} from '../dosage/calculations';

/**
 * Discriminated so a refusal cannot be rendered as though it carried a dose.
 * The previous shape was a single object and the engine signalled failure by
 * throwing, which the calling screen did not catch.
 */
export type ChemotherapyCalculationResult =
  | {
      status: 'success';
      drug: ChemotherapyDrug;
      patientInfo: {
        weight: number;
        height: number;
        bsa: number;
        age: number;
        gender: 'male' | 'female';
        gfr?: number;
        auc?: number;
        serumCreatinine?: number;
      };
      calculatedDose: {
        dose: number;
        unit: string;
        method: string;
        formula: string;
      };
      administration: {
        route: string;
        solvent: string;
        concentration: string;
        concentrationMgPerMl: number;
        requiredVolumeMl: number;
        bagVolumeMl: number;
        finalConcentrationMgPerMl: number;
        volume: string;
        infusionTime: string;
      };
      safety: {
        /** Absolute milligram ceiling for THIS patient (mg/m² ceiling × BSA). */
        maxDose?: number;
        cappedByMaximumDose: boolean;
        isWithinLimits: boolean;
        warnings: DoseWarning[];
      };
      monitoring: {
        required: string[];
        frequency: string;
      };
    }
  | {
      status: 'blocked';
      messageCode: string;
      messageParams?: Record<string, string | number>;
    };

export interface PatientInfo {
  weight: number; // kg
  height: number; // cm
  age: number;
  gender: 'male' | 'female';
  gfr?: number; // mL/min
  /** mg/dL. Required to derive a GFR; never defaulted. */
  serumCreatinine?: number;
  auc?: number; // for carboplatin (Calvert)
}

/**
 * BSA is imported from the dosage engine so the app has exactly one Mosteller
 * implementation. The local copy here (with its arguments in the opposite order)
 * was a second place for the formula to drift.
 */
export const calculateBSA = (weight: number, height: number): number =>
  sharedCalculateBSA(height, weight);

/**
 * Cockcroft-Gault. Unlike the previous version this takes no default creatinine:
 * inventing a normal renal function and feeding it into the Calvert equation
 * scales a cytotoxic dose off a number nobody measured.
 */
export const calculateGFR = (
  weight: number,
  age: number,
  gender: 'male' | 'female',
  creatinine: number
): number => calculateCrCl(age, weight, gender, creatinine);

const isFiniteNumber = (v: unknown): v is number =>
  typeof v === 'number' && Number.isFinite(v);

const round1 = (v: number) => Math.round(v * 10) / 10;

/** Calvert caps GFR at 125 mL/min; without it an overestimate inflates the dose. */
const CALVERT_GFR_CAP = 125;

/**
 * Chemotherapy dose calculation.
 *
 * Rewritten to fail closed. The previous version:
 *   - returned `weight * 1.5` for ANY weight-dosed agent,
 *   - returned `bsa * (maxDailyDose * 0.8)` for any BSA agent it did not
 *     recognise, mixing an absolute mg ceiling into a mg/m² rate,
 *   - compared the absolute mg result against a mg/m² ceiling, so every result
 *     for a patient above 1 m² reported "exceeds maximum",
 *   - defaulted serum creatinine to 1.0 mg/dL when GFR was unknown, and
 *   - threw raw Errors that the calling screen did not catch.
 *
 * It now refuses to produce a number whenever the protocol is not explicitly
 * recorded on the drug.
 */
export const calculateChemotherapyDose = (
  drug: ChemotherapyDrug,
  patientInfo: PatientInfo
): ChemotherapyCalculationResult => {
  const blocked = (
    messageCode: string,
    params: Record<string, string | number> = {}
  ) => ({ status: 'blocked', messageCode, messageParams: params }) as const;

  if (!drug) return blocked('chemo.blocked.missingDrug');

  if (
    !isFiniteNumber(patientInfo.weight) ||
    !isFiniteNumber(patientInfo.height) ||
    !isFiniteNumber(patientInfo.age) ||
    patientInfo.weight <= 0 ||
    patientInfo.height <= 0 ||
    patientInfo.age < 0
  ) {
    return blocked('chemo.blocked.invalidPatient');
  }

  if (
    patientInfo.weight > 500 ||
    patientInfo.height > 250 ||
    patientInfo.age > 120
  ) {
    return blocked('chemo.blocked.implausiblePatient');
  }

  const bsa = calculateBSA(patientInfo.weight, patientInfo.height);
  if (bsa <= 0) return blocked('chemo.blocked.invalidPatient');

  // GFR is only derived when a creatinine was actually measured.
  const gfr = isFiniteNumber(patientInfo.gfr)
    ? patientInfo.gfr
    : isFiniteNumber(patientInfo.serumCreatinine) &&
        patientInfo.serumCreatinine > 0
      ? calculateGFR(
          patientInfo.weight,
          patientInfo.age,
          patientInfo.gender,
          patientInfo.serumCreatinine
        )
      : undefined;

  const warnings: DoseWarning[] = [];
  let calculatedDose = 0;
  let method = '';
  let formula = '';

  switch (drug.calculationMethod) {
    case 'BSA': {
      if (
        !isFiniteNumber(drug.standardDosePerM2) ||
        drug.standardDosePerM2 <= 0
      ) {
        // No recorded mg/m² rate. Previously this fell through to
        // `bsa * maxDailyDose * 0.8`, which is not a dose.
        return blocked('chemo.blocked.noProtocolRate', { drug: drug.name });
      }
      calculatedDose = bsa * drug.standardDosePerM2;
      method = 'BSA';
      formula = `${round1(bsa)} m² × ${drug.standardDosePerM2} mg/m² = ${round1(calculatedDose)} mg`;
      break;
    }

    case 'Weight': {
      if (
        !isFiniteNumber(drug.standardDosePerKg) ||
        drug.standardDosePerKg <= 0
      ) {
        // Previously a flat 1.5 mg/kg for every weight-dosed cytotoxic agent.
        return blocked('chemo.blocked.noProtocolRate', { drug: drug.name });
      }
      calculatedDose = patientInfo.weight * drug.standardDosePerKg;
      method = 'Weight';
      formula = `${patientInfo.weight} kg × ${drug.standardDosePerKg} mg/kg = ${round1(calculatedDose)} mg`;
      break;
    }

    case 'AUC': {
      if (!isFiniteNumber(patientInfo.auc) || patientInfo.auc <= 0) {
        return blocked('chemo.blocked.aucRequired', { drug: drug.name });
      }
      if (!isFiniteNumber(gfr) || gfr <= 0) {
        // Calvert without a measured GFR is a guess multiplied by a cytotoxic.
        return blocked('chemo.blocked.gfrRequired', { drug: drug.name });
      }
      const cappedGfr = Math.min(gfr, CALVERT_GFR_CAP);
      if (gfr > CALVERT_GFR_CAP) {
        warnings.push({
          code: 'chemo.safety.gfrCapped',
          severity: 'warning',
          params: { measured: round1(gfr), cap: CALVERT_GFR_CAP },
        });
      }
      calculatedDose = patientInfo.auc * (cappedGfr + 25);
      method = 'AUC (Calvert)';
      formula = `AUC ${patientInfo.auc} × (GFR ${round1(cappedGfr)} + 25) = ${round1(calculatedDose)} mg`;
      break;
    }

    case 'Fixed': {
      if (
        !isFiniteNumber(drug.maxAbsoluteDoseMg) ||
        drug.maxAbsoluteDoseMg <= 0
      ) {
        return blocked('chemo.blocked.noProtocolRate', { drug: drug.name });
      }
      calculatedDose = drug.maxAbsoluteDoseMg;
      method = 'Fixed';
      formula = `${drug.maxAbsoluteDoseMg} mg (protocol fixed dose)`;
      break;
    }

    default:
      return blocked('chemo.blocked.unknownMethod', {
        method: String(drug.calculationMethod),
      });
  }

  if (!isFiniteNumber(calculatedDose) || calculatedDose <= 0) {
    return blocked('chemo.blocked.invalidResult');
  }

  // ---- Ceiling ------------------------------------------------------------
  // `maxDailyDose` is recorded in the drug's own unit (mg/m² for BSA agents),
  // so it must be scaled by BSA before it can be compared with an absolute dose.
  // For BSA agents the recorded mg/m² ceiling scales with the patient. For AUC
  // and weight dosing there is no per-m² interpretation, so only an explicit
  // absolute ceiling counts — treating the mg/m² number as absolute milligrams
  // would clamp a carboplatin dose to a figure that is not a dose at all.
  const ceilingMg =
    drug.calculationMethod === 'BSA' && isFiniteNumber(drug.maxDailyDose)
      ? drug.maxDailyDose * bsa
      : isFiniteNumber(drug.maxAbsoluteDoseMg)
        ? drug.maxAbsoluteDoseMg
        : undefined;

  if (!isFiniteNumber(ceilingMg)) {
    warnings.push({
      code: 'chemo.safety.noCeiling',
      severity: 'critical',
      params: {},
    });
  }

  let cappedByMaximumDose = false;
  if (isFiniteNumber(ceilingMg) && calculatedDose > ceilingMg) {
    warnings.push({
      code: 'chemo.safety.doseCapped',
      severity: 'critical',
      params: { calculated: round1(calculatedDose), max: round1(ceilingMg) },
    });
    calculatedDose = ceilingMg;
    cappedByMaximumDose = true;
  }

  calculatedDose = round1(calculatedDose);

  // ---- Clinical flags -----------------------------------------------------
  if (patientInfo.age < 18) {
    warnings.push({
      code: 'chemo.safety.pediatric',
      severity: 'critical',
      params: {},
    });
  } else if (patientInfo.age > 70) {
    warnings.push({
      code: 'chemo.safety.elderly',
      severity: 'warning',
      params: {},
    });
  }

  if (!isFiniteNumber(gfr)) {
    warnings.push({
      code: 'chemo.safety.renalNotAssessed',
      severity: 'warning',
      params: {},
    });
  } else if (gfr < 30) {
    warnings.push({
      code: 'chemo.safety.severeRenal',
      severity: 'critical',
      params: { gfr: round1(gfr) },
    });
  } else if (gfr < 60) {
    warnings.push({
      code: 'chemo.safety.moderateRenal',
      severity: 'critical',
      params: { gfr: round1(gfr) },
    });
  }

  if (bsa > 2.2) {
    warnings.push({
      code: 'chemo.safety.largeBsa',
      severity: 'warning',
      params: { bsa: round1(bsa) },
    });
  }

  // Every rule in this data set is machine-entered and unreviewed.
  warnings.push({
    code: 'chemo.safety.unverified',
    severity: 'warning',
    params: {},
  });

  const concentrationMgPerMl = getConcentrationMgPerMl(drug);
  const requiredVolumeMl =
    concentrationMgPerMl > 0
      ? round1(calculatedDose / concentrationMgPerMl)
      : 0;
  const bagVolumeMl = chooseBagVolume(calculatedDose, requiredVolumeMl, drug);
  const finalConcentrationMgPerMl =
    bagVolumeMl > 0 ? round1(calculatedDose / bagVolumeMl) : 0;

  return {
    status: 'success',
    drug,
    patientInfo: {
      ...patientInfo,
      bsa: round1(bsa),
      gfr: isFiniteNumber(gfr) ? round1(gfr) : undefined,
    },
    calculatedDose: { dose: calculatedDose, unit: 'mg', method, formula },
    administration: {
      route: drug.administrationRoute,
      solvent: drug.dilution.solvent,
      concentration: drug.dilution.concentration,
      concentrationMgPerMl,
      requiredVolumeMl,
      bagVolumeMl,
      finalConcentrationMgPerMl,
      volume: drug.dilution.volume,
      infusionTime: getInfusionTime(drug),
    },
    safety: {
      maxDose: isFiniteNumber(ceilingMg) ? round1(ceilingMg) : undefined,
      cappedByMaximumDose,
      isWithinLimits: !cappedByMaximumDose,
      warnings,
    },
    monitoring: {
      required: drug.monitoring,
      frequency: getMonitoringFrequency(drug),
    },
  };
};

// Infusion duration. Returns an i18n key (chemo.infusion.*): this module stays
// i18n-free, and the screen translates it.
const getInfusionTime = (drug: ChemotherapyDrug): string => {
  switch (drug.id) {
    case 'cisplatin':
      return 'chemo.infusion.h2to6';
    case 'carboplatin':
      return 'chemo.infusion.m30to60';
    case 'doxorubicin':
      return 'chemo.infusion.m15to30';
    case 'cyclophosphamide':
      return 'chemo.infusion.m30to60';
    case 'paclitaxel':
      return 'chemo.infusion.h3';
    case 'docetaxel':
      return 'chemo.infusion.h1';
    case '5-fluorouracil':
      return 'chemo.infusion.h2to24';
    case 'methotrexate':
      return 'chemo.infusion.h2to6';
    default:
      return 'chemo.infusion.m30to60';
  }
};

// Konsantrasyon metninden (ör. "1 mg/mL") sayısal mg/mL çıkar
const parseConcentrationMgPerMl = (concentrationText: string): number => {
  const match = concentrationText.match(/([0-9]+\.?[0-9]*)\s*mg\s*\/\s*mL/i);
  if (match) {
    return parseFloat(match[1]);
  }
  return 0;
};

// İlaç için mg/mL konsantrasyonunu belirle
const getConcentrationMgPerMl = (drug: ChemotherapyDrug): number => {
  const fromText = parseConcentrationMgPerMl(drug.dilution.concentration);
  if (fromText > 0) return fromText;
  // Metin çözümlenemiyorsa bazı ilaçlara makul varsayılan ver
  switch (drug.id) {
    case 'cisplatin':
      return 1;
    case 'carboplatin':
      return 10;
    case 'doxorubicin':
      return 2;
    case 'cyclophosphamide':
      return 20;
    case 'paclitaxel':
      return 1;
    case 'docetaxel':
      return 0.8;
    case '5-fluorouracil':
      return 50;
    case 'methotrexate':
      return 25;
    default:
      return 1;
  }
};

// Önerilen torba hacmini seç (100, 250, 500, 1000 mL gibi)
const chooseBagVolume = (
  doseMg: number,
  requiredVolumeMl: number,
  drug: ChemotherapyDrug
): number => {
  // Kurum protokolüne yakın rafine seçim:
  // 1) Belli ilaçlar için minimum torba hacmi (stabilite/güvenlik):
  const minByDrug: Record<string, number> = {
    cisplatin: 250,
    carboplatin: 250,
    paclitaxel: 500,
    docetaxel: 250,
    '5-fluorouracil': 250,
    cyclophosphamide: 250,
    methotrexate: 250,
  };

  // 2) Doz yoğunluğuna göre tercih (yüksek mg → daha büyük torba):
  // - ≤ 150 mg: 100 mL
  // - 151–500 mg: 250 mL
  // - 501–1000 mg: 500 mL
  // - > 1000 mg: 1000 mL
  let byDose = 100;
  if (doseMg <= 150) byDose = 100;
  else if (doseMg <= 500) byDose = 250;
  else if (doseMg <= 1000) byDose = 500;
  else byDose = 1000;

  // 3) Gerekli hacme göre alt sınır (sığmalı):
  let byVolume = 100;
  if (requiredVolumeMl <= 100) byVolume = 100;
  else if (requiredVolumeMl <= 250) byVolume = 250;
  else if (requiredVolumeMl <= 500) byVolume = 500;
  else byVolume = Math.ceil(requiredVolumeMl / 500) * 500; // 1000, 1500, ...

  const minForDrug = minByDrug[drug.id] ?? 100;
  return Math.max(minForDrug, byDose, byVolume);
};

// Monitoring schedule. Returns an i18n key (chemo.monitoringFreq.*) rather than
// Turkish prose, so the engine stays language-neutral.
const MONITORING_KEYS: Record<string, string> = {
  cisplatin: 'cisplatin',
  carboplatin: 'carboplatin',
  doxorubicin: 'doxorubicin',
  cyclophosphamide: 'cyclophosphamide',
  paclitaxel: 'paclitaxel',
  docetaxel: 'docetaxel',
  '5-fluorouracil': 'fluorouracil',
  methotrexate: 'methotrexate',
};

const getMonitoringFrequency = (drug: ChemotherapyDrug): string =>
  `chemo.monitoringFreq.${MONITORING_KEYS[drug.id] ?? 'default'}`;

// Doz azaltım faktörleri
export const getDoseReductionFactors = (patientInfo: PatientInfo) => {
  const factors: { [key: string]: number } = {};

  // Yaş faktörü
  if (patientInfo.age > 70) {
    factors.age = 0.8;
  }

  // GFR factor. Only applied when renal function was actually measured — the
  // previous version defaulted creatinine to 1.0 mg/dL and derived a factor from it.
  const gfr =
    patientInfo.gfr ??
    (typeof patientInfo.serumCreatinine === 'number' &&
    patientInfo.serumCreatinine > 0
      ? calculateGFR(
          patientInfo.weight,
          patientInfo.age,
          patientInfo.gender,
          patientInfo.serumCreatinine
        )
      : undefined);

  if (typeof gfr === 'number') {
    if (gfr < 30) {
      factors.renal = 0.5;
    } else if (gfr < 60) {
      factors.renal = 0.75;
    }
  }

  return factors;
};

// Toplam doz hesaplama (döngü sayısı ile)
export const calculateTotalDose = (
  singleDose: number,
  cycleCount: number,
  cycleInterval: number = 21 // gün
): { totalDose: number; totalTime: number } => {
  return {
    totalDose: singleDose * cycleCount,
    totalTime: cycleCount * cycleInterval,
  };
};
