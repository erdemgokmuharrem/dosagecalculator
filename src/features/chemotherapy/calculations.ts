import { ChemotherapyDrug } from '../../data/chemotherapy';

export interface ChemotherapyCalculationResult {
  drug: ChemotherapyDrug;
  patientInfo: {
    weight: number;
    height: number;
    bsa: number;
    age: number;
    gender: 'male' | 'female';
    gfr?: number;
    auc?: number;
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
    maxDose: number;
    isWithinLimits: boolean;
    warnings: string[];
  };
  monitoring: {
    required: string[];
    frequency: string;
  };
}

export interface PatientInfo {
  weight: number; // kg
  height: number; // cm
  age: number;
  gender: 'male' | 'female';
  gfr?: number; // mL/min/1.73m²
  auc?: number; // for carboplatin
}

// BSA hesaplama (Mosteller formülü)
export const calculateBSA = (weight: number, height: number): number => {
  // Mosteller: BSA(m²) = sqrt( (height(cm) * weight(kg)) / 3600 )
  return Math.sqrt((height * weight) / 3600);
};

// GFR hesaplama (Cockcroft-Gault formülü)
export const calculateGFR = (weight: number, age: number, gender: 'male' | 'female', creatinine: number = 1.0): number => {
  const genderFactor = gender === 'male' ? 1 : 0.85;
  return ((140 - age) * weight * genderFactor) / (72 * creatinine);
};

// Kemoterapi doz hesaplama
export const calculateChemotherapyDose = (
  drug: ChemotherapyDrug,
  patientInfo: PatientInfo
): ChemotherapyCalculationResult => {
  const bsa = calculateBSA(patientInfo.weight, patientInfo.height);
  const gfr = patientInfo.gfr || calculateGFR(patientInfo.weight, patientInfo.age, patientInfo.gender);
  
  let calculatedDose = 0;
  let method = '';
  let formula = '';

  switch (drug.calculationMethod) {
    case 'BSA':
      calculatedDose = calculateBSADose(drug, bsa);
      method = 'BSA (Body Surface Area)';
      formula = drug.formula;
      break;
    
    case 'Weight':
      calculatedDose = calculateWeightDose(drug, patientInfo.weight);
      method = 'Weight-based';
      formula = drug.formula;
      break;
    
    case 'AUC':
      if (drug.id === 'carboplatin' && patientInfo.auc) {
        calculatedDose = patientInfo.auc * (gfr + 25);
        method = 'AUC (Area Under Curve)';
        formula = `Dose = AUC × (GFR + 25) = ${patientInfo.auc} × (${gfr.toFixed(1)} + 25) = ${calculatedDose.toFixed(1)} mg`;
      } else {
        throw new Error('AUC value required for carboplatin calculation');
      }
      break;
    
    case 'Fixed':
      calculatedDose = drug.maxDailyDose;
      method = 'Fixed dose';
      formula = 'Fixed dose as per protocol';
      break;
    
    default:
      throw new Error(`Unknown calculation method: ${drug.calculationMethod}`);
  }

  // Konsantrasyon (mg/mL) belirleme ve gerekli hacim hesabı
  const concentrationMgPerMl = getConcentrationMgPerMl(drug);
  const requiredVolumeMl = concentrationMgPerMl > 0 ? Math.round((calculatedDose / concentrationMgPerMl) * 10) / 10 : 0;
  const bagVolumeMl = chooseBagVolume(calculatedDose, requiredVolumeMl, drug);
  const finalConcentrationMgPerMl = bagVolumeMl > 0 ? Math.round((calculatedDose / bagVolumeMl) * 10) / 10 : 0;

  // Güvenlik kontrolü
  const isWithinLimits = calculatedDose <= drug.maxDailyDose;
  const warnings: string[] = [];
  
  if (!isWithinLimits) {
    warnings.push(`Hesaplanan doz (${calculatedDose.toFixed(1)} ${drug.unit}) maksimum günlük dozu (${drug.maxDailyDose} ${drug.unit}) aşıyor`);
  }

  // Yaş bazlı uyarılar
  if (patientInfo.age > 70) {
    warnings.push('Yaşlı hasta - doz azaltımı gerekebilir');
  }

  if (patientInfo.age < 18) {
    warnings.push('Pediatrik hasta - özel doz hesaplama gerekebilir');
  }

  // GFR bazlı uyarılar
  if (gfr < 60) {
    warnings.push('Böbrek fonksiyon bozukluğu - doz azaltımı gerekebilir');
  }

  if (gfr < 30) {
    warnings.push('Ciddi böbrek fonksiyon bozukluğu - ilaç kontrendike olabilir');
  }

  return {
    drug,
    patientInfo: {
      ...patientInfo,
      bsa,
      gfr
    },
    calculatedDose: {
      dose: Math.round(calculatedDose * 10) / 10, // mg cinsinden, 1 ondalık basamak
      unit: 'mg',
      method,
      formula
    },
    administration: {
      route: drug.administrationRoute,
      solvent: drug.dilution.solvent,
      concentration: drug.dilution.concentration,
      concentrationMgPerMl,
      requiredVolumeMl,
      bagVolumeMl,
      finalConcentrationMgPerMl,
      volume: drug.dilution.volume,
      infusionTime: getInfusionTime(drug)
    },
    safety: {
      maxDose: drug.maxDailyDose,
      isWithinLimits,
      warnings
    },
    monitoring: {
      required: drug.monitoring,
      frequency: getMonitoringFrequency(drug)
    }
  };
};

// BSA bazlı doz hesaplama
const calculateBSADose = (drug: ChemotherapyDrug, bsa: number): number => {
  switch (drug.id) {
    case 'cisplatin':
      return bsa * 75; // 75-100 mg/m² arası, güvenli başlangıç
    case 'doxorubicin':
      return bsa * 60; // 60-75 mg/m² arası
    case 'cyclophosphamide':
      return bsa * 750; // 600-1000 mg/m² arası
    case 'paclitaxel':
      return bsa * 175; // 135-175 mg/m² arası
    case 'docetaxel':
      return bsa * 75; // 75-100 mg/m² arası
    case '5-fluorouracil':
      return bsa * 500; // 400-600 mg/m² arası
    case 'methotrexate':
      return bsa * 100; // 100-1000 mg/m² arası, düşük doz
    default:
      return bsa * (drug.maxDailyDose * 0.8); // Güvenli başlangıç
  }
};

// Kilo bazlı doz hesaplama
const calculateWeightDose = (drug: ChemotherapyDrug, weight: number): number => {
  // Genel olarak 1-2 mg/kg kullanılır
  return weight * 1.5;
};

// İnfüzyon süresi belirleme
const getInfusionTime = (drug: ChemotherapyDrug): string => {
  switch (drug.id) {
    case 'cisplatin':
      return '2-6 saat';
    case 'carboplatin':
      return '30-60 dakika';
    case 'doxorubicin':
      return '15-30 dakika';
    case 'cyclophosphamide':
      return '30-60 dakika';
    case 'paclitaxel':
      return '3 saat';
    case 'docetaxel':
      return '1 saat';
    case '5-fluorouracil':
      return '2-24 saat (protokole göre)';
    case 'methotrexate':
      return '2-6 saat';
    default:
      return '30-60 dakika';
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
const chooseBagVolume = (doseMg: number, requiredVolumeMl: number, drug: ChemotherapyDrug): number => {
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

// İzlem sıklığı belirleme
const getMonitoringFrequency = (drug: ChemotherapyDrug): string => {
  switch (drug.id) {
    case 'cisplatin':
      return 'Her döngü öncesi: Kreatinin, işitme testi';
    case 'carboplatin':
      return 'Her döngü öncesi: CBC, kreatinin, GFR';
    case 'doxorubicin':
      return 'Her döngü öncesi: Ekokardiyogram, CBC';
    case 'cyclophosphamide':
      return 'Her döngü öncesi: CBC, idrar tahlili';
    case 'paclitaxel':
      return 'Her döngü öncesi: Vital bulgular, nörolojik muayene';
    case 'docetaxel':
      return 'Her döngü öncesi: Kilo, vital bulgular';
    case '5-fluorouracil':
      return 'Her döngü öncesi: CBC, mukoz membranlar';
    case 'methotrexate':
      return 'Her döngü öncesi: CBC, LFT, kreatinin';
    default:
      return 'Her döngü öncesi: CBC, böbrek fonksiyonları';
  }
};

// Doz azaltım faktörleri
export const getDoseReductionFactors = (patientInfo: PatientInfo) => {
  const factors: { [key: string]: number } = {};
  
  // Yaş faktörü
  if (patientInfo.age > 70) {
    factors.age = 0.8;
  }
  
  // GFR faktörü
  const gfr = patientInfo.gfr || calculateGFR(patientInfo.weight, patientInfo.age, patientInfo.gender);
  if (gfr < 60) {
    factors.renal = 0.75;
  }
  if (gfr < 30) {
    factors.renal = 0.5;
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
    totalTime: cycleCount * cycleInterval
  };
};
