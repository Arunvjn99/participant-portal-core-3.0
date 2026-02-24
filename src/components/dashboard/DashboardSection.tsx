import type { ReactNode } from "react";

interface DashboardSectionProps {
  title: string;
  action?: ReactNode;
  children: ReactNode;
}

const DashboardSection = ({ title, action, children }: DashboardSectionProps) => {
  return (
    <section className="flex flex-col gap-4">
      <header className="flex flex-wrap items-center justify-between gap-2">
        <h2 className="text-xl font-bold text-[var(--color-text)] md:text-2xl">
          {title}
        </h2>
        {action && <div className="shrink-0">{action}</div>}
      </header>
      <div className="min-w-0">{children}</div>
    </section>
  );
};

export default DashboardSection;
