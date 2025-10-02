import React from 'react';
import { View, Text, StyleSheet, ScrollView, SafeAreaView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useTranslation } from 'react-i18next';
import { RootStackParamList } from '../types';
import { useTheme } from '../contexts/ThemeContext';
import { useAppStore } from '../store';
import GradientButton from '../components/GradientButton';
import ModernCard from '../components/ModernCard';
import FadeInView from '../components/FadeInView';
import Icon from '../components/Icon';

type HomeScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'Home'
>;

const HomeScreen: React.FC = () => {
  const navigation = useNavigation<HomeScreenNavigationProp>();
  const { t } = useTranslation();
  const { theme } = useTheme();
  const { currentPatient } = useAppStore();

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#f6f8fa',
    },
    content: {
      flex: 1,
      padding: theme.spacing.md,
    },
    header: {
      marginBottom: theme.spacing.xl,
    },
    titleContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: theme.spacing.sm,
    },
    title: {
      fontSize: theme.fontSizes.xxxl,
      fontWeight: 'bold',
      color: theme.colors.text,
      marginLeft: theme.spacing.md,
    },
    subtitle: {
      fontSize: theme.fontSizes.lg,
      color: theme.colors.textSecondary,
      marginBottom: theme.spacing.lg,
    },
    card: {
      marginBottom: theme.spacing.md,
    },
    cardHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: theme.spacing.sm,
    },
    cardTitle: {
      fontSize: theme.fontSizes.xl,
      fontWeight: 'bold',
      color: theme.colors.text,
      marginLeft: theme.spacing.sm,
    },
    cardDescription: {
      fontSize: theme.fontSizes.md,
      color: theme.colors.textSecondary,
      marginBottom: theme.spacing.md,
    },
    patientInfo: {
      backgroundColor: theme.colors.warning + '20',
      borderRadius: theme.borderRadius.md,
      padding: theme.spacing.md,
      marginBottom: theme.spacing.md,
    },
    patientInfoText: {
      fontSize: theme.fontSizes.sm,
      color: theme.colors.warning,
    },
    quickActions: {
      flexDirection: 'column',
      marginTop: theme.spacing.lg,
      gap: theme.spacing.sm,
    },
    chemotherapyButton: {
      marginTop: theme.spacing.md,
      marginHorizontal: theme.spacing.md,
    },
  });

  const handleStartCalculation = () => {
    if (currentPatient) {
      navigation.navigate('DrugSelection', { patientId: currentPatient.id });
    } else {
      navigation.navigate('PatientInfo');
    }
  };

  const handleViewHistory = () => {
    navigation.navigate('History');
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.content}>
        <FadeInView delay={0}>
          <View style={styles.header}>
            <View style={styles.titleContainer}>
              <Icon name="calculator" size={40} color={theme.colors.primary} />
              <Text style={styles.title}>{t('navigation.calculator')}</Text>
            </View>
            <Text style={styles.subtitle}>
              Güvenli ve doğru ilaç doz hesaplaması için hasta bilgilerini girin
            </Text>
          </View>
        </FadeInView>

        {currentPatient && (
          <FadeInView delay={200}>
            <View style={styles.patientInfo}>
              <Text style={styles.patientInfoText}>
                Aktif Hasta: {currentPatient.age} yaş, {currentPatient.weight}{' '}
                kg, {currentPatient.patientType}
              </Text>
            </View>
          </FadeInView>
        )}

        <FadeInView delay={400}>
          <View style={styles.quickActions}>
            <GradientButton
              title="Hasta Bilgileri"
              onPress={() => navigation.navigate('PatientInfo')}
              variant="secondary"
              size="medium"
              fullWidth
            />
            <GradientButton
              title="İlaç Seçimi"
              onPress={handleStartCalculation}
              variant="primary"
              size="medium"
              fullWidth
            />
            <GradientButton
              title="Kemoterapi Dozu"
              onPress={() => navigation.navigate('ChemotherapyDose')}
              variant="primary"
              size="medium"
              fullWidth
            />
            <GradientButton
              title="Geçmiş"
              onPress={handleViewHistory}
              variant="secondary"
              size="medium"
              fullWidth
            />
            <GradientButton
              title="Ayarlar"
              onPress={() => navigation.navigate('Settings')}
              variant="secondary"
              size="medium"
              fullWidth
            />
          </View>
        </FadeInView>

        <FadeInView delay={500}>
          <ModernCard variant="elevated" style={styles.card}>
            <View style={styles.cardHeader}>
              <Icon name="pill" size={24} color={theme.colors.primary} />
              <Text style={styles.cardTitle}>İlaç Doz Hesaplama</Text>
            </View>
            <Text style={styles.cardDescription}>
              Hasta bilgilerini girerek güvenli ilaç dozunu hesaplayın.
              Hesaplama motoru yaş, kilo, boy ve hasta tipine göre optimal dozu
              belirler.
            </Text>
            <GradientButton
              title={currentPatient ? 'İlaç Seç' : 'Başla'}
              onPress={handleStartCalculation}
              variant="primary"
              size="large"
              fullWidth
            />
          </ModernCard>
        </FadeInView>

        <FadeInView delay={600}>
          <ModernCard variant="elevated" style={styles.card}>
            <View style={styles.cardHeader}>
              <Icon name="history" size={24} color={theme.colors.primary} />
              <Text style={styles.cardTitle}>Hesaplama Geçmişi</Text>
            </View>
            <Text style={styles.cardDescription}>
              Önceki hesaplamalarınızı görüntüleyin ve yönetin.
            </Text>
            <GradientButton
              title="Geçmişi Görüntüle"
              onPress={handleViewHistory}
              variant="secondary"
              size="large"
              fullWidth
            />
          </ModernCard>
        </FadeInView>
      </ScrollView>
    </SafeAreaView>
  );
};

export default HomeScreen;
