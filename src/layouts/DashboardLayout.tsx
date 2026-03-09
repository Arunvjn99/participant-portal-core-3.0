import type { ReactNode } from "react";
import { Footer } from "../components/layout/Footer";

interface DashboardLayoutProps {
  header?: ReactNode;
  /** Optional secondary header rendered immediately below the main header (e.g. enrollment stepper). */
  subHeader?: ReactNode;
  children: ReactNode;
  /** When true, reduces top padding so content sits closer to header/stepper (e.g. enrollment steps). */
  mainCompactTop?: boolean;
  /** When true, do not apply page background so a parent page wrapper can provide the background. */
  transparentBackground?: boolean;
}

/*
  Shared header base class.
  Sticky with backdrop-blur, consistent border, safe-area insets.
  Theme-aware: uses --color-border and --color-background.
*/
const HEADER_BASE =
  "relative sticky top-0 z-40 shrink-0 bg-[var(--color-background)]/80 backdrop-blur-md supports-[backdrop-filter]:bg-[var(--color-background)]/80 pl-[env(safe-area-inset-left)] pr-[env(safe-area-inset-right)]";
const HEADER_WITH_BORDER = "border-b border-[var(--color-border)]";

const HEADER_FIXED_H = "h-14 lg:h-16";

export const DashboardLayout = ({
  header,
  subHeader,
  children,
  mainCompactTop = false,
  transparentBackground = false,
}: DashboardLayoutProps) => {
  const mainPadding = mainCompactTop
    ? "pt-3 pb-24 md:pt-4 md:pb-24"
    : "pb-24";

  const headerClass = subHeader
    ? HEADER_BASE
    : `${HEADER_BASE} ${HEADER_WITH_BORDER} ${HEADER_FIXED_H}`;

  if (transparentBackground) {
    return (
      <div className="dashboard-layout flex min-h-screen flex-col bg-transparent">
        {(header || subHeader) && (
          <header className={headerClass}>
            {header}
            {subHeader}
          </header>
        )}
        {/* No max-w wrapper so enrollment pages can full-bleed (EnrollmentPageContent owns max-w-7xl). */}
        <div className="flex-1 min-h-0 overflow-x-hidden">
          {children}
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="dashboard-layout flex min-h-screen flex-col bg-[var(--color-background-secondary)]">
      {(header || subHeader) && (
        <header className={headerClass}>
          {header}
          {subHeader}
        </header>
      )}
      <main
        className={`dashboard-layout__main flex-1 min-h-0 overflow-x-hidden ${mainPadding}`}
      >
        <div className="mx-auto w-full max-w-7xl px-6 py-8">
          {children}
        </div>
      </main>
      <Footer />
    </div>
  );
};
