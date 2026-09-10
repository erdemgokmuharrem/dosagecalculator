import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import { useSubscription } from '../contexts/SubscriptionContext';
import { useTheme } from '../contexts/ThemeContext';

const FEATURES = [
  { icon: '🚫', key: 'feature1' },
  { icon: '💊', key: 'feature2' },
  { icon: '📄', key: 'feature3' },
  { icon: '⚖️', key: 'feature4' },
  { icon: '📊', key: 'feature5' },
  { icon: '🎯', key: 'feature6' },
];

const SubscriptionScreen: React.FC = () => {
  const navigation = useNavigation();
  const { t } = useTranslation();
  const { theme } = useTheme();
  const {
    subscription,
    isPro,
    purchaseMonthly,
    purchaseLifetime,
    restorePurchases,
    isLoading,
  } = useSubscription();
  const [selectedPlan, setSelectedPlan] = useState<'monthly' | 'lifetime'>(
    'monthly'
  );
  const [purchasing, setPurchasing] = useState(false);

  const handlePurchase = async () => {
    setPurchasing(true);
    const result =
      selectedPlan === 'monthly'
        ? await purchaseMonthly()
        : await purchaseLifetime();
    setPurchasing(false);

    if (result.success) {
      Alert.alert('🎉', t('subscription.alreadyPro'), [
        { text: t('common.ok'), onPress: () => navigation.goBack() },
      ]);
    } else {
      if (result.error !== 'subscription.errors.cancelled') {
        Alert.alert(
          t('common.error'),
          t(result.error ?? 'errors.purchaseError')
        );
      }
    }
  };

  const handleRestore = async () => {
    setPurchasing(true);
    const result = await restorePurchases();
    setPurchasing(false);

    if (result.success) {
      Alert.alert('🎉', t('subscription.alreadyPro'));
    } else {
      Alert.alert(t('common.info'), t(result.error ?? 'errors.restoreError'));
    }
  };

  const s = StyleSheet.create({
    container: { flex: 1, backgroundColor: theme.colors.background },
    header: {
      paddingTop: 20,
      paddingHorizontal: 24,
      paddingBottom: 24,
      alignItems: 'center',
      backgroundColor: theme.colors.primary,
    },
    crownIcon: { fontSize: 56, marginBottom: 12 },
    headerTitle: {
      fontSize: 28,
      fontWeight: '900',
      color: '#FFFFFF',
      marginBottom: 6,
      textAlign: 'center',
    },
    headerSubtitle: {
      fontSize: 15,
      color: 'rgba(255,255,255,0.85)',
      textAlign: 'center',
    },
    content: { padding: 20 },
    sectionTitle: {
      fontSize: 16,
      fontWeight: '800',
      color: theme.colors.text,
      marginBottom: 14,
      marginTop: 8,
    },
    featuresGrid: { marginBottom: 24 },
    featureItem: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 12,
      backgroundColor: theme.colors.surface,
      borderRadius: 12,
      padding: 14,
      borderWidth: 1,
      borderColor: theme.colors.border,
    },
    featureIcon: { fontSize: 22, marginRight: 14 },
    featureText: {
      fontSize: 14,
      color: theme.colors.text,
      fontWeight: '600',
      flex: 1,
    },
    plansRow: { flexDirection: 'row', gap: 12, marginBottom: 20 },
    planCard: {
      flex: 1,
      borderRadius: 16,
      padding: 16,
      backgroundColor: theme.colors.surface,
      borderWidth: 2,
      borderColor: theme.colors.border,
      alignItems: 'center',
      position: 'relative',
      overflow: 'hidden',
    },
    planCardSelected: {
      borderColor: theme.colors.primary,
      backgroundColor: theme.colors.primary + '10',
    },
    planBadge: {
      position: 'absolute',
      top: -1,
      right: -1,
      backgroundColor: theme.colors.primary,
      paddingHorizontal: 8,
      paddingVertical: 3,
      borderBottomLeftRadius: 10,
    },
    planBadgeLifetime: { backgroundColor: '#F59E0B' },
    planBadgeText: { color: '#FFF', fontSize: 9, fontWeight: '800' },
    planType: {
      fontSize: 13,
      fontWeight: '700',
      color: theme.colors.textSecondary,
      marginBottom: 6,
      marginTop: 20,
    },
    planPrice: {
      fontSize: 22,
      fontWeight: '900',
      color: theme.colors.primary,
      marginBottom: 4,
    },
    planBenefit: {
      fontSize: 11,
      color: theme.colors.textSecondary,
      textAlign: 'center',
    },
    radioOuter: {
      width: 20,
      height: 20,
      borderRadius: 10,
      borderWidth: 2,
      borderColor: theme.colors.border,
      alignItems: 'center',
      justifyContent: 'center',
      marginTop: 10,
    },
    radioOuterSelected: { borderColor: theme.colors.primary },
    radioInner: {
      width: 10,
      height: 10,
      borderRadius: 5,
      backgroundColor: theme.colors.primary,
    },
    purchaseButton: {
      backgroundColor: theme.colors.primary,
      borderRadius: 16,
      paddingVertical: 18,
      alignItems: 'center',
      marginBottom: 12,
      shadowColor: theme.colors.primary,
      shadowOffset: { width: 0, height: 6 },
      shadowOpacity: 0.35,
      shadowRadius: 12,
      elevation: 8,
    },
    purchaseButtonText: {
      fontSize: 18,
      fontWeight: '800',
      color: '#FFFFFF',
      letterSpacing: 0.3,
    },
    restoreButton: {
      paddingVertical: 14,
      alignItems: 'center',
    },
    restoreText: {
      fontSize: 13,
      color: theme.colors.primary,
      fontWeight: '600',
    },
    termsText: {
      fontSize: 11,
      color: theme.colors.textSecondary,
      textAlign: 'center',
      marginTop: 8,
      lineHeight: 16,
    },
    proActiveCard: {
      margin: 20,
      backgroundColor: theme.colors.success + '15',
      borderRadius: 20,
      padding: 24,
      alignItems: 'center',
      borderWidth: 2,
      borderColor: theme.colors.success,
    },
    proActiveIcon: { fontSize: 48, marginBottom: 12 },
    proActiveTitle: {
      fontSize: 22,
      fontWeight: '900',
      color: theme.colors.success,
      marginBottom: 6,
    },
    proActiveSubtitle: {
      fontSize: 14,
      color: theme.colors.textSecondary,
      textAlign: 'center',
    },
  });

  if (isPro) {
    return (
      <SafeAreaView style={s.container}>
        <View style={s.proActiveCard}>
          <Text style={s.proActiveIcon}>👑</Text>
          <Text style={s.proActiveTitle}>{t('subscription.alreadyPro')}</Text>
          <Text style={s.proActiveSubtitle}>
            {subscription.plan === 'lifetime'
              ? t('subscription.lifetimeBenefit')
              : subscription.expiresAt
                ? t('subscription.proExpires', {
                    date: new Date(subscription.expiresAt).toLocaleDateString(),
                  })
                : t('subscription.proActive')}
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={s.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={s.header}>
          <Text style={s.crownIcon}>👑</Text>
          <Text style={s.headerTitle}>{t('subscription.title')}</Text>
          <Text style={s.headerSubtitle}>{t('subscription.subtitle')}</Text>
        </View>

        <View style={s.content}>
          {/* Features */}
          <Text style={s.sectionTitle}>
            ✨ {t('subscription.featuresTitle')}
          </Text>
          <View style={s.featuresGrid}>
            {FEATURES.map(f => (
              <View key={f.key} style={s.featureItem}>
                <Text style={s.featureIcon}>{f.icon}</Text>
                <Text style={s.featureText}>{t(`subscription.${f.key}`)}</Text>
                <Text style={{ color: '#10B981', fontSize: 18 }}>✓</Text>
              </View>
            ))}
          </View>

          {/* Plans */}
          <Text style={s.sectionTitle}>📋 {t('subscription.choosePlan')}</Text>
          <View style={s.plansRow}>
            {/* Monthly */}
            <TouchableOpacity
              accessibilityRole="radio"
              accessibilityState={{ checked: selectedPlan === 'monthly' }}
              style={[
                s.planCard,
                selectedPlan === 'monthly' && s.planCardSelected,
              ]}
              onPress={() => setSelectedPlan('monthly')}
              activeOpacity={0.8}
            >
              <View style={s.planBadge}>
                <Text style={s.planBadgeText}>
                  {t('subscription.mostPopular')}
                </Text>
              </View>
              <Text style={s.planType}>
                {t('subscription.monthly').toUpperCase()}
              </Text>
              <Text style={s.planPrice}>{t('subscription.monthlyPrice')}</Text>
              <Text style={s.planBenefit}>
                {t('subscription.monthlyBenefit')}
              </Text>
              <View
                style={[
                  s.radioOuter,
                  selectedPlan === 'monthly' && s.radioOuterSelected,
                ]}
              >
                {selectedPlan === 'monthly' && <View style={s.radioInner} />}
              </View>
            </TouchableOpacity>

            {/* Lifetime */}
            <TouchableOpacity
              accessibilityRole="radio"
              accessibilityState={{ checked: selectedPlan === 'lifetime' }}
              style={[
                s.planCard,
                selectedPlan === 'lifetime' && s.planCardSelected,
              ]}
              onPress={() => setSelectedPlan('lifetime')}
              activeOpacity={0.8}
            >
              <View style={[s.planBadge, s.planBadgeLifetime]}>
                <Text style={s.planBadgeText}>
                  {t('subscription.bestValue')}
                </Text>
              </View>
              <Text style={s.planType}>
                {t('subscription.lifetime').toUpperCase()}
              </Text>
              <Text style={s.planPrice}>{t('subscription.lifetimePrice')}</Text>
              <Text style={s.planBenefit}>
                {t('subscription.lifetimeBenefit')}
              </Text>
              <View
                style={[
                  s.radioOuter,
                  selectedPlan === 'lifetime' && s.radioOuterSelected,
                ]}
              >
                {selectedPlan === 'lifetime' && <View style={s.radioInner} />}
              </View>
            </TouchableOpacity>
          </View>

          {/* Purchase Button */}
          <TouchableOpacity
            accessibilityRole="button"
            accessibilityState={{
              disabled: purchasing || isLoading,
              busy: purchasing,
            }}
            style={s.purchaseButton}
            onPress={handlePurchase}
            disabled={purchasing || isLoading}
            activeOpacity={0.85}
          >
            {purchasing ? (
              <ActivityIndicator color="#FFFFFF" size="small" />
            ) : (
              <Text style={s.purchaseButtonText}>
                {selectedPlan === 'monthly'
                  ? `${t('subscription.subscribe')} — ${t('subscription.monthlyPrice')}`
                  : `${t('subscription.buyLifetime')} — ${t('subscription.lifetimePrice')}`}
              </Text>
            )}
          </TouchableOpacity>

          <TouchableOpacity
            accessibilityRole="button"
            accessibilityState={{ disabled: purchasing }}
            style={s.restoreButton}
            onPress={handleRestore}
            disabled={purchasing}
          >
            <Text style={s.restoreText}>
              {t('subscription.restorePurchase')}
            </Text>
          </TouchableOpacity>

          <Text style={s.termsText}>{t('subscription.terms')}</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default SubscriptionScreen;
