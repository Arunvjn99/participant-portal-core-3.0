import { useState, useRef, useEffect, useCallback, type KeyboardEvent, type MouseEvent } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import LanguageSwitcher from "@/components/common/LanguageSwitcher";
import ThemeToggle from "@/components/ui/ThemeToggle";
import { useDemoUser } from "@/hooks/useDemoUser";
import { useDemoStore } from "@/store/demoStore";
import { useScenarioStore } from "@/store/scenarioStore";
import { blockDemoNavIfNotAllowed } from "@/lib/demoNav";
import { useFeedbackStore } from "@/store/feedbackStore";
import { useAuth } from "@/context/AuthContext";
import { useOtp } from "@/context/OtpContext";
import { useUser } from "@/context/UserContext";
import { useTheme } from "@/context/ThemeContext";
import { LogoutConfirmModal } from "@/components/dashboard/LogoutConfirmModal";
import { NotificationPanel } from "@/components/dashboard/NotificationPanel";
import { branding } from "@/config/branding";
import { getRoutingVersion, stripRoutingVersionPrefix, withVersion } from "@/core/version";
import { Search } from "lucide-react";
import { requestOpenGlobalSearch } from "@/hooks/useGlobalSearch";

/* ────────────────────────────── Nav config ────────────────────────────── */

function getNavLinks(isDemoMode: boolean, version: string, dashboardHome: string) {
  return [
    { to: isDemoMode ? "/demo" : dashboardHome, labelKey: "nav.dashboard" as const },
    { to: withVersion(version, "/enrollment"), labelKey: "nav.retirementPlan" as const },
    { to: withVersion(version, "/transactions"), labelKey: "nav.transactions" as const },
    { to: "/dashboard/investment-portfolio", labelKey: "nav.investmentPortfolio" as const },
    { to: "/profile", labelKey: "nav.account" as const },
  ] as const;
}

type NavEntry = (ReturnType<typeof getNavLinks>)[number];

/* ────────────────────────── Icons ─────────────────────────── */

function BellIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
      <path d="M13.73 21a2 2 0 0 1-3.46 0" />
    </svg>
  );
}

function HamburgerIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <line x1="3" y1="6" x2="21" y2="6" />
      <line x1="3" y1="12" x2="21" y2="12" />
      <line x1="3" y1="18" x2="21" y2="18" />
    </svg>
  );
}

function CloseMenuIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  );
}

function ChevronDownIcon({ className }: { className?: string }) {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden>
      <path d="M6 9l6 6 6-6" />
    </svg>
  );
}

const ICON_BTN =
  "relative h-9 w-9 flex shrink-0 items-center justify-center rounded-lg text-[var(--color-text-secondary)] transition-colors hover:bg-[var(--color-surface)] hover:text-[var(--color-text-primary)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--color-background)]";

const HEADER_SEARCH_BTN =
  "relative flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-muted/20 text-foreground transition-colors hover:bg-muted/40 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 focus-visible:ring-offset-2 focus-visible:ring-offset-background";

/* ──────────────────────────── Nav primitives ──────────────────────────── */

function NavUnderlineLink({
  to,
  label,
  active,
  onNavigate,
  onClick,
}: {
  to: string;
  label: string;
  active: boolean;
  onNavigate?: () => void;
  onClick?: (e: MouseEvent<HTMLAnchorElement>) => void;
}) {
  return (
    <Link
      to={to}
      onClick={(e) => {
        onClick?.(e);
        if (!e.defaultPrevented) onNavigate?.();
      }}
      className={`relative whitespace-nowrap rounded-md px-2.5 py-2 text-sm font-medium transition-colors sm:px-3 ${
        active
          ? "text-[var(--color-primary)]"
          : "text-[var(--color-text-secondary)] hover:bg-[var(--color-surface)]/80 hover:text-[var(--color-text-primary)]"
      }`}
    >
      {label}
      {active && (
        <span
          className="absolute bottom-0 left-1/2 h-0.5 w-7 -translate-x-1/2 rounded-full bg-[var(--color-primary)]"
          aria-hidden
        />
      )}
    </Link>
  );
}

function MoreNavDropdown({
  id,
  label,
  items,
  isActive,
  onNavigate,
  onLinkClick,
}: {
  id: string;
  label: string;
  items: readonly NavEntry[];
  isActive: (to: string) => boolean;
  onNavigate?: () => void;
  onLinkClick?: (e: MouseEvent<HTMLAnchorElement>, to: string) => void;
}) {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const wrapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onDoc = (e: MouseEvent) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target as Node)) setOpen(false);
    };
    if (open) document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, [open]);

  const onKeyDownBtn = (e: KeyboardEvent<HTMLButtonElement>) => {
    if (e.key === "Escape") setOpen(false);
    if (e.key === "ArrowDown" && !open) {
      e.preventDefault();
      setOpen(true);
    }
  };

  const anyActive = items.some(({ to }) => isActive(to));

  return (
    <div className="relative" ref={wrapRef}>
      <button
        type="button"
        id={`${id}-trigger`}
        aria-haspopup="menu"
        aria-expanded={open}
        aria-controls={`${id}-menu`}
        onClick={() => setOpen((o) => !o)}
        onKeyDown={onKeyDownBtn}
        className={`flex items-center gap-1 rounded-md px-2.5 py-2 text-sm font-medium transition-colors sm:px-3 ${
          anyActive && !open
            ? "text-[var(--color-primary)]"
            : "text-[var(--color-text-secondary)] hover:bg-[var(--color-surface)]/80 hover:text-[var(--color-text-primary)]"
        } ${open ? "bg-[var(--color-surface)]/80 text-[var(--color-text-primary)]" : ""}`}
      >
        {label}
        <ChevronDownIcon className="opacity-70" />
      </button>
      {open && (
        <div
          id={`${id}-menu`}
          role="menu"
          aria-labelledby={`${id}-trigger`}
          className="absolute left-0 top-full z-50 mt-1 min-w-[12rem] rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] py-1 shadow-[var(--shadow-lg)] lg:left-1/2 lg:-translate-x-1/2"
        >
          {items.map(({ to, labelKey }) => {
            const active = isActive(to);
            return (
              <Link
                key={labelKey}
                to={to}
                role="menuitem"
                className={`block px-4 py-2.5 text-sm transition-colors ${
                  active
                    ? "bg-[var(--color-background-secondary)] font-medium text-[var(--color-primary)]"
                    : "text-[var(--color-text-primary)] hover:bg-[var(--color-background-secondary)]"
                }`}
                onClick={(e) => {
                  onLinkClick?.(e, to);
                  if (e.defaultPrevented) return;
                  setOpen(false);
                  onNavigate?.();
                }}
              >
                {labelKey === "nav.investmentPortfolio" ? t("nav.investments") : t(labelKey)}
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}

function UserMenuSections({
  onNavigate,
  onLogout,
  onBeforeLinkNav,
  onShareFeedback,
}: {
  onNavigate: () => void;
  onLogout: () => void;
  onBeforeLinkNav?: (e: MouseEvent<HTMLAnchorElement>, href: string) => void;
  onShareFeedback?: () => void;
}) {
  const { t } = useTranslation();

  return (
    <>
      {onShareFeedback ? (
        <button
          type="button"
          className="block w-full px-4 py-2.5 text-left text-sm text-[var(--color-text-primary)] hover:bg-[var(--color-background-secondary)]"
          role="menuitem"
          onClick={() => {
            onShareFeedback();
            onNavigate();
          }}
        >
          {t("nav.shareFeedback")}
        </button>
      ) : null}
      <Link
        to="/profile"
        className="block px-4 py-2.5 text-sm text-[var(--color-text-primary)] hover:bg-[var(--color-background-secondary)]"
        role="menuitem"
        onClick={(e) => {
          onBeforeLinkNav?.(e, "/profile");
          if (!e.defaultPrevented) onNavigate();
        }}
      >
        {t("nav.account")}
      </Link>
      <Link
        to="/settings"
        className="block px-4 py-2.5 text-sm text-[var(--color-text-primary)] hover:bg-[var(--color-background-secondary)]"
        role="menuitem"
        onClick={(e) => {
          onBeforeLinkNav?.(e, "/settings");
          if (!e.defaultPrevented) onNavigate();
        }}
      >
        {t("nav.settings")}
      </Link>
      <div className="my-1 border-t border-[var(--color-border)]" role="separator" />
      <div className="px-3 py-2">
        <p className="mb-2 text-xs font-medium uppercase tracking-wide text-[var(--color-text-secondary)]">
          {t("settings.appearance.languageLabel")}
        </p>
        <LanguageSwitcher />
      </div>
      <div className="flex items-center justify-between px-4 py-2">
        <span className="text-sm text-[var(--color-text-primary)]">{t("settings.appearance.themeLabel")}</span>
        <ThemeToggle />
      </div>
      <div className="my-1 border-t border-[var(--color-border)]" role="separator" />
      <button
        type="button"
        className="block w-full px-4 py-2.5 text-left text-sm text-[var(--color-text-primary)] hover:bg-[var(--color-background-secondary)]"
        role="menuitem"
        onClick={onLogout}
      >
        {t("nav.logOut")}
      </button>
    </>
  );
}

/* ──────────────────────────── Component ──────────────────────────────── */

export const DashboardHeader = () => {
  const { t } = useTranslation();
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userMenu, setUserMenu] = useState<null | "desktop" | "mobile">(null);
  const [notificationPanelOpen, setNotificationPanelOpen] = useState(false);
  const userMenuDesktopRef = useRef<HTMLDivElement>(null);
  const userMenuMobileRef = useRef<HTMLDivElement>(null);
  const demoUser = useDemoUser();
  const isDemoMode = useScenarioStore((s) => s.isDemoMode);
  const scenarioData = useScenarioStore((s) => s.scenarioData);
  const { signOut } = useAuth();
  const { resetOtp } = useOtp();
  const { user, profile, enrollmentStatus } = useUser();

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const t = e.target as Node;
      const inDesktop = userMenuDesktopRef.current?.contains(t);
      const inMobile = userMenuMobileRef.current?.contains(t);
      if (!inDesktop && !inMobile) setUserMenu(null);
    };
    if (userMenu) document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [userMenu]);

  useEffect(() => {
    setMobileMenuOpen(false);
    setUserMenu(null);
  }, [location.pathname]);

  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  const routeVersion = getRoutingVersion(location.pathname);

  const performLogout = useCallback(async () => {
    useDemoStore.getState().clearScenario();
    resetOtp();
    try {
      await signOut();
    } catch (e) {
      console.error("[DashboardHeader] signOut failed:", e);
    }
    navigate(withVersion(routeVersion, "/login"), { replace: true });
  }, [resetOtp, signOut, navigate, routeVersion]);

  const handleLogoutClick = () => {
    setUserMenu(null);
    setMobileMenuOpen(false);
    setShowLogoutConfirm(true);
  };

  const dashboardHome =
    enrollmentStatus === "completed" ? "/dashboard/post-enrollment" : "/dashboard/pre-enrollment";
  const NAV_LINKS = getNavLinks(!!demoUser, routeVersion, dashboardHome);
  const [dash, retirement, trans, invest, account] = NAV_LINKS;

  const isActive = (to: string) => {
    if (to === "/dashboard/investment-portfolio") return location.pathname === "/dashboard/investment-portfolio";
    if (to === "/demo") return location.pathname === "/demo";
    if (to === "/dashboard/pre-enrollment" || to === "/dashboard/post-enrollment")
      return (
        location.pathname === to ||
        location.pathname === "/dashboard/pre-enrollment" ||
        location.pathname === "/dashboard/post-enrollment" ||
        location.pathname === "/dashboard" ||
        /^\/v\d+\/dashboard$/.test(location.pathname) ||
        location.pathname === "/dashboard/classic"
      );
    if (stripRoutingVersionPrefix(to) === "/transactions")
      return stripRoutingVersionPrefix(location.pathname).startsWith("/transactions");
    if (stripRoutingVersionPrefix(to) === "/enrollment")
      return stripRoutingVersionPrefix(location.pathname).startsWith("/enrollment");
    return location.pathname === to;
  };

  const { currentColors } = useTheme();
  const tenantLogo = currentColors?.logo?.trim();
  const isAuthenticated = Boolean(user);

  const primaryLg = [dash, invest, trans] as const;
  const moreLg = [retirement, account] as const;
  const moreMd = [invest, trans, retirement, account] as const;

  const closeUserMenu = () => setUserMenu(null);

  const toggleUserMenu = (from: "desktop" | "mobile") => {
    setUserMenu((cur) => (cur === from ? null : from));
  };

  const avatarLetter = demoUser?.name?.charAt(0) ?? profile?.name?.charAt(0) ?? "U";

  const handleHeaderSearch = () => {
    requestOpenGlobalSearch();
  };

  const openFeedback = useFeedbackStore((s) => s.openFeedback);

  const demoBlockNav = useCallback(
    (e: MouseEvent<HTMLAnchorElement>, targetPath: string) => {
      if (blockDemoNavIfNotAllowed(scenarioData, isDemoMode, targetPath, t("demo.scenarioNavBlocked"))) {
        e.preventDefault();
      }
    },
    [isDemoMode, scenarioData, t],
  );

  const avatarButtonClass =
    "flex h-8 w-8 items-center justify-center rounded-full text-sm font-semibold text-white shadow-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--color-background)]";

  return (
    <>
      <div>
        <div className="mx-auto flex h-14 w-full max-w-7xl items-center justify-between gap-2 px-4 sm:px-6 lg:px-8">
          {/* Logo */}
          <div className="flex min-w-0 shrink-0 items-center gap-2">
            <Link
              to={isAuthenticated ? dashboardHome : "/"}
              className="flex min-w-0 items-center rounded-md focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)] focus-visible:ring-offset-2"
              aria-label={branding.authAppName}
              onClick={(e) => {
                if (isAuthenticated) demoBlockNav(e, dashboardHome);
              }}
            >
              <img
                src={tenantLogo || branding.logo.src}
                alt={branding.logo.alt}
                className="h-8 w-auto max-w-[140px] object-contain sm:max-w-[160px]"
              />
            </Link>
            {demoUser && (
              <span className="hidden min-w-0 max-w-[8rem] truncate sm:max-w-[10rem] md:inline-flex items-center gap-1.5 rounded-full border border-[var(--color-warning)] bg-[var(--color-warning-light)] px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-[var(--color-warning)] lg:max-w-[12rem]">
                <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--color-warning)] animate-pulse" aria-hidden />
                <span className="truncate">{t("demo.badge", { scenario: t(`demo.scenario_${demoUser.scenario}` as const) })}</span>
              </span>
            )}
          </div>

          {/* Tablet: Dashboard + More */}
          <div className="hidden min-w-0 flex-1 justify-center md:flex lg:hidden">
            <nav className="flex max-w-full items-center gap-0.5 overflow-x-auto" aria-label={t("nav.mainNav")}>
              <NavUnderlineLink
                to={dash.to}
                label={t(dash.labelKey)}
                active={isActive(dash.to)}
                onClick={(e) => demoBlockNav(e, dash.to)}
              />
              <MoreNavDropdown
                id="nav-more-md"
                label={t("nav.more")}
                items={moreMd}
                isActive={isActive}
                onLinkClick={demoBlockNav}
              />
            </nav>
          </div>

          {/* Desktop: primary + More */}
          <div className="hidden min-w-0 flex-1 justify-center lg:flex">
            <nav className="flex items-center gap-0.5 xl:gap-1" aria-label={t("nav.mainNav")}>
              {primaryLg.map(({ to, labelKey }) => (
                <NavUnderlineLink
                  key={labelKey}
                  to={to}
                  label={labelKey === "nav.investmentPortfolio" ? t("nav.investments") : t(labelKey)}
                  active={isActive(to)}
                  onClick={(e) => demoBlockNav(e, to)}
                />
              ))}
              <MoreNavDropdown
                id="nav-more-lg"
                label={t("nav.more")}
                items={moreLg}
                isActive={isActive}
                onLinkClick={demoBlockNav}
              />
            </nav>
          </div>

          {/* Mobile only: push actions to the right when center nav is hidden */}
          <div className="min-w-0 flex-1 md:hidden" aria-hidden />

          {/* Right actions */}
          <div className="flex shrink-0 items-center gap-1 sm:gap-2">
            <button
              type="button"
              className={HEADER_SEARCH_BTN}
              aria-label={t("nav.goToSearch")}
              onClick={handleHeaderSearch}
            >
              <Search className="size-5 text-foreground" strokeWidth={2} aria-hidden />
            </button>

            <button
              type="button"
              className={`${ICON_BTN} hidden md:flex`}
              aria-label={t("nav.notifications")}
              aria-expanded={notificationPanelOpen}
              onClick={() => setNotificationPanelOpen(true)}
            >
              <BellIcon />
              <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-[var(--color-danger)] ring-2 ring-[var(--color-background)]" aria-hidden />
            </button>

            <div className="relative hidden lg:block" ref={userMenuDesktopRef}>
              <button
                type="button"
                className="flex items-center gap-1 rounded-lg p-1 transition-colors hover:bg-[var(--color-surface)]"
                aria-label={t("nav.userMenu")}
                aria-expanded={userMenu === "desktop"}
                aria-haspopup="true"
                onClick={() => toggleUserMenu("desktop")}
              >
                <span className={avatarButtonClass} style={{ background: "var(--banner-gradient)" }} aria-hidden>
                  {avatarLetter}
                </span>
                <ChevronDownIcon className="hidden text-[var(--color-text-secondary)] xl:inline" />
              </button>
              {userMenu === "desktop" && (
                <div
                  className="absolute right-0 top-full z-50 mt-2 min-w-[220px] rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] py-1 shadow-[var(--shadow-lg)]"
                  role="menu"
                >
                  <UserMenuSections
                    onNavigate={closeUserMenu}
                    onLogout={handleLogoutClick}
                    onBeforeLinkNav={demoBlockNav}
                    onShareFeedback={openFeedback}
                  />
                </div>
              )}
            </div>

            <button
              type="button"
              className={`${ICON_BTN} md:hidden`}
              aria-label={mobileMenuOpen ? t("nav.closeMenu") : t("nav.openMenu")}
              aria-expanded={mobileMenuOpen}
              onClick={() => setMobileMenuOpen((o) => !o)}
            >
              {mobileMenuOpen ? <CloseMenuIcon /> : <HamburgerIcon />}
            </button>

            <div className="relative lg:hidden" ref={userMenuMobileRef}>
              <button
                type="button"
                className={`${avatarButtonClass} hover:opacity-95`}
                style={{ background: "var(--banner-gradient)" }}
                aria-label={t("nav.userMenu")}
                aria-expanded={userMenu === "mobile"}
                aria-haspopup="true"
                onClick={() => toggleUserMenu("mobile")}
              >
                {avatarLetter}
              </button>
              {userMenu === "mobile" && (
                <div
                  className="absolute right-0 top-full z-50 mt-2 min-w-[220px] rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] py-1 shadow-[var(--shadow-lg)]"
                  role="menu"
                >
                  <UserMenuSections
                    onNavigate={closeUserMenu}
                    onLogout={handleLogoutClick}
                    onBeforeLinkNav={demoBlockNav}
                    onShareFeedback={openFeedback}
                  />
                </div>
              )}
            </div>
          </div>
        </div>

        {mobileMenuOpen && (
          <div
            className="absolute inset-x-0 top-full z-40 border-b border-[var(--color-border)] bg-[var(--color-surface)] shadow-[var(--shadow-lg)] md:hidden"
            role="dialog"
            aria-label={t("nav.mobileNav")}
          >
            <nav className="px-4 py-3 sm:px-6">
              <ul className="flex flex-col gap-0.5">
                {NAV_LINKS.map(({ to, labelKey }) => {
                  const active = isActive(to);
                  return (
                    <li key={labelKey}>
                      <Link
                        to={to}
                        className={`flex items-center rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                          active
                            ? "bg-[var(--color-background-secondary)] text-[var(--color-primary)]"
                            : "text-[var(--color-text-secondary)] hover:bg-[var(--color-surface)]"
                        }`}
                        onClick={(e) => {
                          demoBlockNav(e, to);
                          if (!e.defaultPrevented) setMobileMenuOpen(false);
                        }}
                      >
                        {labelKey === "nav.investmentPortfolio" ? t("nav.investments") : t(labelKey)}
                      </Link>
                    </li>
                  );
                })}
                <li className="mt-1 border-t border-[var(--color-border)] pt-1">
                  <button
                    type="button"
                    className="flex w-full items-center rounded-lg px-3 py-2.5 text-left text-sm font-medium text-[var(--color-text-secondary)] hover:bg-[var(--color-surface)]"
                    onClick={() => {
                      setMobileMenuOpen(false);
                      openFeedback();
                    }}
                  >
                    {t("nav.shareFeedback")}
                  </button>
                </li>
                <li>
                  <button
                    type="button"
                    className="flex w-full items-center rounded-lg px-3 py-2.5 text-left text-sm font-medium text-[var(--color-text-secondary)] hover:bg-[var(--color-surface)]"
                    onClick={() => {
                      setMobileMenuOpen(false);
                      setNotificationPanelOpen(true);
                    }}
                  >
                    {t("nav.notifications")}
                  </button>
                </li>
                <li>
                  <div className="px-3 py-2">
                    <p className="mb-2 text-xs font-medium uppercase tracking-wide text-[var(--color-text-secondary)]">
                      {t("settings.appearance.languageLabel")}
                    </p>
                    <LanguageSwitcher />
                  </div>
                </li>
                <li className="flex items-center justify-between px-3 py-2">
                  <span className="text-sm text-[var(--color-text-primary)]">{t("settings.appearance.themeLabel")}</span>
                  <ThemeToggle />
                </li>
                <li className="mt-1 border-t border-[var(--color-border)] pt-1">
                  <button
                    type="button"
                    className="flex w-full items-center rounded-lg px-3 py-2.5 text-left text-sm font-medium text-[var(--color-text-secondary)] hover:bg-[var(--color-surface)]"
                    onClick={handleLogoutClick}
                  >
                    {t("nav.logOut")}
                  </button>
                </li>
              </ul>
            </nav>
          </div>
        )}
      </div>

      <NotificationPanel open={notificationPanelOpen} onClose={() => setNotificationPanelOpen(false)} />

      <LogoutConfirmModal
        open={showLogoutConfirm}
        onOpenChange={setShowLogoutConfirm}
        onConfirm={() => void performLogout()}
      />
    </>
  );
};
