import defaultThemeMap, { fallbackTheme } from "./defaultThemes";
import { generateDarkTheme } from "./utils";
import type { CompanyTheme, ThemeColors } from "./utils";

/**
 * ThemeManager – data-driven, scalable theme resolution.
 *
 * Resolution order:
 *   1. Theme JSON from DB (company.branding_json column, jsonb)
 *   2. Hardcoded map in defaultThemes.ts  (Phase 1)
 *   3. Fallback generic theme
 *
 * No switch-statements or company name conditionals.
 */

export const themeManager = {
  /**
   * Resolve a full CompanyTheme for a company.
   * Accepts the company name (matched case-insensitively) and an optional
   * theme from the database (jsonb column returns a parsed object; text
   * column returns a string — both are handled).
   */
  getTheme(companyName: string, dbJson?: unknown): CompanyTheme {
    if (dbJson != null) {
      const parsed = themeManager.parseThemeJSON(dbJson);
      if (parsed) return parsed;
    }

    const key = companyName.trim().toLowerCase();
    return defaultThemeMap[key] ?? fallbackTheme;
  },

  /**
   * Parse a theme value into a CompanyTheme.
   * Accepts either a pre-parsed object (from jsonb) or a raw JSON string.
   * Auto-generates dark theme if only light is provided.
   * Returns null if parsing/validation fails.
   */
  parseThemeJSON(raw: unknown): CompanyTheme | null {
    try {
      const obj: Record<string, unknown> =
        typeof raw === "string" ? JSON.parse(raw) : (raw as Record<string, unknown>);

      if (!obj?.light || typeof obj.light !== "object") return null;

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
        obj.dark && typeof obj.dark === "object" && Object.keys(obj.dark).length > 2
          ? { ...generateDarkTheme(light), ...(obj.dark as ThemeColors) }
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
