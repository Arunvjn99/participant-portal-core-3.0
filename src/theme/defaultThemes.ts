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
  logo: "/logos/congruent-solutions.png",
};

const lincolnLight: ThemeColors = {
  primary: "#6B1D4A",
  secondary: "#F5EDF1",
  accent: "#E87722",
  background: "#FFFFFF",
  surface: "#FAF7F9",
  textPrimary: "#1A1A1A",
  textSecondary: "#5F6368",
  border: "#E0D6DB",
  success: "#2E7D32",
  warning: "#EF6C00",
  danger: "#C62828",
  font: "Georgia",
  logo: "/logos/lincoln-financial.png",
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
  logo: "/logos/john-hancock.png",
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
  logo: "/logos/transamerica.png",
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
