import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import LanguageDetector from 'i18next-browser-languagedetector'

import enCommon from './locales/en/common.json'
import enDashboard from './locales/en/dashboard.json'
import enEnrollment from './locales/en/enrollment.json'
import enTransactions from './locales/en/transactions.json'
import esCommon from './locales/es/common.json'
import esDashboard from './locales/es/dashboard.json'
import esEnrollment from './locales/es/enrollment.json'
import esTransactions from './locales/es/transactions.json'

const STORAGE_KEY = 'i18nextLng'

const resources = {
  en: {
    common: enCommon as Record<string, unknown>,
    dashboard: enDashboard as Record<string, unknown>,
    enrollment: enEnrollment as Record<string, unknown>,
    transactions: enTransactions as Record<string, unknown>,
  },
  es: {
    common: esCommon as Record<string, unknown>,
    dashboard: esDashboard as Record<string, unknown>,
    enrollment: esEnrollment as Record<string, unknown>,
    transactions: esTransactions as Record<string, unknown>,
  },
}

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'en',
    supportedLngs: ['en', 'es'],
    defaultNS: 'common',
    ns: ['common', 'dashboard', 'enrollment', 'transactions'],
    interpolation: {
      escapeValue: false,
    },
    detection: {
      order: ['localStorage', 'navigator'],
      lookupLocalStorage: STORAGE_KEY,
      caches: ['localStorage'],
    },
  })

// Persist language on change so all tabs and reloads stay in sync
i18n.on('languageChanged', (lng) => {
  try {
    localStorage.setItem(STORAGE_KEY, lng)
  } catch {
    // ignore
  }
})

export default i18n
