/**
 * Shared locale configuration for i18n.
 * Used by LanguageSwitcher and Settings hub to avoid duplication.
 */

export const SUPPORTED_LANGS = [
  { code: "en", labelKey: "common.english" },
  { code: "es", labelKey: "common.spanish" },
  { code: "fr", labelKey: "common.french" },
  { code: "ta", labelKey: "common.tamil" },
  { code: "zh", labelKey: "common.chinese" },
  { code: "ja", labelKey: "common.japanese" },
  { code: "de", labelKey: "common.german" },
  { code: "hi", labelKey: "common.hindi" },
] as const;

export function normalizeLanguage(lng: string): string {
  const code = lng.split("-")[0].toLowerCase();
  if (SUPPORTED_LANGS.some((x) => x.code === code)) return code;
  return "en";
}
