import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import commonEn from "../locales/en/common.json";
import commonEs from "../locales/es/common.json";
import enrollmentEn from "../locales/en/enrollment.json";
import dashboardEn from "./en.json";
import dashboardEs from "./es.json";

type JsonRecord = Record<string, unknown>;

function unwrapJson<T>(mod: T | { default: T }): T {
  if (mod && typeof mod === "object" && "default" in (mod as object)) {
    return (mod as { default: T }).default;
  }
  return mod as T;
}

/** Merge enrollment into translation.enrollment. When preferExistingLocale is true, existing locale wins over enrollment file (e.g. Spanish). */
function mergeEnrollmentIntoTranslation(
  common: JsonRecord,
  enrollment: JsonRecord,
  preferExistingLocale = false,
): JsonRecord {
  const merged = { ...common };
  const existing = (merged.enrollment as JsonRecord) || {};
  merged.enrollment = preferExistingLocale
    ? { ...enrollment, ...existing }
    : { ...existing, ...enrollment };
  return merged;
}

/** Merge dashboard strings from src/i18n locale JSON over common.json dashboard keys. */
function mergeDashboardPatch(common: JsonRecord, patch: JsonRecord): JsonRecord {
  const baseDash = (common.dashboard as JsonRecord) || {};
  const patchDash = (patch.dashboard as JsonRecord) || {};
  return { ...common, dashboard: { ...baseDash, ...patchDash } };
}

const enBase = unwrapJson(commonEn) as JsonRecord;
const esBase = unwrapJson(commonEs) as JsonRecord;
const enrollment = unwrapJson(enrollmentEn) as JsonRecord;
const patchEn = unwrapJson(dashboardEn) as JsonRecord;
const patchEs = unwrapJson(dashboardEs) as JsonRecord;

const enWithEnrollment = mergeEnrollmentIntoTranslation(enBase, enrollment);
const esWithEnrollment = mergeEnrollmentIntoTranslation(esBase, enrollment, true);

const enFinal = mergeDashboardPatch(enWithEnrollment, patchEn);
const esFinal = mergeDashboardPatch(esWithEnrollment, patchEs);

const resources = {
  en: { translation: enFinal },
  es: { translation: esFinal },
};

const supportedLngs = ["en", "es"];

function normalizeLng(lng: string | null): string {
  if (!lng) return "en";
  const base = lng.split("-")[0].toLowerCase();
  return supportedLngs.includes(base) ? base : "en";
}

function syncHtmlLang(lng: string) {
  if (typeof document !== "undefined") {
    document.documentElement.lang = normalizeLng(lng);
  }
}

const initialLng = normalizeLng(
  typeof localStorage !== "undefined" ? localStorage.getItem("i18nextLng") : null,
);

i18n.use(initReactI18next).init({
  resources,
  lng: initialLng,
  fallbackLng: "en",
  supportedLngs,
  defaultNS: "translation",
  load: "currentOnly",
  interpolation: {
    escapeValue: false,
  },
  returnNull: false,
  react: {
    useSuspense: false,
    bindI18n: "languageChanged loaded",
    bindI18nStore: "added removed",
  },
});

syncHtmlLang(i18n.language);

i18n.on("languageChanged", (lng: string) => {
  if (typeof localStorage !== "undefined") {
    localStorage.setItem("i18nextLng", normalizeLng(lng));
  }
  syncHtmlLang(lng);
});

export default i18n;
