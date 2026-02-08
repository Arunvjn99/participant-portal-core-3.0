import type { ReactNode } from "react";

interface DashboardGridProps {
  left: ReactNode;
  right: ReactNode;
}

export const DashboardGrid = ({ left, right }: DashboardGridProps) => {
  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-[2fr_1fr]">
      <div className="min-w-0">{left}</div>
      <div className="min-w-0">{right}</div>
    </div>
  );
};
