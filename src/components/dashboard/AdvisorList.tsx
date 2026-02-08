import type { ReactNode } from "react";

interface AdvisorListProps {
  children: ReactNode;
}

export const AdvisorList = ({ children }: AdvisorListProps) => {
  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
      {children}
    </div>
  );
};
