import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  Switch,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useTranslation } from 'react-i18next';
import { sampleDrugs } from '../data/drugs';
import { RootStackParamList } from '../types';
import { useTheme } from '../contexts/ThemeContext';
import { useSubscription } from '../contexts/SubscriptionContext';
import { SUPPORTED_LANGUAGES, changeLanguage } from '../locales/i18n';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

const APP_VERSION = '2.1.0';

const SettingsScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();
  const { t, i18n } = useTranslation();
  const { theme, isDark, setThemeMode } = useTheme();
  const { isPro, subscription } = useSubscription();

  const [currentLang, setCurrentLang] = useState(i18n.language);

  const handleLanguageChange = async (langCode: string) => {
    await changeLanguage(langCode);
    setCurrentLang(langCode);
  };

  const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: theme.colors.background },
    scrollContent: { padding: 16, paddingBottom: 40 },
    // Section
    sectionTitle: {
      fontSize: 11,
      fontWeight: '800',
      color: theme.colors.textSecondary,
      letterSpacing: 1,
      textTransform: 'uppercase',
      marginBottom: 8,
      marginTop: 16,
      marginLeft: 4,
    },
    card: {
      backgroundColor: theme.colors.surface,
      borderRadius: 16,
      overflow: 'hidden',
      borderWidth: 1,
      borderColor: theme.colors.border,
      marginBottom: 6,
    },
    row: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: 16,
      paddingVertical: 14,
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.border,
    },
    rowLast: {
      borderBottomWidth: 0,
    },
    rowIcon: { fontSize: 20, width: 32, marginRight: 12 },
    rowContent: { flex: 1 },
    rowLabel: { fontSize: 15, fontWeight: '600', color: theme.colors.text },
    rowSub: { fontSize: 12, color: theme.colors.textSecondary, marginTop: 1 },
    rowValue: { fontSize: 13, color: theme.colors.textSecondary },
    rowArrow: { fontSize: 14, color: theme.colors.textSecondary },
    // Language selector
    langGrid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      padding: 12,
      gap: 8,
    },
    langBtn: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: 12,
      paddingVertical: 8,
      borderRadius: 12,
      borderWidth: 1.5,
      borderColor: theme.colors.border,
      backgroundColor: theme.colors.background,
      gap: 6,
      minWidth: 120,
    },
    langBtnActive: {
      borderColor: theme.colors.primary,
      backgroundColor: theme.colors.primary + '12',
    },
    langFlag: { fontSize: 20 },
    langName: {
      fontSize: 13,
      fontWeight: '600',
      color: theme.colors.textSecondary,
    },
    langNameActive: { color: theme.colors.primary },
    langCheck: {
      marginLeft: 'auto',
      color: theme.colors.primary,
      fontSize: 14,
    },
    // Pro card
    proCard: {
      backgroundColor: theme.colors.primary,
      borderRadius: 16,
      padding: 16,
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 6,
      shadowColor: theme.colors.primary,
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.3,
      shadowRadius: 8,
      elevation: 6,
    },
    proIconContainer: {
      width: 48,
      height: 48,
      borderRadius: 14,
      backgroundColor: 'rgba(255,255,255,0.2)',
      alignItems: 'center',
      justifyContent: 'center',
      marginRight: 14,
    },
    proIcon: { fontSize: 24 },
    proInfo: { flex: 1 },
    proTitle: {
      fontSize: 16,
      fontWeight: '900',
      color: '#FFFFFF',
      marginBottom: 2,
    },
    proSubtitle: { fontSize: 12, color: 'rgba(255,255,255,0.8)' },
    proArrow: { fontSize: 18, color: 'rgba(255,255,255,0.8)' },
    // About
    aboutCard: {
      backgroundColor: theme.colors.surface,
      borderRadius: 16,
      padding: 20,
      alignItems: 'center',
      borderWidth: 1,
      borderColor: theme.colors.border,
    },
    appName: {
      fontSize: 20,
      fontWeight: '900',
      color: theme.colors.primary,
      marginBottom: 4,
    },
    appVersion: {
      fontSize: 13,
      color: theme.colors.textSecondary,
      marginBottom: 8,
    },
    appDescription: {
      fontSize: 12,
      color: theme.colors.textSecondary,
      textAlign: 'center',
      lineHeight: 18,
    },
    // Warning card
    warningCard: {
      backgroundColor: '#FEF3C7',
      borderRadius: 12,
      padding: 14,
      marginTop: 6,
      borderWidth: 1,
      borderColor: '#F59E0B40',
      flexDirection: 'row',
      alignItems: 'flex-start',
      gap: 10,
    },
    warningIcon: { fontSize: 18 },
    warningText: { fontSize: 12, color: '#92400E', flex: 1, lineHeight: 18 },
  });

  const SettingsRow: React.FC<{
    icon: string;
    label: string;
    sub?: string;
    value?: string;
    onPress?: () => void;
    rightContent?: React.ReactNode;
    isLast?: boolean;
  }> = ({ icon, label, sub, value, onPress, rightContent, isLast }) => (
    <TouchableOpacity
      accessibilityRole="button"
      accessibilityState={{ disabled: !onPress && !rightContent }}
      style={[styles.row, isLast && styles.rowLast]}
      onPress={onPress}
      disabled={!onPress && !rightContent}
      activeOpacity={onPress ? 0.7 : 1}
    >
      <Text style={styles.rowIcon}>{icon}</Text>
      <View style={styles.rowContent}>
        <Text style={styles.rowLabel}>{label}</Text>
        {sub && <Text style={styles.rowSub}>{sub}</Text>}
      </View>
      {rightContent || (value && <Text style={styles.rowValue}>{value}</Text>)}
      {onPress && !rightContent && <Text style={styles.rowArrow}>›</Text>}
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* PRO / SUBSCRIPTION */}
        <Text style={styles.sectionTitle}>{t('settings.proVersion')}</Text>
        <TouchableOpacity
          accessibilityRole="button"
          style={styles.proCard}
          onPress={() => navigation.navigate('Subscription')}
          activeOpacity={0.85}
        >
          <View style={styles.proIconContainer}>
            <Text style={styles.proIcon}>{isPro ? '👑' : '⭐'}</Text>
          </View>
          <View style={styles.proInfo}>
            <Text style={styles.proTitle}>
              {isPro ? t('subscription.alreadyPro') : t('subscription.title')}
            </Text>
            <Text style={styles.proSubtitle}>
              {isPro
                ? subscription.plan === 'lifetime'
                  ? t('subscription.lifetimeBenefit')
                  : t('subscription.proActive')
                : t('subscription.subtitle')}
            </Text>
          </View>
          {!isPro && <Text style={styles.proArrow}>›</Text>}
        </TouchableOpacity>

        {/* LANGUAGE */}
        <Text style={styles.sectionTitle}>{t('settings.language')}</Text>
        <View style={[styles.card, { marginBottom: 6 }]}>
          <View style={styles.langGrid}>
            {SUPPORTED_LANGUAGES.map(lang => (
              <TouchableOpacity
                accessibilityRole="radio"
                accessibilityState={{ checked: currentLang === lang.code }}
                key={lang.code}
                style={[
                  styles.langBtn,
                  currentLang === lang.code && styles.langBtnActive,
                ]}
                onPress={() => handleLanguageChange(lang.code)}
                activeOpacity={0.8}
              >
                <Text style={styles.langFlag}>{lang.flag}</Text>
                <Text
                  style={[
                    styles.langName,
                    currentLang === lang.code && styles.langNameActive,
                  ]}
                >
                  {lang.nativeName}
                </Text>
                {currentLang === lang.code && (
                  <Text style={styles.langCheck}>✓</Text>
                )}
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* APPEARANCE */}
        <Text style={styles.sectionTitle}>{t('settings.theme')}</Text>
        <View style={styles.card}>
          <SettingsRow
            icon={isDark ? '🌙' : '☀️'}
            label={isDark ? t('settings.dark') : t('settings.light')}
            sub={t('settings.system')}
            rightContent={
              <Switch
                value={isDark}
                onValueChange={v => setThemeMode(v ? 'dark' : 'light')}
                trackColor={{
                  false: '#D1D5DB',
                  true: theme.colors.primary + '80',
                }}
                thumbColor={isDark ? theme.colors.primary : '#F9FAFB'}
              />
            }
            isLast
          />
        </View>

        {/* ABOUT */}
        <Text style={styles.sectionTitle}>{t('settings.about')}</Text>
        <View style={styles.card}>
          <SettingsRow
            icon="⭐"
            label={t('settings.rateApp')}
            onPress={() =>
              Alert.alert(
                t('settings.rateThanksTitle'),
                t('settings.rateThanksMessage')
              )
            }
          />
          <SettingsRow
            icon="📧"
            label={t('settings.feedback')}
            onPress={() =>
              Alert.alert(t('settings.feedback'), 'feedback@dozuhesapla.com')
            }
          />
          <SettingsRow
            icon="🔒"
            label={t('settings.privacy')}
            onPress={() =>
              Alert.alert(t('settings.privacy'), 'www.dozuhesapla.com/privacy')
            }
          />
          <SettingsRow
            icon="📄"
            label={t('settings.terms')}
            onPress={() =>
              Alert.alert(t('settings.terms'), 'www.dozuhesapla.com/terms')
            }
          />
          <SettingsRow
            icon="🎧"
            label={t('settings.support')}
            onPress={() =>
              Alert.alert(t('settings.support'), 'support@dozuhesapla.com')
            }
            isLast
          />
        </View>

        {/* APP INFO */}
        <Text style={styles.sectionTitle}>{t('settings.appInfo')}</Text>
        <View style={styles.aboutCard}>
          <Text style={{ fontSize: 40, marginBottom: 8 }}>⚕️</Text>
          <Text style={styles.appName}>DozuHesapla!</Text>
          <Text style={styles.appVersion}>
            {t('settings.version')} {APP_VERSION}
            {isPro ? ' Pro' : ' Free'}
          </Text>
          <Text style={styles.appDescription}>
            {t('settings.appDescription')}
            {'\n'}
            {t('settings.appStats', { count: sampleDrugs.length })}
          </Text>
        </View>

        {/* MEDICAL DISCLAIMER */}
        <View style={styles.warningCard}>
          <Text style={styles.warningIcon}>⚕️</Text>
          <Text style={styles.warningText}>{t('settings.disclaimerText')}</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default SettingsScreen;
