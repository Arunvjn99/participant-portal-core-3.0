import type { ReactNode } from "react";

interface DashboardLayoutProps {
  header?: ReactNode;
  children: ReactNode;
  /** When true, reduces top padding so content sits closer to header/stepper (e.g. enrollment steps). */
  mainCompactTop?: boolean;
  /** When true, do not apply bg-background so a parent page wrapper can provide the background. */
  transparentBackground?: boolean;
}

export const DashboardLayout = ({ header, children, mainCompactTop = false, transparentBackground = false }: DashboardLayoutProps) => {
  const mainPadding = mainCompactTop
    ? "pt-3 pb-24 md:pt-4 md:pb-24"
    : "py-6 pb-24 md:py-8 md:pb-24";

  if (transparentBackground) {
    return (
      <div className="dashboard-layout flex min-h-screen flex-col bg-transparent">
        {header && (
          <header className="relative sticky top-0 z-40 min-h-14 shrink-0 border-b border-slate-200 bg-white/80 backdrop-blur-md md:min-h-16 supports-[backdrop-filter]:bg-white/80 dark:border-slate-700 dark:bg-slate-900/80 dark:supports-[backdrop-filter]:bg-slate-900/80 pl-[env(safe-area-inset-left)] pr-[env(safe-area-inset-right)]">
            {header}
          </header>
        )}
        <div className="min-h-[calc(100vh-64px)] flex-1 min-h-0 overflow-x-hidden bg-slate-50 dark:bg-slate-900">
          <div className="max-w-7xl mx-auto px-6 py-8 flex flex-col gap-6 w-full">
            {children}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard-layout flex min-h-screen flex-col bg-background">
      {header && (
        <header className="relative sticky top-0 z-40 min-h-14 shrink-0 border-b border-slate-200 bg-white/80 backdrop-blur-md md:min-h-16 supports-[backdrop-filter]:bg-white/80 dark:border-slate-700 dark:bg-slate-900/80 dark:supports-[backdrop-filter]:bg-slate-900/80 pl-[env(safe-area-inset-left)] pr-[env(safe-area-inset-right)]">
          {header}
        </header>
      )}
      <main className={`dashboard-layout__main flex-1 min-h-0 overflow-x-hidden ${mainPadding}`}>
        <div className="flex flex-col gap-6 mx-auto w-full max-w-[1440px] px-6 lg:px-8">{children}</div>
      </main>
    </div>
  );
};
