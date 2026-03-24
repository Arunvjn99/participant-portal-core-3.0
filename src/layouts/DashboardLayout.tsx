import type { ReactNode } from "react";
import { Footer } from "../components/layout/Footer";

interface DashboardLayoutProps {
  header?: ReactNode;
  /** Optional secondary header rendered immediately below the main header (e.g. enrollment stepper). */
  subHeader?: ReactNode;
  children: ReactNode;
  /** When true, reduces top padding so content sits closer to header/stepper (e.g. enrollment steps). */
  mainCompactTop?: boolean;
  /** When true, do not apply bg-background so a parent page wrapper can provide the background. */
  transparentBackground?: boolean;
  /** When true, do not render the footer (e.g. test pages that use header only). */
  hideFooter?: boolean;
  /** When true, children are not wrapped in the max-w-7xl container (page controls its own grid). */
  fullWidthChildren?: boolean;
  /** When true, main allows horizontal overflow (e.g. immersive hero art past the grid). */
  allowMainOverflowX?: boolean;
}

/*
  Shared header base class.
  Sticky with backdrop-blur, consistent border, safe-area insets.
  Theme-aware: uses --color-border and --color-background.
*/
const HEADER_BASE =
  "relative sticky top-0 z-40 shrink-0 bg-[var(--color-background)]/80 backdrop-blur-md supports-[backdrop-filter]:bg-[var(--color-background)]/80 pl-[env(safe-area-inset-left)] pr-[env(safe-area-inset-right)]";
const HEADER_WITH_BORDER = "border-b border-[var(--color-border)]";

const HEADER_FIXED_H = "h-14";

export const DashboardLayout = ({
  header,
  subHeader,
  children,
  mainCompactTop = false,
  transparentBackground = false,
  hideFooter = false,
  fullWidthChildren = false,
  allowMainOverflowX = false,
}: DashboardLayoutProps) => {
  const mainPadding = mainCompactTop
    ? "pt-3 pb-28 md:pt-4 md:pb-32"
    : "py-6 pb-28 md:py-8 md:pb-32";

  const headerClass = subHeader
    ? HEADER_BASE
    : `${HEADER_BASE} ${HEADER_WITH_BORDER} ${HEADER_FIXED_H}`;

  const contentWrapper = fullWidthChildren ? (
    children
  ) : (
    <div className="mx-auto flex w-full max-w-7xl flex-col gap-4 px-4 pt-4 pb-28 sm:px-6 md:pb-32 lg:px-8">
      {children}
    </div>
  );

  if (transparentBackground) {
    return (
      <div className="dashboard-layout flex min-h-screen flex-col bg-transparent">
        {(header || subHeader) && (
          <header className={headerClass}>
            {header}
            {subHeader}
          </header>
        )}
        <div
          className={`flex-1 min-h-0 bg-[var(--color-background)] ${allowMainOverflowX ? "overflow-x-visible" : "overflow-x-hidden"}`}
        >
          {contentWrapper}
        </div>
        {!hideFooter && <Footer />}
      </div>
    );
  }

  const mainContent = fullWidthChildren ? (
    children
  ) : (
    <div className="mx-auto flex w-full max-w-7xl flex-col gap-4 px-4 sm:gap-6 sm:px-6 lg:px-8">
      {children}
    </div>
  );

  const mainOverflow = allowMainOverflowX ? "overflow-x-visible" : "overflow-x-hidden";

  return (
    <div className="dashboard-layout flex min-h-screen flex-col bg-background">
      {(header || subHeader) && (
        <header className={headerClass}>
          {header}
          {subHeader}
        </header>
      )}
      <main className={`dashboard-layout__main flex-1 min-h-0 ${mainOverflow} ${mainPadding}`}>
        {mainContent}
      </main>
      {!hideFooter && <Footer />}
    </div>
  );
};
