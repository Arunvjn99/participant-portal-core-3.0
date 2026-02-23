import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  useMemo,
  type ReactNode,
} from "react";
import { themeManager } from "../theme/themeManager";
import { applyThemeToDOM, clearThemeFromDOM } from "../theme/utils";
import type { CompanyTheme, ThemeColors } from "../theme/utils";
import { fallbackTheme } from "../theme/defaultThemes";

type Mode = "light" | "dark";

interface ThemeContextValue {
  mode: Mode;
  toggleTheme: () => void;
  setMode: (m: Mode) => void;
  companyTheme: CompanyTheme;
  currentColors: ThemeColors;
  setCompanyBranding: (companyName: string, dbJson?: unknown, logoUrl?: string | null) => void;
  /** Backwards-compatible alias */
  theme: Mode;
}

const ThemeContext = createContext<ThemeContextValue | null>(null);

function applyMode(mode: Mode) {
  document.documentElement.classList.remove("light", "dark");
  document.documentElement.classList.add(mode);
  localStorage.setItem("theme", mode);
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [mode, setModeState] = useState<Mode>(() => {
    const saved = localStorage.getItem("theme");
    return saved === "dark" ? "dark" : "light";
  });

  const [companyTheme, setCompanyTheme] = useState<CompanyTheme>(fallbackTheme);

  const currentColors = useMemo(
    () => (mode === "dark" ? companyTheme.dark : companyTheme.light),
    [mode, companyTheme],
  );

  useEffect(() => {
    applyMode(mode);
  }, [mode]);

  useEffect(() => {
    applyThemeToDOM(currentColors);
  }, [currentColors]);

  useEffect(() => {
    return () => {
      clearThemeFromDOM();
    };
  }, []);

  const toggleTheme = useCallback(() => {
    setModeState((prev) => (prev === "light" ? "dark" : "light"));
  }, []);

  const setMode = useCallback((m: Mode) => {
    setModeState(m);
  }, []);

  const setCompanyBranding = useCallback(
    (companyName: string, dbJson?: unknown, logoUrl?: string | null) => {
      const resolved = themeManager.getTheme(companyName, dbJson);
      const dbLogo = logoUrl?.trim() || "";
      const jsonLogo = resolved.light.logo?.trim() || "";
      const effectiveLogo = dbLogo || jsonLogo;
      resolved.light = { ...resolved.light, logo: effectiveLogo };
      resolved.dark = { ...resolved.dark, logo: effectiveLogo };
      setCompanyTheme({ ...resolved });
    },
    [],
  );

  const value = useMemo<ThemeContextValue>(
    () => ({
      mode,
      toggleTheme,
      setMode,
      companyTheme,
      currentColors,
      setCompanyBranding,
      theme: mode,
    }),
    [mode, toggleTheme, setMode, companyTheme, currentColors, setCompanyBranding],
  );

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
}

export function useTheme(): ThemeContextValue {
  const ctx = useContext(ThemeContext);
  if (!ctx) {
    throw new Error("useTheme must be used within ThemeProvider");
  }
  return ctx;
}
