import LanguageDetector from 'i18next-browser-languagedetector';
import { initReactI18next } from 'react-i18next';
import i18n from 'i18next';

import commonES from './es/common.json';
import commonEN from './en/common.json';
import menuES from './es/menu.json';
import menuEN from './en/menu.json';
import homeES from './es/home.json';
import homeEN from './en/home.json';
import diagnosisES from './es/diagnosis.json';
import diagnosisEN from './en/diagnosis.json';
import modelInfoES from './es/modelInfo.json';
import modelInfoEN from './en/modelInfo.json';
import explainabilityES from './es/explainability.json';
import explainabilityEN from './en/explainability.json';
import diseasesES from './es/diseases.json';
import diseasesEN from './en/diseases.json';
import notFoundES from './es/notFound.json';
import notFoundEN from './en/notFound.json';

export const NAMESPACES = [
  'common',
  'menu',
  'home',
  'diagnosis',
  'modelInfo',
  'explainability',
  'diseases',
  'notFound',
] as const;

i18n
  .use(initReactI18next)
  .use(LanguageDetector)
  .init({
    resources: {
      es: {
        common: commonES,
        menu: menuES,
        home: homeES,
        diagnosis: diagnosisES,
        modelInfo: modelInfoES,
        explainability: explainabilityES,
        diseases: diseasesES,
        notFound: notFoundES,
      },
      en: {
        common: commonEN,
        menu: menuEN,
        home: homeEN,
        diagnosis: diagnosisEN,
        modelInfo: modelInfoEN,
        explainability: explainabilityEN,
        diseases: diseasesEN,
        notFound: notFoundEN,
      },
    },
    lng: localStorage.getItem('i18nextLng') || 'es',
    fallbackLng: 'es',
    ns: [...NAMESPACES],
    defaultNS: 'common',
    interpolation: { escapeValue: false },
    react: { useSuspense: false },
    detection: {
      order: ['localStorage', 'navigator'],
      caches: ['localStorage'],
    },
  });

export const changeLanguage = async (lang: string) => {
  try {
    await i18n.changeLanguage(lang);
    localStorage.setItem('i18nextLng', lang);
    document.documentElement.lang = lang.startsWith('en') ? 'en' : 'es';
    return true;
  } catch {
    return false;
  }
};

export default i18n;
