import i18next from 'i18next'
import { initReactI18next } from '../../node_modules/react-i18next'
import LanguageDetector from 'i18next-browser-languagedetector/cjs'

import en from './locales/en.json'
import hi from './locales/hi.json'
import mr from './locales/mr.json'
import ta from './locales/ta.json'
import te from './locales/te.json'

i18next
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    // Synchronous init — resources are bundled, no async fetch needed
    resources: {
      en: { translation: en },
      hi: { translation: hi },
      mr: { translation: mr },
      ta: { translation: ta },
      te: { translation: te },
    },
    lng: undefined, // let LanguageDetector pick; falls back to 'en'
    fallbackLng: 'en',
    defaultNS: 'translation',
    ns: ['translation'],

    // LanguageDetector: read/write language preference from localStorage
    detection: {
      order: ['localStorage', 'navigator'],
      lookupLocalStorage: 'agro_lang',
      caches: ['localStorage'],
    },

    interpolation: {
      // React already escapes values; no need to double-escape
      escapeValue: false,
    },

    // Prevent i18next from splitting keys on '.' — keys are already flat
    // e.g. "nav.home" is one complete key, not a nested path
    keySeparator: false,
    nsSeparator: false,
  })

export default i18next
