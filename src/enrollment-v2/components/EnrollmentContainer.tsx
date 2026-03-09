import type { ReactNode } from "react";

export interface EnrollmentContainerProps {
  children: ReactNode;
  /** Optional class for the container */
  className?: string;
}

/**
 * Standard layout container for all enrollment step pages.
 * Applies: max-w-6xl mx-auto px-6 py-8.
 * Use inside EnrollmentPageContent to keep content width and spacing consistent.
 */
export function EnrollmentContainer({ children, className = "" }: EnrollmentContainerProps) {
  return (
    <div className={`max-w-6xl mx-auto px-6 py-8 ${className}`}>
      {children}
    </div>
  );
}
