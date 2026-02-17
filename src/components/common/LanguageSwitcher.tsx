import { useRef, useEffect, useState, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { Globe } from "lucide-react";

const SUPPORTED_LANGS = [
  { code: "en", labelKey: "common.english" },
  { code: "es", labelKey: "common.spanish" },
  { code: "fr", labelKey: "common.french" },
  { code: "ta", labelKey: "common.tamil" },
  { code: "zh", labelKey: "common.chinese" },
  { code: "ja", labelKey: "common.japanese" },
  { code: "de", labelKey: "common.german" },
  { code: "hi", labelKey: "common.hindi" },
] as const;

const normalizeLanguage = (lng: string): string => {
  const code = lng.split("-")[0].toLowerCase();
  if (SUPPORTED_LANGS.some((x) => x.code === code)) return code;
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

  const displayLabel = SUPPORTED_LANGS.find((x) => x.code === currentLang)
    ? t(SUPPORTED_LANGS.find((x) => x.code === currentLang)!.labelKey)
    : currentLang.toUpperCase();

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
        <Globe size={16} className="text-slate-500 dark:text-slate-400 shrink-0" />
        <span className="max-w-[3rem] truncate">{displayLabel}</span>
      </button>

      {open && (
        <div
          className="absolute right-0 mt-2 w-40 max-h-[70vh] overflow-y-auto rounded-lg bg-white shadow-lg border border-slate-200 z-50 dark:bg-slate-800 dark:border-slate-600"
          role="menu"
        >
          {SUPPORTED_LANGS.map(({ code, labelKey }) => (
            <button
              key={code}
              type="button"
              onClick={() => handleChange(code)}
              role="menuitem"
              className={`w-full text-left px-3 py-2 text-sm hover:bg-slate-50 dark:hover:bg-slate-700 dark:text-slate-200 ${currentLang === code ? "font-medium text-[#0b5fff] dark:text-blue-400" : ""}`}
            >
              {t(labelKey)}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
