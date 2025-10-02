import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  Alert,
} from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useTranslation } from 'react-i18next';
import { RootStackParamList, DosageResult } from '../types';
import { useTheme } from '../contexts/ThemeContext';
import { useAppStore } from '../store';
import {
  calculateDosage,
  validatePatientForCalculation,
  validateDrugForCalculation,
} from '../features/dosage/calculations';
import { analytics } from '../services/analytics';
import GradientButton from '../components/GradientButton';
import ModernCard from '../components/ModernCard';
import LoadingSpinner from '../components/LoadingSpinner';

type DosageCalculationScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'DosageCalculation'
>;
type DosageCalculationScreenRouteProp = RouteProp<
  RootStackParamList,
  'DosageCalculation'
>;

const DosageCalculationScreen: React.FC = () => {
  const navigation = useNavigation<DosageCalculationScreenNavigationProp>();
  const route = useRoute<DosageCalculationScreenRouteProp>();
  const { t } = useTranslation();
  const { theme } = useTheme();
  const { currentPatient, selectedDrug, addCalculation } = useAppStore();

  const [result, setResult] = useState<DosageResult | null>(null);
  const [isCalculating, setIsCalculating] = useState(false);

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },
    content: {
      flex: 1,
      padding: theme.spacing.md,
    },
    card: {
      marginBottom: theme.spacing.md,
    },
    cardTitle: {
      fontSize: theme.fontSizes.lg,
      fontWeight: 'bold',
      color: theme.colors.text,
      marginBottom: theme.spacing.sm,
    },
    cardContent: {
      fontSize: theme.fontSizes.md,
      color: theme.colors.textSecondary,
      lineHeight: 20,
    },
    resultTitle: {
      fontSize: theme.fontSizes.xl,
      fontWeight: 'bold',
      color: theme.colors.text,
      marginBottom: theme.spacing.md,
      textAlign: 'center',
    },
    resultValue: {
      fontSize: theme.fontSizes.xxxl,
      fontWeight: 'bold',
      color: theme.colors.primary,
      textAlign: 'center',
      marginBottom: theme.spacing.sm,
    },
    resultUnit: {
      fontSize: theme.fontSizes.lg,
      color: theme.colors.textSecondary,
      textAlign: 'center',
      marginBottom: theme.spacing.lg,
    },
    resultInfo: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginBottom: theme.spacing.md,
    },
    resultInfoItem: {
      flex: 1,
      alignItems: 'center',
    },
    resultInfoLabel: {
      fontSize: theme.fontSizes.sm,
      color: theme.colors.textSecondary,
      marginBottom: theme.spacing.xs,
    },
    resultInfoValue: {
      fontSize: theme.fontSizes.md,
      fontWeight: 'bold',
      color: theme.colors.text,
    },
    warningsContainer: {
      marginTop: theme.spacing.md,
    },
    warningItem: {
      backgroundColor: theme.colors.warning + '20',
      borderRadius: theme.borderRadius.md,
      padding: theme.spacing.sm,
      marginBottom: theme.spacing.sm,
      borderLeftWidth: 4,
      borderLeftColor: theme.colors.warning,
    },
    warningText: {
      fontSize: theme.fontSizes.sm,
      color: theme.colors.warning,
    },
    successIndicator: {
      backgroundColor: theme.colors.success + '20',
      borderRadius: theme.borderRadius.md,
      padding: theme.spacing.sm,
      marginTop: theme.spacing.md,
      borderLeftWidth: 4,
      borderLeftColor: theme.colors.success,
    },
    successText: {
      fontSize: theme.fontSizes.sm,
      color: theme.colors.success,
      fontWeight: 'bold',
    },
    buttonContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginTop: theme.spacing.lg,
      gap: theme.spacing.sm,
    },
  });

  useEffect(() => {
    if (currentPatient && selectedDrug) {
      calculateDosageResult();
    }
  }, [currentPatient, selectedDrug]);

  const calculateDosageResult = async () => {
    if (!currentPatient || !selectedDrug) {
      Alert.alert('Hata', 'Hasta veya ilaç bilgisi bulunamadı.');
      return;
    }

    setIsCalculating(true);

    try {
      // Validate patient and drug data
      const patientErrors = validatePatientForCalculation(currentPatient);
      const drugErrors = validateDrugForCalculation(selectedDrug);

      if (patientErrors.length > 0 || drugErrors.length > 0) {
        const allErrors = [...patientErrors, ...drugErrors];
        Alert.alert('Hata', allErrors.join('\n'));
        return;
      }

      // Calculate dosage
      const calculationResult = calculateDosage(currentPatient, selectedDrug);
      setResult(calculationResult);

      // Track analytics
      analytics.trackDosageCalculation(
        currentPatient.patientType,
        selectedDrug.category,
        calculationResult.warnings.length > 0
      );
    } catch (error) {
      Alert.alert(
        'Hesaplama Hatası',
        'Doz hesaplaması sırasında bir hata oluştu.'
      );
    } finally {
      setIsCalculating(false);
    }
  };

  const handleSaveCalculation = () => {
    if (!result || !currentPatient || !selectedDrug) return;

    const calculation = {
      id: Date.now().toString(),
      patientId: currentPatient.id,
      drugId: selectedDrug.id,
      calculatedDose: result.singleDose,
      unit: result.unit,
      frequency: result.frequency,
      maxDailyDose: result.maxDailyDose,
      maxSingleDose: result.maxSingleDose,
      warnings: result.warnings,
      timestamp: new Date(),
      parameters: {
        patientWeight: currentPatient.weight,
        patientAge: currentPatient.age,
        patientBsa: currentPatient.bsa,
        patientCrcl: currentPatient.crcl,
        drugDosePerKg: selectedDrug.dosageFormula.dosePerKg,
        drugDosePerM2: selectedDrug.dosageFormula.dosePerM2,
        drugFixedDose: selectedDrug.dosageFormula.fixedDose,
      },
    };

    addCalculation(calculation);
    Alert.alert('Başarılı', 'Hesaplama kaydedildi.');
  };

  const handleRecalculate = () => {
    calculateDosageResult();
  };

  if (!currentPatient || !selectedDrug) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.content}>
          <LoadingSpinner
            size="large"
            text="Hasta veya ilaç bilgisi bulunamadı."
          />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.content}>
        <ModernCard variant="elevated" style={styles.card}>
          <Text style={styles.cardTitle}>Hasta Bilgileri</Text>
          <Text style={styles.cardContent}>
            {currentPatient.age} yaş, {currentPatient.weight}kg,{' '}
            {currentPatient.height}cm
            {'\n'}
            {currentPatient.gender === 'male' ? 'Erkek' : 'Kadın'} •{' '}
            {currentPatient.patientType}
            {currentPatient.bsa && `\nBSA: ${currentPatient.bsa.toFixed(2)} m²`}
            {currentPatient.crcl &&
              `\nCrCl: ${currentPatient.crcl.toFixed(1)} mL/min`}
          </Text>
        </ModernCard>

        <ModernCard variant="gradient" style={styles.card}>
          <Text style={styles.cardTitle}>İlaç Bilgileri</Text>
          <Text style={styles.cardContent}>
            {selectedDrug.name} ({selectedDrug.genericName}){'\n'}
            {selectedDrug.category} • {selectedDrug.dosageForm}
            {'\n'}Max Günlük Doz: {selectedDrug.maxDailyDose}
            {selectedDrug.unit}
            {'\n'}Hesaplama Yöntemi: {selectedDrug.dosageFormula.method}
          </Text>
        </ModernCard>

        {result && (
          <ModernCard variant="elevated" style={styles.card}>
            <Text style={styles.resultTitle}>Hesaplanan Doz</Text>
            <Text style={styles.resultValue}>{result.singleDose}</Text>
            <Text style={styles.resultUnit}>{result.unit}</Text>

            <View style={styles.resultInfo}>
              <View style={styles.resultInfoItem}>
                <Text style={styles.resultInfoLabel}>Sıklık</Text>
                <Text style={styles.resultInfoValue}>{result.frequency}</Text>
              </View>
              <View style={styles.resultInfoItem}>
                <Text style={styles.resultInfoLabel}>Max Günlük</Text>
                <Text style={styles.resultInfoValue}>
                  {result.maxDailyDose}
                  {result.unit}
                </Text>
              </View>
              {result.maxSingleDose && (
                <View style={styles.resultInfoItem}>
                  <Text style={styles.resultInfoLabel}>Max Tek Doz</Text>
                  <Text style={styles.resultInfoValue}>
                    {result.maxSingleDose}
                    {result.unit}
                  </Text>
                </View>
              )}
            </View>

            {result.warnings.length > 0 && (
              <View style={styles.warningsContainer}>
                <Text style={styles.cardTitle}>Uyarılar</Text>
                {result.warnings.map((warning, index) => (
                  <View key={index} style={styles.warningItem}>
                    <Text style={styles.warningText}>{warning}</Text>
                  </View>
                ))}
              </View>
            )}

            {result.isWithinLimits && (
              <View style={styles.successIndicator}>
                <Text style={styles.successText}>✓ Güvenli doz aralığında</Text>
              </View>
            )}
          </ModernCard>
        )}

        {selectedDrug.productInfo && (
          <ModernCard variant="elevated" style={styles.card}>
            <GradientButton
              title="📋 Kısa Ürün Bilgisi (KUB)"
              onPress={() => navigation.navigate('ProductInfo')}
              variant="info"
              size="medium"
              style={{ marginBottom: theme.spacing.md }}
            />
          </ModernCard>
        )}

        <View style={styles.buttonContainer}>
          <GradientButton
            title={isCalculating ? 'Hesaplanıyor...' : 'Yeniden Hesapla'}
            onPress={handleRecalculate}
            disabled={isCalculating}
            loading={isCalculating}
            variant="secondary"
            size="medium"
            style={{ flex: 1 }}
          />

          <GradientButton
            title="Kaydet"
            onPress={handleSaveCalculation}
            disabled={!result}
            variant="success"
            size="medium"
            style={{ flex: 1 }}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default DosageCalculationScreen;
