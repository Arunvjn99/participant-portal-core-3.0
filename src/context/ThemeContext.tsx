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

type Mode = "light" | "dark" | "system";
type EffectiveMode = "light" | "dark";

interface ThemeContextValue {
  mode: Mode;
  effectiveMode: EffectiveMode;
  toggleTheme: () => void;
  setMode: (m: Mode) => void;
  companyTheme: CompanyTheme;
  currentColors: ThemeColors;
  setCompanyBranding: (companyName: string, dbJson?: unknown, logoUrl?: string | null) => void;
  theme: EffectiveMode;
  isBrandingLoading: boolean;
  setBrandingLoading: (loading: boolean) => void;
  /** In-memory override; takes precedence over companyTheme when set. */
  overrideTheme: CompanyTheme | null;
  /** Apply a temporary theme globally (preview). Memory-only, clears on refresh. */
  setTemporaryTheme: (theme: CompanyTheme) => void;
  /** Remove the temporary override, revert to companyTheme. */
  clearTemporaryTheme: () => void;
}

const ThemeContext = createContext<ThemeContextValue | null>(null);

function applyThemeClass(effective: EffectiveMode) {
  document.documentElement.classList.remove("light", "dark");
  document.documentElement.classList.add(effective);
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [mode, setModeState] = useState<Mode>(() => {
    const saved = localStorage.getItem("theme");
    if (saved === "dark" || saved === "light" || saved === "system") return saved;
    return "light";
  });

  const [systemDark, setSystemDark] = useState<boolean>(() =>
    typeof window !== "undefined"
      ? window.matchMedia("(prefers-color-scheme: dark)").matches
      : false,
  );

  useEffect(() => {
    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    const handle = () => setSystemDark(mq.matches);
    mq.addEventListener("change", handle);
    return () => mq.removeEventListener("change", handle);
  }, []);

  const effectiveMode: EffectiveMode = useMemo(
    () => (mode === "system" ? (systemDark ? "dark" : "light") : mode),
    [mode, systemDark],
  );

  const [companyTheme, setCompanyTheme] = useState<CompanyTheme>(fallbackTheme);
  const [isBrandingLoading, setBrandingLoading] = useState(true);
  const [overrideTheme, setOverrideTheme] = useState<CompanyTheme | null>(null);

  const activeTheme = overrideTheme ?? companyTheme;

  const currentColors = useMemo(
    () => (effectiveMode === "dark" ? activeTheme.dark : activeTheme.light),
    [effectiveMode, activeTheme],
  );

  useEffect(() => {
    applyThemeClass(effectiveMode);
  }, [effectiveMode]);

  useEffect(() => {
    applyThemeToDOM(currentColors);
  }, [currentColors]);

  useEffect(() => {
    return () => {
      clearThemeFromDOM();
    };
  }, []);

  const toggleTheme = useCallback(() => {
    setModeState((prev) => {
      if (prev === "system") return "light";
      return prev === "light" ? "dark" : "light";
    });
  }, []);

  const setMode = useCallback((m: Mode) => {
    setModeState(m);
    try {
      localStorage.setItem("theme", m);
    } catch (err) {
      if (import.meta.env.DEV) console.error("[ThemeContext] setItem theme failed:", err);
    }
  }, []);

  const setCompanyBranding = useCallback(
    (companyName: string, dbJson?: unknown, logoUrl?: string | null) => {
      const resolved = themeManager.getTheme(companyName, dbJson);
      const dbLogo = logoUrl?.trim() || "";
      const jsonLogo = resolved.light.logo?.trim() || "";
      const effectiveLogo =
        dbLogo ||
        jsonLogo ||
        themeManager.getTheme(companyName)?.light?.logo ||
        "";
      resolved.light = { ...resolved.light, logo: effectiveLogo };
      resolved.dark = { ...resolved.dark, logo: effectiveLogo };
      if (import.meta.env.DEV) {
        console.log("[logo-audit] effectiveLogo:", effectiveLogo);
      }
      setCompanyTheme({ ...resolved });
    },
    [],
  );

  const setTemporaryTheme = useCallback((theme: CompanyTheme) => {
    setOverrideTheme(theme);
  }, []);

  const clearTemporaryTheme = useCallback(() => {
    setOverrideTheme(null);
  }, []);

  const value = useMemo<ThemeContextValue>(
    () => ({
      mode,
      effectiveMode,
      toggleTheme,
      setMode,
      companyTheme,
      currentColors,
      setCompanyBranding,
      theme: effectiveMode,
      isBrandingLoading,
      setBrandingLoading,
      overrideTheme,
      setTemporaryTheme,
      clearTemporaryTheme,
    }),
    [
      mode, effectiveMode, toggleTheme, setMode, companyTheme,
      currentColors, setCompanyBranding, isBrandingLoading,
      overrideTheme, setTemporaryTheme, clearTemporaryTheme,
    ],
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
