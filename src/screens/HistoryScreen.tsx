import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SectionList,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../contexts/ThemeContext';
import { useAppStore } from '../store';
import { DosageCalculation } from '../types';
import {
  formatWarning,
  sortWarnings,
  ICON_BY_SEVERITY,
} from '../features/dosage/warnings';
import { getDrugById } from '../data/drugs';
import ModernCard from '../components/ModernCard';
import GradientButton from '../components/GradientButton';
import FadeInView from '../components/FadeInView';
import { AdBanner } from '../components/AdBanner';

const HistoryScreen: React.FC = () => {
  const { t, i18n } = useTranslation();
  const { theme } = useTheme();
  const { calculations, patients, clearCalculations } = useAppStore();
  const [selectedCalculation, setSelectedCalculation] =
    useState<DosageCalculation | null>(null);

  const groupedCalculations = React.useMemo(() => {
    const map = new Map<string, DosageCalculation[]>();

    const sortedCalcs = [...calculations].sort(
      (a, b) =>
        new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    );

    sortedCalcs.forEach(calc => {
      const d = new Date(calc.timestamp);
      const today = new Date();
      const yesterday = new Date(today);
      yesterday.setDate(yesterday.getDate() - 1);

      let dateStr = d.toLocaleDateString(i18n.language, {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      });

      if (d.toDateString() === today.toDateString()) {
        dateStr = t('history.today', 'Today');
      } else if (d.toDateString() === yesterday.toDateString()) {
        dateStr = t('history.yesterday', 'Yesterday');
      }

      if (!map.has(dateStr)) {
        map.set(dateStr, []);
      }
      map.get(dateStr)!.push(calc);
    });

    return Array.from(map.entries()).map(([title, data]) => ({ title, data }));
  }, [calculations, i18n.language, t]);

  const styles = StyleSheet.create({
    warningCritical: { fontWeight: '700' },
    warningNormal: { fontWeight: '400' },
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },
    content: {
      flex: 1,
      padding: theme.spacing.md,
    },
    header: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: theme.spacing.lg,
    },
    title: {
      fontSize: theme.fontSizes.xxl,
      fontWeight: 'bold',
      color: theme.colors.text,
    },
    calculationCard: {
      marginBottom: theme.spacing.md,
    },
    calculationHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: theme.spacing.sm,
    },
    calculationDate: {
      fontSize: theme.fontSizes.sm,
      color: theme.colors.textSecondary,
    },
    calculationDose: {
      fontSize: theme.fontSizes.lg,
      fontWeight: 'bold',
      color: theme.colors.primary,
    },
    calculationInfo: {
      marginBottom: theme.spacing.sm,
    },
    calculationLabel: {
      fontSize: theme.fontSizes.sm,
      color: theme.colors.textSecondary,
      marginBottom: theme.spacing.xs,
    },
    calculationValue: {
      fontSize: theme.fontSizes.md,
      color: theme.colors.text,
    },
    warningBadge: {
      backgroundColor: theme.colors.warning,
      borderRadius: theme.borderRadius.sm,
      paddingHorizontal: theme.spacing.sm,
      paddingVertical: theme.spacing.xs,
      alignSelf: 'flex-start',
      marginTop: theme.spacing.sm,
    },
    warningBadgeText: {
      color: theme.colors.surface,
      fontSize: theme.fontSizes.xs,
      fontWeight: 'bold',
    },
    emptyState: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      padding: theme.spacing.xl,
    },
    emptyStateText: {
      fontSize: theme.fontSizes.lg,
      color: theme.colors.textSecondary,
      textAlign: 'center',
      marginBottom: theme.spacing.lg,
    },
    emptyStateSubtext: {
      fontSize: theme.fontSizes.md,
      color: theme.colors.textSecondary,
      textAlign: 'center',
    },
    detailModal: {
      flex: 1,
      backgroundColor: 'rgba(0,0,0,0.5)',
      justifyContent: 'center',
      alignItems: 'center',
      padding: theme.spacing.lg,
    },
    detailCard: {
      backgroundColor: theme.colors.surface,
      borderRadius: theme.borderRadius.lg,
      padding: theme.spacing.lg,
      width: '100%',
      maxHeight: '80%',
    },
    detailTitle: {
      fontSize: theme.fontSizes.xl,
      fontWeight: 'bold',
      color: theme.colors.text,
      marginBottom: theme.spacing.md,
      textAlign: 'center',
    },
    detailCloseButton: {
      backgroundColor: theme.colors.primary,
      borderRadius: theme.borderRadius.md,
      padding: theme.spacing.md,
      alignItems: 'center',
      marginTop: theme.spacing.lg,
    },
    detailCloseButtonText: {
      color: theme.colors.surface,
      fontSize: theme.fontSizes.md,
      fontWeight: 'bold',
    },
    sectionHeader: {
      backgroundColor: theme.colors.background,
      paddingVertical: theme.spacing.sm,
      paddingHorizontal: theme.spacing.xs,
      marginBottom: theme.spacing.sm,
    },
    sectionHeaderText: {
      fontSize: theme.fontSizes.md,
      fontWeight: '700',
      color: theme.colors.textSecondary,
      textTransform: 'uppercase',
      letterSpacing: 1,
    },
  });

  const handleClearHistory = () => {
    Alert.alert(t('history.clearHistory'), t('history.clearConfirm'), [
      { text: t('common.cancel'), style: 'cancel' },
      {
        text: t('common.delete'),
        style: 'destructive',
        onPress: () => clearCalculations(),
      },
    ]);
  };

  const getPatientName = (patientId: string): string => {
    const patient = patients.find(p => p.id === patientId);
    return patient
      ? `${patient.age} ${t('patient.age').toLowerCase()}, ${patient.weight}kg`
      : t('common.noData');
  };

  const getDrugName = (drugId: string): string => {
    const drug = getDrugById(drugId);
    return drug ? drug.name : t('common.noData');
  };

  const formatDate = (date: Date | string): string => {
    // JSON persistence turns Date into an ISO string, so always re-hydrate before
    // formatting — Intl.DateTimeFormat throws when handed a string.
    const value = date instanceof Date ? date : new Date(date);
    if (Number.isNaN(value.getTime())) return t('common.noData');
    return new Intl.DateTimeFormat(i18n.language, {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(value);
  };

  const renderCalculation = ({
    item,
    index,
  }: {
    item: DosageCalculation;
    index: number;
  }) => (
    <FadeInView delay={index * 100}>
      <ModernCard
        variant="elevated"
        style={styles.calculationCard}
        onPress={() => setSelectedCalculation(item)}
      >
        <View style={styles.calculationHeader}>
          <Text style={styles.calculationDate}>
            {formatDate(item.timestamp)}
          </Text>
          <Text style={styles.calculationDose}>
            {item.calculatedDose}
            {item.unit}
          </Text>
        </View>

        <View style={styles.calculationInfo}>
          <Text style={styles.calculationLabel}>{t('patient.title')}</Text>
          <Text style={styles.calculationValue}>
            {getPatientName(item.patientId)}
          </Text>
        </View>

        <View style={styles.calculationInfo}>
          <Text style={styles.calculationLabel}>{t('drug.name')}</Text>
          <Text style={styles.calculationValue}>
            {getDrugName(item.drugId)}
          </Text>
        </View>

        <View style={styles.calculationInfo}>
          <Text style={styles.calculationLabel}>
            {t('calculation.frequency')}
          </Text>
          <Text style={styles.calculationValue}>{item.frequency}</Text>
        </View>

        {item.warnings.length > 0 && (
          <View style={styles.warningBadge}>
            <Text style={styles.warningBadgeText}>
              {item.warnings.length} {t('calculation.warnings')}
            </Text>
          </View>
        )}
      </ModernCard>
    </FadeInView>
  );

  const renderEmptyState = () => (
    <View style={styles.emptyState}>
      <Text style={styles.emptyStateText}>{t('history.emptyTitle')}</Text>
      <Text style={styles.emptyStateSubtext}>{t('history.emptySubtitle')}</Text>
    </View>
  );

  const renderDetailModal = () => {
    if (!selectedCalculation) return null;

    const drug = getDrugById(selectedCalculation.drugId);
    const patient = patients.find(p => p.id === selectedCalculation.patientId);

    return (
      <View style={styles.detailModal}>
        <View style={styles.detailCard}>
          <Text style={styles.detailTitle}>
            {t('calculation.title', 'Calculation Details')}
          </Text>

          <View style={styles.calculationInfo}>
            <Text style={styles.calculationLabel}>{t('history.date')}</Text>
            <Text style={styles.calculationValue}>
              {formatDate(selectedCalculation.timestamp)}
            </Text>
          </View>

          <View style={styles.calculationInfo}>
            <Text style={styles.calculationLabel}>{t('history.patient')}</Text>
            <Text style={styles.calculationValue}>
              {patient
                ? `${patient.age} ${t('patient.age').toLowerCase()}, ${patient.weight}kg, ${patient.height}cm, ${patient.gender === 'male' ? t('patient.male') : t('patient.female')}, ${patient.patientType}`
                : t('common.noData')}
            </Text>
          </View>

          <View style={styles.calculationInfo}>
            <Text style={styles.calculationLabel}>{t('history.drug')}</Text>
            <Text style={styles.calculationValue}>
              {drug ? `${drug.name} (${drug.genericName})` : t('common.noData')}
            </Text>
          </View>

          <View style={styles.calculationInfo}>
            <Text style={styles.calculationLabel}>
              {t('calculation.singleDose')}
            </Text>
            <Text style={styles.calculationValue}>
              {selectedCalculation.calculatedDose}
              {selectedCalculation.unit} - {selectedCalculation.frequency}
            </Text>
          </View>

          <View style={styles.calculationInfo}>
            <Text style={styles.calculationLabel}>
              {t('calculation.maxDailyDose')}
            </Text>
            <Text style={styles.calculationValue}>
              {selectedCalculation.maxDailyDose}
              {selectedCalculation.unit}
            </Text>
          </View>

          {selectedCalculation.warnings.length > 0 && (
            <View style={styles.calculationInfo}>
              <Text style={styles.calculationLabel}>
                {t('calculation.warnings')}
              </Text>
              {sortWarnings(selectedCalculation.warnings).map(
                (warning, index) => (
                  <Text
                    key={`${warning.code}-${index}`}
                    style={[
                      styles.calculationValue,
                      {
                        color:
                          warning.severity === 'critical'
                            ? theme.colors.critical
                            : theme.colors.warning,
                      },
                      warning.severity === 'critical'
                        ? styles.warningCritical
                        : styles.warningNormal,
                    ]}
                  >
                    {ICON_BY_SEVERITY[warning.severity]}{' '}
                    {formatWarning(t, warning)}
                  </Text>
                )
              )}
            </View>
          )}

          <TouchableOpacity
            accessibilityRole="button"
            style={styles.detailCloseButton}
            onPress={() => setSelectedCalculation(null)}
          >
            <Text style={styles.detailCloseButtonText}>
              {t('common.close')}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <FadeInView delay={0}>
          <View style={styles.header}>
            <Text style={styles.title}>{t('history.title')}</Text>
            {calculations.length > 0 && (
              <GradientButton
                title={t('history.clearHistory')}
                onPress={handleClearHistory}
                variant="error"
                size="small"
              />
            )}
          </View>
        </FadeInView>

        {calculations.length === 0 ? (
          renderEmptyState()
        ) : (
          <SectionList
            sections={groupedCalculations}
            renderItem={renderCalculation}
            renderSectionHeader={({ section: { title } }) => (
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionHeaderText}>{title}</Text>
              </View>
            )}
            keyExtractor={item => item.id}
            showsVerticalScrollIndicator={false}
            stickySectionHeadersEnabled={false}
          />
        )}

        {selectedCalculation && renderDetailModal()}
      </View>
      <AdBanner />
    </SafeAreaView>
  );
};

export default HistoryScreen;
