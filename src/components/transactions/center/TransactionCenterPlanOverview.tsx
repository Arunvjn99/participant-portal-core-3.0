import { motion } from "framer-motion";
import svgPaths from "@/imports/transaction-center-figma-svg";

function ShieldIcon({ className }: { className?: string }) {
  return (
    <svg className={className || "w-5 h-5"} fill="none" viewBox="0 0 15 18.34" aria-hidden>
      <path
        d={svgPaths.p30439e00}
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.667"
      />
    </svg>
  );
}

function ChartBarIcon({ className }: { className?: string }) {
  return (
    <svg className={className || "w-5 h-5"} fill="none" viewBox="0 0 20 20" aria-hidden>
      <path
        d={svgPaths.p284f7580}
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.667"
      />
      <path d="M7.833 14.167H15" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.667" />
      <path d="M7.833 10.833H18.333" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.667" />
      <path d="M7.833 7.5H10.833" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.667" />
    </svg>
  );
}

export function TransactionCenterPlanOverview({
  planName,
  planBalanceLabel,
  vestedBalanceLabel,
  vestedPctLabel,
}: {
  planName: string;
  planBalanceLabel: string;
  vestedBalanceLabel: string;
  vestedPctLabel: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="mb-5 sm:mb-6"
    >
      <div
        className="overflow-hidden"
        style={{
          background: "linear-gradient(135deg, color-mix(in srgb, var(--color-primary) 14%, var(--background)) 0%, color-mix(in srgb, var(--color-primary) 10%, var(--muted)) 100%)",
          border: "1px solid color-mix(in srgb, var(--color-primary) 35%, var(--border))",
          borderRadius: 16,
          padding: "24px 28px",
        }}
      >
        <div className="flex flex-col sm:flex-row sm:items-center gap-5 sm:gap-0">
          <div className="flex items-center gap-4">
            <div
              className="flex items-center justify-center flex-shrink-0"
              style={{
                width: 44,
                height: 44,
                borderRadius: 12,
                background: "var(--card-bg)",
                border: "1px solid color-mix(in srgb, var(--color-primary) 35%, var(--border))",
              }}
            >
              <ShieldIcon className="w-5 h-5 text-[var(--color-primary)]" />
            </div>
            <div>
              <p
                className="uppercase"
                style={{
                  fontSize: 10.5,
                  color: "var(--color-text-secondary)",
                  letterSpacing: "0.5px",
                  fontWeight: 700,
                  lineHeight: "14px",
                }}
              >
                Plan Name
              </p>
              <p
                style={{
                  fontSize: 15,
                  fontWeight: 800,
                  color: "var(--foreground)",
                  letterSpacing: "-0.3px",
                  lineHeight: "22px",
                  marginTop: 2,
                }}
              >
                {planName}
              </p>
              <div className="flex items-center gap-1.5 mt-1.5">
                <span
                  className="uppercase"
                  style={{
                    fontSize: 10,
                    color: "var(--color-text-tertiary)",
                    letterSpacing: "0.5px",
                    fontWeight: 600,
                  }}
                >
                  Plan Balance :
                </span>
                <span
                  style={{
                    fontSize: 14,
                    fontWeight: 800,
                    color: "var(--color-primary)",
                    letterSpacing: "-0.3px",
                  }}
                >
                  {planBalanceLabel}
                </span>
              </div>
            </div>
          </div>

          <div className="hidden sm:block mx-10 lg:mx-14" style={{ width: 1, height: 56, background: "color-mix(in srgb, var(--color-primary) 35%, var(--border))" }} />
          <div className="sm:hidden" style={{ height: 1, background: "color-mix(in srgb, var(--color-primary) 35%, var(--border))" }} />

          <div className="flex items-center gap-4">
            <div
              className="flex items-center justify-center flex-shrink-0"
              style={{
                width: 44,
                height: 44,
                borderRadius: 12,
                background: "var(--card-bg)",
                border: "1px solid color-mix(in srgb, var(--color-primary) 35%, var(--border))",
              }}
            >
              <ChartBarIcon className="w-5 h-5 text-[var(--color-primary)]" />
            </div>
            <div>
              <p
                className="uppercase"
                style={{
                  fontSize: 10.5,
                  color: "var(--color-text-secondary)",
                  letterSpacing: "0.5px",
                  fontWeight: 700,
                  lineHeight: "14px",
                }}
              >
                Vested Balance
              </p>
              <div className="flex items-baseline gap-2.5" style={{ marginTop: 2 }}>
                <span
                  style={{
                    fontSize: 28,
                    fontWeight: 800,
                    color: "var(--foreground)",
                    letterSpacing: "-0.5px",
                    lineHeight: "36px",
                  }}
                >
                  {vestedBalanceLabel}
                </span>
                <span style={{ fontSize: 12, color: "var(--color-text-secondary)", fontWeight: 600 }}>{vestedPctLabel}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
