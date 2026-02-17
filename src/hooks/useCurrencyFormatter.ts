import { useMemo } from "react";
import { useTranslation } from "react-i18next";

/**
 * Returns a currency formatter that uses the current i18n language and USD.
 * Use for all user-visible currency amounts (no hardcoded "$").
 */
export function useCurrencyFormatter(
  options: Intl.NumberFormatOptions = {}
): (amount: number) => string {
  const { i18n } = useTranslation();
  const locale = i18n.language === "es" ? "es" : "en-US";
  return useMemo(
    () =>
      (amount: number) =>
        new Intl.NumberFormat(locale, {
          style: "currency",
          currency: "USD",
          minimumFractionDigits: 0,
          maximumFractionDigits: 2,
          ...options,
        }).format(amount),
    [locale]
  );
}
