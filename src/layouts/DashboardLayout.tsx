import type { ReactNode } from "react";
import { AIFab } from "../components/ai/AIFab";

interface DashboardLayoutProps {
  header?: ReactNode;
  children: ReactNode;
}

export const DashboardLayout = ({ header, children }: DashboardLayoutProps) => {
  return (
    <div className="dashboard-layout flex min-h-screen flex-col bg-slate-50 dark:bg-slate-900">
      {header && (
        <header className="dashboard-layout__header sticky top-0 z-50 shrink-0">
          {header}
        </header>
      )}
      <main className="dashboard-layout__main flex-1 px-4 py-6 md:px-6 md:py-8 lg:px-8">
        <div className="flex flex-col space-y-10">{children}</div>
      </main>
      <AIFab />
    </div>
  );
};
