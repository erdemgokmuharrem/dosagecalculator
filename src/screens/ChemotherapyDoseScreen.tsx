import React, { useState, useCallback, useMemo, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../contexts/ThemeContext';
import {
  CHEMOTHERAPY_DRUGS,
  CHEMOTHERAPY_CATEGORIES,
  ADMINISTRATION_ROUTES,
} from '../data/chemotherapy';
import {
  calculateChemotherapyDose,
  PatientInfo,
  ChemotherapyCalculationResult,
} from '../features/chemotherapy/calculations';
import ModernCard from '../components/ModernCard';
import GradientButton from '../components/GradientButton';
import FadeInView from '../components/FadeInView';
import Icon from '../components/Icon';
import {
  formatWarning,
  sortWarnings,
  ICON_BY_SEVERITY,
} from '../features/dosage/warnings';
import { reportError } from '../services/monitoring';

const ChemotherapyDoseScreen: React.FC = () => {
  const { theme } = useTheme();
  const navigation = useNavigation();

  const [patientInfo, setPatientInfo] = useState<PatientInfo>({
    weight: 70,
    height: 170,
    age: 50,
    gender: 'male',
    gfr: undefined,
    auc: undefined,
  });

  const [selectedDrug, setSelectedDrugState] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedRoute, setSelectedRoute] = useState<string>('IV');
  const { t } = useTranslation();
  const [calculationResult, setCalculationResult] =
    useState<ChemotherapyCalculationResult | null>(null);
  // Narrowed once so every field access below is type-checked against the
  // success branch rather than the union.
  const chemoResult =
    calculationResult?.status === 'success' ? calculationResult : null;
  const [isCalculating, setIsCalculating] = useState(false);

  // Any patient edit invalidates a displayed dose. The calculator screen already
  // did this; here a stale cytotoxic dose stayed on screen next to changed
  // inputs, which is how a wrong number gets drawn up.
  useEffect(() => {
    setCalculationResult(null);
  }, [patientInfo]);
  const [showSideEffects, setShowSideEffects] = useState(false);
  const [showComplications, setShowComplications] = useState(false);

  // Filtrelenmiş ilaçlar
  const filteredDrugs = useMemo(() => {
    let drugs = CHEMOTHERAPY_DRUGS;

    if (selectedCategory !== 'All') {
      drugs = drugs.filter(drug => drug.category === selectedCategory);
    }

    if (searchQuery.trim()) {
      drugs = drugs.filter(
        drug =>
          drug.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          drug.genericName.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    return drugs;
  }, [selectedCategory, searchQuery]);

  // Seçilen ilaç bilgisi
  const selectedDrugInfo = useMemo(() => {
    return CHEMOTHERAPY_DRUGS.find(drug => drug.id === selectedDrug);
  }, [selectedDrug]);

  // Hesaplama yap
  const handleCalculate = useCallback(async () => {
    if (!selectedDrug) {
      Alert.alert(t('common.error'), t('drug.noDrugSelected'));
      return;
    }

    if (patientInfo.weight <= 0 || patientInfo.height <= 0) {
      Alert.alert(t('common.error'), t('chemo.blocked.invalidPatient'));
      return;
    }

    setIsCalculating(true);

    try {
      const drug = CHEMOTHERAPY_DRUGS.find(d => d.id === selectedDrug);
      if (!drug) {
        Alert.alert(t('common.error'), t('drug.noResults'));
        return;
      }

      // The engine returns a discriminated result instead of throwing, so a
      // refusal reaches the UI as a message rather than an uncaught exception.
      const result = calculateChemotherapyDose(drug, patientInfo);
      setCalculationResult(result);
    } catch (error) {
      reportError(error, { screen: 'ChemotherapyDose', drugId: selectedDrug });
      Alert.alert(t('common.error'), t('errors.calculationError'));
    } finally {
      setIsCalculating(false);
    }
  }, [selectedDrug, patientInfo, t]);

  // İlaç seç
  const handleDrugSelect = useCallback((drugId: string) => {
    setSelectedDrugState(drugId);
    setCalculationResult(null);
    setShowSideEffects(false);
    setShowComplications(false);
  }, []);

  // Kategori seç
  const handleCategorySelect = useCallback((category: string) => {
    setSelectedCategory(category);
    setSearchQuery('');
  }, []);

  const styles = StyleSheet.create({
    genderRow: { flexDirection: 'row', marginTop: theme.spacing.sm },
    container: {
      flex: 1,
      backgroundColor: '#dc2626',
    },
    content: {
      flex: 1,
    },
    searchContainer: {
      padding: theme.spacing.md,
      backgroundColor: theme.colors.surface,
    },
    searchInputContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: theme.colors.background,
      borderRadius: theme.borderRadius.md,
      borderWidth: 1,
      borderColor: theme.colors.border,
      paddingHorizontal: theme.spacing.md,
    },
    searchInput: {
      flex: 1,
      padding: theme.spacing.md,
      fontSize: theme.fontSizes.md,
      color: theme.colors.text,
    },
    header: {
      backgroundColor: '#dc2626',
      padding: theme.spacing.lg,
      alignItems: 'center',
      paddingTop: theme.spacing.xl,
      position: 'relative',
    },
    headerTitle: {
      fontSize: theme.fontSizes.xl,
      fontWeight: 'bold',
      color: '#ffffff',
      marginBottom: theme.spacing.xs,
    },
    headerSubtitle: {
      fontSize: theme.fontSizes.md,
      color: '#ffffff',
      opacity: 0.9,
    },
    backButton: {
      position: 'absolute',
      left: theme.spacing.md,
      top: theme.spacing.lg,
      paddingVertical: theme.spacing.xs,
      paddingHorizontal: theme.spacing.sm,
      borderRadius: theme.borderRadius.md,
      backgroundColor: 'rgba(255,255,255,0.15)',
    },
    backButtonText: {
      color: '#ffffff',
      fontSize: theme.fontSizes.md,
      fontWeight: 'bold',
    },
    section: {
      margin: theme.spacing.md,
    },
    titleRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: theme.spacing.sm,
      marginBottom: theme.spacing.sm,
    },
    sectionTitle: {
      fontSize: theme.fontSizes.lg,
      fontWeight: 'bold',
      color: theme.colors.text,
      marginBottom: theme.spacing.md,
    },
    inputRow: {
      flexDirection: 'row',
      marginBottom: theme.spacing.md,
    },
    inputContainer: {
      flex: 1,
      marginHorizontal: theme.spacing.xs,
    },
    inputLabel: {
      fontSize: theme.fontSizes.sm,
      color: theme.colors.textSecondary,
      marginBottom: theme.spacing.xs,
    },
    input: {
      backgroundColor: theme.colors.surface,
      borderRadius: theme.borderRadius.md,
      borderWidth: 1,
      borderColor: theme.colors.border,
      padding: theme.spacing.md,
      fontSize: theme.fontSizes.md,
      color: theme.colors.text,
    },
    categoryContainer: {
      paddingHorizontal: theme.spacing.md,
      paddingVertical: theme.spacing.sm,
    },
    categoryScrollView: {
      flexDirection: 'row',
    },
    categoryButton: {
      backgroundColor: theme.colors.background,
      borderRadius: theme.borderRadius.md,
      paddingHorizontal: theme.spacing.md,
      paddingVertical: theme.spacing.sm,
      marginRight: theme.spacing.sm,
      borderWidth: 1,
      borderColor: theme.colors.border,
    },
    categoryButtonActive: {
      backgroundColor: theme.colors.primary,
      borderColor: theme.colors.primary,
    },
    categoryButtonText: {
      fontSize: theme.fontSizes.sm,
      color: theme.colors.text,
    },
    categoryButtonTextActive: {
      color: theme.colors.surface,
      fontWeight: 'bold',
    },
    drugCard: {
      marginBottom: theme.spacing.md,
    },
    drugList: {
      flex: 1,
      paddingHorizontal: theme.spacing.md,
    },
    drugCardOptimized: {
      backgroundColor: theme.colors.surface,
      borderRadius: theme.borderRadius.md,
      padding: theme.spacing.md,
      marginBottom: theme.spacing.sm,
      borderWidth: 1,
      borderColor: theme.colors.border,
      elevation: 2,
      shadowColor: theme.colors.text,
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.1,
      shadowRadius: 2,
    },
    drugHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: theme.spacing.xs,
    },
    drugName: {
      fontSize: theme.fontSizes.lg,
      fontWeight: 'bold',
      color: theme.colors.text,
      marginLeft: theme.spacing.sm,
    },
    drugGenericName: {
      fontSize: theme.fontSizes.sm,
      color: theme.colors.textSecondary,
      marginBottom: theme.spacing.sm,
    },
    drugInfoRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginBottom: theme.spacing.sm,
    },
    drugCategory: {
      fontSize: theme.fontSizes.sm,
      color: theme.colors.primary,
      fontWeight: 'bold',
    },
    drugUnit: {
      fontSize: theme.fontSizes.sm,
      color: theme.colors.textSecondary,
    },
    drugDescription: {
      fontSize: theme.fontSizes.sm,
      color: theme.colors.textSecondary,
    },
    drugInfo: {
      marginTop: theme.spacing.md,
    },
    infoButton: {
      marginTop: theme.spacing.sm,
    },
    infoSection: {
      backgroundColor: '#FEF08A',
      borderRadius: theme.borderRadius.md,
      padding: theme.spacing.md,
      marginTop: theme.spacing.md,
      borderWidth: 1,
      borderColor: theme.colors.warning,
    },
    infoTitle: {
      fontSize: theme.fontSizes.md,
      fontWeight: 'bold',
      color: '#000',
      marginBottom: theme.spacing.sm,
    },
    infoText: {
      fontSize: theme.fontSizes.sm,
      color: '#000',
      marginBottom: theme.spacing.xs,
    },
    blockedContainer: {
      backgroundColor: theme.colors.criticalLight,
      borderWidth: 1.5,
      borderColor: theme.colors.critical,
      borderRadius: theme.borderRadius.lg,
      margin: theme.spacing.md,
      padding: theme.spacing.md,
    },
    blockedTitle: {
      fontSize: theme.fontSizes.md,
      fontWeight: '800',
      color: theme.colors.criticalText,
      marginBottom: theme.spacing.xs,
    },
    blockedText: {
      fontSize: theme.fontSizes.sm,
      color: theme.colors.criticalText,
      lineHeight: 19,
    },
    chemoWarning: {
      backgroundColor: theme.colors.warningSurface,
      borderLeftWidth: 3,
      borderLeftColor: theme.colors.warning,
      borderRadius: theme.borderRadius.sm,
      padding: theme.spacing.sm,
      marginTop: theme.spacing.xs,
    },
    chemoWarningCritical: {
      backgroundColor: theme.colors.criticalLight,
      borderLeftColor: theme.colors.critical,
      borderLeftWidth: 4,
    },
    chemoWarningText: {
      fontSize: theme.fontSizes.sm,
      color: theme.colors.warningText,
      lineHeight: 18,
    },
    chemoWarningTextCritical: {
      color: theme.colors.criticalText,
      fontWeight: '700',
    },
    resultContainer: {
      margin: theme.spacing.md,
    },
    resultTitle: {
      fontSize: theme.fontSizes.lg,
      fontWeight: 'bold',
      color: theme.colors.text,
      marginBottom: theme.spacing.md,
      textAlign: 'center',
    },
    resultCard: {
      marginBottom: theme.spacing.md,
    },
    resultRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginBottom: theme.spacing.sm,
    },
    resultLabel: {
      fontSize: theme.fontSizes.md,
      color: theme.colors.textSecondary,
      flex: 1,
    },
    resultValue: {
      fontSize: theme.fontSizes.md,
      color: theme.colors.text,
      fontWeight: 'bold',
      flex: 1,
      textAlign: 'right',
    },
  });

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <FadeInView delay={0}>
          <View style={styles.header}>
            <TouchableOpacity
              accessibilityRole="button"
              accessibilityLabel={t('common.back')}
              style={styles.backButton}
              onPress={() => navigation.goBack()}
            >
              <Text style={styles.backButtonText}>← {t('common.back')}</Text>
            </TouchableOpacity>
            <Icon name="syringe" size={32} color={'#ffffff'} />
            <Text style={styles.headerTitle}>{t('chemo.title')}</Text>
            <Text style={styles.headerSubtitle}>{t('chemo.subtitle')}</Text>
          </View>
        </FadeInView>

        {/* Arama */}
        <FadeInView delay={50}>
          <View style={styles.searchContainer}>
            <View style={styles.searchInputContainer}>
              <Icon
                name="search"
                size={20}
                color={theme.colors.textSecondary}
              />
              <TextInput
                style={styles.searchInput}
                placeholder={t('drug.searchPlaceholder')}
                value={searchQuery}
                onChangeText={setSearchQuery}
                placeholderTextColor={theme.colors.textSecondary}
              />
            </View>
          </View>
        </FadeInView>

        <ScrollView
          style={[styles.content, { backgroundColor: theme.colors.background }]}
        >
          {/* Hasta Bilgileri */}
          <FadeInView delay={100}>
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>
                <Icon name="user" size={20} color={theme.colors.primary} />{' '}
                {t('patient.section')}
              </Text>

              <View style={styles.inputRow}>
                <View style={styles.inputContainer}>
                  <Text style={styles.inputLabel}>{t('patient.weight')}</Text>
                  <TextInput
                    testID="chemo-weight-input"
                    style={styles.input}
                    value={patientInfo.weight.toString()}
                    onChangeText={text =>
                      setPatientInfo(prev => ({
                        ...prev,
                        weight: parseFloat(text) || 0,
                      }))
                    }
                    keyboardType="numeric"
                    placeholder="70"
                  />
                </View>
                <View style={styles.inputContainer}>
                  <Text style={styles.inputLabel}>{t('patient.height')}</Text>
                  <TextInput
                    testID="chemo-height-input"
                    style={styles.input}
                    value={patientInfo.height.toString()}
                    onChangeText={text =>
                      setPatientInfo(prev => ({
                        ...prev,
                        height: parseFloat(text) || 0,
                      }))
                    }
                    keyboardType="numeric"
                    placeholder="170"
                  />
                </View>
              </View>

              <View style={styles.inputRow}>
                <View style={styles.inputContainer}>
                  <Text style={styles.inputLabel}>
                    {t('patient.serumCreatinine')}
                  </Text>
                  <TextInput
                    testID="creatinine-input"
                    style={styles.input}
                    value={(patientInfo.serumCreatinine ?? '').toString()}
                    onChangeText={text => {
                      const value = parseFloat(text.replace(',', '.'));
                      setPatientInfo(prev => ({
                        ...prev,
                        serumCreatinine:
                          Number.isFinite(value) && value > 0
                            ? value
                            : undefined,
                      }));
                    }}
                    keyboardType="decimal-pad"
                    placeholder="1.0"
                    placeholderTextColor={theme.colors.textSecondary}
                    accessibilityLabel={t('patient.serumCreatinine')}
                  />
                </View>
                <View style={styles.inputContainer}>
                  <Text style={styles.inputLabel}>{t('patient.crcl')}</Text>
                  <TextInput
                    testID="gfr-input"
                    style={styles.input}
                    value={(patientInfo.gfr ?? '').toString()}
                    onChangeText={text => {
                      const value = parseFloat(text.replace(',', '.'));
                      setPatientInfo(prev => ({
                        ...prev,
                        gfr:
                          Number.isFinite(value) && value > 0
                            ? value
                            : undefined,
                      }));
                    }}
                    keyboardType="decimal-pad"
                    placeholder={t('calculation.notChecked')}
                    placeholderTextColor={theme.colors.textSecondary}
                    accessibilityLabel={t('patient.crclFull')}
                  />
                </View>
              </View>

              <View style={styles.inputRow}>
                <View style={styles.inputContainer}>
                  <Text style={styles.inputLabel}>{t('patient.age')}</Text>
                  <TextInput
                    testID="chemo-age-input"
                    style={styles.input}
                    value={patientInfo.age.toString()}
                    onChangeText={text =>
                      setPatientInfo(prev => ({
                        ...prev,
                        age: parseInt(text) || 0,
                      }))
                    }
                    keyboardType="numeric"
                    placeholder="50"
                  />
                </View>
                <View style={styles.inputContainer}>
                  <Text style={styles.inputLabel}>{t('patient.gender')}</Text>
                  <View style={styles.genderRow}>
                    <TouchableOpacity
                      accessibilityRole="radio"
                      accessibilityState={{
                        checked: patientInfo.gender === 'male',
                      }}
                      style={[
                        styles.categoryButton,
                        patientInfo.gender === 'male' &&
                          styles.categoryButtonActive,
                        { marginRight: theme.spacing.sm },
                      ]}
                      onPress={() =>
                        setPatientInfo(prev => ({ ...prev, gender: 'male' }))
                      }
                    >
                      <Text
                        style={[
                          styles.categoryButtonText,
                          patientInfo.gender === 'male' &&
                            styles.categoryButtonTextActive,
                        ]}
                      >
                        {t('patient.male')}
                      </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      accessibilityRole="radio"
                      accessibilityState={{
                        checked: patientInfo.gender === 'female',
                      }}
                      style={[
                        styles.categoryButton,
                        patientInfo.gender === 'female' &&
                          styles.categoryButtonActive,
                      ]}
                      onPress={() =>
                        setPatientInfo(prev => ({ ...prev, gender: 'female' }))
                      }
                    >
                      <Text
                        style={[
                          styles.categoryButtonText,
                          patientInfo.gender === 'female' &&
                            styles.categoryButtonTextActive,
                        ]}
                      >
                        {t('patient.female')}
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            </View>
          </FadeInView>

          {/* Uygulama Yolu Seçimi */}
          <FadeInView delay={150}>
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>
                <Icon name="syringe" size={20} color={theme.colors.primary} />{' '}
                {t('vademecum.route')}
              </Text>

              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                style={styles.categoryScrollView}
              >
                {ADMINISTRATION_ROUTES.map(route => (
                  <TouchableOpacity
                    accessibilityRole="button"
                    accessibilityState={{ selected: selectedRoute === route }}
                    key={route}
                    style={[
                      styles.categoryButton,
                      selectedRoute === route && styles.categoryButtonActive,
                    ]}
                    onPress={() => setSelectedRoute(route)}
                  >
                    <Text
                      style={[
                        styles.categoryButtonText,
                        selectedRoute === route &&
                          styles.categoryButtonTextActive,
                      ]}
                    >
                      {route}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
          </FadeInView>

          {/* İlaç Kategorileri */}
          <FadeInView delay={200}>
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>
                <Icon name="pill" size={20} color={theme.colors.primary} />{' '}
                {t('chemo.drugCategory')}
              </Text>

              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                style={styles.categoryScrollView}
              >
                {CHEMOTHERAPY_CATEGORIES.map(category => (
                  <TouchableOpacity
                    accessibilityRole="button"
                    accessibilityState={{
                      selected: selectedCategory === category,
                    }}
                    key={category}
                    style={[
                      styles.categoryButton,
                      selectedCategory === category &&
                        styles.categoryButtonActive,
                    ]}
                    onPress={() => handleCategorySelect(category)}
                  >
                    <Text
                      style={[
                        styles.categoryButtonText,
                        selectedCategory === category &&
                          styles.categoryButtonTextActive,
                      ]}
                    >
                      {category}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
          </FadeInView>

          {/* İlaç Listesi */}
          <FadeInView delay={250}>
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>
                <Icon name="pill" size={20} color={theme.colors.primary} />{' '}
                {t('drug.title')}
              </Text>
              <ScrollView style={styles.drugList}>
                {filteredDrugs.map(drug => (
                  <ModernCard
                    key={drug.id}
                    variant={selectedDrug === drug.id ? 'gradient' : 'elevated'}
                    onPress={() => handleDrugSelect(drug.id)}
                  >
                    <View style={styles.drugHeader}>
                      <Icon
                        name="pill"
                        size={20}
                        color={theme.colors.primary}
                      />
                      <Text style={styles.drugName} numberOfLines={1}>
                        {drug.name}
                      </Text>
                    </View>
                    <Text style={styles.drugGenericName} numberOfLines={1}>
                      {drug.genericName}
                    </Text>
                    <View style={styles.drugInfoRow}>
                      <Text style={styles.drugCategory}>{drug.category}</Text>
                      <Text style={styles.drugUnit}>{drug.unit}</Text>
                    </View>
                    <Text style={styles.drugDescription} numberOfLines={2}>
                      {drug.dosageForm} • Max: {drug.maxDailyDose}
                      {drug.unit}
                    </Text>

                    {selectedDrug === drug.id && (
                      <View style={styles.drugInfo}>
                        {drug.calculationMethod === 'AUC' && (
                          <View style={styles.inputRow}>
                            <View style={styles.inputContainer}>
                              <Text style={styles.inputLabel}>
                                {t('chemo.auc')}
                              </Text>
                              <TextInput
                                testID="chemo-auc-input"
                                style={styles.input}
                                value={(patientInfo.auc ?? '').toString()}
                                onChangeText={text =>
                                  setPatientInfo(prev => ({
                                    ...prev,
                                    auc: parseFloat(text) || undefined,
                                  }))
                                }
                                keyboardType="numeric"
                                placeholder="5"
                              />
                            </View>
                          </View>
                        )}

                        <View style={styles.infoButton}>
                          <GradientButton
                            title={
                              showSideEffects
                                ? t('chemo.sideEffectsHide')
                                : t('chemo.sideEffectsShow')
                            }
                            onPress={() => setShowSideEffects(!showSideEffects)}
                            variant="secondary"
                            size="small"
                            fullWidth
                          />
                        </View>

                        {showSideEffects && (
                          <View style={styles.infoSection}>
                            <Text style={styles.infoTitle}>
                              <Icon
                                name="warning"
                                size={16}
                                color={theme.colors.warning}
                              />{' '}
                              {t('vademecum.sideEffects')}
                            </Text>
                            {drug.sideEffects.map((effect, index) => (
                              <Text key={index} style={styles.infoText}>
                                • {effect}
                              </Text>
                            ))}
                          </View>
                        )}

                        <View style={styles.infoButton}>
                          <GradientButton
                            title={
                              showComplications
                                ? t('chemo.complicationsHide')
                                : t('chemo.complicationsShow')
                            }
                            onPress={() =>
                              setShowComplications(!showComplications)
                            }
                            variant="warning"
                            size="small"
                            fullWidth
                          />
                        </View>

                        {showComplications && (
                          <View style={styles.infoSection}>
                            <Text style={styles.infoTitle}>
                              <Icon
                                name="error"
                                size={16}
                                color={theme.colors.warning}
                              />{' '}
                              {t('chemo.complications')}
                            </Text>
                            {drug.precautions.map((precaution, index) => (
                              <Text key={index} style={styles.infoText}>
                                • {precaution}
                              </Text>
                            ))}
                            <Text
                              style={[
                                styles.infoTitle,
                                { marginTop: theme.spacing.md },
                              ]}
                            >
                              {t('vademecum.contraindications')}:
                            </Text>
                            {drug.contraindications.map((contra, index) => (
                              <Text key={index} style={styles.infoText}>
                                • {contra}
                              </Text>
                            ))}
                            <Text
                              style={[
                                styles.infoTitle,
                                { marginTop: theme.spacing.md },
                              ]}
                            >
                              {t('chemo.monitoringNeeds')}:
                            </Text>
                            {drug.monitoring.map((monitor, index) => (
                              <Text key={index} style={styles.infoText}>
                                • {monitor}
                              </Text>
                            ))}
                          </View>
                        )}
                      </View>
                    )}
                  </ModernCard>
                ))}
              </ScrollView>
            </View>
          </FadeInView>

          {/* Hesaplama Butonu */}
          {selectedDrug && (
            <FadeInView delay={300}>
              <GradientButton
                title={t('calculation.calculate')}
                testID="chemo-calculate"
                onPress={handleCalculate}
                variant="primary"
                size="large"
                fullWidth
                loading={isCalculating}
                style={{ margin: theme.spacing.md }}
              />
            </FadeInView>
          )}

          {/* Refusal: the engine could not produce a safe dose. */}
          {calculationResult?.status === 'blocked' && (
            <FadeInView delay={350}>
              <View style={styles.blockedContainer}>
                <Text style={styles.blockedTitle}>⛔ {t('blocked.title')}</Text>
                <Text testID="chemo-blocked-message" style={styles.blockedText}>
                  {t(calculationResult.messageCode, {
                    ...(calculationResult.messageParams ?? {}),
                    defaultValue: calculationResult.messageCode,
                  })}
                </Text>
              </View>
            </FadeInView>
          )}

          {/* Sonuçlar */}
          {chemoResult && (
            <FadeInView delay={350}>
              <View style={styles.resultContainer}>
                <Text style={styles.resultTitle}>
                  <Icon
                    name="calculator"
                    size={24}
                    color={theme.colors.primary}
                  />{' '}
                  {t('chemo.resultTitle')}
                </Text>

                <ModernCard variant="elevated" style={styles.resultCard}>
                  <View style={styles.resultRow}>
                    <Text style={styles.resultLabel}>{t('drug.name')}:</Text>
                    <Text style={styles.resultValue}>
                      {chemoResult.drug.name}
                    </Text>
                  </View>
                  <View style={styles.resultRow}>
                    <Text style={styles.resultLabel}>{t('chemo.bsa')}:</Text>
                    <Text style={styles.resultValue}>
                      {chemoResult.patientInfo.bsa.toFixed(2)} m²
                    </Text>
                  </View>
                  <View style={styles.resultRow}>
                    <Text style={styles.resultLabel}>
                      {t('calculation.singleDose')}:
                    </Text>
                    <Text testID="chemo-result-dose" style={styles.resultValue}>
                      {chemoResult.calculatedDose.dose}{' '}
                      {chemoResult.calculatedDose.unit}
                    </Text>
                  </View>
                  <View style={styles.resultRow}>
                    <Text style={styles.resultLabel}>
                      {t('chemo.formula')}:
                    </Text>
                    <Text style={styles.resultValue}>
                      {chemoResult.calculatedDose.formula}
                    </Text>
                  </View>

                  {/* Safety warnings. These were computed by the engine but
                      never rendered, so a capped cytotoxic dose or an
                      unassessed renal function reached nobody. */}
                  {sortWarnings(chemoResult.safety.warnings).map((w, i) => (
                    <View
                      key={`${w.code}-${i}`}
                      style={[
                        styles.chemoWarning,
                        w.severity === 'critical' &&
                          styles.chemoWarningCritical,
                      ]}
                    >
                      <Text
                        style={[
                          styles.chemoWarningText,
                          w.severity === 'critical' &&
                            styles.chemoWarningTextCritical,
                        ]}
                      >
                        {ICON_BY_SEVERITY[w.severity]} {formatWarning(t, w)}
                      </Text>
                    </View>
                  ))}
                  <View style={styles.resultRow}>
                    <Text style={styles.resultLabel}>
                      {t('vademecum.route')}:
                    </Text>
                    <Text style={styles.resultValue}>{selectedRoute}</Text>
                  </View>
                  <View style={styles.resultRow}>
                    <Text style={styles.resultLabel}>
                      {t('vademecum.concentration')}:
                    </Text>
                    <Text style={styles.resultValue}>
                      {chemoResult.administration.concentration} (
                      {chemoResult.administration.concentrationMgPerMl} mg/mL)
                    </Text>
                  </View>
                  <View style={styles.resultRow}>
                    <Text style={styles.resultLabel}>
                      {t('chemo.requiredVolume')}:
                    </Text>
                    <Text style={styles.resultValue}>
                      {chemoResult.administration.requiredVolumeMl} mL
                    </Text>
                  </View>
                  <View style={styles.resultRow}>
                    <Text style={styles.resultLabel}>
                      {t('chemo.recommendedBag')}:
                    </Text>
                    <Text style={styles.resultValue}>
                      {chemoResult.administration.solvent}{' '}
                      {chemoResult.administration.bagVolumeMl} mL
                    </Text>
                  </View>
                  <View style={styles.resultRow}>
                    <Text style={styles.resultLabel}>
                      {t('chemo.finalConcentration')}:
                    </Text>
                    <Text style={styles.resultValue}>
                      {chemoResult.administration.finalConcentrationMgPerMl}{' '}
                      mg/mL
                    </Text>
                  </View>
                  <View style={styles.resultRow}>
                    <Text style={styles.resultLabel}>
                      {t('vademecum.diluent')}:
                    </Text>
                    <Text style={styles.resultValue}>
                      {selectedDrugInfo?.dilution.solvent}
                    </Text>
                  </View>
                  <View style={styles.resultRow}>
                    <Text style={styles.resultLabel}>
                      {t('vademecum.concentration')}:
                    </Text>
                    <Text style={styles.resultValue}>
                      {selectedDrugInfo?.dilution.concentration}
                    </Text>
                  </View>
                </ModernCard>

                <ModernCard variant="outlined" style={styles.resultCard}>
                  <Text style={styles.resultTitle}>
                    {t('chemo.preparation')}
                  </Text>
                  <View style={styles.resultRow}>
                    <Text style={styles.resultLabel}>
                      {t('chemo.dilution')}:
                    </Text>
                    <Text style={styles.resultValue}>
                      {t('chemo.dilutionSentence', {
                        dose: chemoResult.calculatedDose.dose,
                        bag: chemoResult.administration.bagVolumeMl,
                        solvent: chemoResult.administration.solvent,
                      })}
                    </Text>
                  </View>
                  <View style={styles.resultRow}>
                    <Text style={styles.resultLabel}>
                      {t('chemo.volumeToDraw')}:
                    </Text>
                    <Text style={styles.resultValue}>
                      {chemoResult.administration.requiredVolumeMl} mL
                    </Text>
                  </View>
                  <View style={styles.resultRow}>
                    <Text style={styles.resultLabel}>
                      {t('chemo.finalConcentration')}:
                    </Text>
                    <Text style={styles.resultValue}>
                      {chemoResult.administration.finalConcentrationMgPerMl}{' '}
                      mg/mL
                    </Text>
                  </View>
                  <View style={styles.resultRow}>
                    <Text style={styles.resultLabel}>
                      {t('vademecum.duration')}:
                    </Text>
                    <Text style={styles.resultValue}>
                      {t(chemoResult.administration.infusionTime)}
                    </Text>
                  </View>
                </ModernCard>
              </View>
            </FadeInView>
          )}
        </ScrollView>
      </View>
    </SafeAreaView>
  );
};

export default ChemotherapyDoseScreen;
