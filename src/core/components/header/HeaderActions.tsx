import { useEffect, useMemo, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { Bell, Globe, Search } from "lucide-react";
import { useUser } from "@/core/context/UserContext";
import { requestOpenGlobalSearch } from "@/core/hooks/useGlobalSearch";
import { cn } from "@/core/lib/utils";
import ThemeToggle from "@/core/components/ui/ThemeToggle";
import { SUPPORTED_LANGS, normalizeLanguage } from "@/core/constants/locales";

const iconBtn =
  "flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-border bg-surface text-foreground transition-colors hover:bg-muted";

function HeaderSearch() {
  const { t } = useTranslation();

  return (
    <>
      <button
        type="button"
        onClick={() => requestOpenGlobalSearch()}
        className={cn(iconBtn, "lg:hidden")}
        aria-label={t("header.searchCompactAria")}
      >
        <Search className="h-4 w-4 text-muted-foreground" aria-hidden />
      </button>

      <button
        type="button"
        onClick={() => requestOpenGlobalSearch()}
        className={cn(
          "hidden min-h-9 w-full max-w-[220px] items-center gap-sm rounded-full border border-border bg-surface px-md py-sm text-left transition-colors hover:bg-muted lg:flex",
        )}
        aria-label={t("floatingSearch.openAria")}
      >
        <Search className="h-4 w-4 shrink-0 text-muted-foreground" aria-hidden />
        <span className="min-w-0 flex-1 truncate text-sm text-muted-foreground">
          {t("floatingSearch.placeholder")}
        </span>
        <kbd className="hidden shrink-0 rounded-md border border-border bg-background-secondary px-sm py-xs font-mono text-xs text-muted-foreground xl:inline">
          ⌘K
        </kbd>
      </button>
    </>
  );
}

function HeaderLanguageSwitcher() {
  const { i18n, t } = useTranslation();
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const currentLang = useMemo(
    () => normalizeLanguage(i18n.language ?? "en"),
    [i18n.language],
  );

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
        aria-label={t("common.language")}
        className="flex h-9 shrink-0 items-center gap-sm rounded-lg border border-border bg-surface px-md text-sm font-medium text-foreground transition-colors hover:bg-muted"
      >
        <Globe className="h-4 w-4 shrink-0 text-muted-foreground" aria-hidden />
        <span className="hidden max-w-32 truncate sm:inline">{displayLabel}</span>
      </button>
      {open ? (
        <div
          className="absolute right-0 z-50 mt-sm max-h-[70vh] min-w-40 overflow-y-auto rounded-lg border border-border bg-card py-xs shadow-elevation-md"
          role="menu"
        >
          {SUPPORTED_LANGS.map(({ code, labelKey }) => (
            <button
              key={code}
              type="button"
              onClick={() => {
                void i18n.changeLanguage(code);
                setOpen(false);
              }}
              role="menuitem"
              className={cn(
                "w-full px-md py-sm text-left text-sm transition-colors hover:bg-muted",
                currentLang === code
                  ? "font-medium text-primary"
                  : "text-muted-foreground",
              )}
            >
              {t(labelKey)}
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}

function ProfileAvatar() {
  const { t } = useTranslation();
  const { profile } = useUser();
  const initials = useMemo(() => {
    const name = profile?.name?.trim();
    if (!name) return "?";
    const parts = name.split(/\s+/).filter(Boolean);
    if (parts.length >= 2) {
      return `${parts[0]![0] ?? ""}${parts[parts.length - 1]![0] ?? ""}`.toUpperCase();
    }
    return name.slice(0, 2).toUpperCase();
  }, [profile?.name]);

  return (
    <Link
      to="/profile"
      className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary text-xs font-semibold leading-none text-primary-foreground transition-opacity hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background"
      aria-label={t("header.profileAria")}
    >
      {initials}
    </Link>
  );
}

/**
 * Right zone: consistent `gap-sm` on narrow viewports, `gap-md` from `md` up (tablet/desktop).
 */
export function HeaderActions() {
  const { t } = useTranslation();

  return (
    <div className="flex min-w-0 shrink-0 items-center justify-end gap-sm md:gap-md">
      <HeaderSearch />
      <HeaderLanguageSwitcher />
      <button type="button" className={iconBtn} aria-label={t("header.notifications")}>
        <Bell className="h-4 w-4 text-muted-foreground" aria-hidden />
      </button>
      <div className="flex h-9 items-center">
        <ThemeToggle />
      </div>
      <ProfileAvatar />
    </div>
  );
}
