import type { TFunction } from "i18next";

/**
 * Returns fallback when i18n has no translation (t returns the key) or empty string.
 */
export function safeT(
  t: TFunction,
  key: string,
  fallback: string,
  options?: Record<string, string | number>,
): string {
  const val =
    options !== undefined ? String(t(key, options as never)) : String(t(key));
  if (val === key || val === "") return fallback;
  return val;
}
