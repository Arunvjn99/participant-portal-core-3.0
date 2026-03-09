import type { ReactNode } from "react";
import { Calendar } from "lucide-react";

export interface AgeCardProps {
  /** Main line (e.g. "You're 32 years old") */
  title: string;
  /** Secondary line (e.g. "Born on April 16, 1994") */
  subtitle?: string;
  /** Edit control or date input */
  children?: ReactNode;
  className?: string;
}

export function AgeCard({ title, subtitle, children, className = "" }: AgeCardProps) {
  return (
    <div
      className={`relative overflow-hidden rounded-xl border border-[var(--color-border)] bg-[var(--color-background)] p-4 shadow-sm ${className}`}
      style={{
        background: "linear-gradient(135deg, rgba(37, 99, 235, 0.06) 0%, rgba(124, 58, 237, 0.04) 100%)",
        borderColor: "rgba(37, 99, 235, 0.25)",
      }}
    >
      <div className="absolute right-2 top-2 opacity-10" aria-hidden>
        <Calendar className="h-10 w-10 text-[#2563EB]" />
      </div>
      <div className="relative z-10">
        <p className="text-lg font-semibold text-[var(--color-text)] sm:text-xl">{title}</p>
        {subtitle && (
          <p className="mt-1 text-sm text-[var(--color-textSecondary)]">{subtitle}</p>
        )}
        {children && <div className="mt-4">{children}</div>}
      </div>
    </div>
  );
}
