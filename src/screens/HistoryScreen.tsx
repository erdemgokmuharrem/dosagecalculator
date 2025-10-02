import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  SafeAreaView,
  Alert,
} from 'react-native';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../contexts/ThemeContext';
import { useAppStore } from '../store';
import { DosageCalculation } from '../types';
import { getDrugById } from '../data/drugs';
import ModernCard from '../components/ModernCard';
import GradientButton from '../components/GradientButton';
import FadeInView from '../components/FadeInView';

const HistoryScreen: React.FC = () => {
  const { t } = useTranslation();
  const { theme } = useTheme();
  const { calculations, patients, clearCalculations } = useAppStore();
  const [selectedCalculation, setSelectedCalculation] =
    useState<DosageCalculation | null>(null);

  const styles = StyleSheet.create({
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
  });

  const handleClearHistory = () => {
    Alert.alert(
      'Geçmişi Temizle',
      'Tüm hesaplama geçmişini silmek istediğinizden emin misiniz?',
      [
        { text: 'İptal', style: 'cancel' },
        {
          text: 'Sil',
          style: 'destructive',
          onPress: () => clearCalculations(),
        },
      ]
    );
  };

  const getPatientName = (patientId: string): string => {
    const patient = patients.find(p => p.id === patientId);
    return patient
      ? `${patient.age} yaş, ${patient.weight}kg`
      : 'Bilinmeyen Hasta';
  };

  const getDrugName = (drugId: string): string => {
    const drug = getDrugById(drugId);
    return drug ? drug.name : 'Bilinmeyen İlaç';
  };

  const formatDate = (date: Date): string => {
    return new Intl.DateTimeFormat('tr-TR', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  };

  const renderCalculation = ({ item, index }: { item: DosageCalculation; index: number }) => (
    <FadeInView delay={index * 100}>
      <ModernCard
        variant="elevated"
        style={styles.calculationCard}
        onPress={() => setSelectedCalculation(item)}
      >
        <View style={styles.calculationHeader}>
          <Text style={styles.calculationDate}>{formatDate(item.timestamp)}</Text>
          <Text style={styles.calculationDose}>
            {item.calculatedDose}
            {item.unit}
          </Text>
        </View>

        <View style={styles.calculationInfo}>
          <Text style={styles.calculationLabel}>Hasta</Text>
          <Text style={styles.calculationValue}>
            {getPatientName(item.patientId)}
          </Text>
        </View>

        <View style={styles.calculationInfo}>
          <Text style={styles.calculationLabel}>İlaç</Text>
          <Text style={styles.calculationValue}>{getDrugName(item.drugId)}</Text>
        </View>

        <View style={styles.calculationInfo}>
          <Text style={styles.calculationLabel}>Sıklık</Text>
          <Text style={styles.calculationValue}>{item.frequency}</Text>
        </View>

        {item.warnings.length > 0 && (
          <View style={styles.warningBadge}>
            <Text style={styles.warningBadgeText}>
              {item.warnings.length} Uyarı
            </Text>
          </View>
        )}
      </ModernCard>
    </FadeInView>
  );

  const renderEmptyState = () => (
    <View style={styles.emptyState}>
      <Text style={styles.emptyStateText}>Henüz hesaplama geçmişi yok</Text>
      <Text style={styles.emptyStateSubtext}>
        İlaç doz hesaplaması yaptığınızda burada görünecek
      </Text>
    </View>
  );

  const renderDetailModal = () => {
    if (!selectedCalculation) return null;

    const drug = getDrugById(selectedCalculation.drugId);
    const patient = patients.find(p => p.id === selectedCalculation.patientId);

    return (
      <View style={styles.detailModal}>
        <View style={styles.detailCard}>
          <Text style={styles.detailTitle}>Hesaplama Detayları</Text>

          <View style={styles.calculationInfo}>
            <Text style={styles.calculationLabel}>Tarih</Text>
            <Text style={styles.calculationValue}>
              {formatDate(selectedCalculation.timestamp)}
            </Text>
          </View>

          <View style={styles.calculationInfo}>
            <Text style={styles.calculationLabel}>Hasta Bilgileri</Text>
            <Text style={styles.calculationValue}>
              {patient
                ? `${patient.age} yaş, ${patient.weight}kg, ${patient.height}cm, ${patient.gender === 'male' ? 'Erkek' : 'Kadın'}, ${patient.patientType}`
                : 'Bilinmeyen'}
            </Text>
          </View>

          <View style={styles.calculationInfo}>
            <Text style={styles.calculationLabel}>İlaç</Text>
            <Text style={styles.calculationValue}>
              {drug ? `${drug.name} (${drug.genericName})` : 'Bilinmeyen'}
            </Text>
          </View>

          <View style={styles.calculationInfo}>
            <Text style={styles.calculationLabel}>Hesaplanan Doz</Text>
            <Text style={styles.calculationValue}>
              {selectedCalculation.calculatedDose}
              {selectedCalculation.unit} - {selectedCalculation.frequency}
            </Text>
          </View>

          <View style={styles.calculationInfo}>
            <Text style={styles.calculationLabel}>Maksimum Günlük Doz</Text>
            <Text style={styles.calculationValue}>
              {selectedCalculation.maxDailyDose}
              {selectedCalculation.unit}
            </Text>
          </View>

          {selectedCalculation.warnings.length > 0 && (
            <View style={styles.calculationInfo}>
              <Text style={styles.calculationLabel}>Uyarılar</Text>
              {selectedCalculation.warnings.map((warning, index) => (
                <Text
                  key={index}
                  style={[
                    styles.calculationValue,
                    { color: theme.colors.warning },
                  ]}
                >
                  • {warning}
                </Text>
              ))}
            </View>
          )}

          <TouchableOpacity
            style={styles.detailCloseButton}
            onPress={() => setSelectedCalculation(null)}
          >
            <Text style={styles.detailCloseButtonText}>Kapat</Text>
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
            <Text style={styles.title}>Hesaplama Geçmişi</Text>
            {calculations.length > 0 && (
              <GradientButton
                title="Temizle"
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
          <FlatList
            data={calculations}
            renderItem={renderCalculation}
            keyExtractor={item => item.id}
            showsVerticalScrollIndicator={false}
          />
        )}

        {selectedCalculation && renderDetailModal()}
      </View>
    </SafeAreaView>
  );
};

export default HistoryScreen;
