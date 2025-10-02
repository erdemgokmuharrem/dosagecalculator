import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  Alert,
} from 'react-native';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../contexts/ThemeContext';
import { useAppStore } from '../store';

const SettingsScreen: React.FC = () => {
  const { t, i18n } = useTranslation();
  const { theme, themeMode, setThemeMode, isDark } = useTheme();
  const { clearCalculations } = useAppStore();

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },
    content: {
      flex: 1,
      padding: theme.spacing.md,
    },
    section: {
      marginBottom: theme.spacing.xl,
    },
    sectionTitle: {
      fontSize: theme.fontSizes.lg,
      fontWeight: 'bold',
      color: theme.colors.text,
      marginBottom: theme.spacing.md,
    },
    settingItem: {
      backgroundColor: theme.colors.surface,
      borderRadius: theme.borderRadius.lg,
      padding: theme.spacing.md,
      marginBottom: theme.spacing.sm,
      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.1,
      shadowRadius: 3.84,
      elevation: 5,
    },
    settingRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    settingLabel: {
      fontSize: theme.fontSizes.md,
      color: theme.colors.text,
      flex: 1,
    },
    settingValue: {
      fontSize: theme.fontSizes.sm,
      color: theme.colors.textSecondary,
      marginRight: theme.spacing.sm,
    },
    optionButton: {
      paddingHorizontal: theme.spacing.md,
      paddingVertical: theme.spacing.sm,
      borderRadius: theme.borderRadius.md,
      backgroundColor: theme.colors.primary + '20',
      marginLeft: theme.spacing.sm,
    },
    optionButtonActive: {
      backgroundColor: theme.colors.primary,
    },
    optionButtonText: {
      fontSize: theme.fontSizes.sm,
      color: theme.colors.primary,
      fontWeight: 'bold',
    },
    optionButtonTextActive: {
      color: theme.colors.surface,
    },
    dangerButton: {
      backgroundColor: theme.colors.error,
      borderRadius: theme.borderRadius.md,
      padding: theme.spacing.md,
      alignItems: 'center',
      marginTop: theme.spacing.lg,
    },
    dangerButtonText: {
      color: theme.colors.surface,
      fontSize: theme.fontSizes.md,
      fontWeight: 'bold',
    },
    infoCard: {
      backgroundColor: theme.colors.primary + '20',
      borderRadius: theme.borderRadius.lg,
      padding: theme.spacing.md,
      marginBottom: theme.spacing.lg,
    },
    infoTitle: {
      fontSize: theme.fontSizes.lg,
      fontWeight: 'bold',
      color: theme.colors.primary,
      marginBottom: theme.spacing.sm,
    },
    infoText: {
      fontSize: theme.fontSizes.md,
      color: theme.colors.text,
      lineHeight: 20,
    },
    versionInfo: {
      textAlign: 'center',
      fontSize: theme.fontSizes.sm,
      color: theme.colors.textSecondary,
      marginTop: theme.spacing.xl,
    },
  });

  const handleLanguageChange = (language: string) => {
    i18n.changeLanguage(language);
  };

  const handleThemeChange = (mode: 'light' | 'dark' | 'system') => {
    setThemeMode(mode);
  };

  const handleClearData = () => {
    Alert.alert(
      'Verileri Temizle',
      'Tüm hesaplama geçmişini ve hasta bilgilerini silmek istediğinizden emin misiniz? Bu işlem geri alınamaz.',
      [
        { text: 'İptal', style: 'cancel' },
        {
          text: 'Sil',
          style: 'destructive',
          onPress: () => {
            clearCalculations();
            Alert.alert('Başarılı', 'Tüm veriler temizlendi.');
          },
        },
      ]
    );
  };

  const getCurrentLanguage = () => {
    return i18n.language === 'tr' ? 'Türkçe' : 'English';
  };

  const getCurrentTheme = () => {
    switch (themeMode) {
      case 'light':
        return 'Açık';
      case 'dark':
        return 'Koyu';
      case 'system':
        return 'Sistem';
      default:
        return 'Sistem';
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.content}>
        <View style={styles.infoCard}>
          <Text style={styles.infoTitle}>İlaç Doz Hesaplayıcı</Text>
          <Text style={styles.infoText}>
            Sağlık profesyonelleri için güvenli ve doğru ilaç doz hesaplama
            uygulaması. Hasta güvenliği için tüm hesaplamalar klinik
            standartlara uygun olarak yapılır.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Görünüm</Text>

          <View style={styles.settingItem}>
            <View style={styles.settingRow}>
              <Text style={styles.settingLabel}>Dil</Text>
              <Text style={styles.settingValue}>{getCurrentLanguage()}</Text>
              <TouchableOpacity
                style={[
                  styles.optionButton,
                  i18n.language === 'tr' && styles.optionButtonActive,
                ]}
                onPress={() => handleLanguageChange('tr')}
              >
                <Text
                  style={[
                    styles.optionButtonText,
                    i18n.language === 'tr' && styles.optionButtonTextActive,
                  ]}
                >
                  TR
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.optionButton,
                  i18n.language === 'en' && styles.optionButtonActive,
                ]}
                onPress={() => handleLanguageChange('en')}
              >
                <Text
                  style={[
                    styles.optionButtonText,
                    i18n.language === 'en' && styles.optionButtonTextActive,
                  ]}
                >
                  EN
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.settingItem}>
            <View style={styles.settingRow}>
              <Text style={styles.settingLabel}>Tema</Text>
              <Text style={styles.settingValue}>{getCurrentTheme()}</Text>
              <TouchableOpacity
                style={[
                  styles.optionButton,
                  themeMode === 'light' && styles.optionButtonActive,
                ]}
                onPress={() => handleThemeChange('light')}
              >
                <Text
                  style={[
                    styles.optionButtonText,
                    themeMode === 'light' && styles.optionButtonTextActive,
                  ]}
                >
                  Açık
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.optionButton,
                  themeMode === 'dark' && styles.optionButtonActive,
                ]}
                onPress={() => handleThemeChange('dark')}
              >
                <Text
                  style={[
                    styles.optionButtonText,
                    themeMode === 'dark' && styles.optionButtonTextActive,
                  ]}
                >
                  Koyu
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.optionButton,
                  themeMode === 'system' && styles.optionButtonActive,
                ]}
                onPress={() => handleThemeChange('system')}
              >
                <Text
                  style={[
                    styles.optionButtonText,
                    themeMode === 'system' && styles.optionButtonTextActive,
                  ]}
                >
                  Sistem
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Veri Yönetimi</Text>

          <View style={styles.settingItem}>
            <View style={styles.settingRow}>
              <Text style={styles.settingLabel}>Hesaplama Geçmişi</Text>
              <Text style={styles.settingValue}>Yerel olarak saklanır</Text>
            </View>
          </View>

          <TouchableOpacity
            style={styles.dangerButton}
            onPress={handleClearData}
          >
            <Text style={styles.dangerButtonText}>Tüm Verileri Temizle</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Hakkında</Text>

          <View style={styles.settingItem}>
            <View style={styles.settingRow}>
              <Text style={styles.settingLabel}>Sürüm</Text>
              <Text style={styles.settingValue}>1.0.0</Text>
            </View>
          </View>

          <View style={styles.settingItem}>
            <View style={styles.settingRow}>
              <Text style={styles.settingLabel}>Geliştirici</Text>
              <Text style={styles.settingValue}>Dosage Calculator Team</Text>
            </View>
          </View>
        </View>

        <Text style={styles.versionInfo}>
          Bu uygulama sağlık profesyonelleri için tasarlanmıştır.{'\n'}
          Tüm hesaplamalar klinik standartlara uygun olarak yapılır.{'\n'}
          Uygulama kullanımından önce yerel protokolleri kontrol edin.
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
};

export default SettingsScreen;
