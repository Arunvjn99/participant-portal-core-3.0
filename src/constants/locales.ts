/**
 * Shared locale configuration for i18n.
 * Used by LanguageSwitcher and Settings hub to avoid duplication.
 */

/** Restricted to English and Spanish for production SaaS. */
export const SUPPORTED_LANGS = [
  { code: "en", labelKey: "common.english" },
  { code: "es", labelKey: "common.spanish" },
] as const;

export function normalizeLanguage(lng: string): string {
  const code = lng.split("-")[0].toLowerCase();
  if (SUPPORTED_LANGS.some((x) => x.code === code)) return code;
  return "en";
}
