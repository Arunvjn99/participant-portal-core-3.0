import { useState } from "react";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import Button from "../ui/Button";
import { AllocationChart } from "./AllocationChart";
import { useInvestment } from "../../context/InvestmentContext";
import { AdvisorHelpWizard } from "./AdvisorHelpWizard";

type AllocationSummaryVariant = "enrollment" | "dashboard";

interface AllocationSummaryProps {
  variant?: AllocationSummaryVariant;
}

const cardStyle: React.CSSProperties = {
  background: "var(--enroll-card-bg)",
  border: "1px solid var(--enroll-card-border)",
  borderRadius: "var(--enroll-card-radius)",
  boxShadow: "var(--enroll-elevation-2)",
};

function getRiskLevelKey(risk: number): string {
  if (risk < 3) return "enrollment.riskConservative";
  if (risk < 5) return "enrollment.riskModerate";
  if (risk < 7) return "enrollment.riskModerateAggressive";
  return "enrollment.riskAggressive";
}

function getRiskColor(risk: number): string {
  if (risk < 3) return "var(--enroll-accent)";
  if (risk < 5) return "var(--enroll-brand)";
  if (risk < 7) return "var(--color-warning)";
  return "var(--color-danger)";
}

export const AllocationSummary = ({ variant = "dashboard" }: AllocationSummaryProps) => {
  const { t } = useTranslation();
  const { weightedSummary, chartAllocations } = useInvestment();
  const [showAdvisorWizard, setShowAdvisorWizard] = useState(false);

  const riskPercent = Math.min(100, (weightedSummary.riskLevel / 10) * 100);
  const riskLabel = t(getRiskLevelKey(weightedSummary.riskLevel));
  const riskColor = getRiskColor(weightedSummary.riskLevel);
  const totalAllocation = chartAllocations.reduce((s, a) => s + a.percentage, 0);

  return (
    <>
      <div className="space-y-6">
        {/* Advisor help card — first */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, delay: 0.1 }}
          className="p-5"
          style={{
            ...cardStyle,
            background: "rgb(var(--enroll-brand-rgb) / 0.04)",
            border: "1px solid rgb(var(--enroll-brand-rgb) / 0.1)",
          }}
        >
          <div className="flex items-center gap-3 mb-3">
            <div
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg"
              style={{ background: "rgb(var(--enroll-brand-rgb) / 0.1)", color: "var(--enroll-brand)" }}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                <circle cx="12" cy="7" r="4" />
              </svg>
            </div>
            <h4 className="text-sm font-bold" style={{ color: "var(--enroll-text-primary)" }}>
              {t("enrollment.needHelpChoosing")}
            </h4>
          </div>
          <p className="text-xs leading-relaxed mb-3" style={{ color: "var(--enroll-text-secondary)" }}>
            {t("enrollment.advisorHelpDesc")}
          </p>
          <Button
            type="button"
            variant="outline"
            className="w-full text-sm"
            onClick={() => setShowAdvisorWizard(true)}
          >
            {t("enrollment.getAdvisorHelp")}
          </Button>
        </motion.div>

        {/* Allocation summary widget — second */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, delay: 0.2 }}
          className="p-6"
          style={cardStyle}
        >
          <h3 className="text-sm font-bold" style={{ color: "var(--enroll-text-primary)" }}>
            {t("enrollment.allocationSummary")}
          </h3>
          <p className="text-xs mt-0.5 mb-5" style={{ color: "var(--enroll-text-muted)" }}>
            {t("enrollment.realtimeImpactElections")}
          </p>

          {/* Donut chart */}
          <AllocationChart
            allocations={chartAllocations}
            centerLabel={t("enrollment.totalLabel")}
            centerValue={totalAllocation.toFixed(0)}
            showValidBadge
            isValid={weightedSummary.isValid}
          />

          {/* Risk meter */}
          <div className="mt-6 pt-5" style={{ borderTop: "1px solid var(--enroll-card-border)" }}>
            <div className="flex justify-between text-[10px] font-bold uppercase tracking-wider mb-2" style={{ color: "var(--enroll-text-muted)" }}>
              <span>{t("enrollment.riskConservative")}</span>
              <span>{t("enrollment.riskAggressive")}</span>
            </div>
            <div className="h-2 w-full rounded-full overflow-hidden" style={{ background: "var(--enroll-soft-bg)" }}>
              <motion.div
                className="h-full rounded-full"
                animate={{ width: `${riskPercent}%` }}
                transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
                style={{ background: riskColor }}
              />
            </div>
            <p className="text-xs font-semibold mt-2" style={{ color: riskColor }}>
              {t("enrollment.riskLevelLabel", { level: riskLabel })}
            </p>
          </div>
        </motion.div>
      </div>

      <AdvisorHelpWizard
        open={showAdvisorWizard}
        onClose={() => setShowAdvisorWizard(false)}
        userName="Satish"
      />
    </>
  );
};
