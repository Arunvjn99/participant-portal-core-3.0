import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import Button from "@/components/ui/Button";

export type ReadinessCardProps = {
  score: number;
  max: number;
  statusLabelKey: string;
  descriptionKey: string;
  simulatorLabelKey: string;
  onLaunchSimulator: () => void;
};

const R = 54;
const C = 2 * Math.PI * R;

export function ReadinessCard({
  score,
  max,
  statusLabelKey,
  descriptionKey,
  simulatorLabelKey,
  onLaunchSimulator,
}: ReadinessCardProps) {
  const { t } = useTranslation();
  const targetOffset = C * (1 - score / max);

  return (
    <div className="dashboard-screen-card dashboard-screen-readiness">
      <div className="dashboard-screen-readiness__ring-wrap" aria-hidden>
        <svg className="h-full w-full" viewBox="0 0 120 120">
          <circle className="dashboard-screen-readiness__arc-bg" cx="60" cy="60" r={R} fill="none" />
          <motion.circle
            className="dashboard-screen-readiness__arc"
            cx="60"
            cy="60"
            r={R}
            fill="none"
            strokeDasharray={C}
            initial={{ strokeDashoffset: C }}
            animate={{ strokeDashoffset: targetOffset }}
            transition={{ duration: 1.1, ease: "easeOut" }}
          />
        </svg>
        <div className="dashboard-screen-readiness__score">
          <span className="dashboard-screen-readiness__score-num">
            {score}
          </span>
          <span className="dashboard-screen-readiness__score-max">/ {max}</span>
        </div>
      </div>
      <div className="dashboard-screen-readiness__status">
        <span className="dashboard-screen-readiness__dot" />
        {t(statusLabelKey)}
      </div>
      <p className="dashboard-screen-readiness__desc">{t(descriptionKey)}</p>
      <Button type="button" className="button w-full justify-center" onClick={onLaunchSimulator}>
        {t(simulatorLabelKey)}
      </Button>
    </div>
  );
}
