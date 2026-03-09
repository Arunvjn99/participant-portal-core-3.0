import type { ReactNode } from "react";
import { motion } from "framer-motion";
import { AlertCircle, Sparkles } from "lucide-react";

export interface ReadinessImprovementCard {
  id: string;
  title: string;
  description: string;
  impactText?: string;
  scoreIncrease?: number;
  impactType?: "High Impact" | "Medium Impact";
  icon?: ReactNode;
}

export interface FundingSummary {
  incomeGoal: number;
  annualContributions: number;
  savingsGap: number;
}

export interface ReadinessLayoutV2Props {
  title: string;
  subtitle: string;
  /** Score 0–100 */
  score: number;
  /** e.g. "Needs Attention" */
  statusLabel?: string;
  /** Optional "Understanding your score" text */
  understandingText?: string;
  /** Optional funding summary (Income Goal, Contributions, Savings Gap) */
  fundingSummary?: FundingSummary;
  /** Improvement / recommendation cards */
  improvements: ReadinessImprovementCard[];
  /** When set, each recommendation card shows Apply and calls this with card id */
  onApplyRecommendation?: (id: string) => void;
  /** Optional CTA (e.g. Continue button) */
  children?: ReactNode;
}

/**
 * Readiness step — layout only. Score and improvements from props.
 * Projection/score math lives in page (useEnrollment + existing logic).
 */
function formatCurrency(n: number): string {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(n);
}

export function ReadinessLayoutV2({
  title,
  subtitle,
  score,
  statusLabel = "Needs Attention",
  understandingText,
  fundingSummary,
  improvements,
  onApplyRecommendation,
  children,
}: ReadinessLayoutV2Props) {
  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {fundingSummary != null && (
        <div
          className="enrollment-card rounded-2xl border border-[var(--enroll-card-border)] p-6 grid grid-cols-1 sm:grid-cols-3 gap-4"
          style={{ background: "var(--enroll-card-bg)" }}
        >
          <h3 className="sm:col-span-3 text-lg font-semibold" style={{ color: "var(--enroll-text-primary)" }}>
            Annual Funding Summary
          </h3>
          <div>
            <p className="text-sm font-medium mb-0.5" style={{ color: "var(--enroll-text-secondary)" }}>Income Goal</p>
            <p className="text-lg font-bold tabular-nums" style={{ color: "var(--enroll-text-primary)" }}>{formatCurrency(fundingSummary.incomeGoal)}</p>
          </div>
          <div>
            <p className="text-sm font-medium mb-0.5" style={{ color: "var(--enroll-text-secondary)" }}>Annual Contributions</p>
            <p className="text-lg font-bold tabular-nums" style={{ color: "var(--enroll-text-primary)" }}>{formatCurrency(fundingSummary.annualContributions)}</p>
          </div>
          <div>
            <p className="text-sm font-medium mb-0.5" style={{ color: "var(--enroll-text-secondary)" }}>Savings Gap</p>
            <p className="text-lg font-bold tabular-nums" style={{ color: fundingSummary.savingsGap > 0 ? "var(--danger)" : "var(--enroll-text-primary)" }}>{formatCurrency(fundingSummary.savingsGap)}</p>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: score circle — gradient stroke with 0→score animation (600–800ms) */}
        <div className="flex flex-col items-center">
          <div className="relative w-[200px] h-[200px] flex-shrink-0 flex items-center justify-center">
            <svg className="absolute inset-0 w-full h-full -rotate-90" viewBox="0 0 200 200" aria-hidden>
              <defs>
                <linearGradient id="readiness-score-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="var(--enroll-brand)" />
                  <stop offset="100%" stopColor="var(--enroll-accent)" />
                </linearGradient>
              </defs>
              <circle
                cx="100"
                cy="100"
                r="96"
                fill="none"
                stroke="var(--enroll-card-border)"
                strokeWidth="8"
              />
                  <motion.circle
                cx="100"
                cy="100"
                r="96"
                fill="none"
                stroke="url(#readiness-score-gradient)"
                strokeWidth="8"
                strokeLinecap="round"
                strokeDasharray={2 * Math.PI * 96}
                initial={{ strokeDashoffset: 2 * Math.PI * 96 }}
                animate={{ strokeDashoffset: 2 * Math.PI * 96 * (1 - Math.min(100, Math.max(0, score)) / 100) }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                style={{ filter: "drop-shadow(0 0 6px rgb(var(--enroll-accent-rgb) / 0.4))" }}
              />
              {/* Small dot at progress end with soft glow */}
              {score > 0 && score < 100 && (() => {
                const theta = (Math.min(100, Math.max(0, score)) / 100) * 2 * Math.PI;
                const dotCx = 100 + 96 * Math.sin(theta);
                const dotCy = 100 - 96 * Math.cos(theta);
                return (
                  <motion.circle
                    r="6"
                    cx={dotCx}
                    cy={dotCy}
                    fill="var(--enroll-accent)"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.6, duration: 0.25, ease: "easeOut" }}
                    style={{ filter: "drop-shadow(0 0 6px var(--enroll-accent)) drop-shadow(0 0 12px rgb(var(--enroll-accent-rgb) / 0.5))" }}
                  />
                );
              })()}
            </svg>
            <div className="relative flex flex-col items-center justify-center">
              <motion.span
                className="text-5xl md:text-6xl font-black tabular-nums"
                style={{ color: "var(--enroll-brand)" }}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4, delay: 0.3 }}
              >
                {Math.round(score)}
              </motion.span>
              <span className="text-sm mt-1" style={{ color: "var(--enroll-text-secondary)" }}>
                out of 100
              </span>
            </div>
          </div>
          <div className="mt-4 px-4 py-2 rounded-full border h-[38px] flex items-center" style={{ borderColor: "var(--enroll-card-border)", background: "var(--enroll-soft-bg)" }}>
            <span className="text-sm font-bold" style={{ color: "var(--enroll-text-primary)" }}>
              {statusLabel}
            </span>
          </div>
          {understandingText && (
            <p className="mt-4 text-sm text-center max-w-xs" style={{ color: "var(--enroll-text-secondary)" }}>
              {understandingText}
            </p>
          )}
        </div>

        {/* Right: optional "Not Ready" card, then improvement cards */}
        <div className="lg:col-span-2 space-y-4">
          {statusLabel === "Needs Attention" && fundingSummary != null && fundingSummary.savingsGap > 0 && (
            <div
              className="enrollment-card rounded-2xl border-2 border-[var(--danger)] p-5"
              style={{ background: "var(--enroll-soft-bg)" }}
            >
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: "rgb(var(--color-danger-rgb) / 0.15)", color: "var(--danger)" }}>
                  <AlertCircle className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold mb-1" style={{ color: "var(--danger)" }}>You&apos;re Not Ready Yet</h3>
                  <p className="text-sm mb-2" style={{ color: "var(--enroll-text-secondary)" }}>
                    Your current savings gap suggests taking action to improve your retirement readiness.
                  </p>
                  <div className="flex flex-wrap gap-4">
                    <div>
                      <p className="text-xs font-medium mb-0.5" style={{ color: "var(--enroll-text-secondary)" }}>Current Gap</p>
                      <p className="text-lg font-bold tabular-nums" style={{ color: "var(--danger)" }}>{formatCurrency(fundingSummary.savingsGap)}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
          <h3 className="text-lg font-semibold" style={{ color: "var(--enroll-text-primary)" }}>
            Recommendations
          </h3>
          {improvements.length === 0 ? (
            <p className="text-sm" style={{ color: "var(--enroll-text-secondary)" }}>
              You're on track. No recommendations at this time.
            </p>
          ) : (
            <div className="space-y-4">
              {improvements.map((card) => (
                <div
                  key={card.id}
                  className="enrollment-card rounded-2xl border p-5"
                  style={{
                    background: "var(--enroll-card-bg)",
                    borderColor: "var(--enroll-card-border)",
                  }}
                >
                  <div className="flex items-start gap-4">
                    {card.icon && (
                      <div
                        className="w-12 h-12 rounded-[10px] flex items-center justify-center flex-shrink-0"
                        style={{ background: "var(--enroll-soft-bg)", border: "1px solid var(--enroll-card-border)" }}
                      >
                        {card.icon}
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap mb-1">
                        <h4 className="text-base font-bold" style={{ color: "var(--enroll-text-primary)" }}>
                          {card.title}
                        </h4>
                        {(card.impactType != null || card.scoreIncrease != null) && (
                          <span
                            className="text-[10px] font-semibold px-1.5 py-0.5 rounded inline-flex items-center gap-1"
                            style={{ background: "var(--enroll-soft-bg)", color: "var(--enroll-brand)", border: "1px solid var(--enroll-card-border)" }}
                          >
                            <Sparkles className="w-2.5 h-2.5" />
                            AI
                          </span>
                        )}
                      </div>
                      <p className="text-sm mb-2" style={{ color: "var(--enroll-text-secondary)" }}>
                        {card.description}
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {card.impactText && (
                          <span className="text-xs font-medium" style={{ color: "var(--enroll-brand)" }}>
                            {card.impactText}
                          </span>
                        )}
                        {card.scoreIncrease != null && (
                          <span className="text-xs font-medium px-2 py-0.5 rounded" style={{ background: "var(--enroll-soft-bg)", color: "var(--enroll-accent)", border: "1px solid var(--enroll-card-border)" }}>
                            +{card.scoreIncrease} pts
                          </span>
                        )}
                        {card.impactType && (
                          <span
                            className="text-xs font-medium px-2 py-1 rounded h-[26px] flex items-center"
                            style={{
                              background: "var(--enroll-soft-bg)",
                              color: "var(--enroll-text-secondary)",
                              border: "1px solid var(--enroll-card-border)",
                            }}
                          >
                            {card.impactType}
                          </span>
                        )}
                      </div>
                    </div>
                    {onApplyRecommendation && (
                      <button
                        type="button"
                        onClick={() => onApplyRecommendation(card.id)}
                        className="flex-shrink-0 text-sm font-semibold px-4 py-2 rounded-[10px] border transition-opacity hover:opacity-90"
                        style={{
                          background: "var(--enroll-card-bg)",
                          borderColor: "var(--enroll-card-border)",
                          color: "var(--enroll-brand)",
                        }}
                      >
                        Apply
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {children}
    </div>
  );
}
