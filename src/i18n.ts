import i18n from "i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import { initReactI18next } from "react-i18next";
import enCommon from "./locales/en/common.json";
import esCommon from "./locales/es/common.json";

const resources = {
  en: {
    translation: enCommon as Record<string, unknown>,
  },
  es: {
    translation: esCommon as Record<string, unknown>,
  },
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: "en",
    supportedLngs: ["en", "es"],
    detection: {
      order: ["localStorage", "navigator"],
      caches: ["localStorage"],
      lookupLocalStorage: "app-language",
    },
    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;
