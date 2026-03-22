import { useState, useRef, useEffect, useCallback } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import LanguageSwitcher from "@/components/common/LanguageSwitcher";
import ThemeToggle from "@/components/ui/ThemeToggle";
import { useDemoUser, clearDemoUser } from "@/hooks/useDemoUser";
import { useAuth } from "@/context/AuthContext";
import { useOtp } from "@/context/OtpContext";
import { useUser } from "@/context/UserContext";
import { useTheme } from "@/context/ThemeContext";
import { FeedbackModal } from "@/components/feedback/FeedbackModal";
import { NotificationPanel } from "@/components/dashboard/NotificationPanel";
import { branding } from "@/config/branding";
import { getRoutingVersion, stripRoutingVersionPrefix, withVersion } from "@/core/version";
import { GlobalSearch } from "@/components/search/GlobalSearch";
import { requestOpenGlobalSearch } from "@/hooks/useGlobalSearch";

/* ────────────────────────────── Nav config ────────────────────────────── */

/**
 * Build nav links dynamically — "Dashboard" points to /demo when a demo
 * persona is active, otherwise to /dashboard. labelKey is the i18n key.
 */
/** Order: Dashboard, Retirement Plan, Transactions, Investment Portfolio, Account. */
function getNavLinks(isDemoMode: boolean, version: string) {
  return [
    { to: isDemoMode ? "/demo" : withVersion(version, "/dashboard"), labelKey: "nav.dashboard" as const },
    { to: withVersion(version, "/enrollment"), labelKey: "nav.retirementPlan" as const },
    { to: withVersion(version, "/transactions"), labelKey: "nav.transactions" as const },
    { to: "/dashboard/investment-portfolio", labelKey: "nav.investmentPortfolio" as const },
    { to: "/profile", labelKey: "nav.account" as const },
  ] as const;
}

/* ────────────────────────── Inline SVG icons ─────────────────────────── */

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

/* ────────────────────── Icon button shared class ─────────────────────── */

const ICON_BTN =
  "relative h-9 w-9 flex items-center justify-center rounded-lg text-[var(--color-text-secondary)] transition-colors hover:bg-[var(--color-surface)] hover:text-[var(--color-text-primary)]";

/* ──────────────────────────── Component ──────────────────────────────── */

export const DashboardHeader = () => {
  const { t, i18n } = useTranslation();
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [notificationPanelOpen, setNotificationPanelOpen] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);
  const demoUser = useDemoUser();
  const { signOut } = useAuth();
  const { resetOtp } = useOtp();
  const { user, profile, company } = useUser();

  /* Close user menu on outside click */
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) {
        setUserMenuOpen(false);
      }
    };
    if (userMenuOpen) document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [userMenuOpen]);

  /* Close mobile menu on route change */
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  const [showLogoutFeedback, setShowLogoutFeedback] = useState(false);

  const performLogout = useCallback(async () => {
    clearDemoUser();
    resetOtp();
    await signOut();
    navigate("/");
  }, [resetOtp, signOut, navigate]);

  const handleLogoutClick = () => {
    setUserMenuOpen(false);
    setMobileMenuOpen(false);
    setShowLogoutFeedback(true);
  };

  const handleFeedbackClose = useCallback(() => {
    setShowLogoutFeedback(false);
    performLogout();
  }, [performLogout]);

  const routeVersion = getRoutingVersion(location.pathname);
  const NAV_LINKS = getNavLinks(!!demoUser, routeVersion);

  const isActive = (to: string) => {
    if (to === "/dashboard/investment-portfolio")
      return location.pathname === "/dashboard/investment-portfolio";
    if (to === "/demo")
      return location.pathname === "/demo";
    if (to.endsWith("/dashboard"))
      return (
        location.pathname === to ||
        location.pathname === "/dashboard" ||
        location.pathname === "/v1/dashboard" ||
        location.pathname === "/v2/dashboard" ||
        location.pathname === "/dashboard/classic" ||
        location.pathname === "/dashboard/post-enrollment"
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

  return (
    <>
      <div>
      <div className="mx-auto flex h-14 w-full max-w-7xl items-center justify-between gap-2 px-4 sm:px-6 lg:h-16 lg:px-8">
        {/* ── Left: Logo (tenant when available, else app logo) ── */}
        <div className="flex items-center shrink-0">
          <Link
            to={isAuthenticated ? withVersion(routeVersion, "/dashboard") : "/"}
            className="flex items-center focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:ring-offset-2 rounded-md"
            aria-label={branding.authAppName}
          >
            <img
              src={tenantLogo || branding.logo.src}
              alt={branding.logo.alt}
              className="h-8 w-auto max-w-[160px] object-contain"
            />
          </Link>
        </div>

        {/* ── Center: Desktop nav + global search (lg+) ── */}
        <div className="hidden min-w-0 flex-1 items-center gap-3 px-2 lg:flex lg:gap-4">
          <nav className="flex shrink-0 items-center gap-1" aria-label="Main navigation">
            {NAV_LINKS.map(({ to, labelKey }) => {
              const active = isActive(to);
              return (
                <Link
                  key={labelKey}
                  to={to}
                  className={`relative whitespace-nowrap rounded-md px-3 py-2 text-sm font-medium transition-colors xl:px-4 ${
                    active
                      ? "font-semibold text-[var(--color-primary)]"
                      : "text-[var(--color-text-secondary)] hover:bg-[var(--color-surface)] hover:text-[var(--color-text-primary)]"
                  }`}
                >
                  {t(labelKey)}
                  {active && (
                    <span
                      className="absolute bottom-0 left-1/2 h-0.5 w-8 -translate-x-1/2 rounded-full bg-[var(--color-primary)]"
                      aria-hidden
                    />
                  )}
                </Link>
              );
            })}
          </nav>
          <GlobalSearch routeVersion={routeVersion} />
        </div>

        {/* ── Right: Actions ── */}
        <div className="flex items-center gap-1 sm:gap-2 shrink-0">
          <button
            type="button"
            onClick={() => requestOpenGlobalSearch()}
            className={`${ICON_BTN} lg:hidden`}
            aria-label="Open command palette"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
              <circle cx="11" cy="11" r="8" />
              <path d="M21 21l-4.35-4.35" />
            </svg>
          </button>
          <LanguageSwitcher />
          {/* Demo Mode badge */}
          {demoUser && (
            <span className="hidden sm:inline-flex items-center gap-1.5 rounded-full border border-[var(--color-warning)] bg-[var(--color-warning-light)] px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wider text-[var(--color-warning)]">
              <span className="h-1.5 w-1.5 rounded-full bg-[var(--color-warning)] animate-pulse" aria-hidden />
              {t("demo.badge", { scenario: t(`demo.scenario_${demoUser.scenario}` as const) })}
            </span>
          )}

          {/* Theme toggle – always visible */}
          <ThemeToggle />

          {/* Notifications – opens right slide-over panel */}
          <button
            type="button"
            className={`${ICON_BTN} hidden lg:flex`}
            aria-label={t("nav.notifications")}
            aria-expanded={notificationPanelOpen}
            onClick={() => setNotificationPanelOpen(true)}
          >
            <BellIcon />
            <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-[var(--color-danger)] ring-2 ring-[var(--color-background)]" aria-hidden />
          </button>

          {/* User avatar + dropdown – hidden on mobile */}
          <div className="relative hidden lg:block" ref={userMenuRef}>
            <button
              type="button"
              className="flex items-center gap-1.5 rounded-lg p-1 transition-colors hover:bg-[var(--color-surface)]"
              aria-label={t("nav.userMenu")}
              aria-expanded={userMenuOpen}
              aria-haspopup="true"
              onClick={() => setUserMenuOpen((o) => !o)}
            >
              <span
                className="flex h-8 w-8 items-center justify-center rounded-full text-sm font-semibold text-white shadow-sm"
                style={{ background: "var(--banner-gradient)" }}
                aria-hidden
              >
                {demoUser?.name?.charAt(0) ?? profile?.name?.charAt(0) ?? "U"}
              </span>
              <ChevronDownIcon className="text-[var(--color-text-secondary)]" />
            </button>

            {userMenuOpen && (
              <div
                className="absolute right-0 top-full mt-2 z-50 min-w-[160px] rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] py-1 shadow-[var(--shadow-lg)]"
                role="menu"
              >
                <Link
                  to="/profile"
                  className="block px-4 py-2 text-sm text-[var(--color-text-primary)] hover:bg-[var(--color-surface-elevated)]"
                  role="menuitem"
                  onClick={() => setUserMenuOpen(false)}
                >
                  {t("nav.account")}
                </Link>
                <Link
                  to="/settings"
                  className="block px-4 py-2 text-sm text-[var(--color-text-primary)] hover:bg-[var(--color-surface-elevated)]"
                  role="menuitem"
                  onClick={() => setUserMenuOpen(false)}
                >
                  {t("nav.settings")}
                </Link>
                <button
                  type="button"
                  className="block w-full px-4 py-2 text-left text-sm text-[var(--color-text-primary)] hover:bg-[var(--color-surface-elevated)]"
                  role="menuitem"
                  onClick={handleLogoutClick}
                >
                  {t("nav.logOut")}
                </button>
              </div>
            )}
          </div>

          {/* Mobile hamburger – visible below lg */}
          <button
            type="button"
            className={`${ICON_BTN} lg:hidden`}
            aria-label={mobileMenuOpen ? t("nav.closeMenu") : t("nav.openMenu")}
            aria-expanded={mobileMenuOpen}
            onClick={() => setMobileMenuOpen((o) => !o)}
          >
            {mobileMenuOpen ? <CloseMenuIcon /> : <HamburgerIcon />}
          </button>
        </div>
      </div>

      {/* ── Mobile nav drawer (below lg) ── */}
      {mobileMenuOpen && (
      <div
        className="absolute inset-x-0 top-full z-40 border-b border-[var(--color-border)] bg-[var(--color-surface)] shadow-[var(--shadow-lg)] lg:hidden"
        role="dialog"
        aria-label={t("nav.mobileNav")}
      >
        <nav className="px-4 sm:px-6 py-3">
          <ul className="flex flex-col gap-0.5">
            {NAV_LINKS.map(({ to, labelKey }) => {
              const active = isActive(to);
              return (
                <li key={labelKey}>
                  <Link
                    to={to}
                    className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                      active
                        ? "text-[var(--color-primary)] bg-[var(--color-secondary)]"
                        : "text-[var(--color-text-secondary)] hover:bg-[var(--color-surface)]"
                    }`}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {t(labelKey)}
                  </Link>
                </li>
              );
            })}
            <li className="mt-1 border-t border-[var(--color-border)] pt-1">
              <button
                type="button"
                className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm font-medium text-[var(--color-text-secondary)] hover:bg-[var(--color-surface)]"
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

      {/* Notification center – right slide-over panel */}
      <NotificationPanel
        open={notificationPanelOpen}
        onClose={() => setNotificationPanelOpen(false)}
      />

      {/* Logout feedback modal */}
      <FeedbackModal
        isOpen={showLogoutFeedback}
        onClose={handleFeedbackClose}
        workflowType="overall_experience"
      />
    </>
  );
};
