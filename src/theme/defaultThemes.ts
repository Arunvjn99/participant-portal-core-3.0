import type { CompanyTheme, ThemeColors } from "./utils";
import { generateDarkTheme } from "./utils";

/**
 * Phase 1: Hardcoded company branding.
 * Keyed by company name (normalized lowercase) for flexible lookup.
 * Will move to DB in Phase 2.
 */

const congruentLight: ThemeColors = {
  primary: "#0052CC",
  secondary: "#E6F0FF",
  accent: "#00C853",
  background: "#FFFFFF",
  surface: "#F8FAFC",
  textPrimary: "#111827",
  textSecondary: "#6B7280",
  border: "#E5E7EB",
  success: "#16A34A",
  warning: "#F59E0B",
  danger: "#DC2626",
  font: "Inter",
  logo: "/image/ascend-logo.png",
};

const lincolnLight: ThemeColors = {
  primary: "#00594C",
  secondary: "#E0F2EF",
  accent: "#00897B",
  background: "#FFFFFF",
  surface: "#F7FAF9",
  textPrimary: "#1A1A1A",
  textSecondary: "#5F6368",
  border: "#D6E4E1",
  success: "#2E7D32",
  warning: "#EF6C00",
  danger: "#C62828",
  font: "Georgia",
  logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/55/Lincoln_National_Corporation_logo.svg/512px-Lincoln_National_Corporation_logo.svg.png",
};

const johnHancockLight: ThemeColors = {
  primary: "#002B5C",
  secondary: "#E8EFF7",
  accent: "#C8102E",
  background: "#FFFFFF",
  surface: "#F5F7FA",
  textPrimary: "#1B2A4A",
  textSecondary: "#5C6B7A",
  border: "#D1D9E0",
  success: "#2E7D32",
  warning: "#F9A825",
  danger: "#B71C1C",
  font: "Inter",
  logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/8a/John_Hancock_Insurance_logo.svg/512px-John_Hancock_Insurance_logo.svg.png",
};

const transamericaLight: ThemeColors = {
  primary: "#E31837",
  secondary: "#FDE8EB",
  accent: "#0072CE",
  background: "#FFFFFF",
  surface: "#FBF7F7",
  textPrimary: "#1A1A1A",
  textSecondary: "#6B6B6B",
  border: "#E0D6D6",
  success: "#388E3C",
  warning: "#F57C00",
  danger: "#C62828",
  font: "Inter",
  logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/0b/Transamerica_logo.svg/512px-Transamerica_logo.svg.png",
};

const defaultThemeMap: Record<string, CompanyTheme> = {
  "congruent solutions": {
    light: congruentLight,
    dark: generateDarkTheme(congruentLight),
  },
  "lincoln group": {
    light: lincolnLight,
    dark: generateDarkTheme(lincolnLight),
  },
  "john hancock": {
    light: johnHancockLight,
    dark: generateDarkTheme(johnHancockLight),
  },
  transamerica: {
    light: transamericaLight,
    dark: generateDarkTheme(transamericaLight),
  },
};

/** Fallback theme when no company match is found */
export const fallbackTheme: CompanyTheme = defaultThemeMap["congruent solutions"];

export default defaultThemeMap;
