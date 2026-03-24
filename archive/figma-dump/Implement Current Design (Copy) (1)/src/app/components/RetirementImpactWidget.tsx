import { motion } from "motion/react";
import { TrendingUp, TrendingDown, CheckCircle2, AlertTriangle, Target } from "lucide-react";
import { useId } from "react";

interface RetirementImpactWidgetProps {
  estimatedValue?: number;
  ytdChange?: number;
  contributionsThisYear?: number;
  contributionLimit?: number;
  growthRate?: number;
  yearsToRetire?: number;
  targetAge?: number;
  retirementGoal?: number;
  onTrack?: boolean;
  /** Show impact of a transaction (negative for loans/withdrawals, positive for rollovers) */
  impactAmount?: number;
  impactLabel?: string;
  /** Compact mode for sidebar use */
  compact?: boolean;
  delay?: number;
}

/* Simple SVG sparkline chart */
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
  const lineColor = positive ? "#2563EB" : "#EF4444";
  const fillColor = positive ? "#2563EB" : "#EF4444";

  const years = ["2020", "2022", "2024", "2026"];

  return (
    <div style={{ padding: compact ? "8px 0" : "12px 0" }}>
      <svg width="100%" viewBox={`0 0 ${w} ${h + 16}`} preserveAspectRatio="none">
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
        {/* End dot */}
        <circle
          cx={points[points.length - 1][0]}
          cy={points[points.length - 1][1]}
          r="4"
          fill={lineColor}
          stroke="#fff"
          strokeWidth="2"
        />
        {/* Year labels */}
        {years.map((year, i) => (
          <text
            key={year}
            x={i * (w / (years.length - 1))}
            y={h + 14}
            textAnchor={i === 0 ? "start" : i === years.length - 1 ? "end" : "middle"}
            fill="#94A3B8"
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

export function RetirementImpactWidget({
  estimatedValue = 38420,
  ytdChange = 12.4,
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
}: RetirementImpactWidgetProps) {
  const contributionPercent = Math.round((contributionsThisYear / contributionLimit) * 1000) / 10;
  const isPositiveYtd = ytdChange >= 0;
  const showImpact = impactAmount !== undefined && impactAmount !== 0;
  const adjustedValue = showImpact ? estimatedValue + impactAmount! : estimatedValue;

  // Calculate projected retirement balance
  const currentAge = targetAge - yearsToRetire;
  const projectedBalance = Math.round(
    estimatedValue * Math.pow(1 + growthRate / 100, yearsToRetire)
  );
  const goalProgress = Math.min(100, Math.round((projectedBalance / retirementGoal) * 100));

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut", delay }}
    >
      <div
        style={{
          background: "#fff",
          borderRadius: 16,
          border: "1px solid #F1F5F9",
          overflow: "hidden",
          position: "relative",
        }}
      >
        {/* Top accent bar */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: 3,
            background: showImpact && impactAmount! < 0
              ? "linear-gradient(90deg, #EF4444, #F59E0B)"
              : "linear-gradient(90deg, #2563EB, #0EA5E9)",
            borderRadius: "16px 16px 0 0",
          }}
        />

        {/* Main Content */}
        <div style={{ padding: compact ? "14px 18px" : "16px 20px" }}>
          {/* Projected Balance */}
          <div style={{ marginBottom: 10 }}>
            <div
              style={{
                fontSize: 11,
                fontWeight: 600,
                color: "#64748B",
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
                color: "#1E293B",
                letterSpacing: "-0.5px",
                lineHeight: 1,
              }}
            >
              ${projectedBalance.toLocaleString()}
            </div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 6,
                marginTop: 4,
              }}
            >
              <TrendingUp style={{ width: 13, height: 13, color: "#10B981" }} />
              <span
                style={{
                  fontSize: 12,
                  fontWeight: 600,
                  color: "#059669",
                }}
              >
                {growthRate}% avg. annual growth
              </span>
            </div>
          </div>

          {/* Sparkline Chart */}
          <MiniChart positive={!showImpact || impactAmount! >= 0} compact={compact} />

          {/* Progress toward goal */}
          <div style={{ marginTop: 10, marginBottom: 10 }}>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "baseline",
                marginBottom: 4,
              }}
            >
              <span
                style={{
                  fontSize: 11,
                  fontWeight: 600,
                  color: "#64748B",
                  textTransform: "uppercase",
                  letterSpacing: "0.5px",
                }}
              >
                Goal Progress
              </span>
              <span
                style={{
                  fontSize: 13,
                  fontWeight: 700,
                  color: "#1E293B",
                }}
              >
                {goalProgress}%
              </span>
            </div>
            {/* Progress bar */}
            <div
              style={{
                height: 8,
                borderRadius: 4,
                background: "#E2E8F0",
                overflow: "hidden",
                position: "relative",
              }}
            >
              <div
                style={{
                  height: "100%",
                  width: `${goalProgress}%`,
                  background: "linear-gradient(90deg, #10B981, #059669)",
                  transition: "width 0.4s ease",
                  borderRadius: 4,
                }}
              />
            </div>
            <div
              style={{
                fontSize: 11,
                color: "#94A3B8",
                marginTop: 3,
              }}
            >
              ${retirementGoal.toLocaleString()} retirement goal
            </div>
          </div>

          {/* Stats Grid */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: 10,
              marginBottom: 10,
            }}
          >
            {/* Contribution Progress */}
            <div>
              <div
                style={{
                  fontSize: 10,
                  fontWeight: 600,
                  color: "#94A3B8",
                  textTransform: "uppercase",
                  letterSpacing: "0.5px",
                  marginBottom: 3,
                }}
              >
                2026 Contributions
              </div>
              <div
                style={{
                  fontSize: 16,
                  fontWeight: 700,
                  color: "#1E293B",
                }}
              >
                {contributionPercent}%
              </div>
              <div
                style={{
                  fontSize: 10,
                  color: "#94A3B8",
                }}
              >
                ${contributionsThisYear.toLocaleString()} / ${contributionLimit.toLocaleString()}
              </div>
            </div>

            {/* Years to Retirement */}
            <div>
              <div
                style={{
                  fontSize: 10,
                  fontWeight: 600,
                  color: "#94A3B8",
                  textTransform: "uppercase",
                  letterSpacing: "0.5px",
                  marginBottom: 3,
                }}
              >
                Years to Retire
              </div>
              <div
                style={{
                  fontSize: 16,
                  fontWeight: 700,
                  color: "#1E293B",
                }}
              >
                {yearsToRetire}
              </div>
              <div
                style={{
                  fontSize: 10,
                  color: "#94A3B8",
                }}
              >
                Age {currentAge} → {targetAge}
              </div>
            </div>
          </div>

          {/* Impact Message (if showing impact) */}
          {showImpact && impactLabel && (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
                padding: "8px 12px",
                borderRadius: 10,
                background:
                  impactAmount! < 0
                    ? "linear-gradient(135deg, #FFF7ED, #FFEDD5)"
                    : "linear-gradient(135deg, #F0FDF4, #DCFCE7)",
                border: impactAmount! < 0 ? "1px solid #FED7AA" : "1px solid #BBF7D0",
                marginBottom: 10,
              }}
            >
              {impactAmount! < 0 ? (
                <AlertTriangle style={{ width: 16, height: 16, color: "#F59E0B", flexShrink: 0 }} />
              ) : (
                <TrendingUp style={{ width: 16, height: 16, color: "#10B981", flexShrink: 0 }} />
              )}
              <div style={{ flex: 1 }}>
                <div
                  style={{
                    fontSize: 11,
                    fontWeight: 600,
                    color: impactAmount! < 0 ? "#92400E" : "#059669",
                  }}
                >
                  {impactLabel}
                </div>
                <div
                  style={{
                    fontSize: 13,
                    fontWeight: 700,
                    color: impactAmount! < 0 ? "#B45309" : "#16A34A",
                  }}
                >
                  {impactAmount! < 0 ? "-" : "+"}${Math.abs(impactAmount!).toLocaleString()}
                </div>
              </div>
            </div>
          )}

          {/* On Track Banner */}
          {onTrack && !showImpact && (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                padding: "8px 12px",
                borderRadius: 8,
                background: "linear-gradient(135deg, #F0FDF4, #DCFCE7)",
                border: "1px solid #BBF7D0",
              }}
            >
              <CheckCircle2 style={{ width: 14, height: 14, color: "#10B981" }} />
              <span
                style={{
                  fontSize: 12,
                  fontWeight: 600,
                  color: "#059669",
                }}
              >
                You're on track to meet your goal
              </span>
            </div>
          )}

          {/* Off Track Warning */}
          {!onTrack && !showImpact && (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                padding: "8px 12px",
                borderRadius: 8,
                background: "linear-gradient(135deg, #FFFBEB, #FFF7ED)",
                border: "1px solid #FED7AA",
              }}
            >
              <Target style={{ width: 14, height: 14, color: "#F59E0B" }} />
              <span
                style={{
                  fontSize: 12,
                  fontWeight: 600,
                  color: "#92400E",
                }}
              >
                Consider increasing contributions
              </span>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}