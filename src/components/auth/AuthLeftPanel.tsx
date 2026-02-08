import type { ReactNode } from "react";

interface AuthLeftPanelProps {
  children?: ReactNode;
}

/**
 * Left panel: gradient background, glass card.
 * Theme-aware. Hidden on mobile.
 */
export const AuthLeftPanel = ({ children }: AuthLeftPanelProps) => {
  return (
    <div className="flex h-full min-h-screen w-full items-center justify-center overflow-x-hidden overflow-y-auto bg-gradient-to-br from-slate-100 to-slate-200 p-8 dark:from-slate-900 dark:to-slate-950">
      <div className="flex max-w-md flex-col items-center justify-center gap-8 text-center">
        {/* Chart card */}
        <div className="relative w-full">
          <div className="overflow-hidden rounded-xl border border-white/20 bg-white/30 p-6 shadow-xl backdrop-blur-xl dark:border-white/10 dark:bg-white/5 sm:p-8">
            <div className="grid gap-6 sm:grid-cols-2">
              <div className="flex flex-col justify-center">
                <h2 className="mb-2 text-lg font-semibold text-slate-900 dark:text-white sm:text-xl">
                  Monitor Plan Performance
                </h2>
                <p className="text-sm leading-relaxed text-slate-600 dark:text-white/80">
                  View participant engagement, contribution trends, and plan health at a glance to make informed decisions.
                </p>
              </div>
              <div className="flex flex-col gap-2 rounded-lg bg-white/50 p-4 dark:bg-white/5">
                <p className="text-xs font-medium text-slate-600 dark:text-white/70">Plan Performance</p>
                <p className="text-sm font-semibold text-slate-900 dark:text-white">Account Balance: $15,122.00</p>
                <div className="mt-2 h-12 w-full">
                  <svg viewBox="0 0 200 48" className="h-full w-full" preserveAspectRatio="none">
                    <polyline
                      fill="none"
                      stroke="rgb(34 197 94)"
                      strokeWidth="2"
                      points="0,40 25,35 50,30 75,28 100,25 125,22 150,18 175,15 200,10"
                    />
                  </svg>
                </div>
                <p className="text-xs font-medium text-emerald-600 dark:text-emerald-400">+95.20%</p>
              </div>
            </div>
          </div>
          <div className="absolute -bottom-3 -right-2 rounded-full border border-white/20 bg-white/40 px-4 py-2 shadow-lg backdrop-blur-sm dark:border-white/10 dark:bg-white/10">
            <p className="text-xs font-medium text-slate-700 dark:text-white/90">Plan Insights</p>
            <p className="text-sm font-semibold text-blue-600 dark:text-blue-400">$15,123.00</p>
          </div>
        </div>

        <div className="h-4 w-full" aria-hidden />

        <h2 className="text-2xl font-bold text-slate-900 dark:text-white sm:text-3xl md:text-4xl">
          Empower your oversight
        </h2>
        <p className="text-sm text-slate-600 dark:text-white/80 sm:text-base">
          Sign in to gain clear visibility into every plan&apos;s performance
        </p>

        {children}
      </div>
    </div>
  );
};
