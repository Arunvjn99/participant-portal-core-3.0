import { motion } from "framer-motion";
import { TrendingUp, CheckCircle2, AlertTriangle, Target } from "lucide-react";
import { useId } from "react";
import { cn } from "@/lib/utils";

interface TransactionCenterRetirementWidgetProps {
  estimatedValue?: number;
  ytdChange?: number;
  contributionsThisYear?: number;
  contributionLimit?: number;
  growthRate?: number;
  yearsToRetire?: number;
  targetAge?: number;
  retirementGoal?: number;
  onTrack?: boolean;
  impactAmount?: number;
  impactLabel?: string;
  compact?: boolean;
  delay?: number;
}

function MiniChart({ positive = true, compact = false }: { positive?: boolean; compact?: boolean }) {
  const uid = useId();
  const h = compact ? 48 : 64;
  const w = compact ? 200 : 260;
  const points = positive
    ? [
        [0, h * 0.75],
        [w * 0.15, h * 0.7],
        [w * 0.3, h * 0.62],
        [w * 0.45, h * 0.55],
        [w * 0.6, h * 0.42],
        [w * 0.75, h * 0.28],
        [w * 0.9, h * 0.18],
        [w, h * 0.12],
      ]
    : [
        [0, h * 0.75],
        [w * 0.15, h * 0.7],
        [w * 0.3, h * 0.6],
        [w * 0.45, h * 0.5],
        [w * 0.6, h * 0.45],
        [w * 0.75, h * 0.5],
        [w * 0.9, h * 0.55],
        [w, h * 0.58],
      ];

  const linePoints = points.map((p) => `${p[0]},${p[1]}`).join(" ");
  const areaPoints = `0,${h} ${linePoints} ${w},${h}`;
  const gradientId = `${uid}-${positive ? "pos" : "neg"}`;
  const lineColor = positive ? "var(--color-primary)" : "var(--color-danger)";
  const fillColor = positive ? "var(--color-primary)" : "var(--color-danger)";

  const years = ["2020", "2022", "2024", "2026"];

  return (
    <div style={{ padding: compact ? "8px 0" : "12px 0" }}>
      <svg width="100%" viewBox={`0 0 ${w} ${h + 16}`} preserveAspectRatio="none" aria-hidden>
        <defs>
          <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={fillColor} stopOpacity="0.12" />
            <stop offset="100%" stopColor={fillColor} stopOpacity="0.01" />
          </linearGradient>
        </defs>
        <polygon points={areaPoints} fill={`url(#${gradientId})`} />
        <polyline
          points={linePoints}
          fill="none"
          stroke={lineColor}
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <circle
          cx={points[points.length - 1][0]}
          cy={points[points.length - 1][1]}
          r="4"
          fill={lineColor}
          stroke="var(--card-bg)"
          strokeWidth="2"
        />
        {years.map((year, i) => (
          <text
            key={year}
            x={i * (w / (years.length - 1))}
            y={h + 14}
            textAnchor={i === 0 ? "start" : i === years.length - 1 ? "end" : "middle"}
            fill="var(--color-text-tertiary)"
            fontSize="9"
            fontWeight="500"
            fontFamily="inherit"
          >
            {year}
          </text>
        ))}
      </svg>
    </div>
  );
}

export function TransactionCenterRetirementWidget({
  estimatedValue = 38420,
  ytdChange: _ytdChange = 12.4,
  contributionsThisYear = 5538,
  contributionLimit = 23500,
  growthRate = 7.2,
  yearsToRetire = 28,
  targetAge = 65,
  retirementGoal = 450000,
  onTrack = true,
  impactAmount,
  impactLabel,
  compact = false,
  delay = 0,
}: TransactionCenterRetirementWidgetProps) {
  const contributionPercent = Math.round((contributionsThisYear / contributionLimit) * 1000) / 10;
  const showImpact = impactAmount !== undefined && impactAmount !== 0;
  const projectedBalance = Math.round(estimatedValue * (1 + growthRate / 100) ** yearsToRetire);
  const goalProgress = Math.min(100, Math.round((projectedBalance / retirementGoal) * 100));
  const currentAge = targetAge - yearsToRetire;

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut", delay }}
    >
      <div
        style={{
          background: "var(--card-bg)",
          borderRadius: 16,
          border: "1px solid var(--border)",
          overflow: "hidden",
          position: "relative",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: 3,
            background:
              showImpact && impactAmount! < 0
                ? "linear-gradient(90deg, var(--color-danger), var(--color-warning))"
                : "linear-gradient(90deg, var(--color-primary), color-mix(in srgb, var(--color-primary) 72%, var(--foreground)))",
            borderRadius: "16px 16px 0 0",
          }}
        />

        <div style={{ padding: compact ? "14px 18px" : "16px 20px" }}>
          <div style={{ marginBottom: 10 }}>
            <div
              style={{
                fontSize: 11,
                fontWeight: 600,
                color: "var(--color-text-secondary)",
                textTransform: "uppercase",
                letterSpacing: "0.5px",
                marginBottom: 4,
              }}
            >
              Projected at Age {targetAge}
            </div>
            <div
              style={{
                fontSize: 32,
                fontWeight: 800,
                color: "var(--foreground)",
                letterSpacing: "-0.5px",
                lineHeight: 1,
              }}
            >
              ${projectedBalance.toLocaleString()}
            </div>
            <div className="mt-1 flex items-center gap-1.5">
              <TrendingUp className="h-[13px] w-[13px] text-emerald-600 dark:text-emerald-400" />
              <span className="text-xs font-semibold text-emerald-700 dark:text-emerald-300">{growthRate}% avg. annual growth</span>
            </div>
          </div>

          <MiniChart positive={!showImpact || impactAmount! >= 0} compact={compact} />

          <div style={{ marginTop: 10, marginBottom: 10 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 4 }}>
              <span
                style={{
                  fontSize: 11,
                  fontWeight: 600,
                  color: "var(--color-text-secondary)",
                  textTransform: "uppercase",
                  letterSpacing: "0.5px",
                }}
              >
                Goal Progress
              </span>
              <span style={{ fontSize: 13, fontWeight: 700, color: "var(--foreground)" }}>{goalProgress}%</span>
            </div>
            <div
              style={{
                height: 8,
                borderRadius: 4,
                background: "var(--border)",
                overflow: "hidden",
                position: "relative",
              }}
            >
              <div
                style={{
                  height: "100%",
                  width: `${goalProgress}%`,
                  background:
                    "linear-gradient(90deg, var(--color-success), color-mix(in srgb, var(--color-success) 78%, var(--foreground)))",
                  transition: "width 0.4s ease",
                  borderRadius: 4,
                }}
              />
            </div>
            <div style={{ fontSize: 11, color: "var(--color-text-tertiary)", marginTop: 3 }}>${retirementGoal.toLocaleString()} retirement goal</div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 10 }}>
            <div>
              <div
                style={{
                  fontSize: 10,
                  fontWeight: 600,
                  color: "var(--color-text-tertiary)",
                  textTransform: "uppercase",
                  letterSpacing: "0.5px",
                  marginBottom: 3,
                }}
              >
                2026 Contributions
              </div>
              <div style={{ fontSize: 16, fontWeight: 700, color: "var(--foreground)" }}>{contributionPercent}%</div>
              <div style={{ fontSize: 10, color: "var(--color-text-tertiary)" }}>
                ${contributionsThisYear.toLocaleString()} / ${contributionLimit.toLocaleString()}
              </div>
            </div>
            <div>
              <div
                style={{
                  fontSize: 10,
                  fontWeight: 600,
                  color: "var(--color-text-tertiary)",
                  textTransform: "uppercase",
                  letterSpacing: "0.5px",
                  marginBottom: 3,
                }}
              >
                Years to Retire
              </div>
              <div style={{ fontSize: 16, fontWeight: 700, color: "var(--foreground)" }}>{yearsToRetire}</div>
              <div style={{ fontSize: 10, color: "var(--color-text-tertiary)" }}>
                Age {currentAge} → {targetAge}
              </div>
            </div>
          </div>

          {showImpact && impactLabel ? (
            <div
              className={cn(
                "mb-2.5 flex items-center gap-2.5 rounded-[10px] border p-2",
                impactAmount! < 0
                  ? "border-amber-200/90 bg-gradient-to-br from-amber-50 to-orange-50/95 dark:border-amber-500/30 dark:from-amber-950/45 dark:to-orange-950/35"
                  : "border-emerald-200/90 bg-gradient-to-br from-emerald-50 to-green-50/95 dark:border-emerald-600/35 dark:from-emerald-950/40 dark:to-green-950/30",
              )}
            >
              {impactAmount! < 0 ? (
                <AlertTriangle className="h-4 w-4 flex-shrink-0 text-amber-600 dark:text-amber-400" />
              ) : (
                <TrendingUp className="h-4 w-4 flex-shrink-0 text-emerald-600 dark:text-emerald-400" />
              )}
              <div className="min-w-0 flex-1">
                <div
                  className={cn(
                    "text-[11px] font-semibold",
                    impactAmount! < 0
                      ? "text-amber-900 dark:text-amber-100"
                      : "text-emerald-800 dark:text-emerald-200",
                  )}
                >
                  {impactLabel}
                </div>
                <div
                  className={cn(
                    "text-[13px] font-bold",
                    impactAmount! < 0
                      ? "text-amber-800 dark:text-amber-200"
                      : "text-emerald-700 dark:text-emerald-300",
                  )}
                >
                  {impactAmount! < 0 ? "-" : "+"}${Math.abs(impactAmount!).toLocaleString()}
                </div>
              </div>
            </div>
          ) : null}

          {onTrack && !showImpact ? (
            <div className="flex items-center gap-2 rounded-lg border border-emerald-200/90 bg-gradient-to-br from-emerald-50 to-green-50/95 p-2 dark:border-emerald-600/35 dark:from-emerald-950/40 dark:to-green-950/30">
              <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
              <span className="text-xs font-semibold text-emerald-800 dark:text-emerald-200">
                You&apos;re on track to meet your goal
              </span>
            </div>
          ) : null}

          {!onTrack && !showImpact ? (
            <div className="flex items-center gap-2 rounded-lg border border-amber-200/90 bg-gradient-to-br from-amber-50 to-orange-50/95 p-2 dark:border-amber-500/30 dark:from-amber-950/45 dark:to-orange-950/35">
              <Target className="h-3.5 w-3.5 text-amber-600 dark:text-amber-400" />
              <span className="text-xs font-semibold text-amber-900 dark:text-amber-100">Consider increasing contributions</span>
            </div>
          ) : null}
        </div>
      </div>
    </motion.div>
  );
}
