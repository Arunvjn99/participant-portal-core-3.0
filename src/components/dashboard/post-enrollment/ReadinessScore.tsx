import { motion } from "framer-motion";
import { Rocket, Target } from "lucide-react";
import { useTranslation } from "react-i18next";
import { cn } from "@/lib/utils";
import type { ReadinessScoreResult } from "./hooks/useReadinessScore";

function translateReadinessLabel(
  label: ReadinessScoreResult["label"],
  t: (k: string) => string,
): string {
  switch (label) {
    case "On Track":
      return t("dashboard.postEnrollment.onTrack");
    case "Needs Attention":
      return t("dashboard.postEnrollment.peReadinessNeedsAttention");
    case "At Risk":
      return t("dashboard.postEnrollment.peReadinessAtRiskLabel");
    case "Critical":
      return t("dashboard.postEnrollment.peReadinessCritical");
    default:
      return label;
  }
}

type Props = {
  readiness: ReadinessScoreResult;
  onLaunchSimulator: () => void;
  showWarnings?: boolean;
  launchDisabled?: boolean;
  className?: string;
};

const RADIUS = 60;
const STROKE_WIDTH = 10;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;
const VIEW_SIZE = (RADIUS + STROKE_WIDTH) * 2;
const CENTER = VIEW_SIZE / 2;

const ease = [0.25, 0.1, 0.25, 1] as const;

export function ReadinessScore({
  readiness,
  onLaunchSimulator,
  showWarnings = false,
  launchDisabled = false,
  className,
}: Props) {
  const { t } = useTranslation();
  const clamped = Math.max(0, Math.min(100, readiness.score));
  const offset = CIRCUMFERENCE - (clamped / 100) * CIRCUMFERENCE;

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease, delay: 0.05 }}
      className={cn("rounded-2xl border border-border bg-card p-5 shadow-sm", className)}
    >
      <div className="mb-5 flex items-center gap-2">
        <Target className="h-4 w-4 text-muted-foreground" aria-hidden />
        <h3 className="text-sm font-semibold text-foreground">{t("dashboard.postEnrollment.peReadinessTitle")}</h3>
      </div>

      {showWarnings ? (
        <p
          role="status"
          className="mb-3 rounded-lg border border-amber-500/35 bg-amber-500/10 px-3 py-2 text-xs font-medium text-amber-900 dark:text-amber-100"
        >
          {t("dashboard.postEnrollment.peScenarioWarning")}
        </p>
      ) : null}

      <div className="flex flex-col items-center">
        <div className="relative">
          <svg
            width={VIEW_SIZE}
            height={VIEW_SIZE}
            viewBox={`0 0 ${VIEW_SIZE} ${VIEW_SIZE}`}
            className="-rotate-90"
          >
            <circle
              cx={CENTER}
              cy={CENTER}
              r={RADIUS}
              fill="none"
              strokeWidth={STROKE_WIDTH}
              className="stroke-muted"
            />
            <motion.circle
              cx={CENTER}
              cy={CENTER}
              r={RADIUS}
              fill="none"
              strokeWidth={STROKE_WIDTH}
              strokeLinecap="round"
              stroke={readiness.color}
              strokeDasharray={CIRCUMFERENCE}
              initial={{ strokeDashoffset: CIRCUMFERENCE }}
              animate={{ strokeDashoffset: offset }}
              transition={{ duration: 0.8, ease, delay: 0.2 }}
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-4xl font-bold text-foreground">{clamped}</span>
            <span className="text-xs text-muted-foreground">/100</span>
          </div>
        </div>

        <div className="mt-4 flex items-center gap-1.5">
          <span className="h-2 w-2 rounded-full bg-emerald-500" aria-hidden />
          <span className="text-xs font-medium text-emerald-600 dark:text-emerald-400">
            {translateReadinessLabel(readiness.label, t)}
          </span>
        </div>

        <p className="mt-3 text-center text-xs text-muted-foreground">
          {t("dashboard.postEnrollment.peReadinessReplaceIncome", { percent: readiness.replacementPercent })}
        </p>

        <motion.button
          type="button"
          onClick={launchDisabled ? undefined : onLaunchSimulator}
          disabled={launchDisabled}
          aria-disabled={launchDisabled}
          whileHover={launchDisabled ? undefined : { scale: 1.02 }}
          whileTap={launchDisabled ? undefined : { scale: 0.98 }}
          className={cn(
            "mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-foreground px-4 py-2.5 text-sm font-medium text-background transition-opacity hover:opacity-90 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2",
            launchDisabled && "cursor-not-allowed opacity-60",
          )}
        >
          <Rocket className="h-4 w-4" aria-hidden />
          {t("dashboard.postEnrollment.peLaunchSimulator")}
        </motion.button>
      </div>
    </motion.div>
  );
}
