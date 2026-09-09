import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Import translation files
import en from './en.json';
import tr from './tr.json';
import de from './de.json';
import ru from './ru.json';
import zh from './zh.json';

export const SUPPORTED_LANGUAGES = [
  { code: 'tr', name: 'Türkçe', flag: '🇹🇷', nativeName: 'Türkçe' },
  { code: 'en', name: 'English', flag: '🇬🇧', nativeName: 'English' },
  { code: 'de', name: 'Deutsch', flag: '🇩🇪', nativeName: 'Deutsch' },
  { code: 'ru', name: 'Русский', flag: '🇷🇺', nativeName: 'Русский' },
  { code: 'zh', name: '中文', flag: '🇨🇳', nativeName: '简体中文' },
];

const LANGUAGE_STORAGE_KEY = '@app_language';

const resources = {
  en: { translation: en },
  tr: { translation: tr },
  de: { translation: de },
  ru: { translation: ru },
  zh: { translation: zh },
};

// Initialize with default
i18n.use(initReactI18next).init({
  resources,
  lng: 'tr', // default language
  fallbackLng: 'en',
  interpolation: {
    escapeValue: false,
  },
  react: {
    useSuspense: false,
  },
});

// Load saved language
export const loadSavedLanguage = async (): Promise<void> => {
  try {
    const savedLang = await AsyncStorage.getItem(LANGUAGE_STORAGE_KEY);
    if (savedLang && resources[savedLang as keyof typeof resources]) {
      await i18n.changeLanguage(savedLang);
    }
  } catch (error) {
    console.warn('Failed to load saved language:', error);
  }
};

export const changeLanguage = async (lang: string): Promise<void> => {
  try {
    await i18n.changeLanguage(lang);
    await AsyncStorage.setItem(LANGUAGE_STORAGE_KEY, lang);
  } catch (error) {
    console.warn('Failed to change language:', error);
  }
};

export default i18n;
