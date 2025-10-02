export const COLORS = {
  primary: '#3b82f6',
  primaryDark: '#2563eb',
  primaryLight: '#60a5fa',
  secondary: '#8b5cf6',
  secondaryDark: '#7c3aed',
  success: '#10b981',
  successLight: '#34d399',
  warning: '#f59e0b',
  warningLight: '#fbbf24',
  error: '#ef4444',
  errorLight: '#f87171',
  background: '#f8fafc',
  backgroundSecondary: '#f1f5f9',
  surface: '#ffffff',
  surfaceSecondary: '#f8fafc',
  text: '#1e293b',
  textSecondary: '#64748b',
  textTertiary: '#94a3b8',
  border: '#e2e8f0',
  borderLight: '#f1f5f9',
  disabled: '#94a3b8',
  accent: '#06b6d4',
  accentLight: '#22d3ee',
};

// Gradient definitions
export const GRADIENTS = {
  primary: ['#3b82f6', '#2563eb'],
  secondary: ['#8b5cf6', '#7c3aed'],
  success: ['#10b981', '#059669'],
  warning: ['#f59e0b', '#d97706'],
  error: ['#ef4444', '#dc2626'],
  accent: ['#06b6d4', '#0891b2'],
  surface: ['#ffffff', '#f8fafc'],
  background: ['#f8fafc', '#f1f5f9'],
};

export const SPACING = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};

export const FONT_SIZES = {
  xs: 12,
  sm: 14,
  md: 16,
  lg: 18,
  xl: 20,
  xxl: 24,
  xxxl: 32,
};

export const BORDER_RADIUS = {
  sm: 4,
  md: 8,
  lg: 12,
  xl: 16,
  full: 9999,
};

export const DRUG_CATEGORIES = [
  'Antibiotics',
  'Analgesics',
  'Antihypertensives',
  'Antidiabetics',
  'Anticoagulants',
  'Bronchodilators',
  'Corticosteroids',
  'Antiemetics',
  'Antihistamines',
  'Vitamins',
  'Other',
] as const;

export const PATIENT_TYPES = [
  { value: 'adult', label: 'Adult (18-64 years)' },
  { value: 'elderly', label: 'Elderly (65+ years)' },
  { value: 'child', label: 'Child (2-17 years)' },
  { value: 'neonate', label: 'Neonate (0-1 years)' },
] as const;

export const DOSAGE_FREQUENCIES = [
  'q4h', // every 4 hours
  'q6h', // every 6 hours
  'q8h', // every 8 hours
  'q12h', // every 12 hours
  'q24h', // every 24 hours
  'bid', // twice daily
  'tid', // three times daily
  'qid', // four times daily
  'prn', // as needed
] as const;

export const UNITS = ['mg', 'g', 'mcg', 'ml', 'units'] as const;

export const DOSAGE_FORMS = [
  'tablet',
  'capsule',
  'syrup',
  'injection',
  'cream',
  'drops',
] as const;

export const CALCULATION_METHODS = ['weight', 'bsa', 'age', 'fixed'] as const;
