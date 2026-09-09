import React, { useEffect, useState } from 'react';
import {
  Modal,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../contexts/ThemeContext';

const DISCLAIMER_ACCEPTED_KEY = '@medical_disclaimer_accepted';

export const MedicalDisclaimerModal: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);
  const { t } = useTranslation();
  const { theme } = useTheme();

  useEffect(() => {
    const checkDisclaimer = async () => {
      try {
        const accepted = await AsyncStorage.getItem(DISCLAIMER_ACCEPTED_KEY);
        if (accepted !== 'true') {
          setIsVisible(true);
        }
      } catch (error) {
        console.error('Failed to read disclaimer status', error);
      }
    };
    checkDisclaimer();
  }, []);

  const handleAccept = async () => {
    try {
      await AsyncStorage.setItem(DISCLAIMER_ACCEPTED_KEY, 'true');
      setIsVisible(false);
    } catch (error) {
      console.error('Failed to save disclaimer status', error);
    }
  };

  if (!isVisible) return null;

  return (
    <Modal
      visible={isVisible}
      animationType="slide"
      transparent={true}
      onRequestClose={() => {
        // Enforce reading the disclaimer
      }}
    >
      <View style={styles.overlay}>
        <SafeAreaView style={styles.safeArea}>
          <View
            style={[
              styles.modalContainer,
              { backgroundColor: theme.colors.surface },
            ]}
          >
            <View
              style={[styles.header, { backgroundColor: theme.colors.primary }]}
            >
              <Text style={styles.headerIcon}>⚕️</Text>
              <Text style={styles.title}>
                {t('disclaimer.title', 'Önemli Uyarı')}
              </Text>
              <Text style={styles.subtitle}>
                {t(
                  'disclaimer.professionalOnly',
                  'Yalnızca Sağlık Profesyonelleri İçin'
                )}
              </Text>
            </View>

            <ScrollView
              style={styles.content}
              showsVerticalScrollIndicator={false}
            >
              <View
                style={[
                  styles.warningBox,
                  { backgroundColor: '#FEF3C7', borderColor: '#F59E0B' },
                ]}
              >
                <Text style={styles.warningText}>
                  {t(
                    'disclaimer.text1',
                    'Bu uygulama yalnızca eğitim ve yardımcı araç amaçlıdır. Tıbbi tavsiye niteliği taşımaz.'
                  )}
                </Text>
              </View>

              <View
                style={[
                  styles.warningBox,
                  { backgroundColor: '#FEE2E2', borderColor: '#EF4444' },
                ]}
              >
                <Text style={styles.warningText}>
                  {t(
                    'disclaimer.text2',
                    'Tüm doz hesaplamaları yetkili hekim tarafından onaylanmalıdır.'
                  )}
                </Text>
              </View>

              <View
                style={[
                  styles.warningBox,
                  {
                    backgroundColor: theme.colors.info + '15',
                    borderColor: theme.colors.info,
                  },
                ]}
              >
                <Text style={styles.warningText}>
                  {t(
                    'disclaimer.text3',
                    'Klinik kararların sorumluluğu tamamen uygulayıcı sağlık profesyoneline aittir.'
                  )}
                </Text>
              </View>

              <Text
                style={[
                  styles.termsText,
                  { color: theme.colors.textSecondary },
                ]}
              >
                {t('disclaimer.terms')}
              </Text>
            </ScrollView>

            <View
              style={[styles.footer, { borderTopColor: theme.colors.border }]}
            >
              <TouchableOpacity
                testID="disclaimer-accept"
                style={[
                  styles.acceptButton,
                  { backgroundColor: theme.colors.primary },
                ]}
                onPress={handleAccept}
                activeOpacity={0.85}
              >
                <Text style={styles.acceptButtonText}>
                  {t('disclaimer.accept', 'Anladım, Devam Et')}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </SafeAreaView>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.65)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  safeArea: {
    flex: 1,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContainer: {
    width: '100%',
    maxWidth: 500,
    borderRadius: 24,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.25,
    shadowRadius: 20,
    elevation: 24,
  },
  header: {
    padding: 24,
    alignItems: 'center',
  },
  headerIcon: {
    fontSize: 48,
    marginBottom: 8,
  },
  title: {
    fontSize: 24,
    fontWeight: '900',
    color: '#FFFFFF',
    marginBottom: 4,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 14,
    fontWeight: '700',
    color: 'rgba(255, 255, 255, 0.9)',
    textTransform: 'uppercase',
    letterSpacing: 1,
    textAlign: 'center',
  },
  content: {
    padding: 24,
    maxHeight: 400,
  },
  warningBox: {
    padding: 16,
    borderRadius: 12,
    borderWidth: 1.5,
    marginBottom: 12,
  },
  warningText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1F2937',
    lineHeight: 20,
  },
  termsText: {
    fontSize: 12,
    marginTop: 8,
    textAlign: 'center',
    lineHeight: 18,
    fontStyle: 'italic',
  },
  footer: {
    padding: 20,
    borderTopWidth: 1,
  },
  acceptButton: {
    borderRadius: 16,
    paddingVertical: 18,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 6,
  },
  acceptButtonText: {
    fontSize: 16,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: 0.5,
  },
});
