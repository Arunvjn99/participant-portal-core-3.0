import { useState } from "react";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import { Link, useLocation } from "react-router-dom";
import Button from "../ui/Button";
import { AllocationChart } from "./AllocationChart";
import { useInvestment } from "@/context/InvestmentContext";
import { AdvisorHelpWizard } from "./AdvisorHelpWizard";
import { useUser } from "@/context/UserContext";
import { useEnrollmentOptional } from "@/enrollment/context/EnrollmentContext";
import { useInvestmentWizardOpen } from "@/context/InvestmentWizardContext";
import { getRoutingVersion, withVersion } from "@/core/version";

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

export const AllocationSummary = ({ variant = "dashboard" }: AllocationSummaryProps) => {
  const { t } = useTranslation();
  const { pathname } = useLocation();
  const version = getRoutingVersion(pathname);
  const { weightedSummary, chartAllocations, isCustomAllocationEnabled } = useInvestment();
  const { profile } = useUser();
  const enrollment = useEnrollmentOptional();
  const openWizard = useInvestmentWizardOpen();
  const [showAdvisorWizard, setShowAdvisorWizard] = useState(false);

  const totalAllocation = chartAllocations.reduce((s, a) => s + a.percentage, 0);
  const currentAge = enrollment?.state.currentAge ?? 30;
  const retirementAge = enrollment?.state.retirementAge ?? 65;
  const yearsToRetirement = Math.max(0, retirementAge - currentAge);
  const retirementYear = new Date().getFullYear() + yearsToRetirement;
  const riskComfortKey = weightedSummary.riskLevel < 4 ? "enrollment.riskConservative" : weightedSummary.riskLevel < 7 ? "enrollment.riskModerate" : "enrollment.riskAggressive";

  return (
    <>
      <div className="space-y-6">
        {/* Compact Investor Profile Summary — above Advisor card */}
        {variant === "enrollment" && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, delay: 0.05 }}
            className="p-3.5 rounded-xl"
            style={{
              background: "var(--enroll-soft-bg)",
              border: "1px solid var(--enroll-card-border)",
            }}
          >
            <div className="flex items-center justify-between gap-2 mb-2">
              <h4 className="text-xs font-bold uppercase tracking-wider" style={{ color: "var(--enroll-text-muted)" }}>
                {t("enrollment.investorProfile")}
              </h4>
              {openWizard ? (
                <button
                  type="button"
                  onClick={openWizard}
                  className="text-[11px] font-semibold"
                  style={{ color: "var(--enroll-brand)" }}
                >
                  {t("enrollment.editProfile")}
                </button>
              ) : (
                <Link
                  to={withVersion(version, "/enrollment/contribution")}
                  className="text-[11px] font-semibold"
                  style={{ color: "var(--enroll-brand)" }}
                >
                  {t("enrollment.editProfile")}
                </Link>
              )}
            </div>
            <div className="grid grid-cols-2 gap-x-4 gap-y-1.5 text-[11px]">
              <span style={{ color: "var(--enroll-text-muted)" }}>{t("enrollment.ageLabel")}</span>
              <span className="font-medium" style={{ color: "var(--enroll-text-primary)" }}>{currentAge}</span>
              <span style={{ color: "var(--enroll-text-muted)" }}>{t("enrollment.retirementTargetYear")}</span>
              <span className="font-medium" style={{ color: "var(--enroll-text-primary)" }}>{retirementYear}</span>
              <span style={{ color: "var(--enroll-text-muted)" }}>{t("enrollment.riskComfort")}</span>
              <span className="font-medium" style={{ color: "var(--enroll-text-primary)" }}>{t(riskComfortKey)}</span>
              <span style={{ color: "var(--enroll-text-muted)" }}>{t("enrollment.investmentHorizon")}</span>
              <span className="font-medium" style={{ color: "var(--enroll-text-primary)" }}>{yearsToRetirement} {t("enrollment.years")}</span>
            </div>
          </motion.div>
        )}

        {/* Advisor card — "Optimize your portfolio with AI" */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, delay: 0.1 }}
          className="p-5 relative overflow-hidden"
          style={{
            ...cardStyle,
            background: "rgb(var(--enroll-brand-rgb) / 0.04)",
            border: "1px solid rgb(var(--enroll-brand-rgb) / 0.1)",
          }}
        >
          <div className="flex items-center gap-3 mb-3">
            <div
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg advisor-card-icon-pulse"
              style={{ background: "rgb(var(--enroll-brand-rgb) / 0.1)", color: "var(--enroll-brand)" }}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M12 2a10 10 0 0 1 7.38 16.75l-1.67-4.38A4 4 0 0 0 14 12h-4a4 4 0 0 0-3.71 2.37l-1.67 4.38A10 10 0 0 1 12 2z" />
              </svg>
            </div>
            <h4 className="text-sm font-bold" style={{ color: "var(--enroll-text-primary)" }}>
              {t("enrollment.optimizePortfolioWithAi")}
            </h4>
          </div>
          <p className="text-xs leading-relaxed mb-3" style={{ color: "var(--enroll-text-secondary)" }}>
            {t("enrollment.advisorDescOptimize")}
          </p>
          <Button
            type="button"
            variant="outline"
            className="w-full text-sm"
            onClick={() => setShowAdvisorWizard(true)}
          >
            {isCustomAllocationEnabled ? t("enrollment.reoptimizeAllocation") : t("enrollment.optimizeAutomatically")}
          </Button>
        </motion.div>

        {/* Allocation summary — donut + legend only; risk block removed */}
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

          <AllocationChart
            allocations={chartAllocations}
            centerLabel={t("enrollment.totalLabel")}
            centerValue={totalAllocation.toFixed(0)}
            showValidBadge
            isValid={weightedSummary.isValid}
          />
        </motion.div>
      </div>

      <AdvisorHelpWizard
        open={showAdvisorWizard}
        onClose={() => setShowAdvisorWizard(false)}
        userName={profile?.name ?? "there"}
      />
    </>
  );
};
