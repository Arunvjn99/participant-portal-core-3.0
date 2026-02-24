import type { ReactNode } from "react";

interface AuthLeftPanelProps {
  children?: ReactNode;
}

export const AuthLeftPanel = ({ children }: AuthLeftPanelProps) => {
  return (
    <div className="flex h-full min-h-screen w-full items-center justify-center overflow-x-hidden overflow-y-auto bg-gradient-to-br from-[var(--color-surface)] to-[var(--color-background)] p-8">
      <div className="flex max-w-md flex-col items-center justify-center gap-8 text-center">
        <div className="relative w-full">
          <div className="overflow-hidden rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)]/30 p-6 shadow-xl backdrop-blur-xl sm:p-8">
            <div className="grid gap-6 sm:grid-cols-2">
              <div className="flex flex-col justify-center">
                <h2 className="mb-2 text-lg font-semibold text-[var(--color-text)] sm:text-xl">
                  Monitor Plan Performance
                </h2>
                <p className="text-sm leading-relaxed text-[var(--color-textSecondary)]">
                  View participant engagement, contribution trends, and plan health at a glance to make informed decisions.
                </p>
              </div>
              <div className="flex flex-col gap-2 rounded-lg bg-[var(--color-surface)] p-4">
                <p className="text-xs font-medium text-[var(--color-textSecondary)]">Plan Performance</p>
                <p className="text-sm font-semibold text-[var(--color-text)]">Account Balance: $15,122.00</p>
                <div className="mt-2 h-12 w-full">
                  <svg viewBox="0 0 200 48" className="h-full w-full" preserveAspectRatio="none">
                    <polyline
                      fill="none"
                      stroke="var(--color-success)"
                      strokeWidth="2"
                      points="0,40 25,35 50,30 75,28 100,25 125,22 150,18 175,15 200,10"
                    />
                  </svg>
                </div>
                <p className="text-xs font-medium text-[var(--color-success)]">+95.20%</p>
              </div>
            </div>
          </div>
          <div className="absolute -bottom-3 -right-2 rounded-full border border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-2 shadow-lg backdrop-blur-sm">
            <p className="text-xs font-medium text-[var(--color-textSecondary)]">Plan Insights</p>
            <p className="text-sm font-semibold text-[var(--color-primary)]">$15,123.00</p>
          </div>
        </div>

        <div className="h-4 w-full" aria-hidden />

        <h2 className="text-2xl font-bold text-[var(--color-text)] sm:text-3xl md:text-4xl">
          Empower your oversight
        </h2>
        <p className="text-sm text-[var(--color-textSecondary)] sm:text-base">
          Sign in to gain clear visibility into every plan&apos;s performance
        </p>

        {children}
      </div>
    </div>
  );
};
