import React, {
  useState,
  useCallback,
  useRef,
  useMemo,
  useEffect,
} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  TextInput,
  FlatList,
  Animated,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useTranslation } from 'react-i18next';
import { RootStackParamList, Drug, DoseCalculationResult } from '../types';
import { useTheme } from '../contexts/ThemeContext';
import { useAppStore } from '../store';
import { sampleDrugs, getDrugsByCategory } from '../data/drugs';
import { calculateDosage } from '../features/dosage/calculations';
import {
  PatientFormState,
  PatientFieldErrors,
  buildPatient,
  validatePatientForm,
  derivePatientMetrics,
} from '../features/dosage/patientForm';
import {
  formatWarning,
  formatBlockedReason,
  sortWarnings,
  ICON_BY_SEVERITY,
} from '../features/dosage/warnings';
import { reportError } from '../services/monitoring';
import { AdBanner } from '../components/AdBanner';
import { useAdManager } from '../contexts/AdContext';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

const CATEGORY_ICONS: Record<string, string> = {
  All: '🔍',
  Analgesics: '💊',
  Antibiotics: '🦠',
  'Cardiac Glycosides': '❤️',
  Anticoagulants: '🩸',
  Antidiabetics: '💉',
  Corticosteroids: '⚡',
  Cardiovascular: '🫀',
  Antihypertensives: '📉',
  Diuretics: '💧',
  Immunosuppressants: '🛡️',
  Neurology: '🧠',
  Psychiatry: '🧩',
  Respiratory: '🫁',
  Gastrointestinal: '🫃',
  Oncology: '⚕️',
  Antimicrobials: '🧪',
  Emergency: '🚨',
  Endocrinology: '🔬',
  Ophthalmology: '👁️',
  Dermatology: '🩹',
  Supplements: '🌿',
  Vitamins: '🍋',
};

// FREQUENCY_LABELS is generated with t() inside the component.
// PatientFormState lives in features/dosage/patientForm so the form bounds and
// the engine's bounds cannot drift apart.

const CalculatorScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();
  const { t } = useTranslation();
  const { theme } = useTheme();
  const { addCalculation } = useAppStore();
  const { showInterstitialAd } = useAdManager();

  // Must cover every code in the engine's DOSES_PER_DAY map, otherwise the UI
  // shows a raw code like "q21d" where a schedule belongs.
  const FREQUENCY_LABELS: Record<string, string> = {
    q4h: t('calculation.q4h'),
    q6h: t('calculation.q6h'),
    q8h: t('calculation.q8h'),
    q12h: t('calculation.q12h'),
    q24h: t('calculation.q24h'),
    q48h: t('calculation.q48h'),
    q72h: t('calculation.q72h'),
    q7d: t('calculation.q7d'),
    q14d: t('calculation.q14d'),
    q21d: t('calculation.q21d'),
    q28d: t('calculation.q28d'),
    qd: t('calculation.qd'),
    bid: t('calculation.bid'),
    tid: t('calculation.tid'),
    qid: t('calculation.qid'),
    prn: t('calculation.prn'),
  };

  const scrollRef = useRef<ScrollView>(null);
  const resultAnim = useRef(new Animated.Value(0)).current;

  // Patient State
  const [patient, setPatient] = useState<PatientFormState>({
    age: '35',
    weight: '70',
    height: '170',
    gender: 'male',
    patientType: 'adult',
    serumCreatinine: '1.0',
  });

  // Drug Selection State
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedDrug, setSelectedDrug] = useState<Drug | null>(null);
  const [showDrugList, setShowDrugList] = useState(false);

  // Result State. Typed as the discriminated union so a "blocked" result cannot
  // be rendered as if it carried a dose — the previous `any` hid exactly that.
  const [result, setResult] = useState<DoseCalculationResult | null>(null);
  const [fieldErrors, setFieldErrors] = useState<PatientFieldErrors>({});
  const [showErrors, setShowErrors] = useState(false);

  // Filtered drugs with debounce
  const searchTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [debouncedQuery, setDebouncedQuery] = useState('');

  const handleSearchChange = useCallback((text: string) => {
    setSearchQuery(text);
    if (searchTimeoutRef.current) clearTimeout(searchTimeoutRef.current);
    searchTimeoutRef.current = setTimeout(() => setDebouncedQuery(text), 80);
  }, []);

  const filteredDrugs = useMemo(() => {
    let drugs =
      selectedCategory === 'All'
        ? sampleDrugs
        : getDrugsByCategory(selectedCategory);
    if (debouncedQuery.trim()) {
      const q = debouncedQuery.toLowerCase();
      drugs = drugs.filter(
        d =>
          d.name.toLowerCase().includes(q) ||
          d.genericName.toLowerCase().includes(q) ||
          d.category.toLowerCase().includes(q)
      );
    }
    return drugs;
  }, [debouncedQuery, selectedCategory]);

  const allCategories = useMemo(() => {
    const cats = Array.from(new Set(sampleDrugs.map(d => d.category)));
    return cats;
  }, []);

  // Derived patient values. Computed from the shared module rather than
  // re-implementing BSA/CrCl here — a second copy of a clinical formula is a
  // second place for it to be wrong.
  const metrics = useMemo(() => derivePatientMetrics(patient), [patient]);

  // Re-validate as the clinician types, but only surface errors once they have
  // tried to calculate, so the form does not shout at a half-typed number.
  useEffect(() => {
    setFieldErrors(validatePatientForm(patient));
  }, [patient]);

  // Any patient edit invalidates the displayed dose. Leaving a stale result on
  // screen next to changed inputs is how a wrong dose gets read out loud.
  useEffect(() => {
    setResult(null);
  }, [patient]);

  const calculateDose = useCallback(
    (drug?: Drug) => {
      const d = drug || selectedDrug;
      if (!d) {
        Alert.alert(t('common.warning'), t('drug.noDrugSelected'));
        return;
      }

      const errors = validatePatientForm(patient);
      if (Object.keys(errors).length > 0) {
        // Surface the errors inline on the offending fields instead of a modal
        // that hides which value is wrong.
        setFieldErrors(errors);
        setShowErrors(true);
        setResult(null);
        return;
      }

      const p = buildPatient(patient);
      if (!p) {
        setShowErrors(true);
        setResult(null);
        return;
      }

      let calcResult: DoseCalculationResult;
      try {
        calcResult = calculateDosage(p, d);
      } catch (error) {
        // A crash in the clinical engine must be visible, not swallowed.
        reportError(error, { screen: 'Calculator', drugId: d.id });
        Alert.alert(t('common.error'), t('errors.calculationError'));
        return;
      }

      setShowErrors(false);
      setResult(calcResult);

      Animated.spring(resultAnim, {
        toValue: 1,
        useNativeDriver: true,
        tension: 80,
        friction: 8,
      }).start();

      setTimeout(() => {
        scrollRef.current?.scrollToEnd({ animated: true });
      }, 200);
    },
    [selectedDrug, patient, resultAnim, t]
  );

  const handleSelectDrug = useCallback(
    (drug: Drug) => {
      setSelectedDrug(drug);
      setShowDrugList(false);
      setSearchQuery('');
      setResult(null);
      // Auto-calculate after selection.
      setTimeout(() => calculateDose(drug), 100);
    },
    [calculateDose]
  );

  /**
   * Opens the monograph — and is the only place an interstitial is shown.
   *
   * The interstitial used to gate the calculation result itself: a full-screen
   * ad appeared between pressing Calculate and seeing the dose. Interrupting a
   * clinical task that way is both a store-review risk and a genuine safety
   * problem, so it now hangs off a browsing action instead.
   */
  const openDrugDetail = useCallback(
    (drugId: string) => {
      showInterstitialAd(() => navigation.navigate('DrugDetail', { drugId }));
    },
    [navigation, showInterstitialAd]
  );

  const handleSaveCalculation = useCallback(() => {
    // Only a successful calculation is savable. The previous version read
    // `result.singleDose` / `result.unit`, which the engine never returned, so
    // every stored entry recorded an undefined dose.
    if (!result || result.status !== 'success' || !selectedDrug) return;
    const p = buildPatient(patient);
    if (!p) return;

    addCalculation({
      id: Date.now().toString(),
      patientId: p.id,
      drugId: selectedDrug.id,
      calculatedDose: result.doseMg,
      unit: result.unit,
      frequency: result.frequency,
      dailyTotalMg: result.dailyTotalMg,
      maxDailyDose: result.maxDailyDose,
      maxSingleDose: result.maxSingleDose,
      cappedByMaximumDose: result.cappedByMaximumDose,
      exceedsDailyMax: result.exceedsDailyMax,
      warnings: result.warnings,
      timestamp: new Date(),
      parameters: {
        patientWeight: p.weight,
        patientAge: p.age,
        patientBsa: result.bsa,
        patientCrcl: result.renalEstimate?.value,
        drugDosePerKg: selectedDrug.dosageFormula.dosePerKg,
        drugDosePerM2: selectedDrug.dosageFormula.dosePerM2,
        drugFixedDose: selectedDrug.dosageFormula.fixedDose,
      },
      drugName: selectedDrug.name,
      patientSummary: `${p.age}y, ${p.weight}kg, ${t(`patient.${p.gender}`)}`,
    });

    Alert.alert('✓', t('calculation.savedSuccess'));
  }, [result, selectedDrug, patient, addCalculation, t]);

  const styles = StyleSheet.create({
    flex: { flex: 1 },
    clearSearchIcon: { color: theme.colors.textSecondary, fontSize: 16 },
    emptyList: { padding: 20, alignItems: 'center' },
    limitIcon: { fontSize: 16 },
    bannerWrap: { marginHorizontal: 12, marginBottom: 8 },
    container: { flex: 1, backgroundColor: theme.colors.background },
    scrollContent: { paddingBottom: 40 },
    // Section styles
    section: {
      backgroundColor: theme.colors.surface,
      borderRadius: 20,
      margin: 12,
      marginBottom: 6,
      padding: 18,
      shadowColor: theme.colors.shadow,
      shadowOffset: { width: 0, height: 3 },
      shadowOpacity: 0.1,
      shadowRadius: 8,
      elevation: 4,
    },
    sectionHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 14,
    },
    sectionIcon: { fontSize: 20, marginRight: 8 },
    sectionTitle: {
      fontSize: 16,
      fontWeight: '800',
      color: theme.colors.text,
      flex: 1,
    },
    // Patient form
    inlineRow: { flexDirection: 'row', gap: 10, marginBottom: 10 },
    inputGroup: { flex: 1 },
    inputLabel: {
      fontSize: 11,
      fontWeight: '700',
      color: theme.colors.textSecondary,
      marginBottom: 4,
      textTransform: 'uppercase',
      letterSpacing: 0.5,
    },
    input: {
      backgroundColor: theme.colors.background,
      borderRadius: 10,
      borderWidth: 1.5,
      borderColor: theme.colors.border,
      paddingHorizontal: 12,
      paddingVertical: 10,
      fontSize: 16,
      fontWeight: '700',
      color: theme.colors.text,
    },
    // Gender Toggle
    toggleRow: { flexDirection: 'row', gap: 8, marginBottom: 10 },
    toggleBtn: {
      flex: 1,
      paddingVertical: 10,
      borderRadius: 10,
      borderWidth: 1.5,
      borderColor: theme.colors.border,
      alignItems: 'center',
      backgroundColor: theme.colors.background,
    },
    toggleBtnActive: {
      borderColor: theme.colors.primary,
      backgroundColor: theme.colors.primary + '15',
    },
    toggleText: {
      fontSize: 13,
      fontWeight: '700',
      color: theme.colors.textSecondary,
    },
    toggleTextActive: { color: theme.colors.primary },
    // Patient type pills
    pillRow: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: 8,
      marginBottom: 10,
    },
    pill: {
      paddingHorizontal: 12,
      paddingVertical: 6,
      borderRadius: 20,
      backgroundColor: theme.colors.background,
      borderWidth: 1.5,
      borderColor: theme.colors.border,
    },
    pillActive: {
      backgroundColor: theme.colors.primary,
      borderColor: theme.colors.primary,
    },
    pillText: {
      fontSize: 12,
      fontWeight: '600',
      color: theme.colors.textSecondary,
    },
    pillTextActive: { color: '#FFFFFF' },
    // Calculated values
    calcRow: {
      flexDirection: 'row',
      backgroundColor: theme.colors.primary + '08',
      borderRadius: 12,
      padding: 12,
      gap: 8,
      marginTop: 6,
    },
    calcItem: { flex: 1, alignItems: 'center' },
    calcLabel: {
      fontSize: 10,
      color: theme.colors.textSecondary,
      fontWeight: '600',
      marginBottom: 2,
    },
    calcValue: { fontSize: 15, fontWeight: '800', color: theme.colors.primary },
    // Drug Search
    searchBar: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: theme.colors.background,
      borderRadius: 12,
      borderWidth: 1.5,
      borderColor: theme.colors.border,
      paddingHorizontal: 12,
      marginBottom: 10,
    },
    searchIcon: {
      fontSize: 16,
      marginRight: 8,
      color: theme.colors.textSecondary,
    },
    searchInput: {
      flex: 1,
      paddingVertical: 11,
      fontSize: 14,
      color: theme.colors.text,
    },
    catScroll: { marginBottom: 10 },
    catChip: {
      paddingHorizontal: 12,
      paddingVertical: 6,
      borderRadius: 20,
      backgroundColor: theme.colors.background,
      borderWidth: 1.5,
      borderColor: theme.colors.border,
      marginRight: 8,
      flexDirection: 'row',
      alignItems: 'center',
      gap: 4,
    },
    catChipActive: {
      backgroundColor: theme.colors.primary,
      borderColor: theme.colors.primary,
    },
    catChipText: {
      fontSize: 12,
      fontWeight: '600',
      color: theme.colors.textSecondary,
    },
    catChipTextActive: { color: '#FFFFFF' },
    // Drug list
    drugListContainer: {
      maxHeight: 280,
      borderRadius: 12,
      borderWidth: 1,
      borderColor: theme.colors.border,
      overflow: 'hidden',
    },
    drugItem: {
      flexDirection: 'row',
      alignItems: 'center',
      padding: 12,
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.border,
      backgroundColor: theme.colors.surface,
    },
    drugItemIcon: {
      width: 36,
      height: 36,
      borderRadius: 10,
      backgroundColor: theme.colors.primary + '15',
      alignItems: 'center',
      justifyContent: 'center',
      marginRight: 10,
    },
    drugItemIconText: { fontSize: 16 },
    drugItemInfo: { flex: 1 },
    drugItemName: { fontSize: 14, fontWeight: '700', color: theme.colors.text },
    drugItemSub: {
      fontSize: 12,
      color: theme.colors.textSecondary,
      marginTop: 1,
    },
    drugItemCategory: {
      paddingHorizontal: 8,
      paddingVertical: 3,
      backgroundColor: theme.colors.primary + '15',
      borderRadius: 8,
    },
    drugItemCategoryText: {
      fontSize: 10,
      fontWeight: '700',
      color: theme.colors.primary,
    },
    // Selected drug card
    selectedDrugCard: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: theme.colors.primary + '08',
      borderRadius: 12,
      padding: 12,
      borderWidth: 1.5,
      borderColor: theme.colors.primary + '40',
    },
    selectedDrugIcon: {
      width: 44,
      height: 44,
      borderRadius: 12,
      backgroundColor: theme.colors.primary,
      alignItems: 'center',
      justifyContent: 'center',
      marginRight: 12,
    },
    selectedDrugIconText: { fontSize: 22 },
    selectedDrugInfo: { flex: 1 },
    selectedDrugName: {
      fontSize: 15,
      fontWeight: '800',
      color: theme.colors.text,
    },
    selectedDrugSub: {
      fontSize: 12,
      color: theme.colors.textSecondary,
      marginTop: 2,
    },
    changeDrugBtn: {
      paddingHorizontal: 10,
      paddingVertical: 6,
      backgroundColor: theme.colors.primary,
      borderRadius: 8,
    },
    changeDrugText: { fontSize: 11, fontWeight: '700', color: '#FFF' },
    // Calculate button
    calculateBtn: {
      margin: 12,
      marginTop: 6,
      backgroundColor: theme.colors.primary,
      borderRadius: 16,
      paddingVertical: 18,
      alignItems: 'center',
      shadowColor: theme.colors.primary,
      shadowOffset: { width: 0, height: 6 },
      shadowOpacity: 0.4,
      shadowRadius: 12,
      elevation: 10,
    },
    calculateBtnText: {
      fontSize: 17,
      fontWeight: '900',
      color: '#FFFFFF',
      letterSpacing: 0.5,
    },
    // Result section
    resultSection: {
      backgroundColor: theme.colors.surface,
      borderRadius: 20,
      margin: 12,
      marginTop: 6,
      overflow: 'hidden',
      borderWidth: 2,
      borderColor: theme.colors.primary + '40',
      shadowColor: theme.colors.primary,
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.2,
      shadowRadius: 12,
      elevation: 8,
    },
    resultHeader: {
      backgroundColor: theme.colors.primaryDark,
      paddingHorizontal: 20,
      paddingVertical: 14,
    },
    resultHeaderText: {
      fontSize: 14,
      fontWeight: '800',
      color: '#FFFFFF',
    },
    resultBody: { padding: 20 },
    resultDoseRow: {
      flexDirection: 'row',
      alignItems: 'flex-end',
      justifyContent: 'center',
      marginBottom: 6,
    },
    resultDoseValue: {
      fontSize: 52,
      fontWeight: '900',
      color: theme.colors.primary,
      lineHeight: 56,
    },
    resultDoseUnit: {
      fontSize: 20,
      fontWeight: '700',
      color: theme.colors.textSecondary,
      marginBottom: 8,
      marginLeft: 4,
    },
    resultStats: {
      flexDirection: 'row',
      backgroundColor: theme.colors.background,
      borderRadius: 12,
      padding: 14,
      marginBottom: 12,
    },
    resultStat: { flex: 1, alignItems: 'center' },
    resultStatLabel: {
      fontSize: 10,
      color: theme.colors.textSecondary,
      fontWeight: '600',
      marginBottom: 3,
    },
    resultStatValue: {
      fontSize: 14,
      fontWeight: '800',
      color: theme.colors.text,
    },
    resultStatDivider: { width: 1, backgroundColor: theme.colors.border },
    // Limit indicator
    limitOk: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: theme.colors.safeSurface,
      borderRadius: 10,
      padding: 10,
      marginBottom: 10,
    },
    limitWarn: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: theme.colors.criticalLight,
      borderRadius: 10,
      padding: 10,
      marginBottom: 10,
    },
    limitText: { fontSize: 13, fontWeight: '700', marginLeft: 6 },
    // Warnings
    // Warnings. Severity drives colour AND weight so a capped dose does not read
    // like an informational note. Hardcoded hex values were theme-blind and
    // became unreadable in dark mode.
    warningItem: {
      flexDirection: 'row',
      backgroundColor: theme.colors.warningSurface,
      borderLeftWidth: 3,
      borderLeftColor: theme.colors.warning,
      borderRadius: 8,
      padding: 10,
      marginBottom: 6,
    },
    warningText: {
      fontSize: 12,
      color: theme.colors.warningText,
      flex: 1,
      lineHeight: 18,
    },
    warningCritical: {
      backgroundColor: theme.colors.criticalLight,
      borderLeftColor: theme.colors.critical,
      borderLeftWidth: 4,
    },
    warningTextCritical: {
      color: theme.colors.criticalText,
      fontWeight: '700',
    },
    warningInfo: {
      backgroundColor: theme.colors.infoSurface,
      borderLeftColor: theme.colors.info,
    },
    warningTextInfo: { color: theme.colors.infoText, fontWeight: '500' },

    // Blocked result
    blockedCard: {
      backgroundColor: theme.colors.criticalLight,
      borderWidth: 1.5,
      borderColor: theme.colors.critical,
      borderRadius: 16,
      margin: 12,
      padding: 16,
    },
    blockedTitle: {
      fontSize: 15,
      fontWeight: '800',
      color: theme.colors.criticalText,
      marginBottom: 6,
    },
    blockedText: {
      fontSize: 13,
      color: theme.colors.criticalText,
      lineHeight: 19,
    },

    // Volume / formula / provenance
    resultVolume: {
      fontSize: 15,
      fontWeight: '700',
      color: theme.colors.textSecondary,
      textAlign: 'center',
      marginTop: -6,
      marginBottom: 10,
    },
    formulaText: {
      fontSize: 11,
      color: theme.colors.textSecondary,
      fontVariant: ['tabular-nums'],
      marginBottom: 10,
    },
    provenanceRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 8,
      marginTop: 4,
      marginBottom: 10,
    },
    provenanceLabel: {
      fontSize: 11,
      fontWeight: '700',
      color: theme.colors.textSecondary,
    },
    provenanceBadge: {
      backgroundColor: theme.colors.criticalLight,
      borderRadius: 6,
      paddingHorizontal: 8,
      paddingVertical: 3,
    },
    provenanceBadgeOk: { backgroundColor: theme.colors.safeSurface },
    provenanceBadgeText: {
      fontSize: 10,
      fontWeight: '800',
      color: theme.colors.text,
    },

    // Inline field validation
    inputError: { borderColor: theme.colors.critical, borderWidth: 2 },
    errorText: {
      fontSize: 11,
      color: theme.colors.critical,
      marginTop: 3,
      fontWeight: '600',
    },

    // Result actions
    resultActions: { flexDirection: 'row', gap: 10, marginTop: 4 },
    actionBtn: {
      flex: 1,
      paddingVertical: 12,
      borderRadius: 12,
      alignItems: 'center',
      borderWidth: 1.5,
    },
    actionBtnPrimary: {
      backgroundColor: theme.colors.primary,
      borderColor: theme.colors.primary,
    },
    actionBtnSecondary: {
      backgroundColor: 'transparent',
      borderColor: theme.colors.primary,
    },
    actionBtnText: { fontSize: 13, fontWeight: '700' },
    actionBtnTextPrimary: { color: '#FFF' },
    actionBtnTextSecondary: { color: theme.colors.primary },
    // Disclaimer
    disclaimer: {
      marginHorizontal: 12,
      marginBottom: 12,
      padding: 12,
      backgroundColor: theme.colors.primary + '08',
      borderRadius: 10,
      borderWidth: 1,
      borderColor: theme.colors.primary + '20',
    },
    disclaimerText: {
      fontSize: 10,
      color: theme.colors.textSecondary,
      textAlign: 'center',
      lineHeight: 15,
    },
  });

  const patientTypes = [
    { key: 'adult', label: `👨 ${t('patient.adult')}` },
    { key: 'elderly', label: `👴 ${t('patient.elderly')}` },
    { key: 'child', label: `👧 ${t('patient.child')}` },
    { key: 'neonate', label: `👶 ${t('patient.neonate')}` },
  ] as const;

  const success = result?.status === 'success' ? result : null;
  const blocked = result?.status === 'blocked' ? result : null;

  const freqLabel = success?.frequency
    ? (FREQUENCY_LABELS[success.frequency.trim().toLowerCase()] ??
      success.frequency)
    : t('calculation.unknownFrequency');

  const fieldError = (field: keyof PatientFormState): string | null =>
    showErrors && fieldErrors[field] ? t(fieldErrors[field] as string) : null;

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          ref={scrollRef}
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* ═══ SECTION 1: PATIENT INFO ═══ */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionIcon}>👤</Text>
              <Text style={styles.sectionTitle}>{t('patient.section')}</Text>
            </View>

            {/* Age, Weight, Height */}
            <View style={styles.inlineRow}>
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>{t('patient.age')}</Text>
                <TextInput
                  style={[styles.input, fieldError('age') && styles.inputError]}
                  value={patient.age}
                  onChangeText={v => setPatient(p => ({ ...p, age: v }))}
                  keyboardType="number-pad"
                  placeholder={t('patient.agePlaceholder')}
                  placeholderTextColor={theme.colors.textSecondary}
                  maxLength={3}
                  testID="age-input"
                  accessibilityLabel={t('patient.age')}
                  accessibilityHint={t('patient.agePlaceholder')}
                />
                {fieldError('age') && (
                  <Text style={styles.errorText}>{fieldError('age')}</Text>
                )}
              </View>
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>{t('patient.weight')}</Text>
                <TextInput
                  style={[
                    styles.input,
                    fieldError('weight') && styles.inputError,
                  ]}
                  value={patient.weight}
                  onChangeText={v => setPatient(p => ({ ...p, weight: v }))}
                  keyboardType="decimal-pad"
                  placeholder={t('patient.weightPlaceholder')}
                  placeholderTextColor={theme.colors.textSecondary}
                  maxLength={5}
                  testID="weight-input"
                  accessibilityLabel={t('patient.weight')}
                  accessibilityHint={t('patient.weightPlaceholder')}
                />
                {fieldError('weight') && (
                  <Text style={styles.errorText}>{fieldError('weight')}</Text>
                )}
              </View>
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>{t('patient.height')}</Text>
                <TextInput
                  style={[
                    styles.input,
                    fieldError('height') && styles.inputError,
                  ]}
                  value={patient.height}
                  onChangeText={v => setPatient(p => ({ ...p, height: v }))}
                  keyboardType="decimal-pad"
                  placeholder={t('patient.heightPlaceholder')}
                  placeholderTextColor={theme.colors.textSecondary}
                  maxLength={3}
                  testID="height-input"
                  accessibilityLabel={t('patient.height')}
                  accessibilityHint={t('patient.heightPlaceholder')}
                />
                {fieldError('height') && (
                  <Text style={styles.errorText}>{fieldError('height')}</Text>
                )}
              </View>
            </View>

            {/* Gender Toggle */}
            <View style={styles.toggleRow}>
              <TouchableOpacity
                accessibilityRole="radio"
                accessibilityState={{ checked: patient.gender === 'male' }}
                style={[
                  styles.toggleBtn,
                  patient.gender === 'male' && styles.toggleBtnActive,
                ]}
                onPress={() => setPatient(p => ({ ...p, gender: 'male' }))}
              >
                <Text
                  style={[
                    styles.toggleText,
                    patient.gender === 'male' && styles.toggleTextActive,
                  ]}
                >
                  ♂ {t('patient.male')}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                accessibilityRole="radio"
                accessibilityState={{ checked: patient.gender === 'female' }}
                style={[
                  styles.toggleBtn,
                  patient.gender === 'female' && styles.toggleBtnActive,
                ]}
                onPress={() => setPatient(p => ({ ...p, gender: 'female' }))}
              >
                <Text
                  style={[
                    styles.toggleText,
                    patient.gender === 'female' && styles.toggleTextActive,
                  ]}
                >
                  ♀ {t('patient.female')}
                </Text>
              </TouchableOpacity>
            </View>

            {/* Patient Type Pills */}
            <View style={styles.pillRow}>
              {patientTypes.map(pt => (
                <TouchableOpacity
                  accessibilityRole="radio"
                  accessibilityState={{
                    checked: patient.patientType === pt.key,
                  }}
                  key={pt.key}
                  style={[
                    styles.pill,
                    patient.patientType === pt.key && styles.pillActive,
                  ]}
                  onPress={() =>
                    setPatient(p => ({ ...p, patientType: pt.key }))
                  }
                >
                  <Text
                    style={[
                      styles.pillText,
                      patient.patientType === pt.key && styles.pillTextActive,
                    ]}
                  >
                    {pt.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            {/* Serum Creatinine */}
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>
                {t('patient.serumCreatinine')} ({t('common.optional')})
              </Text>
              <TextInput
                style={[
                  styles.input,
                  fieldError('serumCreatinine') && styles.inputError,
                ]}
                value={patient.serumCreatinine}
                onChangeText={v =>
                  setPatient(p => ({ ...p, serumCreatinine: v }))
                }
                keyboardType="decimal-pad"
                placeholder="1.0"
                placeholderTextColor={theme.colors.textSecondary}
                maxLength={5}
                testID="creatinine-input"
                accessibilityLabel={t('patient.serumCreatinine')}
              />
              {fieldError('serumCreatinine') && (
                <Text style={styles.errorText}>
                  {fieldError('serumCreatinine')}
                </Text>
              )}
            </View>

            {/* Derived values. The renal figure is labelled with the method and
                unit actually used (Schwartz eGFR under 18, Cockcroft-Gault
                otherwise) — the previous version showed a bare "CrCl" number
                computed with an adult-only formula regardless of age. */}
            {(metrics.bsa !== null ||
              metrics.bmi !== null ||
              metrics.renal !== null) && (
              <View style={styles.calcRow}>
                {metrics.bmi !== null && (
                  <View style={styles.calcItem}>
                    <Text style={styles.calcLabel}>{t('patient.bmi')}</Text>
                    <Text style={styles.calcValue}>{metrics.bmi}</Text>
                  </View>
                )}
                {metrics.bsa !== null && (
                  <View style={styles.calcItem}>
                    <Text style={styles.calcLabel}>{t('patient.bsa')}</Text>
                    <Text style={styles.calcValue}>{metrics.bsa}</Text>
                  </View>
                )}
                {metrics.renal !== null && (
                  <View style={styles.calcItem}>
                    <Text style={styles.calcLabel}>
                      {metrics.renal.method === 'schwartz'
                        ? 'eGFR'
                        : t('patient.crcl')}
                    </Text>
                    <Text style={styles.calcValue}>{metrics.renal.value}</Text>
                  </View>
                )}
              </View>
            )}
          </View>

          {/* ═══ SECTION 2: DRUG SELECTION ═══ */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionIcon}>💊</Text>
              <Text style={styles.sectionTitle}>{t('drug.section')}</Text>
              {selectedDrug && !showDrugList && (
                <TouchableOpacity
                  accessibilityRole="button"
                  style={styles.changeDrugBtn}
                  onPress={() => setShowDrugList(true)}
                >
                  <Text style={styles.changeDrugText}>
                    {t('drug.changeDrug')}
                  </Text>
                </TouchableOpacity>
              )}
            </View>

            {/* Selected drug card */}
            {selectedDrug && !showDrugList ? (
              <View style={styles.selectedDrugCard}>
                <View style={styles.selectedDrugIcon}>
                  <Text style={styles.selectedDrugIconText}>💊</Text>
                </View>
                <View style={styles.selectedDrugInfo}>
                  <Text style={styles.selectedDrugName}>
                    {selectedDrug.name}
                  </Text>
                  <Text style={styles.selectedDrugSub}>
                    {selectedDrug.genericName} •{' '}
                    {t(
                      `drug.${selectedDrug.dosageForm}`,
                      selectedDrug.dosageForm
                    )}
                  </Text>
                  <Text style={styles.selectedDrugSub}>
                    Max: {selectedDrug.maxDailyDose} {selectedDrug.unit}/
                    {t('calculation.perDay', 'day')}
                  </Text>
                </View>
              </View>
            ) : (
              <>
                {/* Search Bar */}
                <View style={styles.searchBar}>
                  <Text style={styles.searchIcon}>🔍</Text>
                  <TextInput
                    style={styles.searchInput}
                    value={searchQuery}
                    testID="drug-search"
                    onChangeText={handleSearchChange}
                    placeholder={t('drug.searchPlaceholder')}
                    placeholderTextColor={theme.colors.textSecondary}
                    onFocus={() => setShowDrugList(true)}
                  />
                  {searchQuery.length > 0 && (
                    <TouchableOpacity
                      accessibilityRole="button"
                      accessibilityLabel={t('common.clearSearch')}
                      onPress={() => {
                        setSearchQuery('');
                        setDebouncedQuery('');
                      }}
                    >
                      <Text style={styles.clearSearchIcon}>✕</Text>
                    </TouchableOpacity>
                  )}
                </View>

                {/* Category Chips */}
                <ScrollView
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  style={styles.catScroll}
                >
                  <TouchableOpacity
                    accessibilityRole="button"
                    accessibilityState={{
                      selected: selectedCategory === 'All',
                    }}
                    style={[
                      styles.catChip,
                      selectedCategory === 'All' && styles.catChipActive,
                    ]}
                    onPress={() => setSelectedCategory('All')}
                  >
                    <Text
                      style={[
                        styles.catChipText,
                        selectedCategory === 'All' && styles.catChipTextActive,
                      ]}
                    >
                      🔍 {t('common.all')}
                    </Text>
                  </TouchableOpacity>
                  {allCategories.map(cat => (
                    <TouchableOpacity
                      accessibilityRole="button"
                      accessibilityState={{
                        selected: selectedCategory === cat,
                      }}
                      key={cat}
                      style={[
                        styles.catChip,
                        selectedCategory === cat && styles.catChipActive,
                      ]}
                      onPress={() => setSelectedCategory(cat)}
                    >
                      <Text
                        style={[
                          styles.catChipText,
                          selectedCategory === cat && styles.catChipTextActive,
                        ]}
                      >
                        {CATEGORY_ICONS[cat] || '💊'}{' '}
                        {t(`category.${cat}`, cat)}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>

                {/* Drug List */}
                <View style={styles.drugListContainer}>
                  <FlatList
                    data={filteredDrugs}
                    keyExtractor={item => item.id}
                    scrollEnabled={true}
                    nestedScrollEnabled={true}
                    renderItem={({ item, index }) => (
                      <TouchableOpacity
                        testID={`drug-item-${index}`}
                        style={styles.drugItem}
                        onPress={() => handleSelectDrug(item)}
                        activeOpacity={0.7}
                        accessibilityRole="button"
                        accessibilityLabel={item.name}
                      >
                        <View style={styles.drugItemIcon}>
                          <Text style={styles.drugItemIconText}>
                            {CATEGORY_ICONS[item.category] || '💊'}
                          </Text>
                        </View>
                        <View style={styles.drugItemInfo}>
                          <Text style={styles.drugItemName}>{item.name}</Text>
                          <Text style={styles.drugItemSub}>
                            {item.genericName} •{' '}
                            {t(`drug.${item.dosageForm}`, item.dosageForm)}
                          </Text>
                        </View>
                        <View style={styles.drugItemCategory}>
                          <Text style={styles.drugItemCategoryText}>
                            {t(`category.${item.category}`, item.category)}
                          </Text>
                        </View>
                      </TouchableOpacity>
                    )}
                    ListEmptyComponent={
                      <View style={styles.emptyList}>
                        <Text style={{ color: theme.colors.textSecondary }}>
                          {t('drug.noResults')}
                        </Text>
                      </View>
                    }
                  />
                </View>
              </>
            )}
          </View>

          {/* ═══ CALCULATE BUTTON ═══ */}
          <TouchableOpacity
            accessibilityRole="button"
            style={styles.calculateBtn}
            testID="calculate-button"
            onPress={() => calculateDose()}
            activeOpacity={0.85}
          >
            <Text style={styles.calculateBtnText}>
              ⚡ {t('calculation.calculate')}
            </Text>
          </TouchableOpacity>

          {/* ═══ SECTION 3: RESULT ═══ */}
          {/* Blocked: the engine refused to produce a dose. Say why, plainly. */}
          {blocked && (
            <View style={styles.blockedCard}>
              <Text style={styles.blockedTitle}>⛔ {t('blocked.title')}</Text>
              <Text testID="blocked-message" style={styles.blockedText}>
                {formatBlockedReason(t, blocked)}
              </Text>
            </View>
          )}

          {success && (
            <Animated.View
              style={[
                styles.resultSection,
                {
                  opacity: resultAnim,
                  transform: [
                    {
                      translateY: resultAnim.interpolate({
                        inputRange: [0, 1],
                        outputRange: [30, 0],
                      }),
                    },
                  ],
                },
              ]}
            >
              <View style={styles.resultHeader}>
                <Text style={styles.resultHeaderText}>
                  💊 {selectedDrug?.name} — {t('calculation.section')}
                </Text>
              </View>

              <View style={styles.resultBody}>
                {/* Main dose */}
                <View style={styles.resultDoseRow}>
                  <Text testID="result-dose" style={styles.resultDoseValue}>
                    {success.doseMg % 1 === 0
                      ? success.doseMg.toString()
                      : success.doseMg.toFixed(2)}
                  </Text>
                  <Text style={styles.resultDoseUnit}>{success.unit}</Text>
                </View>

                {typeof success.volumeMl === 'number' && (
                  <Text style={styles.resultVolume}>
                    ≈ {success.volumeMl} mL
                  </Text>
                )}

                {/* Stats */}
                <View style={styles.resultStats}>
                  <View style={styles.resultStat}>
                    <Text style={styles.resultStatLabel}>
                      {t('calculation.frequency').toUpperCase()}
                    </Text>
                    <Text style={styles.resultStatValue}>{freqLabel}</Text>
                  </View>

                  <View style={styles.resultStatDivider} />
                  <View style={styles.resultStat}>
                    <Text style={styles.resultStatLabel}>
                      {t('calculation.dailyTotal').toUpperCase()}
                    </Text>
                    <Text style={styles.resultStatValue}>
                      {typeof success.dailyTotalMg === 'number'
                        ? `${success.dailyTotalMg} ${success.unit}`
                        : t('calculation.notChecked')}
                    </Text>
                  </View>

                  {typeof success.maxDailyDose === 'number' && (
                    <>
                      <View style={styles.resultStatDivider} />
                      <View style={styles.resultStat}>
                        <Text style={styles.resultStatLabel}>
                          {t('calculation.maxDailyDose').toUpperCase()}
                        </Text>
                        <Text style={styles.resultStatValue}>
                          {success.maxDailyDose} {success.unit}
                        </Text>
                      </View>
                    </>
                  )}

                  {typeof success.maxSingleDose === 'number' && (
                    <>
                      <View style={styles.resultStatDivider} />
                      <View style={styles.resultStat}>
                        <Text style={styles.resultStatLabel}>
                          {t('calculation.maxSingleDose').toUpperCase()}
                        </Text>
                        <Text style={styles.resultStatValue}>
                          {success.maxSingleDose} {success.unit}
                        </Text>
                      </View>
                    </>
                  )}
                </View>

                {/* Derived inputs actually used, so the number can be checked by hand */}
                <View style={styles.resultStats}>
                  <View style={styles.resultStat}>
                    <Text style={styles.resultStatLabel}>
                      {t('patient.bsa').toUpperCase()}
                    </Text>
                    <Text style={styles.resultStatValue}>{success.bsa} m²</Text>
                  </View>
                  <View style={styles.resultStatDivider} />
                  <View style={styles.resultStat}>
                    <Text style={styles.resultStatLabel}>
                      {t('calculation.renalFunction').toUpperCase()}
                    </Text>
                    <Text style={styles.resultStatValue}>
                      {success.renalEstimate
                        ? `${success.renalEstimate.value} ${success.renalEstimate.unit}`
                        : t('calculation.notChecked')}
                    </Text>
                  </View>
                </View>

                <Text style={styles.formulaText}>{success.formula}</Text>

                {/* Limit status. `isWithinLimits` is false whenever a ceiling was
                    breached OR could not be verified — never a bare "safe". */}
                {success.isWithinLimits ? (
                  <View style={styles.limitOk}>
                    <Text style={styles.limitIcon}>✅</Text>
                    <Text
                      style={[
                        styles.limitText,
                        { color: theme.colors.safeText },
                      ]}
                    >
                      {t('calculation.isWithinLimits')}
                    </Text>
                  </View>
                ) : (
                  <View style={styles.limitWarn}>
                    <Text style={styles.limitIcon}>⚠️</Text>
                    <Text
                      style={[
                        styles.limitText,
                        { color: theme.colors.criticalText },
                      ]}
                    >
                      {success.cappedByMaximumDose || success.exceedsDailyMax
                        ? t('calculation.exceedsLimits')
                        : t('calculation.safetyChecksIncomplete')}
                    </Text>
                  </View>
                )}

                {/* Warnings, most severe first */}
                {sortWarnings(success.warnings).map((w, i) => (
                  <View
                    key={`${w.code}-${i}`}
                    style={[
                      styles.warningItem,
                      w.severity === 'critical' && styles.warningCritical,
                      w.severity === 'info' && styles.warningInfo,
                    ]}
                  >
                    <Text
                      style={[
                        styles.warningText,
                        w.severity === 'critical' && styles.warningTextCritical,
                        w.severity === 'info' && styles.warningTextInfo,
                      ]}
                    >
                      {ICON_BY_SEVERITY[w.severity]} {formatWarning(t, w)}
                    </Text>
                  </View>
                ))}

                {/* Provenance */}
                <View style={styles.provenanceRow}>
                  <Text style={styles.provenanceLabel}>
                    {t('calculation.provenance')}
                  </Text>
                  <View
                    style={[
                      styles.provenanceBadge,
                      success.sourceVerification === 'REVIEWED' &&
                        styles.provenanceBadgeOk,
                    ]}
                  >
                    <Text style={styles.provenanceBadgeText}>
                      {success.sourceVerification === 'REVIEWED'
                        ? t('calculation.reviewedBadge')
                        : t('calculation.unverifiedBadge')}
                    </Text>
                  </View>
                </View>

                {/* Actions */}
                <View style={styles.resultActions}>
                  <TouchableOpacity
                    accessibilityRole="button"
                    style={[styles.actionBtn, styles.actionBtnPrimary]}
                    onPress={handleSaveCalculation}
                  >
                    <Text
                      style={[
                        styles.actionBtnText,
                        styles.actionBtnTextPrimary,
                      ]}
                    >
                      💾 {t('calculation.saveCalculation')}
                    </Text>
                  </TouchableOpacity>

                  {selectedDrug?.productInfo && (
                    <TouchableOpacity
                      accessibilityRole="button"
                      style={[styles.actionBtn, styles.actionBtnSecondary]}
                      onPress={() => openDrugDetail(selectedDrug.id)}
                    >
                      <Text
                        style={[
                          styles.actionBtnText,
                          styles.actionBtnTextSecondary,
                        ]}
                      >
                        📋 {t('vademecum.subtitle')}
                      </Text>
                    </TouchableOpacity>
                  )}
                </View>
              </View>
            </Animated.View>
          )}

          {/* Ad Banner */}
          <View style={styles.bannerWrap}>
            <AdBanner />
          </View>

          {/* Disclaimer */}
          <View style={styles.disclaimer}>
            <Text style={styles.disclaimerText}>
              ⚠️ {t('calculation.disclaimer')}
            </Text>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default CalculatorScreen;
