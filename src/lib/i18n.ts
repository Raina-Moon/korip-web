
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    fallbackLng: 'en',
    debug: true,
    interpolation: {
      escapeValue: false, // not needed for react as it escapes by default
    },
    resources: {
      en: {
        translation: {
          // English translations will go here
          welcome: 'Welcome to Korip!',
          greeting: 'Hello, {{name}}!',
        },
      },
      ko: {
        translation: {
          // Korean translations will go here
          welcome: '코립에 오신 것을 환영합니다!',
          greeting: '안녕하세요, {{name}}님!',
        },
      },
    },
  });

export default i18n;
