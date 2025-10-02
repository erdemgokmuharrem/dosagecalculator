export interface ChemotherapyDrug {
  id: string;
  name: string;
  genericName: string;
  category: string;
  unit: string;
  dosageForm: string;
  maxDailyDose: number;
  administrationRoute: 'IV' | 'SC' | 'IM' | 'PO' | 'IT';
  dilution: {
    solvent: string;
    concentration: string;
    volume: string;
  };
  calculationMethod: 'BSA' | 'Weight' | 'Fixed' | 'AUC';
  formula: string;
  precautions: string[];
  contraindications: string[];
  sideEffects: string[];
  monitoring: string[];
}

export const CHEMOTHERAPY_DRUGS: ChemotherapyDrug[] = [
  {
    id: 'cisplatin',
    name: 'Cisplatin',
    genericName: 'Cisplatin',
    category: 'Platinum Compounds',
    unit: 'mg/m²',
    dosageForm: 'Injection',
    maxDailyDose: 100,
    administrationRoute: 'IV',
    dilution: {
      solvent: '0.9% NaCl',
      concentration: '1 mg/mL',
      volume: '250-500 mL'
    },
    calculationMethod: 'BSA',
    formula: 'Dose = BSA × 75-100 mg/m²',
    precautions: ['Nephrotoxicity', 'Ototoxicity', 'Neurotoxicity'],
    contraindications: ['Renal impairment', 'Hearing loss'],
    sideEffects: ['Nausea', 'Vomiting', 'Nephrotoxicity', 'Ototoxicity'],
    monitoring: ['Creatinine', 'Hearing', 'Neurological']
  },
  {
    id: 'carboplatin',
    name: 'Carboplatin',
    genericName: 'Carboplatin',
    category: 'Platinum Compounds',
    unit: 'mg/m²',
    dosageForm: 'Injection',
    maxDailyDose: 400,
    administrationRoute: 'IV',
    dilution: {
      solvent: '0.9% NaCl or 5% Dextrose',
      concentration: '10 mg/mL',
      volume: '250-500 mL'
    },
    calculationMethod: 'AUC',
    formula: 'Dose = AUC × (GFR + 25)',
    precautions: ['Myelosuppression', 'Hypersensitivity'],
    contraindications: ['Severe renal impairment'],
    sideEffects: ['Myelosuppression', 'Nausea', 'Vomiting'],
    monitoring: ['CBC', 'Creatinine', 'GFR']
  },
  {
    id: 'doxorubicin',
    name: 'Doxorubicin',
    genericName: 'Doxorubicin HCl',
    category: 'Anthracyclines',
    unit: 'mg/m²',
    dosageForm: 'Injection',
    maxDailyDose: 60,
    administrationRoute: 'IV',
    dilution: {
      solvent: '0.9% NaCl',
      concentration: '2 mg/mL',
      volume: '100-250 mL'
    },
    calculationMethod: 'BSA',
    formula: 'Dose = BSA × 60-75 mg/m²',
    precautions: ['Cardiotoxicity', 'Extravasation', 'Red urine'],
    contraindications: ['Severe cardiac disease'],
    sideEffects: ['Cardiotoxicity', 'Myelosuppression', 'Alopecia'],
    monitoring: ['Echocardiogram', 'CBC', 'Cardiac function']
  },
  {
    id: 'cyclophosphamide',
    name: 'Cyclophosphamide',
    genericName: 'Cyclophosphamide',
    category: 'Alkylating Agents',
    unit: 'mg/m²',
    dosageForm: 'Injection',
    maxDailyDose: 1000,
    administrationRoute: 'IV',
    dilution: {
      solvent: '0.9% NaCl or 5% Dextrose',
      concentration: '20 mg/mL',
      volume: '250-500 mL'
    },
    calculationMethod: 'BSA',
    formula: 'Dose = BSA × 600-1000 mg/m²',
    precautions: ['Hemorrhagic cystitis', 'Myelosuppression'],
    contraindications: ['Severe renal impairment'],
    sideEffects: ['Myelosuppression', 'Hemorrhagic cystitis', 'Nausea'],
    monitoring: ['CBC', 'Urinalysis', 'Renal function']
  },
  {
    id: 'paclitaxel',
    name: 'Paclitaxel',
    genericName: 'Paclitaxel',
    category: 'Taxanes',
    unit: 'mg/m²',
    dosageForm: 'Injection',
    maxDailyDose: 175,
    administrationRoute: 'IV',
    dilution: {
      solvent: '0.9% NaCl or 5% Dextrose',
      concentration: '0.3-1.2 mg/mL',
      volume: '250-500 mL'
    },
    calculationMethod: 'BSA',
    formula: 'Dose = BSA × 135-175 mg/m²',
    precautions: ['Hypersensitivity', 'Neuropathy', 'Myelosuppression'],
    contraindications: ['Severe hypersensitivity'],
    sideEffects: ['Hypersensitivity', 'Neuropathy', 'Myelosuppression'],
    monitoring: ['Vital signs', 'Neurological', 'CBC']
  },
  {
    id: 'docetaxel',
    name: 'Docetaxel',
    genericName: 'Docetaxel',
    category: 'Taxanes',
    unit: 'mg/m²',
    dosageForm: 'Injection',
    maxDailyDose: 100,
    administrationRoute: 'IV',
    dilution: {
      solvent: '0.9% NaCl or 5% Dextrose',
      concentration: '0.3-0.9 mg/mL',
      volume: '250-500 mL'
    },
    calculationMethod: 'BSA',
    formula: 'Dose = BSA × 75-100 mg/m²',
    precautions: ['Hypersensitivity', 'Fluid retention', 'Neuropathy'],
    contraindications: ['Severe hypersensitivity'],
    sideEffects: ['Hypersensitivity', 'Fluid retention', 'Neuropathy'],
    monitoring: ['Vital signs', 'Weight', 'Neurological']
  },
  {
    id: '5-fluorouracil',
    name: '5-Fluorouracil',
    genericName: '5-FU',
    category: 'Antimetabolites',
    unit: 'mg/m²',
    dosageForm: 'Injection',
    maxDailyDose: 1000,
    administrationRoute: 'IV',
    dilution: {
      solvent: '0.9% NaCl or 5% Dextrose',
      concentration: '50 mg/mL',
      volume: '100-500 mL'
    },
    calculationMethod: 'BSA',
    formula: 'Dose = BSA × 400-600 mg/m²',
    precautions: ['Myelosuppression', 'Mucositis', 'Diarrhea'],
    contraindications: ['Severe renal impairment'],
    sideEffects: ['Myelosuppression', 'Mucositis', 'Diarrhea'],
    monitoring: ['CBC', 'Mucous membranes', 'GI symptoms']
  },
  {
    id: 'methotrexate',
    name: 'Methotrexate',
    genericName: 'Methotrexate',
    category: 'Antimetabolites',
    unit: 'mg/m²',
    dosageForm: 'Injection',
    maxDailyDose: 1000,
    administrationRoute: 'IV',
    dilution: {
      solvent: '0.9% NaCl or 5% Dextrose',
      concentration: '25 mg/mL',
      volume: '100-500 mL'
    },
    calculationMethod: 'BSA',
    formula: 'Dose = BSA × 100-1000 mg/m²',
    precautions: ['Myelosuppression', 'Hepatotoxicity', 'Nephrotoxicity'],
    contraindications: ['Severe renal impairment'],
    sideEffects: ['Myelosuppression', 'Hepatotoxicity', 'Nephrotoxicity'],
    monitoring: ['CBC', 'LFTs', 'Creatinine']
  }
];

export const CHEMOTHERAPY_CATEGORIES = [
  'All',
  'Platinum Compounds',
  'Anthracyclines',
  'Alkylating Agents',
  'Taxanes',
  'Antimetabolites',
  'Topoisomerase Inhibitors',
  'Vinca Alkaloids'
];

export const ADMINISTRATION_ROUTES = [
  'IV',
  'SC',
  'IM',
  'PO',
  'IT'
];

export const DILUTION_SOLVENTS = [
  '0.9% NaCl',
  '5% Dextrose',
  '10% Dextrose',
  'Ringer\'s Lactate',
  'Sterile Water'
];
