import type { ReactNode } from "react";

interface ResourceGridProps {
  children: ReactNode;
  className?: string;
}

const ResourceGrid = ({ children, className = "" }: ResourceGridProps) => {
  return (
    <div
      className={`grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 ${className}`.trim()}
    >
      {children}
    </div>
  );
};

export default ResourceGrid;
