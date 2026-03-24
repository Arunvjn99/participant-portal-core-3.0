import { useState, useCallback } from "react";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import { FundAllocationSection } from "./FundAllocationSection";
import { useInvestment } from "@/context/InvestmentContext";
import { useEnrollmentOptional } from "@/enrollment/context/EnrollmentContext";
import { useInvestmentWizardOpen } from "@/context/InvestmentWizardContext";
import { deriveStyleFromRiskScore } from "@/utils/investmentAllocationHelpers";
import type { InvestmentStyleKey } from "@/utils/investmentAllocationHelpers";
import { Shield, Scale, TrendingUp, Zap } from "lucide-react";

const STYLE_LABEL_KEYS: Record<InvestmentStyleKey, string> = {
  conservative: "enrollment.personalityConservative",
  balanced: "enrollment.personalityBalanced",
  growth: "enrollment.personalityGrowth",
  aggressive: "enrollment.personalityAggressive",
};

const STYLE_DESC_KEYS: Record<InvestmentStyleKey, string> = {
  conservative: "enrollment.personalityDescStability",
  balanced: "enrollment.personalityDescGrowthStability",
  growth: "enrollment.personalityDescHigherReturns",
  aggressive: "enrollment.personalityDescMaxGrowth",
};

const STYLE_ICONS: Record<InvestmentStyleKey, React.ComponentType<{ className?: string; style?: React.CSSProperties }>> = {
  conservative: Shield,
  balanced: Scale,
  growth: TrendingUp,
  aggressive: Zap,
};

const cardStyle: React.CSSProperties = {
  background: "var(--enroll-card-bg)",
  border: "1px solid var(--enroll-card-border)",
  borderRadius: "var(--enroll-card-radius)",
  boxShadow: "var(--enroll-elevation-2)",
};

export const ManualBuilder = () => {
  const { t } = useTranslation();
  const enrollment = useEnrollmentOptional();
  const openWizard = useInvestmentWizardOpen();
  const profile = enrollment?.state.investmentProfile ?? null;
  const riskTolerance = profile?.riskTolerance ?? 3;
  const derivedStyle: InvestmentStyleKey = deriveStyleFromRiskScore(riskTolerance);
  const StyleIcon = STYLE_ICONS[derivedStyle];

  return (
    <div className="space-y-6">
      {/* Single informational style card: "You belong to: X Strategy" */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
      >
        <p
          className="text-[10px] font-bold uppercase tracking-widest mb-3"
          style={{ color: "var(--enroll-text-muted)" }}
        >
          {t("enrollment.investmentStyle")}
        </p>
        <div
          className="p-4 rounded-xl flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
          style={{ ...cardStyle, background: "var(--enroll-soft-bg)", border: "1px solid var(--enroll-card-border)" }}
        >
          <div className="flex items-center gap-3">
            <div
              className="flex h-10 w-10 items-center justify-center rounded-xl shrink-0"
              style={{ background: "rgb(var(--enroll-brand-rgb) / 0.1)", color: "var(--enroll-brand)" }}
            >
              {StyleIcon && <StyleIcon style={{ width: 24, height: 24 }} />}
            </div>
            <div>
              <p className="text-xs font-semibold" style={{ color: "var(--enroll-text-muted)" }}>
                {t("enrollment.youBelongTo")}
              </p>
              <p className="text-sm font-bold" style={{ color: "var(--enroll-text-primary)" }}>
                {t(STYLE_LABEL_KEYS[derivedStyle])} {t("enrollment.strategy")}
              </p>
              <p className="text-[11px] mt-0.5" style={{ color: "var(--enroll-text-secondary)" }}>
                {t(STYLE_DESC_KEYS[derivedStyle])}
              </p>
            </div>
          </div>
          {openWizard && (
            <button
              type="button"
              onClick={openWizard}
              className="shrink-0 inline-flex items-center justify-center px-4 py-2 rounded-lg text-xs font-semibold transition-colors"
              style={{
                background: "rgb(var(--enroll-brand-rgb) / 0.1)",
                color: "var(--enroll-brand)",
                border: "1px solid rgb(var(--enroll-brand-rgb) / 0.2)",
              }}
            >
              {t("enrollment.edit")}
            </button>
          )}
        </div>
      </motion.div>

      <FundAllocationSection />
    </div>
  );
};
