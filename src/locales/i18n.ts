import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import { Platform, NativeModules } from 'react-native';

// Import translation files
import en from './en.json';
import tr from './tr.json';

const resources = {
  en: {
    translation: en,
  },
  tr: {
    translation: tr,
  },
};

// Get device language - simplified version
const getDeviceLanguage = (): string => {
  // For now, default to English to avoid native module issues
  // In production, you can implement proper language detection
  return 'en';
};

i18n.use(initReactI18next).init({
  resources,
  lng: getDeviceLanguage(),
  fallbackLng: 'en',

  interpolation: {
    escapeValue: false, // React already does escaping
  },

  react: {
    useSuspense: false, // Disable suspense for React Native
  },
});

export default i18n;
