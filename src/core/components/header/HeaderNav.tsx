import { Fragment, useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { Link, useLocation } from "react-router-dom";
import * as Dialog from "@radix-ui/react-dialog";
import { ChevronDown, Menu, X } from "lucide-react";
import { cn } from "@/core/lib/utils";
import {
  type HeaderNavMode,
  type NavConfigEntry,
  NAV_CONFIG,
  flattenNavEntries,
  isNavPathActive,
} from "./headerNavConfig";

const focusRing =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background";

/** Desktop: token spacing; active = primary + bottom border (stable height via transparent border) */
function DesktopNavLink({
  to,
  label,
  active,
  onNavigate,
}: {
  to: string;
  label: string;
  active: boolean;
  onNavigate?: () => void;
}) {
  return (
    <Link
      to={to}
      onClick={onNavigate}
      className={cn(
        "inline-flex items-center whitespace-nowrap border-b-2 border-transparent px-sm py-xs text-sm font-medium text-muted-foreground transition-colors hover:text-foreground",
        focusRing,
        active && "border-primary text-primary",
      )}
    >
      {label}
    </Link>
  );
}

function DesktopNavDropdown({
  entry,
  pathname,
}: {
  entry: Extract<NavConfigEntry, { type: "dropdown" }>;
  pathname: string;
}) {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const anyActive = entry.items.some((item) => isNavPathActive(pathname, item.to, item.match));

  useEffect(() => {
    const onDoc = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    if (open) document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, [open]);

  return (
    <div className="relative flex items-center" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        aria-haspopup="true"
        className={cn(
          "inline-flex items-center gap-xs whitespace-nowrap border-b-2 border-transparent px-sm py-xs text-sm font-medium text-muted-foreground transition-colors hover:text-foreground",
          focusRing,
          open && "border-transparent bg-muted/80 text-foreground",
          !open && anyActive && "border-primary text-primary",
        )}
      >
        {t(entry.labelKey)}
        <ChevronDown className="h-4 w-4 shrink-0 opacity-70" aria-hidden />
      </button>
      {open ? (
        <div
          className="absolute left-0 top-full z-50 mt-sm min-w-40 rounded-lg border border-border bg-card py-sm shadow-elevation-md lg:left-1/2 lg:-translate-x-1/2"
          role="menu"
        >
          {entry.items.map((item) => {
            const active = isNavPathActive(pathname, item.to, item.match);
            return (
              <Link
                key={item.to}
                to={item.to}
                role="menuitem"
                className={cn(
                  "block px-md py-sm text-sm transition-colors",
                  active
                    ? "bg-muted font-medium text-primary"
                    : "text-foreground hover:bg-muted",
                )}
                onClick={() => setOpen(false)}
              >
                {t(item.labelKey)}
              </Link>
            );
          })}
        </div>
      ) : null}
    </div>
  );
}

const mobileNavLinkClass = cn(
  "rounded-lg px-md py-sm text-left text-sm font-medium transition-colors",
  focusRing,
);

export type HeaderNavProps = {
  mode: HeaderNavMode;
  variant: "desktop" | "mobile";
  onMobileNavigate?: () => void;
};

/** Desktop: fragment — parent supplies `flex flex-nowrap gap-*` */
export function HeaderNav({ mode, variant, onMobileNavigate }: HeaderNavProps) {
  const { t } = useTranslation();
  const { pathname } = useLocation();
  const entries = NAV_CONFIG[mode];

  if (variant === "mobile") {
    return (
      <nav className="flex flex-col gap-md" aria-label={t("header.openMenu")}>
        {flattenNavEntries(entries).map((item) => {
          const active = isNavPathActive(pathname, item.to, item.match);
          return (
            <Link
              key={`${item.to}-${item.labelKey}`}
              to={item.to}
              className={cn(
                mobileNavLinkClass,
                active
                  ? "bg-muted text-primary"
                  : "text-foreground hover:bg-muted",
              )}
              onClick={onMobileNavigate}
            >
              {t(item.labelKey)}
            </Link>
          );
        })}
      </nav>
    );
  }

  return (
    <Fragment>
      {entries.map((entry) => {
        if (entry.type === "link") {
          const active = isNavPathActive(pathname, entry.to, entry.match);
          return (
            <DesktopNavLink
              key={entry.to}
              to={entry.to}
              label={t(entry.labelKey)}
              active={active}
            />
          );
        }
        return <DesktopNavDropdown key={entry.labelKey} entry={entry} pathname={pathname} />;
      })}
    </Fragment>
  );
}

export function HeaderMobileNavDialog({ mode }: { mode: HeaderNavMode }) {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);

  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Trigger asChild>
        <button
          type="button"
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-border bg-surface text-foreground transition-colors hover:bg-muted md:hidden"
          aria-label={t("header.openMenu")}
        >
          <Menu className="h-5 w-5" aria-hidden />
        </button>
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm md:hidden" />
        <Dialog.Content className="fixed inset-x-md top-16 z-50 max-h-[70vh] overflow-y-auto rounded-card border border-border bg-card p-lg shadow-elevation-md md:hidden">
          <div className="mb-md flex items-center justify-between gap-md">
            <Dialog.Title className="text-sm font-semibold text-foreground">
              {t("header.menuTitle")}
            </Dialog.Title>
            <Dialog.Close asChild>
              <button
                type="button"
                className="flex h-9 w-9 items-center justify-center rounded-lg border border-border text-muted-foreground hover:bg-muted hover:text-foreground"
                aria-label={t("header.closeMenu")}
              >
                <X className="h-5 w-5" />
              </button>
            </Dialog.Close>
          </div>
          <HeaderNav mode={mode} variant="mobile" onMobileNavigate={() => setOpen(false)} />
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
