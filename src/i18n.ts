import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import en from "./locales/en/common.json";
import es from "./locales/es/common.json";
import fr from "./locales/fr/common.json";
import ta from "./locales/ta/common.json";
import zh from "./locales/zh/common.json";
import ja from "./locales/ja/common.json";
import de from "./locales/de/common.json";
import hi from "./locales/hi/common.json";

const resources = {
  en: { translation: en as Record<string, unknown> },
  es: { translation: es as Record<string, unknown> },
  fr: { translation: fr as Record<string, unknown> },
  ta: { translation: ta as Record<string, unknown> },
  zh: { translation: zh as Record<string, unknown> },
  ja: { translation: ja as Record<string, unknown> },
  de: { translation: de as Record<string, unknown> },
  hi: { translation: hi as Record<string, unknown> },
};

const supportedLngs = ["en", "es", "fr", "ta", "zh", "ja", "de", "hi"];

function normalizeLng(lng: string | null): string {
  if (!lng) return "en";
  const base = lng.split("-")[0].toLowerCase();
  return supportedLngs.includes(base) ? base : "en";
}

const initialLng = normalizeLng(localStorage.getItem("i18nextLng"));

i18n.use(initReactI18next).init({
  resources,
  lng: initialLng,
  fallbackLng: "en",
  supportedLngs,
  load: "currentOnly",
  interpolation: {
    escapeValue: false,
  },
  react: {
    useSuspense: false,
    bindI18n: "languageChanged loaded",
    bindI18nStore: "added removed",
  },
});

i18n.on("languageChanged", (lng: string) => {
  localStorage.setItem("i18nextLng", normalizeLng(lng));
});

export default i18n;
