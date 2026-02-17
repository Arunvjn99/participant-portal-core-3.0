import type { ReactNode } from "react";

interface TransactionFlowLayoutProps {
  title: string;
  subtitle?: string;
  backLabel?: string;
  onBack?: () => void;
  children: ReactNode;
}

/**
 * Transaction flow page layout — mirrors EnrollmentPageContent.
 * Uses enrollment design tokens only.
 */
export function TransactionFlowLayout({
  title,
  subtitle,
  backLabel = "← Back to Transactions",
  onBack,
  children,
}: TransactionFlowLayoutProps) {
  return (
    <div
      className="w-full pb-28"
      style={{ background: "var(--enroll-bg)" }}
    >
      <div className="max-w-[1200px] mx-auto px-4 md:px-6 py-8 md:py-10">
        <header className="mb-8">
          {onBack && (
            <button
              type="button"
              onClick={onBack}
              className="mb-4 text-[0.9375em] font-medium cursor-pointer border-none bg-transparent transition-opacity hover:opacity-80 focus-visible:outline-2 focus-visible:outline-offset-2 rounded-[var(--radius-sm)]"
              style={{ color: "var(--enroll-brand)" }}
              aria-label="Back to transactions"
            >
              {backLabel}
            </button>
          )}
          <h1
            className="text-[28px] md:text-[32px] font-bold leading-tight"
            style={{ color: "var(--enroll-text-primary)" }}
          >
            {title}
          </h1>
          {subtitle && (
            <p
              className="mt-1.5 text-base"
              style={{ color: "var(--enroll-text-secondary)" }}
            >
              {subtitle}
            </p>
          )}
        </header>
        {children}
      </div>
    </div>
  );
}
