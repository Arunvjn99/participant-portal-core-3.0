import { useRef, useEffect, useState, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { Globe } from "lucide-react";
import { SUPPORTED_LANGS, normalizeLanguage } from "@/constants/locales";

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
        className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] text-sm font-medium text-[var(--color-text-primary)] shadow-sm hover:border-[var(--color-border)] transition"
      >
        <Globe size={16} className="text-[var(--color-text-secondary)] shrink-0" />
        <span className="max-w-[3rem] truncate">{displayLabel}</span>
      </button>

      {open && (
        <div
          className="absolute right-0 mt-2 w-40 max-h-[70vh] overflow-y-auto rounded-lg bg-[var(--color-surface)] shadow-[var(--shadow-lg)] border border-[var(--color-border)] z-50"
          role="menu"
        >
          {SUPPORTED_LANGS.map(({ code, labelKey }) => (
            <button
              key={code}
              type="button"
              onClick={() => handleChange(code)}
              role="menuitem"
              className={`w-full text-left px-3 py-2 text-sm text-[var(--color-text-primary)] hover:bg-[var(--color-background-secondary)] ${currentLang === code ? "font-medium text-[var(--color-primary)]" : ""}`}
            >
              {t(labelKey)}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
