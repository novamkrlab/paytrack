import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import * as Localization from 'expo-localization';
import AsyncStorage from '@react-native-async-storage/async-storage';

import tr from './tr.json';
import en from './en.json';

const LANGUAGE_KEY = '@language';

// Cihaz dilini al
const getDeviceLanguage = () => {
  const deviceLocale = Localization.getLocales()[0];
  const languageCode = deviceLocale?.languageCode || 'tr';
  
  // Sadece desteklenen dilleri döndür
  return languageCode === 'en' ? 'en' : 'tr';
};

// Kaydedilmiş dili al
const getSavedLanguage = async () => {
  try {
    // Web ortamında localStorage kullan, native'de AsyncStorage
    if (typeof window !== 'undefined' && window.localStorage) {
      const savedLanguage = window.localStorage.getItem(LANGUAGE_KEY);
      return savedLanguage || getDeviceLanguage();
    }
    const savedLanguage = await AsyncStorage.getItem(LANGUAGE_KEY);
    return savedLanguage || getDeviceLanguage();
  } catch (error) {
    console.error('Error loading saved language:', error);
    return getDeviceLanguage();
  }
};

// Dili kaydet
export const saveLanguage = async (language: string) => {
  try {
    // Web ortamında localStorage kullan, native'de AsyncStorage
    if (typeof window !== 'undefined' && window.localStorage) {
      window.localStorage.setItem(LANGUAGE_KEY, language);
    } else {
      await AsyncStorage.setItem(LANGUAGE_KEY, language);
    }
  } catch (error) {
    console.error('Error saving language:', error);
  }
};

// i18n yapılandırması
const initI18n = async () => {
  const savedLanguage = await getSavedLanguage();

  i18n
    .use(initReactI18next)
    .init({
      resources: {
        tr: { translation: tr },
        en: { translation: en },
      },
      lng: savedLanguage,
      fallbackLng: 'tr',
      interpolation: {
        escapeValue: false,
      },
      react: {
        useSuspense: false,
      },
    });
};

initI18n();

export default i18n;
