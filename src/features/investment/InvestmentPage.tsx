import { useCallback, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { MessageCircle, PhoneCall, Shield, DollarSign, Scale, SlidersHorizontal, Edit3, PieChart } from "lucide-react";
import { EnrollmentPageContent } from "../../components/enrollment/EnrollmentPageContent";
import { EnrollmentFooter } from "../../components/enrollment/EnrollmentFooter";
import { loadEnrollmentDraft, saveEnrollmentDraft } from "../../enrollment/enrollmentDraftStore";
import { useEnrollment } from "../../enrollment/context/EnrollmentContext";
import { ENROLLMENT_V2_STEP_PATHS } from "../enrollment/config/stepConfig";
import type { SourceAllocation } from "./AllocationSourceCard";
import { InvestorProfileCard } from "./InvestorProfileCard";
import { AllocationSummaryChart } from "./AllocationSummaryChart";
import type { FundSegment } from "./AllocationSummaryChart";
import { AllocationEditorModal } from "./AllocationEditorModal";
import type { Fund, Portfolio, PortfolioSource } from "./types";

/** Source allocation (contribution split); total 100%. */
const DEFAULT_SOURCE_ALLOCATION: SourceAllocation = {
  pretax: 60,
  roth: 30,
  aftertax: 10,
};

const DEFAULT_PRETAX_FUNDS: Fund[] = [
  { id: "1", name: "S&P 500 Index Fund", ticker: "SP500", category: "US Large Cap", allocation: 35 },
  { id: "2", name: "Small Cap Value Fund", ticker: "SCV", category: "US Small Cap", allocation: 25 },
  { id: "3", name: "Emerging Markets Fund", ticker: "EM", category: "International", allocation: 25 },
  { id: "4", name: "Mid Cap Growth Fund", ticker: "MCG", category: "US Mid Cap", allocation: 15 },
];

const DEFAULT_PORTFOLIO: Portfolio = {
  pretax: DEFAULT_PRETAX_FUNDS,
  roth: [],
  aftertax: [],
};

/** Build chart segments from portfolio weighted by source allocation. */
function portfolioToSegments(
  portfolio: Portfolio,
  sourceAllocation: SourceAllocation
): FundSegment[] {
  const byName = new Map<string, number>();
  const add = (name: string, pct: number) => {
    byName.set(name, (byName.get(name) ?? 0) + pct);
  };
  const weight = (source: PortfolioSource) =>
    source === "pretax" ? sourceAllocation.pretax / 100
    : source === "roth" ? sourceAllocation.roth / 100
    : sourceAllocation.aftertax / 100;
  for (const source of ["pretax", "roth", "aftertax"] as PortfolioSource[]) {
    const w = weight(source);
    for (const f of portfolio[source]) {
      add(f.name, w * f.allocation);
    }
  }
  return Array.from(byName.entries())
    .map(([name, percentage]) => ({ name, percentage }))
    .filter((s) => s.percentage > 0)
    .sort((a, b) => b.percentage - a.percentage);
}

/**
 * Investment step page — full portfolio state, allocation editor modal, chart from portfolio.
 * Grid: max-w-6xl; desktop two-column, mobile single column.
 */
export function InvestmentPage() {
  const { t } = useTranslation();
  const { state, setInvestmentProfileCompleted } = useEnrollment();
  const [portfolio, setPortfolio] = useState<Portfolio>(DEFAULT_PORTFOLIO);
  const [allocationModalSource, setAllocationModalSource] = useState<PortfolioSource | null>(null);

  const sourceAllocation: SourceAllocation = useMemo(() => {
    const fromState = state.sourceAllocation;
    if (
      fromState &&
      typeof fromState.preTax === "number" &&
      typeof fromState.roth === "number" &&
      typeof fromState.afterTax === "number"
    ) {
      const total = fromState.preTax + fromState.roth + fromState.afterTax;
      if (total === 100)
        return {
          pretax: fromState.preTax,
          roth: fromState.roth,
          aftertax: fromState.afterTax,
        };
    }
    return DEFAULT_SOURCE_ALLOCATION;
  }, [state.sourceAllocation]);

  const fundCounts = useMemo(
    () => ({
      pretax: portfolio.pretax.length,
      roth: portfolio.roth.length,
      aftertax: portfolio.aftertax.length,
    }),
    [portfolio]
  );

  const chartSegments = useMemo(
    () => portfolioToSegments(portfolio, sourceAllocation),
    [portfolio, sourceAllocation]
  );

  const profileLabel =
    state.investmentProfile?.riskTolerance === 5
      ? "Aggressive Investor"
      : state.investmentProfile?.riskTolerance === 4
        ? "Growth Investor"
        : state.investmentProfile?.riskTolerance === 3
          ? "Balanced Investor"
          : state.investmentProfile?.riskTolerance === 2
            ? "Moderate Investor"
            : state.investmentProfile?.riskTolerance === 1
              ? "Conservative Investor"
              : "Aggressive Investor";

  const saveDraftForNextStep = useCallback(() => {
    const draft = loadEnrollmentDraft();
    if (!draft) return;
    setInvestmentProfileCompleted(true);
    saveEnrollmentDraft({
      ...draft,
      investmentProfile: state.investmentProfile ?? undefined,
      investmentProfileCompleted: true,
    });
  }, [state.investmentProfile, setInvestmentProfileCompleted]);

  const getDraftSnapshot = useCallback(
    () => ({
      investmentProfile: state.investmentProfile ?? undefined,
      investmentProfileCompleted: true,
    }),
    [state.investmentProfile]
  );

  const handleSavePortfolio = useCallback((source: PortfolioSource, funds: Fund[]) => {
    setPortfolio((prev) => ({ ...prev, [source]: funds }));
    setAllocationModalSource(null);
  }, []);

  const initialFundsForModal = allocationModalSource
    ? portfolio[allocationModalSource]
    : [];

  const defaultChartSegments: FundSegment[] = [
    { name: "S&P 500 Index Fund", percentage: 90 },
    { name: "Total Bond Market Index", percentage: 5 },
    { name: "International Stock Index", percentage: 5 },
  ];
  const segments = chartSegments.length > 0 ? chartSegments : defaultChartSegments;

  const planRows: { key: PortfolioSource; label: string; subtitle: string; icon: typeof Shield }[] = [
    { key: "roth", label: "Roth", subtitle: "Tax Free", icon: Shield },
    { key: "pretax", label: "Pretax", subtitle: "Tax Deferred", icon: DollarSign },
    { key: "aftertax", label: "After-tax", subtitle: "Taxable", icon: Scale },
  ];

  return (
    <EnrollmentPageContent
      title="Choose Your Investment Strategy"
      subtitle="Select a portfolio that matches your risk tolerance and retirement timeline."
    >
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-12 gap-6 pb-12">
          {/* Left column: col-span-8 */}
          <div className="col-span-12 lg:col-span-8 space-y-6 min-w-0">
            {/* 1. Investor Profile Card */}
            <div
              className="p-5 rounded-2xl border"
              style={{
                background: "var(--enroll-card-bg)",
                borderColor: "var(--enroll-card-border)",
              }}
            >
              <InvestorProfileCard profileName={profileLabel} onEdit={() => {}} />
            </div>

            {/* 2. Advisor Help Banner */}
            <div
              className="rounded-2xl border p-5"
              style={{
                background: "var(--enroll-card-bg)",
                borderColor: "var(--enroll-card-border)",
              }}
            >
              <div className="flex flex-wrap items-center gap-4">
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                  style={{ background: "var(--enroll-soft-bg)", color: "var(--color-primary)" }}
                >
                  <MessageCircle className="w-5 h-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-base font-semibold" style={{ color: "var(--enroll-text-primary)" }}>
                    Need Help Choosing?
                  </h3>
                  <p className="text-sm mt-0.5" style={{ color: "var(--enroll-text-secondary)" }}>
                    Get personalized guidance on choosing the right investments.
                  </p>
                </div>
                <button
                  type="button"
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-xl font-semibold text-sm transition-opacity hover:opacity-90"
                  style={{
                    background: "var(--color-primary)",
                    color: "var(--surface-1)",
                  }}
                >
                  <PhoneCall className="w-4 h-4" />
                  Schedule a Call
                </button>
              </div>
            </div>

            {/* 3. Plan Recommended Portfolio */}
            <div
              className="rounded-2xl border overflow-hidden"
              style={{
                background: "var(--enroll-card-bg)",
                borderColor: "var(--enroll-card-border)",
              }}
            >
              <div className="p-4 border-b" style={{ borderColor: "var(--enroll-card-border)" }}>
                <div className="flex items-center gap-2.5">
                  <div
                    className="w-9 h-9 rounded-xl flex items-center justify-center"
                    style={{ background: "var(--color-primary)" }}
                  >
                    <PieChart className="w-5 h-5" style={{ color: "var(--surface-1)" }} />
                  </div>
                  <div>
                    <h3 className="text-base font-semibold" style={{ color: "var(--enroll-text-primary)" }}>
                      Plan Recommended Portfolio
                    </h3>
                    <p className="text-sm mt-0.5" style={{ color: "var(--enroll-text-secondary)" }}>
                      Your contributions are invested in a recommended mix for long-term retirement growth.
                    </p>
                  </div>
                </div>
              </div>
              <div className="p-4 space-y-3">
                {planRows.map(({ key, label, subtitle, icon: Icon }) => {
                  const count = fundCounts[key];
                  const pct = key === "pretax" ? sourceAllocation.pretax : key === "roth" ? sourceAllocation.roth : sourceAllocation.aftertax;
                  return (
                    <div
                      key={key}
                      className="rounded-xl border overflow-hidden"
                      style={{
                        background: "var(--enroll-soft-bg)",
                        borderColor: "var(--enroll-card-border)",
                      }}
                    >
                      <button
                        type="button"
                        onClick={() => setAllocationModalSource(key)}
                        className="w-full flex items-center justify-between px-4 py-3 transition-opacity hover:opacity-90 text-left"
                        style={{ background: "var(--enroll-soft-bg)" }}
                      >
                        <div className="flex items-center gap-2.5">
                          <div
                            className="w-8 h-8 rounded-lg flex items-center justify-center"
                            style={{
                              background: "var(--enroll-card-bg)",
                              borderColor: "var(--enroll-card-border)",
                              border: "1px solid",
                              color: "var(--enroll-text-secondary)",
                            }}
                          >
                            <Icon className="w-4 h-4" />
                          </div>
                          <div className="space-y-1">
                            <p className="text-sm font-semibold" style={{ color: "var(--enroll-text-primary)" }}>
                              {label} · <span className="font-normal" style={{ color: "var(--enroll-text-secondary)" }}>{subtitle}</span>
                            </p>
                            <p className="text-sm flex items-center gap-1.5" style={{ color: "var(--enroll-text-secondary)" }}>
                              <span
                                className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold"
                                style={{ background: "var(--enroll-soft-bg)", color: "var(--enroll-text-primary)" }}
                              >
                                {count} fund{count !== 1 ? "s" : ""}
                              </span>
                              {pct}% allocated
                            </p>
                          </div>
                        </div>
                        <span className="font-semibold text-sm flex-shrink-0" style={{ color: "var(--color-primary)" }}>
                          View funds
                        </span>
                      </button>
                    </div>
                  );
                })}
              </div>

              {/* 4. Customize Your Investments */}
              <div style={{ borderTop: "1px solid var(--enroll-card-border)" }}>
                <button
                  type="button"
                  onClick={() => setAllocationModalSource("pretax")}
                  className="w-full flex items-center gap-3 px-4 py-3.5 transition-opacity hover:opacity-90 text-left"
                  style={{ background: "var(--enroll-card-bg)" }}
                >
                  <div
                    className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
                    style={{ background: "var(--enroll-soft-bg)", color: "var(--color-primary)" }}
                  >
                    <SlidersHorizontal className="w-4 h-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-sm font-semibold" style={{ color: "var(--enroll-text-primary)" }}>
                      Customize Your Investments
                    </h3>
                    <p className="text-[13px] mt-0.5" style={{ color: "var(--enroll-text-secondary)" }}>
                      Select funds and set allocations across your accounts
                    </p>
                  </div>
                  <div className="flex items-center gap-1.5 flex-shrink-0" style={{ color: "var(--enroll-text-secondary)" }}>
                    <Edit3 className="w-4 h-4" />
                    <span className="text-sm font-medium">Edit</span>
                  </div>
                </button>
              </div>
            </div>
          </div>

          {/* Right sidebar: col-span-4 — Allocation Summary only */}
          <div className="col-span-12 lg:col-span-4 space-y-6 min-w-0">
            <AllocationSummaryChart
              segments={segments}
            />
          </div>
        </div>

        <EnrollmentFooter
          primaryLabel={t("enrollment.continueToReadiness", "Continue to Readiness")}
          onPrimary={saveDraftForNextStep}
          getDraftSnapshot={getDraftSnapshot}
          stepPaths={ENROLLMENT_V2_STEP_PATHS}
          inContent
        />

        {allocationModalSource && (
          <AllocationEditorModal
            isOpen={true}
            onClose={() => setAllocationModalSource(null)}
            source={allocationModalSource}
            initialFunds={initialFundsForModal.length > 0 ? initialFundsForModal : (allocationModalSource === "pretax" ? DEFAULT_PRETAX_FUNDS : [])}
            onSave={handleSavePortfolio}
          />
        )}
      </div>
    </EnrollmentPageContent>
  );
}
