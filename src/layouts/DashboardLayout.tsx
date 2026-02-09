import type { ReactNode } from "react";

interface DashboardLayoutProps {
  header?: ReactNode;
  children: ReactNode;
}

export const DashboardLayout = ({ header, children }: DashboardLayoutProps) => {
  return (
    <div className="dashboard-layout flex min-h-screen flex-col bg-background">
      {header && (
        <header className="relative sticky top-0 z-50 shrink-0 h-14 sm:h-16 lg:h-[72px] border-b border-slate-200 bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/95 dark:border-slate-700 dark:bg-slate-900/95 dark:supports-[backdrop-filter]:bg-slate-900/95 pl-[env(safe-area-inset-left)] pr-[env(safe-area-inset-right)]">
          {header}
        </header>
      )}
      <main className="dashboard-layout__main flex-1 py-6 pb-24 md:py-8 md:pb-24">
        <div className="flex flex-col gap-6 mx-auto w-full max-w-[1440px] px-6 lg:px-8">{children}</div>
      </main>
    </div>
  );
};
