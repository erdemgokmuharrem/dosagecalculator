import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useTranslation } from 'react-i18next';
import { RootStackParamList, ProductInfo } from '../types';
import { useTheme } from '../contexts/ThemeContext';
import { useAppStore } from '../store';
import ModernCard from '../components/ModernCard';
import Icon from '../components/Icon';
import FadeInView from '../components/FadeInView';

type ProductInfoScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'ProductInfo'
>;

const ProductInfoScreen: React.FC = () => {
  const navigation = useNavigation<ProductInfoScreenNavigationProp>();
  const { t } = useTranslation();
  const { theme } = useTheme();
  const { selectedDrug } = useAppStore();

  // NOTE: this guard must not reference `styles` — that const is declared below,
  // so touching it here threw "Cannot access 'styles' before initialization" and
  // crashed the screen whenever no drug was selected (the default state). The
  // message is also translated rather than hardcoded Turkish.
  if (!selectedDrug || !selectedDrug.productInfo) {
    return (
      <SafeAreaView
        style={{ flex: 1, backgroundColor: theme.colors.background }}
      >
        <View
          style={{
            flex: 1,
            alignItems: 'center',
            justifyContent: 'center',
            padding: 24,
          }}
        >
          <Icon name="alert-circle" size={48} color={theme.colors.error} />
          <Text
            style={{
              marginTop: 12,
              fontSize: 15,
              fontWeight: '600',
              textAlign: 'center',
              color: theme.colors.text,
            }}
          >
            {t('drug.noDrugSelected')}
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  const productInfo: ProductInfo = selectedDrug.productInfo;

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      padding: theme.spacing.md,
      backgroundColor: theme.colors.surface,
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.border,
    },
    backButton: {
      padding: theme.spacing.sm,
      marginRight: theme.spacing.sm,
    },
    headerTitle: {
      fontSize: theme.fontSizes.lg,
      fontWeight: 'bold',
      color: theme.colors.text,
      flex: 1,
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
      lineHeight: 22,
    },
    sectionTitle: {
      fontSize: theme.fontSizes.md,
      fontWeight: 'bold',
      color: theme.colors.primary,
      marginBottom: theme.spacing.xs,
      marginTop: theme.spacing.sm,
    },
    bulletPoint: {
      fontSize: theme.fontSizes.sm,
      color: theme.colors.textSecondary,
      marginBottom: theme.spacing.xs,
      paddingLeft: theme.spacing.md,
    },
    bulletText: {
      fontSize: theme.fontSizes.sm,
      color: theme.colors.textSecondary,
      lineHeight: 20,
    },
    warningBox: {
      backgroundColor: theme.colors.warning + '20',
      borderRadius: theme.borderRadius.md,
      padding: theme.spacing.sm,
      marginVertical: theme.spacing.xs,
      borderLeftWidth: 4,
      borderLeftColor: theme.colors.warning,
    },
    warningText: {
      fontSize: theme.fontSizes.sm,
      color: theme.colors.warning,
      fontWeight: 'bold',
    },
    infoBox: {
      backgroundColor: theme.colors.primary + '20',
      borderRadius: theme.borderRadius.md,
      padding: theme.spacing.sm,
      marginVertical: theme.spacing.xs,
      borderLeftWidth: 4,
      borderLeftColor: theme.colors.primary,
    },
    infoText: {
      fontSize: theme.fontSizes.sm,
      color: theme.colors.primary,
      fontWeight: 'bold',
    },
    errorContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      padding: theme.spacing.xl,
    },
    errorText: {
      fontSize: theme.fontSizes.lg,
      textAlign: 'center',
      marginTop: theme.spacing.md,
    },
  });

  const renderBulletList = (items: string[]) => (
    <View>
      {items.map((item, index) => (
        <Text key={index} style={styles.bulletPoint}>
          • {item}
        </Text>
      ))}
    </View>
  );

  const renderWarningBox = (title: string, items: string[]) => (
    <View style={styles.warningBox}>
      <Text style={styles.warningText}>{title}</Text>
      {items.map((item, index) => (
        <Text key={index} style={styles.bulletText}>
          • {item}
        </Text>
      ))}
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Icon name="arrow-left" size={24} color={theme.colors.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>
          {selectedDrug.name} - Kısa Ürün Bilgisi
        </Text>
      </View>

      <ScrollView style={styles.content}>
        <FadeInView delay={0}>
          <ModernCard variant="elevated" style={styles.card}>
            <Text style={styles.cardTitle}>{t('drug.activeIngredient')}</Text>
            <Text style={styles.cardContent}>
              {productInfo.activeIngredient}
            </Text>
          </ModernCard>
        </FadeInView>

        <FadeInView delay={100}>
          <ModernCard variant="elevated" style={styles.card}>
            <Text style={styles.cardTitle}>
              {t('vademecum.mechanismOfAction')}
            </Text>
            <Text style={styles.cardContent}>
              {productInfo.mechanismOfAction}
            </Text>
          </ModernCard>
        </FadeInView>

        <FadeInView delay={200}>
          <ModernCard variant="elevated" style={styles.card}>
            <Text style={styles.cardTitle}>
              {t('vademecum.pharmacokinetics')}
            </Text>
            <Text style={styles.sectionTitle}>
              {t('vademecum.absorption')}:
            </Text>
            <Text style={styles.cardContent}>
              {productInfo.pharmacokinetics.absorption}
            </Text>

            <Text style={styles.sectionTitle}>
              {t('vademecum.distribution')}:
            </Text>
            <Text style={styles.cardContent}>
              {productInfo.pharmacokinetics.distribution}
            </Text>

            <Text style={styles.sectionTitle}>
              {t('vademecum.metabolism')}:
            </Text>
            <Text style={styles.cardContent}>
              {productInfo.pharmacokinetics.metabolism}
            </Text>

            <Text style={styles.sectionTitle}>
              {t('vademecum.elimination')}:
            </Text>
            <Text style={styles.cardContent}>
              {productInfo.pharmacokinetics.elimination}
            </Text>

            <Text style={styles.sectionTitle}>{t('vademecum.halfLife')}:</Text>
            <Text style={styles.cardContent}>
              {productInfo.pharmacokinetics.halfLife}
            </Text>
          </ModernCard>
        </FadeInView>

        <FadeInView delay={300}>
          <ModernCard variant="gradient" style={styles.card}>
            <Text style={styles.cardTitle}>
              {t('vademecum.administration')}
            </Text>
            <Text style={styles.sectionTitle}>{t('vademecum.route')}:</Text>
            <Text style={styles.cardContent}>
              {productInfo.administration.route}
            </Text>

            <Text style={styles.sectionTitle}>{t('vademecum.method')}:</Text>
            <Text style={styles.cardContent}>
              {productInfo.administration.method}
            </Text>

            <Text style={styles.sectionTitle}>{t('vademecum.duration')}:</Text>
            <Text style={styles.cardContent}>
              {productInfo.administration.duration}
            </Text>

            <Text style={styles.sectionTitle}>{t('vademecum.diluent')}:</Text>
            <Text style={styles.cardContent}>
              {productInfo.administration.diluent}
            </Text>

            <Text style={styles.sectionTitle}>
              {t('vademecum.concentration')}:
            </Text>
            <Text style={styles.cardContent}>
              {productInfo.administration.concentration}
            </Text>

            <Text style={styles.sectionTitle}>
              {t('vademecum.compatibility')}:
            </Text>
            {renderBulletList(productInfo.administration.compatibility)}

            <Text style={styles.sectionTitle}>
              {t('vademecum.incompatibility')}:
            </Text>
            {renderBulletList(productInfo.administration.incompatibility)}
          </ModernCard>
        </FadeInView>

        <FadeInView delay={400}>
          <ModernCard variant="elevated" style={styles.card}>
            <Text style={styles.cardTitle}>{t('vademecum.indications')}</Text>
            {renderBulletList(productInfo.indications)}
          </ModernCard>
        </FadeInView>

        <FadeInView delay={500}>
          <ModernCard variant="elevated" style={styles.card}>
            <Text style={styles.cardTitle}>
              {t('vademecum.contraindications')}
            </Text>
            {renderBulletList(productInfo.contraindications)}
          </ModernCard>
        </FadeInView>

        <FadeInView delay={600}>
          <ModernCard variant="elevated" style={styles.card}>
            <Text style={styles.cardTitle}>{t('vademecum.warnings')}</Text>
            {renderWarningBox(
              'Dikkat Edilmesi Gerekenler:',
              productInfo.warnings
            )}
          </ModernCard>
        </FadeInView>

        <FadeInView delay={700}>
          <ModernCard variant="elevated" style={styles.card}>
            <Text style={styles.cardTitle}>
              {t('vademecum.drugInteractions')}
            </Text>
            <Text style={styles.sectionTitle}>
              {t('vademecum.drugInteractions')}:
            </Text>
            {renderBulletList(productInfo.interactions.drugInteractions)}

            <Text style={styles.sectionTitle}>
              {t('vademecum.foodInteractions')}:
            </Text>
            {renderBulletList(productInfo.interactions.foodInteractions)}

            <Text style={styles.sectionTitle}>
              {t('vademecum.labInteractions')}:
            </Text>
            {renderBulletList(productInfo.interactions.labInteractions)}
          </ModernCard>
        </FadeInView>

        <FadeInView delay={800}>
          <ModernCard variant="elevated" style={styles.card}>
            <Text style={styles.cardTitle}>{t('vademecum.monitoring')}</Text>
            <Text style={styles.sectionTitle}>
              {t('vademecum.parameters')}:
            </Text>
            {renderBulletList(productInfo.monitoring.parameters)}

            <Text style={styles.sectionTitle}>{t('vademecum.frequency')}:</Text>
            <Text style={styles.cardContent}>
              {productInfo.monitoring.frequency}
            </Text>

            <Text style={styles.sectionTitle}>
              {t('vademecum.specialConsiderations')}:
            </Text>
            {renderBulletList(productInfo.monitoring.specialConsiderations)}
          </ModernCard>
        </FadeInView>

        <FadeInView delay={900}>
          <ModernCard variant="elevated" style={styles.card}>
            <Text style={styles.cardTitle}>{t('vademecum.storage')}</Text>
            <Text style={styles.sectionTitle}>
              {t('vademecum.temperature')}:
            </Text>
            <Text style={styles.cardContent}>
              {productInfo.storage.temperature}
            </Text>

            <Text style={styles.sectionTitle}>{t('vademecum.light')}:</Text>
            <Text style={styles.cardContent}>{productInfo.storage.light}</Text>

            <Text style={styles.sectionTitle}>{t('vademecum.stability')}:</Text>
            <Text style={styles.cardContent}>
              {productInfo.storage.stability}
            </Text>
          </ModernCard>
        </FadeInView>

        <FadeInView delay={1000}>
          <ModernCard variant="elevated" style={styles.card}>
            <Text style={styles.cardTitle}>
              {t('vademecum.specialPopulations')}
            </Text>
            <Text style={styles.sectionTitle}>
              {t('vademecum.pregnancyCategory')}:
            </Text>
            <Text style={styles.cardContent}>
              {productInfo.pregnancyCategory}
            </Text>

            <Text style={styles.sectionTitle}>{t('vademecum.lactation')}:</Text>
            <Text style={styles.cardContent}>{productInfo.lactation}</Text>

            <Text style={styles.sectionTitle}>
              {t('vademecum.pediatricUse')}:
            </Text>
            <Text style={styles.cardContent}>{productInfo.pediatricUse}</Text>

            <Text style={styles.sectionTitle}>
              {t('vademecum.geriatricUse')}:
            </Text>
            <Text style={styles.cardContent}>{productInfo.geriatricUse}</Text>

            <Text style={styles.sectionTitle}>
              {t('vademecum.renalAdjustment')}:
            </Text>
            <Text style={styles.cardContent}>
              {productInfo.renalAdjustment}
            </Text>

            <Text style={styles.sectionTitle}>
              {t('vademecum.hepaticAdjustment')}:
            </Text>
            <Text style={styles.cardContent}>
              {productInfo.hepaticAdjustment}
            </Text>
          </ModernCard>
        </FadeInView>
      </ScrollView>
    </SafeAreaView>
  );
};

export default ProductInfoScreen;
