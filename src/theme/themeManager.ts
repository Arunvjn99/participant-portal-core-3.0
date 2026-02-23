import defaultThemeMap, { fallbackTheme } from "./defaultThemes";
import { generateDarkTheme } from "./utils";
import type { CompanyTheme, ThemeColors } from "./utils";

/**
 * ThemeManager – data-driven, scalable theme resolution.
 *
 * Resolution order:
 *   1. Theme JSON from DB (company.style_config column)
 *   2. Hardcoded map in defaultThemes.ts  (Phase 1)
 *   3. Fallback generic theme
 *
 * No switch-statements or company name conditionals.
 */

export const themeManager = {
  /**
   * Resolve a full CompanyTheme for a company.
   * Accepts the company name (matched case-insensitively) and an optional
   * raw JSON string from the database.
   */
  getTheme(companyName: string, dbJson?: string | null): CompanyTheme {
    if (dbJson) {
      const parsed = themeManager.parseThemeJSON(dbJson);
      if (parsed) return parsed;
    }

    const key = companyName.trim().toLowerCase();
    return defaultThemeMap[key] ?? fallbackTheme;
  },

  /**
   * Parse a raw JSON string into a CompanyTheme.
   * Auto-generates dark theme if only light is provided.
   * Returns null if parsing fails.
   */
  parseThemeJSON(raw: string): CompanyTheme | null {
    try {
      const obj = JSON.parse(raw);
      if (!obj?.light) return null;

      const light = obj.light as ThemeColors;
      const requiredKeys: (keyof ThemeColors)[] = [
        "primary",
        "secondary",
        "accent",
        "background",
        "surface",
        "textPrimary",
        "textSecondary",
        "border",
        "success",
        "warning",
        "danger",
      ];

      for (const k of requiredKeys) {
        if (!light[k]) return null;
      }

      light.font = light.font || "Inter";
      light.logo = light.logo || "";

      const dark: ThemeColors =
        obj.dark && Object.keys(obj.dark).length > 2
          ? { ...generateDarkTheme(light), ...obj.dark }
          : generateDarkTheme(light);

      return { light, dark };
    } catch {
      return null;
    }
  },

  /** Returns all available hardcoded company keys (for testing/admin). */
  listCompanies(): string[] {
    return Object.keys(defaultThemeMap);
  },
};
