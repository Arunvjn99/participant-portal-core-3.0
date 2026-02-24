import { useCallback } from "react";
import { useTranslation } from "react-i18next";

/**
 * Provides locale-aware formatters for currency, percent, number, and date.
 * Respects the current i18n language setting.
 */
export function useLocaleFormat() {
  const { i18n } = useTranslation();
  const locale = i18n.language || "en";

  const currency = useCallback(
    (value: number, compact = false) =>
      new Intl.NumberFormat(locale, {
        style: "currency",
        currency: "USD",
        minimumFractionDigits: compact ? 0 : 2,
        maximumFractionDigits: compact ? 0 : 2,
        notation: compact ? "compact" : "standard",
      }).format(value),
    [locale],
  );

  const percent = useCallback(
    (value: number, decimals = 1) =>
      new Intl.NumberFormat(locale, {
        style: "percent",
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals,
      }).format(value / 100),
    [locale],
  );

  const number = useCallback(
    (value: number, decimals = 0) =>
      new Intl.NumberFormat(locale, {
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals,
      }).format(value),
    [locale],
  );

  const date = useCallback(
    (value: string | Date) =>
      new Intl.DateTimeFormat(locale, {
        year: "numeric",
        month: "short",
        day: "numeric",
      }).format(typeof value === "string" ? new Date(value) : value),
    [locale],
  );

  return { currency, percent, number, date };
}
