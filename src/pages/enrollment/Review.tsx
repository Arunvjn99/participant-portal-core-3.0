import { useState, useMemo, useCallback, useRef, useEffect } from "react";
import { useNavigate, Navigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { AllocationChart } from "../../components/investments/AllocationChart";
import { useEnrollment } from "../../enrollment/context/EnrollmentContext";
import { useInvestment } from "../../context/InvestmentContext";
import { getFundById } from "../../data/mockFunds";
import { EnrollmentFooter } from "../../components/enrollment/EnrollmentFooter";
import { EnrollmentPageContent } from "../../components/enrollment/EnrollmentPageContent";
import { AIAdvisorModal } from "../../components/enrollment/AIAdvisorModal";
import { SuccessEnrollmentModal } from "../../components/enrollment/SuccessEnrollmentModal";
import type { SelectedPlanId } from "../../enrollment/context/EnrollmentContext";
import type { ContributionSource, IncrementCycle } from "../../enrollment/logic/types";

/* ═══════════════════════════════════════════════════════
   CONSTANTS
   ═══════════════════════════════════════════════════════ */

const PLAN_NAMES: Record<SelectedPlanId, string> = {
  traditional_401k: "Traditional 401(k)",
  roth_401k: "Roth 401(k)",
  roth_ira: "Roth IRA",
  null: "",
};

const PLAN_TYPE_LABELS: Record<SelectedPlanId, string> = {
  traditional_401k: "401(k) Plan",
  roth_401k: "401(k) Plan",
  roth_ira: "Roth IRA",
  null: "",
};

const SOURCE_NAMES: Record<ContributionSource, string> = {
  preTax: "Pre-tax",
  roth: "Roth",
  afterTax: "After-tax",
};

const INCREMENT_CYCLE_LABELS: Record<IncrementCycle, string> = {
  calendar_year: "Calendar Year",
  plan_enroll_date: "Plan Enroll Date",
  plan_year: "Plan Year",
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
const formatCurrency = (n: number) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(Number.isFinite(n) && n >= 0 ? n : 0);

function getAssetClassLabel(ac: string): string {
  if (ac.includes("Large Cap")) return "Large Cap";
  if (ac.includes("Mid Cap")) return "Mid Cap";
  if (ac.includes("Small Cap")) return "Small Cap";
  if (ac.includes("International")) return "Intl";
  if (ac.includes("Bond")) return "Bond";
  if (ac.includes("Real Estate")) return "REIT";
  if (ac.includes("Cash")) return "Cash";
  if (ac.includes("Target")) return "Target";
  return ac;
}

function getRiskColor(r: number): string {
  if (r < 3) return "var(--enroll-accent)";
  if (r < 5) return "var(--enroll-brand)";
  if (r < 7) return "var(--color-warning, #f59e0b)";
  return "var(--color-danger, #ef4444)";
}

function formatRiskLevel(r: number): string {
  if (r < 3) return "Conservative";
  if (r < 5) return "Moderate";
  if (r < 7) return "Moderate-Aggressive";
  return "Aggressive";
}

/* ═══════════════════════════════════════════════════════
   REVIEW PAGE
   ═══════════════════════════════════════════════════════ */
export const Review = () => {
  const navigate = useNavigate();
  const enrollment = useEnrollment();
  const investment = useInvestment();

  const [acknowledgements, setAcknowledgements] = useState({ feeDisclosure: false, qdefault: false });
  const [showAdvisorModal, setShowAdvisorModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [feedbackMessage, setFeedbackMessage] = useState<string | null>(null);
  const feedbackTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [expandedInsight, setExpandedInsight] = useState<number | null>(null);

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
  if (!prerequisites.hasPlan) return <Navigate to="/enrollment/choose-plan" replace />;
  if (!prerequisites.hasContribution) return <Navigate to="/enrollment/contribution" replace />;

  /* ── Data ── */
  const selectedPlanName = enrollment.state.selectedPlan ? PLAN_NAMES[enrollment.state.selectedPlan] : "";
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

  const canEnroll = prerequisites.allMet && investment.canConfirmAllocation && acknowledgements.feeDisclosure && acknowledgements.qdefault;

  const formatContributionPct = (pct: number) => (pct % 1 === 0 ? `${pct}%` : `${pct.toFixed(1)}%`);

  /* ── Handlers ── */
  const buildEnrollmentSummary = useCallback(() => {
    const lines: string[] = [
      "Enrollment Summary",
      "==================",
      "",
      `Plan: ${selectedPlanName || "Traditional 401(k)"}`,
      `Employer Match: ${enrollment.state.assumptions.employerMatchPercentage}%`,
      `Contribution: ${contributionTotal}% of paycheck`,
      `  Pre-tax: ${preTax > 0 ? ((preTax / 100) * contributionTotal).toFixed(1) + "%" : "—"}`,
      `  Roth: ${roth > 0 ? ((roth / 100) * contributionTotal).toFixed(1) + "%" : "—"}`,
      `  After-tax: ${afterTax > 0 ? ((afterTax / 100) * contributionTotal).toFixed(1) + "%" : "—"}`,
      "",
      "Investment Elections:",
      ...fundTableRows.map((r) => `  ${r.fund.ticker} ${r.fund.name}: ${r.percentage.toFixed(1)}%`),
      "",
      `Total Allocation: ${totalAllocation.toFixed(1)}%`,
      `Expected Return: ${(weightedSummary.expectedReturn ?? 0).toFixed(1)}%`,
      `Estimated Fees: ${(weightedSummary.totalFees ?? 0).toFixed(2)}%`,
    ];
    return lines.join("\n");
  }, [selectedPlanName, enrollment.state.assumptions.employerMatchPercentage, contributionTotal, preTax, roth, afterTax, fundTableRows, totalAllocation, weightedSummary.expectedReturn, weightedSummary.totalFees]);

  const handleDownloadPDF = useCallback(() => {
    const summary = buildEnrollmentSummary();
    const blob = new Blob([summary], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `enrollment-summary-${new Date().toISOString().slice(0, 10)}.txt`;
    a.click();
    URL.revokeObjectURL(url);
    showFeedback("Summary downloaded.");
  }, [buildEnrollmentSummary, showFeedback]);

  const handleEmailSummary = useCallback(() => {
    const summary = buildEnrollmentSummary();
    const subject = encodeURIComponent("My Retirement Enrollment Summary");
    const body = encodeURIComponent(summary);
    window.location.href = `mailto:?subject=${subject}&body=${body}`;
    showFeedback("Opening email client...");
  }, [buildEnrollmentSummary, showFeedback]);

  const handleApplySuggestion = useCallback(
    (suggestion: "contribution" | "investments") => {
      showFeedback(suggestion === "contribution" ? "Go to Contributions to apply this change." : "Go to Investment Elections to apply this change.");
      setTimeout(() => navigate(suggestion === "contribution" ? "/enrollment/contribution" : "/enrollment/investments"), 800);
    },
    [navigate, showFeedback]
  );

  /* ── AI Insights data ── */
  const insights = [
    {
      icon: (
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 20V10" /><path d="M18 20V4" /><path d="M6 20v-4" /></svg>
      ),
      title: "Increase pre-tax contribution",
      description: "Adding 2% more to your pre-tax contribution could close approximately 40% of any projected shortfall.",
      impact: "+$42,000 projected by retirement",
      action: () => handleApplySuggestion("contribution"),
    },
    {
      icon: (
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><path d="M16 8l-4 4-4-4" /></svg>
      ),
      title: "Simplify with a Target Date Fund",
      description: "A single Target Retirement Fund automatically adjusts risk as you approach retirement age.",
      impact: "Auto-rebalanced portfolio",
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
        title="You're building something powerful."
        subtitle="Here's what your future could look like based on today's decisions."
        badge={
          <span
            className="inline-flex items-center gap-1.5 px-3 py-1 text-xs font-medium rounded-full"
            style={{ background: "rgb(var(--enroll-brand-rgb) / 0.08)", color: "var(--enroll-brand)" }}
          >
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" /></svg>
            Final Review
          </span>
        }
      >
        {/* ═══ FUTURE SNAPSHOT ═══ */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="p-6 md:p-8 mb-8"
          style={{
            ...cardStyle,
            background: "linear-gradient(135deg, var(--enroll-card-bg) 0%, rgb(var(--enroll-brand-rgb) / 0.03) 100%)",
          }}
        >
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div className="flex-1">
              <p className="text-[10px] font-bold uppercase tracking-widest mb-1" style={{ color: "var(--enroll-text-muted)" }}>
                Projected Retirement Balance
              </p>
              <AnimatedCurrencyDisplay value={projectedValue} />
              <div className="flex flex-wrap items-center gap-3 mt-3">
                <span
                  className="inline-flex items-center gap-1 px-2.5 py-1 text-[11px] font-semibold rounded-full"
                  style={{ background: "rgb(var(--enroll-brand-rgb) / 0.06)", color: "var(--enroll-brand)" }}
                >
                  {yearsToRetirement} years to retirement
                </span>
                <span
                  className="inline-flex items-center gap-1 px-2.5 py-1 text-[11px] font-semibold rounded-full"
                  style={{ background: "rgb(var(--enroll-accent-rgb) / 0.06)", color: "var(--enroll-accent)" }}
                >
                  {annualReturn}% annual return assumed
                </span>
                <span
                  className="inline-flex items-center gap-1 px-2.5 py-1 text-[11px] font-semibold rounded-full"
                  style={{ background: "var(--enroll-soft-bg)", color: "var(--enroll-text-muted)" }}
                >
                  {contributionTotal}% contribution rate
                </span>
              </div>
              <p className="text-sm mt-3" style={{ color: "var(--enroll-text-secondary)" }}>
                Based on your current selections, you're on a strong path. Small adjustments today can have outsized impact over {yearsToRetirement} years of compounding growth.
              </p>
            </div>

            {/* Mini progress ring */}
            <div className="flex flex-col items-center gap-2 shrink-0">
              <div className="relative w-24 h-24">
                <svg viewBox="0 0 100 100" className="w-full h-full">
                  <circle cx="50" cy="50" r="40" fill="none" stroke="var(--enroll-card-border)" strokeWidth="7" />
                  <motion.circle
                    cx="50" cy="50" r="40" fill="none"
                    stroke="var(--enroll-accent)"
                    strokeWidth="7"
                    strokeLinecap="round"
                    strokeDasharray="251.2"
                    initial={{ strokeDashoffset: 251.2 }}
                    animate={{ strokeDashoffset: 251.2 * (1 - Math.min(1, contributionTotal / 20)) }}
                    transition={{ duration: 1, ease: "easeOut", delay: 0.3 }}
                    transform="rotate(-90 50 50)"
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-lg font-bold" style={{ color: "var(--enroll-text-primary)" }}>{Math.round(contributionTotal)}%</span>
                  <span className="text-[9px] font-medium" style={{ color: "var(--enroll-text-muted)" }}>of pay</span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowAdvisorModal(true)}
                className="text-[11px] font-semibold px-3 py-1.5 rounded-full border-none cursor-pointer transition-colors"
                style={{ background: "rgb(var(--enroll-brand-rgb) / 0.08)", color: "var(--enroll-brand)" }}
              >
                Optimize with AI
              </button>
            </div>
          </div>
        </motion.div>

        {/* ═══ MAIN GRID ═══ */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">

          {/* ── LEFT COLUMN (2 cols) ── */}
          <div className="lg:col-span-2 space-y-6">

            {/* Plan & Contribution Summary */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, delay: 0.1 }}
              className="p-6"
              style={cardStyle}
            >
              <SectionHeader title="Plan & Contributions" editLabel="Edit" onEdit={() => navigate("/enrollment/contribution")} />

              {/* Plan row */}
              <div
                className="flex items-center justify-between p-3 rounded-xl mb-3"
                style={{ background: "var(--enroll-soft-bg)", border: "1px solid var(--enroll-card-border)" }}
              >
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-wider" style={{ color: "var(--enroll-text-muted)" }}>Plan</p>
                  <p className="text-sm font-semibold mt-0.5" style={{ color: "var(--enroll-text-primary)" }}>
                    {enrollment.state.selectedPlan ? PLAN_TYPE_LABELS[enrollment.state.selectedPlan] : "401(k) Plan"} — {selectedPlanName || "Traditional 401(k)"}
                  </p>
                </div>
                <span
                  className="text-xs font-semibold px-2.5 py-1 rounded-full"
                  style={{ background: "rgb(var(--enroll-accent-rgb) / 0.08)", color: "var(--enroll-accent)" }}
                >
                  {enrollment.state.assumptions.employerMatchPercentage}% match
                </span>
              </div>

              {/* Source breakdown */}
              <div className="grid grid-cols-3 gap-3">
                {[
                  { label: "Pre-tax", value: preTax },
                  { label: "Roth", value: roth },
                  { label: "After-tax", value: afterTax },
                ].map(({ label, value }) => (
                  <div
                    key={label}
                    className="rounded-xl p-3 text-center"
                    style={{ background: "var(--enroll-soft-bg)", border: "1px solid var(--enroll-card-border)" }}
                  >
                    <p className="text-[10px] font-bold uppercase tracking-wider" style={{ color: "var(--enroll-text-muted)" }}>{label}</p>
                    <p
                      className="text-lg font-bold mt-1"
                      style={{ color: value > 0 ? "var(--enroll-text-primary)" : "var(--enroll-text-muted)" }}
                    >
                      {formatContributionPct((value / 100) * contributionTotal)}
                    </p>
                    <p className="text-[10px]" style={{ color: "var(--enroll-text-muted)" }}>of paycheck</p>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Auto Increase */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, delay: 0.15 }}
              className="p-6"
              style={cardStyle}
            >
              <SectionHeader title="Auto Increase" editLabel="Edit" onEdit={() => navigate("/enrollment/future-contributions")} />
              {(() => {
                const ai = enrollment.state.autoIncrease;
                const hasAny = (ai.preTaxIncrease ?? 0) > 0 || (ai.rothIncrease ?? 0) > 0 || (ai.afterTaxIncrease ?? 0) > 0;
                if (!hasAny) {
                  return (
                    <p className="text-sm" style={{ color: "var(--enroll-text-secondary)" }}>
                      Automatic annual increase is not configured.
                    </p>
                  );
                }
                return (
                  <>
                    <div className="flex items-center gap-2 mb-3">
                      <span className="text-[10px] font-bold uppercase tracking-wider" style={{ color: "var(--enroll-text-muted)" }}>Cycle:</span>
                      <span
                        className="text-xs font-semibold px-2.5 py-1 rounded-full"
                        style={{ background: "rgb(var(--enroll-brand-rgb) / 0.06)", color: "var(--enroll-brand)" }}
                      >
                        {INCREMENT_CYCLE_LABELS[ai.incrementCycle]}
                      </span>
                    </div>
                    <div className="grid grid-cols-3 gap-3">
                      {[
                        { label: "Pre-tax", value: ai.preTaxIncrease ?? 0 },
                        { label: "Roth", value: ai.rothIncrease ?? 0 },
                        { label: "After-tax", value: ai.afterTaxIncrease ?? 0 },
                      ].map(({ label, value }) => (
                        <div
                          key={label}
                          className="rounded-xl p-3 text-center"
                          style={{ background: "var(--enroll-soft-bg)", border: "1px solid var(--enroll-card-border)" }}
                        >
                          <p className="text-[10px] font-bold uppercase tracking-wider" style={{ color: "var(--enroll-text-muted)" }}>{label}</p>
                          <p className="text-lg font-bold mt-1" style={{ color: value > 0 ? "var(--enroll-accent)" : "var(--enroll-text-muted)" }}>
                            {value > 0 ? `${value}%` : "—"}
                          </p>
                          <p className="text-[10px]" style={{ color: "var(--enroll-text-muted)" }}>per year</p>
                        </div>
                      ))}
                    </div>
                  </>
                );
              })()}
            </motion.div>

            {/* Investment Elections */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, delay: 0.2 }}
              className="p-6"
              style={cardStyle}
            >
              <SectionHeader
                title="Investment Elections"
                editLabel={!isAllocationValid ? "Fix Allocation" : "Edit"}
                onEdit={() => navigate("/enrollment/investments")}
                warning={!isAllocationValid}
              />

              {/* Allocation warning */}
              {!isAllocationValid && (
                <div
                  className="flex items-center gap-2 p-3 rounded-xl mb-4"
                  style={{ background: "rgb(var(--color-danger-rgb) / 0.06)", border: "1px solid rgb(var(--color-danger-rgb) / 0.15)" }}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--color-danger)" strokeWidth="2" aria-hidden="true">
                    <path d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                  <span className="text-xs font-semibold" style={{ color: "var(--color-danger)" }}>
                    Total allocation is {totalAllocation.toFixed(0)}%. Must equal 100%.
                  </span>
                </div>
              )}

              {/* Fund cards */}
              <div className="space-y-2">
                {fundTableRows.map(({ fund, percentage }, idx) => (
                  <motion.div
                    key={fund.id}
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.2, delay: 0.05 * idx }}
                    className="flex items-center gap-3 p-3 rounded-xl"
                    style={{ background: "var(--enroll-soft-bg)", border: "1px solid var(--enroll-card-border)" }}
                  >
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span
                          className="text-[10px] font-bold px-1.5 py-0.5 rounded font-mono"
                          style={{ background: "rgb(var(--enroll-brand-rgb) / 0.1)", color: "var(--enroll-brand)" }}
                        >
                          {fund.ticker}
                        </span>
                        <span className="text-xs font-semibold truncate" style={{ color: "var(--enroll-text-primary)" }}>{fund.name}</span>
                      </div>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-[10px]" style={{ color: "var(--enroll-text-muted)" }}>{getAssetClassLabel(fund.assetClass)}</span>
                        <span className="text-[10px]" style={{ color: "var(--enroll-text-muted)" }}>{fund.expenseRatio.toFixed(2)}% ER</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <div className="w-16 h-1.5 rounded-full overflow-hidden" style={{ background: "var(--enroll-card-border)" }}>
                        <motion.div
                          className="h-full rounded-full"
                          initial={{ width: 0 }}
                          animate={{ width: `${percentage}%` }}
                          transition={{ duration: 0.6, delay: 0.1 * idx }}
                          style={{ background: "var(--enroll-brand)" }}
                        />
                      </div>
                      <span className="text-sm font-bold w-12 text-right" style={{ color: "var(--enroll-text-primary)" }}>
                        {percentage.toFixed(1)}%
                      </span>
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Total */}
              <div className="flex items-center justify-between mt-3 pt-3" style={{ borderTop: "1px solid var(--enroll-card-border)" }}>
                <span className="text-xs" style={{ color: "var(--enroll-text-muted)" }}>{fundTableRows.length} funds selected</span>
                <span
                  className="text-sm font-bold"
                  style={{ color: isAllocationValid ? "var(--enroll-accent)" : "var(--color-danger)" }}
                >
                  Total: {totalAllocation.toFixed(1)}%
                </span>
              </div>
            </motion.div>

            {/* Terms and Conditions */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, delay: 0.25 }}
              className="p-6"
              style={cardStyle}
            >
              <div className="flex items-center gap-2 mb-3">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--enroll-text-muted)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" /><polyline points="14 2 14 8 20 8" /></svg>
                <p className="text-sm font-bold" style={{ color: "var(--enroll-text-primary)" }}>Terms and Conditions</p>
              </div>
              <p className="text-xs mb-3" style={{ color: "var(--enroll-text-muted)" }}>
                Please accept the terms to enable enrollment.
              </p>
              <div className="space-y-2">
                {[
                  { key: "feeDisclosure" as const, label: "Fee Disclosure Statement" },
                  { key: "qdefault" as const, label: "Qualified Default Investment Notice" },
                ].map(({ key, label }) => (
                  <label
                    key={key}
                    className="flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-colors"
                    style={{
                      background: acknowledgements[key] ? "rgb(var(--enroll-accent-rgb) / 0.04)" : "var(--enroll-soft-bg)",
                      border: acknowledgements[key] ? "1px solid rgb(var(--enroll-accent-rgb) / 0.2)" : "1px solid var(--enroll-card-border)",
                    }}
                  >
                    <div
                      className="flex h-5 w-5 items-center justify-center rounded-md shrink-0 transition-colors"
                      style={{
                        background: acknowledgements[key] ? "var(--enroll-accent)" : "var(--enroll-card-bg)",
                        border: acknowledgements[key] ? "none" : "1.5px solid var(--enroll-card-border)",
                      }}
                    >
                      {acknowledgements[key] && (
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
                      )}
                    </div>
                    <input
                      type="checkbox"
                      checked={acknowledgements[key]}
                      onChange={(e) => setAcknowledgements((p) => ({ ...p, [key]: e.target.checked }))}
                      className="sr-only"
                    />
                    <span className="text-sm font-medium" style={{ color: "var(--enroll-text-primary)" }}>{label}</span>
                  </label>
                ))}
              </div>
            </motion.div>

            {/* What Happens Next */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, delay: 0.3 }}
              className="p-6"
              style={cardStyle}
            >
              <p className="text-sm font-bold mb-4" style={{ color: "var(--enroll-text-primary)" }}>What Happens Next</p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {[
                  { icon: "📅", title: "Contributions Start", desc: "Deductions begin on the first payroll cycle following the 15th of next month." },
                  { icon: "🕐", title: "Processing Time", desc: "Takes 1–2 pay periods to reflect on your pay stub." },
                  { icon: "⚙", title: "Modify Anytime", desc: "Change your contribution rate or investment elections at any time." },
                ].map(({ icon, title, desc }) => (
                  <div
                    key={title}
                    className="flex gap-3 p-3 rounded-xl"
                    style={{ background: "var(--enroll-soft-bg)", border: "1px solid var(--enroll-card-border)" }}
                  >
                    <span className="text-lg shrink-0">{icon}</span>
                    <div>
                      <p className="text-xs font-bold" style={{ color: "var(--enroll-text-primary)" }}>{title}</p>
                      <p className="text-[11px] mt-0.5" style={{ color: "var(--enroll-text-muted)" }}>{desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Download / Email */}
            <div className="flex flex-wrap gap-3">
              {[
                {
                  label: "Download Summary",
                  onClick: handleDownloadPDF,
                  icon: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="7 10 12 15 17 10" /><line x1="12" y1="15" x2="12" y2="3" /></svg>,
                },
                {
                  label: "Email Summary",
                  onClick: handleEmailSummary,
                  icon: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" /><polyline points="22,6 12,13 2,6" /></svg>,
                },
              ].map(({ label, onClick, icon }) => (
                <button
                  key={label}
                  type="button"
                  onClick={onClick}
                  className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-xl border-none cursor-pointer transition-colors"
                  style={{ background: "var(--enroll-soft-bg)", color: "var(--enroll-text-secondary)", border: "1px solid var(--enroll-card-border)" }}
                >
                  {icon}
                  {label}
                </button>
              ))}
            </div>
          </div>

          {/* ── RIGHT COLUMN (1 col, sticky) ── */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, delay: 0.15 }}
            className="lg:col-span-1"
          >
            <div className="lg:sticky lg:top-24 space-y-6">

              {/* Allocation Summary */}
              <div className="p-6" style={cardStyle}>
                <p className="text-[10px] font-bold uppercase tracking-widest mb-4" style={{ color: "var(--enroll-text-muted)" }}>
                  Allocation Summary
                </p>
                <AllocationChart
                  allocations={investment.chartAllocations}
                  centerLabel="Total"
                  centerValue={totalAllocation.toFixed(0)}
                  showValidBadge={false}
                  isValid={isAllocationValid}
                />

                {/* Risk spectrum */}
                <div className="mt-5 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs" style={{ color: "var(--enroll-text-muted)" }}>Risk Profile</span>
                    <span className="text-xs font-bold" style={{ color: getRiskColor(weightedSummary.riskLevel ?? 0) }}>
                      {formatRiskLevel(weightedSummary.riskLevel ?? 0)}
                    </span>
                  </div>
                  <div className="h-2 w-full rounded-full overflow-hidden" style={{ background: "var(--enroll-card-border)" }}>
                    <motion.div
                      className="h-full rounded-full"
                      initial={{ width: 0 }}
                      animate={{ width: `${Math.min(100, (weightedSummary.riskLevel ?? 0) * 10)}%` }}
                      transition={{ duration: 0.8, ease: [0.4, 0, 0.2, 1] }}
                      style={{ background: getRiskColor(weightedSummary.riskLevel ?? 0) }}
                    />
                  </div>
                  <p className="text-[11px] leading-relaxed" style={{ color: "var(--enroll-text-muted)" }}>
                    {(weightedSummary.riskLevel ?? 0) < 5
                      ? "Your portfolio favors stability with measured growth potential."
                      : "Your portfolio is positioned for higher growth with greater market exposure."}
                  </p>
                </div>

                {/* Metrics */}
                <div className="grid grid-cols-2 gap-3 mt-4">
                  <div className="rounded-xl p-3" style={{ background: "var(--enroll-soft-bg)" }}>
                    <p className="text-[10px] font-bold uppercase tracking-wider" style={{ color: "var(--enroll-text-muted)" }}>Return</p>
                    <p className="text-base font-bold mt-0.5" style={{ color: "var(--enroll-brand)" }}>{(weightedSummary.expectedReturn ?? 0).toFixed(1)}%</p>
                  </div>
                  <div className="rounded-xl p-3" style={{ background: "var(--enroll-soft-bg)" }}>
                    <p className="text-[10px] font-bold uppercase tracking-wider" style={{ color: "var(--enroll-text-muted)" }}>Fees</p>
                    <p className="text-base font-bold mt-0.5" style={{ color: "var(--enroll-text-primary)" }}>{(weightedSummary.totalFees ?? 0).toFixed(2)}%</p>
                  </div>
                </div>
              </div>

              {/* AI Insights (expandable) */}
              <div className="p-5" style={cardStyle}>
                <div className="flex items-center gap-2 mb-3">
                  <div
                    className="flex h-6 w-6 items-center justify-center rounded-full"
                    style={{ background: "rgb(var(--enroll-brand-rgb) / 0.1)", color: "var(--enroll-brand)" }}
                  >
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 3l1.912 5.813a2 2 0 001.275 1.275L21 12l-5.813 1.912a2 2 0 00-1.275 1.275L12 21l-1.912-5.813a2 2 0 00-1.275-1.275L3 12l5.813-1.912a2 2 0 001.275-1.275L12 3z" /></svg>
                  </div>
                  <p className="text-xs font-bold" style={{ color: "var(--enroll-text-primary)" }}>AI Insights</p>
                </div>

                <div className="space-y-2">
                  {insights.map((insight, i) => {
                    const isExpanded = expandedInsight === i;
                    return (
                      <div key={i} className="rounded-xl overflow-hidden" style={{ border: "1px solid var(--enroll-card-border)" }}>
                        <button
                          type="button"
                          onClick={() => setExpandedInsight(isExpanded ? null : i)}
                          className="flex items-center gap-2 w-full p-3 text-left border-none cursor-pointer transition-colors"
                          style={{ background: isExpanded ? "rgb(var(--enroll-brand-rgb) / 0.04)" : "var(--enroll-soft-bg)" }}
                        >
                          <span style={{ color: "var(--enroll-brand)" }}>{insight.icon}</span>
                          <span className="flex-1 text-xs font-semibold" style={{ color: "var(--enroll-text-primary)" }}>{insight.title}</span>
                          <svg
                            width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="var(--enroll-text-muted)" strokeWidth="2"
                            style={{ transform: isExpanded ? "rotate(180deg)" : "rotate(0deg)", transition: "transform 0.2s" }}
                          >
                            <polyline points="6 9 12 15 18 9" />
                          </svg>
                        </button>
                        <AnimatePresence>
                          {isExpanded && (
                            <motion.div
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: "auto", opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              transition={{ duration: 0.2 }}
                              className="overflow-hidden"
                            >
                              <div className="px-3 pb-3 space-y-2">
                                <p className="text-[11px] leading-relaxed" style={{ color: "var(--enroll-text-secondary)" }}>{insight.description}</p>
                                <div
                                  className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg"
                                  style={{ background: "rgb(var(--enroll-accent-rgb) / 0.06)", border: "1px solid rgb(var(--enroll-accent-rgb) / 0.12)" }}
                                >
                                  <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="var(--enroll-accent)" strokeWidth="2.5"><path d="M12 19V5M5 12l7-7 7 7" /></svg>
                                  <span className="text-[10px] font-bold" style={{ color: "var(--enroll-accent)" }}>{insight.impact}</span>
                                </div>
                                <button
                                  type="button"
                                  onClick={insight.action}
                                  className="w-full text-xs font-semibold py-2 rounded-lg border-none cursor-pointer transition-colors"
                                  style={{ background: "var(--enroll-brand)", color: "white" }}
                                >
                                  Apply Suggestion
                                </button>
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    );
                  })}
                </div>
                <p className="text-[10px] mt-3" style={{ color: "var(--enroll-text-muted)" }}>Insights generated from your plan data.</p>
              </div>

              {/* Activation CTA */}
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35, delay: 0.3 }}
                className="p-5"
                style={{
                  ...cardStyle,
                  background: canEnroll
                    ? "linear-gradient(135deg, var(--enroll-card-bg) 0%, rgb(var(--enroll-accent-rgb) / 0.04) 100%)"
                    : "var(--enroll-card-bg)",
                }}
              >
                <button
                  type="button"
                  disabled={!canEnroll}
                  onClick={() => { if (canEnroll) setShowSuccessModal(true); }}
                  className="w-full py-3 rounded-xl text-sm font-bold border-none cursor-pointer transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                  style={{
                    background: canEnroll ? "var(--enroll-brand)" : "var(--enroll-card-border)",
                    color: canEnroll ? "white" : "var(--enroll-text-muted)",
                    boxShadow: canEnroll ? "0 4px 12px rgb(var(--enroll-brand-rgb) / 0.25)" : "none",
                  }}
                >
                  Activate My Plan
                </button>
                <p className="text-[11px] text-center mt-2.5 leading-relaxed" style={{ color: "var(--enroll-text-muted)" }}>
                  {canEnroll
                    ? "Your contributions will begin with your next paycheck."
                    : "Complete all sections and accept terms to activate."}
                </p>
              </motion.div>
            </div>
          </motion.div>
        </div>

        <EnrollmentFooter
          step={4}
          primaryLabel="Activate My Plan"
          primaryDisabled={!canEnroll}
          onPrimary={() => { if (canEnroll) setShowSuccessModal(true); }}
          summaryText={!isAllocationValid ? "Allocation must total 100%" : "Ready to submit"}
          summaryError={!isAllocationValid}
          getDraftSnapshot={() => ({ investment: investment.getInvestmentSnapshot() })}
        />
      </EnrollmentPageContent>

      <AIAdvisorModal open={showAdvisorModal} onClose={() => setShowAdvisorModal(false)} />
      <SuccessEnrollmentModal
        open={showSuccessModal}
        onClose={() => { setShowSuccessModal(false); navigate("/dashboard/post-enrollment"); }}
        onViewPlanDetails={() => { setShowSuccessModal(false); navigate("/dashboard/post-enrollment"); }}
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
