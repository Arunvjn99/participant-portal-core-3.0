import { useState, useMemo, useCallback, useRef, useEffect } from "react";
import { useNavigate, Navigate, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import i18n from "i18next";
import { motion, AnimatePresence } from "framer-motion";
import { useEnrollment } from "@/enrollment/context/EnrollmentContext";
import { useInvestment } from "@/context/InvestmentContext";
import { getFundById } from "@/data/mockFunds";
import { EnrollmentFooter } from "@/components/enrollment/EnrollmentFooter";
import { EnrollmentPageContent } from "@/components/enrollment/EnrollmentPageContent";
import { AIAdvisorModal } from "@/components/enrollment/AIAdvisorModal";
import { SuccessEnrollmentModal } from "@/components/enrollment/SuccessEnrollmentModal";
import { FeedbackModal } from "@/components/feedback/FeedbackModal";
import type { SelectedPlanId } from "@/enrollment/context/EnrollmentContext";
import type { ContributionSource, IncrementCycle } from "@/enrollment/logic/types";
import { getRoutingVersion, withVersion } from "@/core/version";

/* ═══════════════════════════════════════════════════════
   CONSTANTS
   ═══════════════════════════════════════════════════════ */

const PLAN_NAME_KEYS: Record<Exclude<SelectedPlanId, null>, string> = {
  traditional_401k: "enrollment.traditional401k",
  roth_401k: "enrollment.roth401k",
  roth_ira: "enrollment.rothIra",
};

const SOURCE_KEYS: Record<ContributionSource, string> = {
  preTax: "enrollment.preTax",
  roth: "enrollment.roth",
  afterTax: "enrollment.afterTax",
};

const INCREMENT_CYCLE_KEYS: Record<IncrementCycle, string> = {
  calendar_year: "enrollment.calendarYear",
  plan_enroll_date: "enrollment.planEnrollDate",
  plan_year: "enrollment.planYear",
};

/* ── Shared card style ── */
const cardStyle: React.CSSProperties = {
  background: "var(--enroll-card-bg)",
  border: "1px solid var(--enroll-card-border)",
  borderRadius: "var(--enroll-card-radius)",
  boxShadow: "var(--enroll-elevation-2)",
};

/* ── Animated count-up ── */
function useAnimatedValue(target: number, duration = 600): number {
  const [current, setCurrent] = useState(target);
  const raf = useRef(0);
  const startRef = useRef(current);
  const startTime = useRef(0);

  useEffect(() => {
    startRef.current = current;
    startTime.current = performance.now();
    const animate = (now: number) => {
      const t = Math.min((now - startTime.current) / duration, 1);
      const eased = 1 - Math.pow(1 - t, 3);
      setCurrent(startRef.current + (target - startRef.current) * eased);
      if (t < 1) raf.current = requestAnimationFrame(animate);
    };
    raf.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(raf.current);
  }, [target, duration]);

  return current;
}

/* ── Helpers ── */
const locale = () => i18n.language || "en-US";

function formatCurrency(n: number): string {
  return new Intl.NumberFormat(locale(), { style: "currency", currency: "USD", minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(Number.isFinite(n) && n >= 0 ? n : 0);
}

function formatPercent(value: number, decimals = 1): string {
  return new Intl.NumberFormat(locale(), { style: "percent", minimumFractionDigits: decimals, maximumFractionDigits: decimals }).format(Number.isFinite(value) ? value / 100 : 0);
}

const ASSET_CLASS_KEYS: Record<string, string> = {
  "Large Cap": "enrollment.assetClassLargeCap",
  "Mid Cap": "enrollment.assetClassMidCap",
  "Small Cap": "enrollment.assetClassSmallCap",
  International: "enrollment.assetClassInternational",
  Intl: "enrollment.assetClassIntl",
  Bond: "enrollment.assetClassBond",
  "Real Estate": "enrollment.assetClassRealEstate",
  REIT: "enrollment.assetClassReit",
  Cash: "enrollment.assetClassCash",
  Target: "enrollment.assetClassTarget",
};

function getAssetClassKey(ac: string): string {
  for (const [needle, key] of Object.entries(ASSET_CLASS_KEYS)) {
    if (ac.includes(needle)) return key;
  }
  return ac;
}

/* ═══════════════════════════════════════════════════════
   REVIEW PAGE
   ═══════════════════════════════════════════════════════ */
export const Review = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const version = getRoutingVersion(pathname);
  const enrollment = useEnrollment();
  const investment = useInvestment();

  const [acknowledgements, setAcknowledgements] = useState({ termsAccepted: false });
  const [showAdvisorModal, setShowAdvisorModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showEnrollmentFeedback, setShowEnrollmentFeedback] = useState(false);
  const [pendingFeedback, setPendingFeedback] = useState(false);
  const [feedbackMessage, setFeedbackMessage] = useState<string | null>(null);
  const feedbackTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  useEffect(() => {
    if (!pendingFeedback || showSuccessModal) return;
    const timer = setTimeout(() => {
      setPendingFeedback(false);
      setShowEnrollmentFeedback(true);
    }, 400);
    return () => clearTimeout(timer);
  }, [pendingFeedback, showSuccessModal]);

  const showFeedback = useCallback((msg: string) => {
    if (feedbackTimeoutRef.current) clearTimeout(feedbackTimeoutRef.current);
    setFeedbackMessage(msg);
    feedbackTimeoutRef.current = setTimeout(() => {
      setFeedbackMessage(null);
      feedbackTimeoutRef.current = null;
    }, 4000);
  }, []);

  /* ── Prerequisites ── */
  const prerequisites = useMemo(() => {
    if (!enrollment.state.isInitialized) return { hasPlan: false, hasContribution: false, hasInvestment: false, allMet: false, loading: true };
    const hasPlan = enrollment.state.selectedPlan !== null;
    const hasContribution = enrollment.state.contributionAmount > 0;
    const hasInvestment = investment.canConfirmAllocation;
    return { hasPlan, hasContribution, hasInvestment, allMet: hasPlan && hasContribution && hasInvestment, loading: false };
  }, [enrollment.state.isInitialized, enrollment.state.selectedPlan, enrollment.state.contributionAmount, investment.canConfirmAllocation]);

  if (prerequisites.loading) return null;
  if (!prerequisites.hasPlan) return <Navigate to={withVersion(version, "/enrollment/choose-plan")} replace />;
  if (!prerequisites.hasContribution) return <Navigate to={withVersion(version, "/enrollment/contribution")} replace />;

  /* ── Data ── */
  const selectedPlanName = enrollment.state.selectedPlan ? t(PLAN_NAME_KEYS[enrollment.state.selectedPlan]) : "";
  const { preTax = 0, roth = 0, afterTax = 0 } = enrollment.state.sourceAllocation ?? {};
  const contributionTotal = enrollment.state.contributionAmount ?? 0;

  const fundTableRows = useMemo(() => {
    return investment.chartAllocations
      .filter((a) => a.percentage > 0)
      .sort((a, b) => b.percentage - a.percentage)
      .map(({ fundId, percentage }) => {
        const fund = getFundById(fundId);
        return fund ? { fund, percentage } : null;
      })
      .filter(Boolean) as { fund: NonNullable<ReturnType<typeof getFundById>>; percentage: number }[];
  }, [investment.chartAllocations]);

  const totalAllocation = fundTableRows.reduce((s, r) => s + r.percentage, 0);
  const weightedSummary = investment.weightedSummary;
  const isAllocationValid = weightedSummary.isValid;

  const projectedValue = useMemo(() => {
    const years = (enrollment.state.retirementAge ?? 67) - (enrollment.state.currentAge ?? 40);
    const annual = (enrollment.monthlyContribution?.employee ?? 0) * 12;
    const rate = (weightedSummary.expectedReturn ?? 7) / 100;
    let v = enrollment.state.currentBalance ?? 0;
    for (let i = 0; i < years; i++) v = v * (1 + rate) + annual;
    return v;
  }, [enrollment.state.retirementAge, enrollment.state.currentAge, enrollment.monthlyContribution?.employee, enrollment.state.currentBalance, weightedSummary.expectedReturn]);

  const yearsToRetirement = (enrollment.state.retirementAge ?? 67) - (enrollment.state.currentAge ?? 40);
  const annualReturn = weightedSummary.expectedReturn ?? 7;
  const feePercent = weightedSummary.totalFees ?? 0;

  /* Retirement readiness: same projected value; goal derived so we can show % and shortfall (e.g. 50% reached). */
  const readinessGoal = Math.max(projectedValue * 2, 1);
  const readinessPercent = Math.min(99, Math.round((projectedValue / readinessGoal) * 100));
  const shortfallAmount = Math.max(0, readinessGoal - projectedValue);

  const canEnroll = prerequisites.allMet && investment.canConfirmAllocation && acknowledgements.termsAccepted;

  const formatContributionPct = (pct: number) => (pct % 1 === 0 ? `${pct}%` : `${pct.toFixed(1)}%`);

  /* ── Handlers ── */
  const buildEnrollmentSummary = useCallback(() => {
    const lines: string[] = [
      t("enrollment.enrolmentSummary"),
      "==================",
      "",
      `Plan: ${selectedPlanName || t("enrollment.traditional401k")}`,
      `${t("enrollment.employerMatchLabel")}: ${enrollment.state.assumptions.employerMatchPercentage}%`,
      `Contribution: ${contributionTotal}% of paycheck`,
      `  Pre-tax: ${preTax > 0 ? ((preTax / 100) * contributionTotal).toFixed(1) + "%" : "—"}`,
      `  Roth: ${roth > 0 ? ((roth / 100) * contributionTotal).toFixed(1) + "%" : "—"}`,
      `  After-tax: ${afterTax > 0 ? ((afterTax / 100) * contributionTotal).toFixed(1) + "%" : "—"}`,
      "",
      t("enrollment.investmentElectionsHeading") + ":",
      ...fundTableRows.map((r) => `  ${r.fund.ticker} ${r.fund.name}: ${r.percentage.toFixed(1)}%`),
      "",
      `Total Allocation: ${totalAllocation.toFixed(1)}%`,
      `Expected Return: ${(weightedSummary.expectedReturn ?? 0).toFixed(1)}%`,
      `Estimated Fees: ${(weightedSummary.totalFees ?? 0).toFixed(2)}%`,
    ];
    return lines.join("\n");
  }, [t, selectedPlanName, enrollment.state.assumptions.employerMatchPercentage, contributionTotal, preTax, roth, afterTax, fundTableRows, totalAllocation, weightedSummary.expectedReturn, weightedSummary.totalFees]);

  const handleDownloadPDF = useCallback(() => {
    const summary = buildEnrollmentSummary();
    const blob = new Blob([summary], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `enrollment-summary-${new Date().toISOString().slice(0, 10)}.txt`;
    a.click();
    URL.revokeObjectURL(url);
    showFeedback(t("enrollment.summaryDownloaded"));
  }, [buildEnrollmentSummary, showFeedback]);

  const handleEmailSummary = useCallback(() => {
    const summary = buildEnrollmentSummary();
    const subject = encodeURIComponent(t("enrollment.emailSummarySubject"));
    const body = encodeURIComponent(summary);
    window.location.href = `mailto:?subject=${subject}&body=${body}`;
    showFeedback(t("enrollment.openingEmail"));
  }, [t, buildEnrollmentSummary, showFeedback]);

  const handleApplySuggestion = useCallback(
    (suggestion: "contribution" | "investments") => {
      showFeedback(suggestion === "contribution" ? t("enrollment.goToContributions") : t("enrollment.goToInvestments"));
      setTimeout(
        () =>
          navigate(
            suggestion === "contribution"
              ? withVersion(version, "/enrollment/contribution")
              : withVersion(version, "/enrollment/investments"),
          ),
        800,
      );
    },
    [navigate, showFeedback, version]
  );

  /* ── AI Insights data ── */
  const insights = [
    {
      icon: (
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 20V10" /><path d="M18 20V4" /><path d="M6 20v-4" /></svg>
      ),
      title: t("enrollment.insightIncreasePreTax"),
      description: t("enrollment.insightIncreasePreTaxDesc"),
      impact: t("enrollment.insightPreTaxImpact"),
      action: () => handleApplySuggestion("contribution"),
    },
    {
      icon: (
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><path d="M16 8l-4 4-4-4" /></svg>
      ),
      title: t("enrollment.insightTargetDate"),
      description: t("enrollment.insightTargetDateDesc"),
      impact: t("enrollment.insightTargetDateImpact"),
      action: () => handleApplySuggestion("investments"),
    },
  ];

  return (
    <>
      {/* Feedback toast */}
      <AnimatePresence>
        {feedbackMessage && (
          <motion.div
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            role="status"
            aria-live="polite"
            className="fixed left-1/2 top-6 z-[100] -translate-x-1/2 rounded-xl px-5 py-3 text-sm font-medium"
            style={{
              background: "var(--enroll-card-bg)",
              border: "1px solid rgb(var(--enroll-accent-rgb) / 0.3)",
              color: "var(--enroll-accent)",
              boxShadow: "var(--enroll-elevation-3)",
            }}
          >
            {feedbackMessage}
          </motion.div>
        )}
      </AnimatePresence>

      <EnrollmentPageContent
        title={t("enrollment.reviewReadyTitle")}
        subtitle={t("enrollment.reviewReadySubtitle")}
      >
        <div className="flex flex-col gap-6">
          {/* 1. Plan summary card — Figma: gradient, plan name, projected balance, pills, donut, Optimize with AI */}
          <div
            className="rounded-2xl border p-6 sm:p-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6"
            style={{
              borderColor: "rgb(var(--enroll-brand-rgb) / 0.12)",
              background: "linear-gradient(117deg, var(--enroll-soft-bg) 0%, rgb(var(--enroll-brand-rgb) / 0.03) 100%)",
              boxShadow: "var(--enroll-elevation-2)",
            }}
          >
            <div className="min-w-0 flex-1">
              <p className="text-[10px] font-bold uppercase tracking-wider mb-1" style={{ color: "var(--enroll-text-muted)" }}>{t("enrollment.planNameLabel")}</p>
              <p className="text-sm font-semibold mb-4" style={{ color: "var(--enroll-text-primary)" }}>{selectedPlanName || t("enrollment.traditional401k")}</p>
              <p className="text-[10px] font-bold uppercase tracking-wider mb-1" style={{ color: "var(--enroll-text-muted)" }}>{t("enrollment.projectedRetirementBalance")}</p>
              <p className="text-3xl sm:text-4xl font-bold leading-tight mb-2" style={{ color: "var(--enroll-text-primary)" }}>{formatCurrency(projectedValue)}</p>
              <div className="flex flex-wrap gap-3 mb-3">
                <span className="text-[11px] font-semibold px-2.5 py-1 rounded-full" style={{ background: "rgb(var(--enroll-brand-rgb) / 0.08)", color: "var(--enroll-brand)" }}>
                  {t("enrollment.yearsToRetirement", { years: yearsToRetirement })}
                </span>
                <span className="text-[11px] font-semibold px-2.5 py-1 rounded-full" style={{ background: "var(--enroll-soft-bg)", color: "var(--enroll-text-muted)" }}>
                  {t("enrollment.contributionRate", { percent: Math.round(contributionTotal) })}
                </span>
              </div>
              <p className="text-sm leading-relaxed" style={{ color: "var(--enroll-text-secondary)" }}>
                {t("enrollment.strongPath", { years: yearsToRetirement })}
              </p>
            </div>
            <div className="flex flex-col items-center gap-2 shrink-0">
              <div className="relative w-24 h-24" role="img" aria-label={t("enrollment.readinessSubtext", { percent: readinessPercent })}>
                <svg viewBox="0 0 100 100" className="w-full h-full">
                  <circle cx="50" cy="50" r="42" fill="none" stroke="var(--enroll-card-border)" strokeWidth="8" />
                  <motion.circle cx="50" cy="50" r="42" fill="none" stroke="var(--enroll-brand)" strokeWidth="8" strokeLinecap="round" strokeDasharray={263.9} initial={{ strokeDashoffset: 263.9 }} animate={{ strokeDashoffset: 263.9 * (1 - readinessPercent / 100) }} transition={{ duration: 0.8 }} transform="rotate(-90 50 50)" />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-lg font-bold" style={{ color: "var(--enroll-text-primary)" }}>{readinessPercent}%</span>
                </div>
              </div>
              <button type="button" onClick={() => setShowAdvisorModal(true)} className="text-[11px] font-semibold px-3 py-1.5 rounded-full focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[var(--enroll-brand)]" style={{ background: "rgb(var(--enroll-brand-rgb) / 0.08)", color: "var(--enroll-brand)" }}>{t("enrollment.optimizeWithAI")}</button>
            </div>
          </div>

          {/* 2. Two-column: left = sections, right = sidebar (Figma) */}
          <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 items-start">
            <div className="flex flex-col gap-6 xl:col-span-8">
              {/* Contributions card */}
              <ReviewSectionCard title={t("enrollment.contributions")} onEdit={() => navigate(withVersion(version, "/enrollment/contribution"))}>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <ReviewStatBox label={t("enrollment.contAmtBiWeekly")} value={formatContributionPct(contributionTotal)} sub={t("enrollment.ofPaycheck")} />
                  <ReviewStatBox label={t("enrollment.preTax")} value={preTax > 0 ? formatContributionPct((preTax / 100) * contributionTotal) : "0%"} sub={t("enrollment.ofPaycheck")} />
                  <ReviewStatBox label={t("enrollment.roth")} value={roth > 0 ? formatContributionPct((roth / 100) * contributionTotal) : "0%"} sub={t("enrollment.ofPaycheck")} />
                  <ReviewStatBox label={t("enrollment.afterTax")} value={afterTax > 0 ? formatContributionPct((afterTax / 100) * contributionTotal) : "0%"} sub={t("enrollment.ofPaycheck")} />
                </div>
              </ReviewSectionCard>

              {/* Auto Increase card */}
              <ReviewSectionCard title={t("enrollment.autoIncrease")} onEdit={() => navigate(withVersion(version, "/enrollment/auto-increase"))}>
                <p className="text-sm" style={{ color: "var(--enroll-text-secondary)" }}>
                  {enrollment.state.autoIncrease?.enabled
                    ? t("enrollment.autoIncreaseActive") + " — " + (enrollment.state.autoIncrease.percentage ?? 0) + "% " + t("enrollment.perYear")
                    : t("enrollment.autoIncreaseNotConfigured")}
                </p>
              </ReviewSectionCard>

              {/* Investment Elections card */}
              <ReviewSectionCard title={t("enrollment.investmentElections")} onEdit={() => navigate(withVersion(version, "/enrollment/investments"))}>
                {!isAllocationValid && (
                  <p className="text-xs font-semibold mb-3" style={{ color: "var(--color-danger)" }}>{t("enrollment.allocationMustEqual", { percent: totalAllocation.toFixed(0) })}</p>
                )}
                <div className="space-y-3">
                  {fundTableRows.map(({ fund, percentage }) => (
                    <div key={fund.id} className="flex flex-wrap items-center justify-between gap-2 p-3 rounded-xl" style={{ background: "var(--enroll-soft-bg)", border: "1px solid var(--enroll-card-border)" }}>
                      <div>
                        <span className="text-[10px] font-bold px-1.5 py-0.5 rounded" style={{ background: "rgb(var(--enroll-brand-rgb) / 0.1)", color: "var(--enroll-brand)" }}>{fund.ticker}</span>
                        <p className="text-sm font-semibold mt-1" style={{ color: "var(--enroll-text-primary)" }}>{fund.name}</p>
                        <p className="text-[10px]" style={{ color: "var(--enroll-text-muted)" }}>{t(getAssetClassKey(fund.assetClass))} · {(fund.expenseRatio ?? 0).toFixed(2)}% ER</p>
                      </div>
                      <span className="text-sm font-bold" style={{ color: "var(--enroll-text-primary)" }}>{percentage.toFixed(1)}%</span>
                    </div>
                  ))}
                </div>
                <div className="flex items-center justify-between mt-4 pt-3" style={{ borderTop: "1px solid var(--enroll-card-border)" }}>
                  <span className="text-xs" style={{ color: "var(--enroll-text-muted)" }}>{t("enrollment.fundsSelected", { count: fundTableRows.length })}</span>
                  <span className="text-sm font-bold" style={{ color: "var(--enroll-brand)" }}>{t("enrollment.total", { percent: totalAllocation.toFixed(1) })}</span>
                </div>
              </ReviewSectionCard>

              {/* What Happens Next */}
              <div className="p-6 rounded-2xl" style={cardStyle}>
                <h2 className="text-sm font-bold mb-4" style={{ color: "var(--enroll-text-primary)" }}>{t("enrollment.whatHappensNext")}</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="flex gap-3 p-4 rounded-xl" style={{ background: "var(--enroll-soft-bg)", border: "1px solid var(--enroll-card-border)" }}>
                    <span className="text-xl shrink-0" aria-hidden>📅</span>
                    <div>
                      <p className="text-xs font-bold" style={{ color: "var(--enroll-text-primary)" }}>{t("enrollment.contributionsStart")}</p>
                      <p className="text-[11px] mt-0.5 leading-relaxed" style={{ color: "var(--enroll-text-muted)" }}>{t("enrollment.contributionsStartDesc")}</p>
                    </div>
                  </div>
                  <div className="flex gap-3 p-4 rounded-xl" style={{ background: "var(--enroll-soft-bg)", border: "1px solid var(--enroll-card-border)" }}>
                    <span className="text-xl shrink-0" aria-hidden>🕐</span>
                    <div>
                      <p className="text-xs font-bold" style={{ color: "var(--enroll-text-primary)" }}>{t("enrollment.processingTime")}</p>
                      <p className="text-[11px] mt-0.5 leading-relaxed" style={{ color: "var(--enroll-text-muted)" }}>{t("enrollment.processingTimeDesc")}</p>
                    </div>
                  </div>
                  <div className="flex gap-3 p-4 rounded-xl" style={{ background: "var(--enroll-soft-bg)", border: "1px solid var(--enroll-card-border)" }}>
                    <span className="text-xl shrink-0" aria-hidden>⚙</span>
                    <div>
                      <p className="text-xs font-bold" style={{ color: "var(--enroll-text-primary)" }}>{t("enrollment.modifyAnytime")}</p>
                      <p className="text-[11px] mt-0.5 leading-relaxed" style={{ color: "var(--enroll-text-muted)" }}>{t("enrollment.modifyAnytimeDesc")}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Download / Email Summary */}
              <div className="flex flex-wrap gap-3">
                <button type="button" onClick={handleDownloadPDF} className="inline-flex items-center gap-2 px-4 py-2.5 text-xs font-semibold rounded-xl focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[var(--enroll-brand)]" style={{ background: "var(--enroll-soft-bg)", border: "1px solid var(--enroll-card-border)", color: "var(--enroll-text-secondary)" }}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3" /></svg>
                  {t("enrollment.downloadSummary")}
                </button>
                <button type="button" onClick={handleEmailSummary} className="inline-flex items-center gap-2 px-4 py-2.5 text-xs font-semibold rounded-xl focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[var(--enroll-brand)]" style={{ background: "var(--enroll-soft-bg)", border: "1px solid var(--enroll-card-border)", color: "var(--enroll-text-secondary)" }}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" /><polyline points="22,6 12,13 2,6" /></svg>
                  {t("enrollment.emailSummary")}
                </button>
              </div>

              {/* Terms and Conditions */}
              <div className="rounded-2xl p-6" style={{ ...cardStyle, background: "var(--enroll-soft-bg)" }}>
                <h2 className="text-sm font-bold mb-2" style={{ color: "var(--enroll-text-primary)" }}>{t("enrollment.termsAndConditions")}</h2>
                <p className="text-sm leading-relaxed mb-4" style={{ color: "var(--enroll-text-secondary)" }}>{t("enrollment.termsAndConditionsAgree")}</p>
                <label className="flex items-center gap-3 cursor-pointer">
                  <div className="flex h-5 w-5 items-center justify-center rounded shrink-0" style={{ background: acknowledgements.termsAccepted ? "var(--enroll-brand)" : "var(--enroll-soft-bg)", border: "1px solid var(--enroll-card-border)" }}>
                    {acknowledgements.termsAccepted && <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>}
                  </div>
                  <input type="checkbox" checked={acknowledgements.termsAccepted} onChange={(e) => setAcknowledgements((p) => ({ ...p, termsAccepted: e.target.checked }))} className="sr-only" />
                  <span className="text-sm font-medium" style={{ color: "var(--enroll-text-primary)" }}>{t("enrollment.acceptTermsCheckbox")}</span>
                </label>
              </div>
            </div>

            {/* Right sidebar: Retirement Readiness + Allocation Summary */}
            <div className="xl:col-span-4 xl:sticky xl:top-24 flex flex-col gap-6">
              <div className="p-6 rounded-2xl" style={cardStyle}>
                <h2 className="text-[10px] font-bold uppercase tracking-wider mb-2" style={{ color: "var(--enroll-text-muted)" }}>{t("enrollment.retirementReadinessLabel")}</h2>
                <p className="text-xl font-bold mb-4" style={{ color: "var(--enroll-text-primary)" }}>{formatCurrency(projectedValue)}</p>
                <div className="relative w-28 h-28 mx-auto mb-3" role="img" aria-label={t("enrollment.readinessSubtext", { percent: readinessPercent })}>
                  <svg viewBox="0 0 100 100" className="w-full h-full">
                    <circle cx="50" cy="50" r="42" fill="none" stroke="var(--enroll-card-border)" strokeWidth="8" />
                    <motion.circle cx="50" cy="50" r="42" fill="none" stroke="var(--enroll-brand)" strokeWidth="8" strokeLinecap="round" strokeDasharray={263.9} initial={{ strokeDashoffset: 263.9 }} animate={{ strokeDashoffset: 263.9 * (1 - readinessPercent / 100) }} transition={{ duration: 0.8 }} transform="rotate(-90 50 50)" />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-2xl font-bold" style={{ color: "var(--enroll-text-primary)" }}>{readinessPercent}%</span>
                  </div>
                </div>
                <button type="button" onClick={() => setShowAdvisorModal(true)} className="w-full text-[11px] font-semibold py-2 rounded-full" style={{ background: "rgb(var(--enroll-brand-rgb) / 0.08)", color: "var(--enroll-brand)" }}>{t("enrollment.optimizeWithAI")}</button>
              </div>
              <div className="p-6 rounded-2xl" style={cardStyle}>
                <h2 className="text-[10px] font-bold uppercase tracking-wider mb-4" style={{ color: "var(--enroll-text-muted)" }}>{t("enrollment.allocationSummary")}</h2>
                <div className="relative w-32 h-32 mx-auto mb-2" role="img" aria-label={totalAllocation.toFixed(0) + "% " + t("enrollment.totalLabel")}>
                  <svg viewBox="0 0 100 100" className="w-full h-full">
                    <circle cx="50" cy="50" r="42" fill="none" stroke="var(--enroll-card-border)" strokeWidth="8" />
                    <motion.circle cx="50" cy="50" r="42" fill="none" stroke="var(--enroll-accent)" strokeWidth="8" strokeLinecap="round" strokeDasharray={263.9} initial={{ strokeDashoffset: 263.9 }} animate={{ strokeDashoffset: 263.9 * (1 - totalAllocation / 100) }} transition={{ duration: 0.8 }} transform="rotate(-90 50 50)" />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-2xl font-bold" style={{ color: "var(--enroll-text-primary)" }}>{totalAllocation.toFixed(0)}%</span>
                    <span className="text-[10px] font-medium uppercase" style={{ color: "var(--enroll-text-muted)" }}>{t("enrollment.totalLabel")}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <EnrollmentFooter
          primaryLabel={t("enrollment.submit")}
          primaryDisabled={!canEnroll}
          onPrimary={() => { if (canEnroll) setShowSuccessModal(true); }}
          summaryText={!isAllocationValid ? t("enrollment.allocationMustTotal") : t("enrollment.readyToSubmit")}
          summaryError={!isAllocationValid}
          getDraftSnapshot={() => {
            const s = enrollment.state;
            const yearsToRetire = (s.retirementAge ?? 67) - (s.currentAge ?? 40);
            return {
              currentAge: s.currentAge ?? 30,
              retirementAge: s.retirementAge ?? 67,
              yearsToRetire,
              annualSalary: s.salary ?? 0,
              selectedPlanId: s.selectedPlan,
              selectedPlanDbId: s.selectedPlanDbId ?? null,
              contributionType: s.contributionType,
              contributionAmount: s.contributionAmount ?? 0,
              sourceAllocation: s.sourceAllocation ?? { preTax: 100, roth: 0, afterTax: 0 },
              autoIncrease: s.autoIncrease?.enabled
                ? {
                    enabled: true,
                    annualIncreasePct: s.autoIncrease.percentage ?? 2,
                    stopAtPct: s.autoIncrease.maxPercentage ?? 15,
                    minimumFloorPct: s.autoIncrease.minimumFloor,
                  }
                : undefined,
              investmentProfile: s.investmentProfile ?? undefined,
              investmentProfileCompleted: s.investmentProfileCompleted ?? false,
              investment: investment.getInvestmentSnapshot(),
            };
          }}
        />
      </EnrollmentPageContent>

      <AIAdvisorModal open={showAdvisorModal} onClose={() => setShowAdvisorModal(false)} />
      <SuccessEnrollmentModal
        open={showSuccessModal}
        onClose={() => {
          setShowSuccessModal(false);
          if (!sessionStorage.getItem("enrollment_feedback_shown")) {
            sessionStorage.setItem("enrollment_feedback_shown", "1");
            setPendingFeedback(true);
          } else {
            navigate("/dashboard/overview");
          }
        }}
        onViewPlanDetails={() => {
          setShowSuccessModal(false);
          if (!sessionStorage.getItem("enrollment_feedback_shown")) {
            sessionStorage.setItem("enrollment_feedback_shown", "1");
            setPendingFeedback(true);
          } else {
            navigate("/dashboard/overview");
          }
        }}
      />
      <FeedbackModal
        isOpen={showEnrollmentFeedback}
        onClose={() => {
          setShowEnrollmentFeedback(false);
          navigate("/dashboard/overview");
        }}
        workflowType="enrollment_flow"
      />
    </>
  );
};

/* ═══════════════════════════════════════════════════════
   SUB-COMPONENTS
   ═══════════════════════════════════════════════════════ */

function AnimatedCurrencyDisplay({ value }: { value: number }) {
  const animatedVal = useAnimatedValue(value, 800);
  return (
    <motion.p
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="text-3xl md:text-4xl font-bold"
      style={{ color: "var(--enroll-text-primary)" }}
    >
      {formatCurrency(animatedVal)}
    </motion.p>
  );
}

function ReviewSectionCard({ title, onEdit, children }: { title: string; onEdit: () => void; children: React.ReactNode }) {
  const { t } = useTranslation();
  return (
    <div className="p-6 rounded-2xl" style={cardStyle}>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-sm font-bold" style={{ color: "var(--enroll-text-primary)" }}>{title}</h2>
        <button type="button" onClick={onEdit} className="text-[11px] font-semibold px-3 py-1 rounded-full focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[var(--enroll-brand)]" style={{ background: "rgb(var(--enroll-brand-rgb) / 0.06)", color: "var(--enroll-brand)" }}>{t("enrollment.edit")}</button>
      </div>
      {children}
    </div>
  );
}

function ReviewStatBox({ label, value, sub }: { label: string; value: string; sub: string }) {
  return (
    <div className="p-3 rounded-xl text-center" style={{ background: "var(--enroll-soft-bg)", border: "1px solid var(--enroll-card-border)" }}>
      <p className="text-[10px] font-bold uppercase tracking-wider" style={{ color: "var(--enroll-text-muted)" }}>{label}</p>
      <p className="text-lg font-bold mt-1" style={{ color: "var(--enroll-text-primary)" }}>{value}</p>
      <p className="text-[10px] mt-0.5" style={{ color: "var(--enroll-text-muted)" }}>{sub}</p>
    </div>
  );
}

function SectionHeader({ title, editLabel, onEdit, warning }: { title: string; editLabel: string; onEdit: () => void; warning?: boolean }) {
  return (
    <div className="flex items-center justify-between mb-4">
      <p className="text-sm font-bold" style={{ color: "var(--enroll-text-primary)" }}>{title}</p>
      <button
        type="button"
        onClick={onEdit}
        className="text-[11px] font-semibold px-3 py-1 rounded-full border-none cursor-pointer transition-colors"
        style={{
          background: warning ? "rgb(var(--color-danger-rgb) / 0.08)" : "rgb(var(--enroll-brand-rgb) / 0.06)",
          color: warning ? "var(--color-danger)" : "var(--enroll-brand)",
        }}
      >
        {editLabel}
      </button>
    </div>
  );
}
