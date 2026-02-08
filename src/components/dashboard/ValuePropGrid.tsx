import type { ReactNode } from "react";

interface ValuePropGridProps {
  children: ReactNode;
}

export const ValuePropGrid = ({ children }: ValuePropGridProps) => {
  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {children}
    </div>
  );
};
