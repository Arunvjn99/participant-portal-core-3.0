import { useRef, useEffect, useState, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { Globe } from "lucide-react";

const normalizeLanguage = (lng: string) => {
  if (lng.startsWith("es")) return "es";
  return "en";
};

export default function LanguageSwitcher() {
  const { i18n, t } = useTranslation();
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const currentLang = useMemo(
    () => normalizeLanguage(i18n.language ?? "en"),
    [i18n.language]
  );

  const handleChange = (lng: string) => {
    i18n.changeLanguage(lng);
    localStorage.setItem("app-language", lng);
    setOpen(false);
  };

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    if (open) document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [open]);

  return (
    <div className="relative" ref={containerRef}>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        aria-haspopup="true"
        aria-label="Change language"
        className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-slate-200 bg-white text-sm font-medium shadow-sm hover:border-slate-300 transition dark:border-slate-600 dark:bg-slate-800 dark:hover:border-slate-500 dark:text-slate-200"
      >
        <Globe size={16} className="text-slate-500 dark:text-slate-400" />
        {currentLang === "en" ? "EN" : "ES"}
      </button>

      {open && (
        <div
          className="absolute right-0 mt-2 w-36 rounded-lg bg-white shadow-lg border border-slate-200 z-50 dark:bg-slate-800 dark:border-slate-600"
          role="menu"
        >
          <button
            type="button"
            onClick={() => handleChange("en")}
            role="menuitem"
            className={`w-full text-left px-3 py-2 text-sm hover:bg-slate-50 dark:hover:bg-slate-700 dark:text-slate-200 ${currentLang === "en" ? "font-medium text-[#0b5fff] dark:text-blue-400" : ""}`}
          >
            {t("common.english")}
          </button>
          <button
            type="button"
            onClick={() => handleChange("es")}
            role="menuitem"
            className={`w-full text-left px-3 py-2 text-sm hover:bg-slate-50 dark:hover:bg-slate-700 dark:text-slate-200 ${currentLang === "es" ? "font-medium text-[#0b5fff] dark:text-blue-400" : ""}`}
          >
            {t("common.spanish")}
          </button>
        </div>
      )}
    </div>
  );
}
