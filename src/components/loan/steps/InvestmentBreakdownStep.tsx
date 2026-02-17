import { useMemo } from "react";
import type { LoanFlowData, LoanPlanConfig, LoanFundAllocation } from "../../../types/loan";
import { LoanStepLayout, LoanSummaryCard, InvestmentBreakdownTable } from "../index";
import { DashboardCard } from "../../../dashboard/DashboardCard";
import { DEFAULT_LOAN_PLAN_CONFIG } from "../../../config/loanPlanConfig";
import { MOCK_FUNDS } from "../../../data/mockFunds";

interface InvestmentBreakdownStepProps {
  data: LoanFlowData;
  onDataChange: (patch: Partial<LoanFlowData>) => void;
  planConfig: LoanPlanConfig;
}

function formatCurrency(n: number): string {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", minimumFractionDigits: 2 }).format(n);
}

function round2(v: number): number {
  return Math.round(v * 100) / 100;
}

/** Pro-rata: distribute loan amount by fund weight. We use equal weight for demo. */
function buildProRataAllocations(loanAmount: number, funds: { id: string; name: string }[]): LoanFundAllocation[] {
  if (funds.length === 0) return [];
  const perFund = round2(loanAmount / funds.length);
  const allocations: LoanFundAllocation[] = funds.map((f, i) => {
    const isLast = i === funds.length - 1;
    const amount = isLast ? round2(loanAmount - perFund * (funds.length - 1)) : perFund;
    const percentage = loanAmount > 0 ? round2((amount / loanAmount) * 100) : 0;
    return { fundId: f.id, fundName: f.name, amount, percentage };
  });
  return allocations;
}

/** Enforce total match: auto-adjust last fund if mismatch */
function normalizeAllocations(allocations: LoanFundAllocation[], loanAmount: number): LoanFundAllocation[] {
  const total = round2(allocations.reduce((s, a) => s + a.amount, 0));
  if (allocations.length === 0) return [];
  const diff = round2(loanAmount - total);
  const out = allocations.map((a) => ({ ...a }));
  if (out.length > 0) {
    out[out.length - 1].amount = round2(out[out.length - 1].amount + diff);
    out[out.length - 1].percentage = loanAmount > 0 ? round2((out[out.length - 1].amount / loanAmount) * 100) : 0;
  }
  return out;
}

export function InvestmentBreakdownStep({ data, onDataChange }: InvestmentBreakdownStepProps) {
  const config = DEFAULT_LOAN_PLAN_CONFIG;
  const basics = data.basics;
  const loanAmount = basics?.loanAmount ?? 0;
  const funds = useMemo(() => MOCK_FUNDS.slice(0, 6).map((f) => ({ id: f.id, name: f.name })), []);

  const defaultAllocations = useMemo(
    () => buildProRataAllocations(loanAmount, funds),
    [loanAmount, funds]
  );

  const investment = data.investment ?? {
    allocationMode: "proRata" as const,
    allocations: defaultAllocations,
    totalAllocated: round2(defaultAllocations.reduce((s, a) => s + a.amount, 0)),
  };

  const allocations = useMemo(() => {
    if (investment.allocationMode === "proRata") {
      return buildProRataAllocations(loanAmount, funds);
    }
    return normalizeAllocations(investment.allocations, loanAmount);
  }, [investment.allocationMode, investment.allocations, loanAmount, funds]);

  const totalAllocated = useMemo(() => round2(allocations.reduce((s, a) => s + a.amount, 0)), [allocations]);

  const handleSetProRata = () => {
    const next = buildProRataAllocations(loanAmount, funds);
    onDataChange({
      investment: {
        allocationMode: "proRata",
        allocations: next,
        totalAllocated: round2(next.reduce((s, a) => s + a.amount, 0)),
      },
    });
  };

  const summaryRows = basics
    ? [
        { label: "Loan amount", value: formatCurrency(basics.loanAmount) },
        { label: "Total allocated", value: formatCurrency(totalAllocated) },
      ]
    : [];

  return (
    <LoanStepLayout sidebar={summaryRows.length > 0 ? <LoanSummaryCard title="Summary" rows={summaryRows} /> : undefined}>
      <div className="space-y-6" style={{ gap: "var(--spacing-6)" }}>
        <DashboardCard title="Investment source">
          <p className="mb-4 text-sm" style={{ color: "var(--enroll-text-secondary)" }}>
            Default is pro-rata liquidation across your current funds. You can keep pro-rata or switch to custom allocation.
          </p>
          <div className="flex gap-2" style={{ gap: "var(--spacing-2)" }}>
            <button
              type="button"
              onClick={handleSetProRata}
              className="rounded-xl px-4 py-2 text-sm font-medium transition-opacity hover:opacity-90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"
              style={{
                background: investment.allocationMode === "proRata" ? "var(--enroll-brand)" : "var(--enroll-soft-bg)",
                color: investment.allocationMode === "proRata" ? "white" : "var(--enroll-text-secondary)",
              }}
              aria-pressed={investment.allocationMode === "proRata"}
            >
              Pro-rata
            </button>
            <button
              type="button"
              onClick={() =>
                onDataChange({
                  investment: {
                    ...investment,
                    allocationMode: "custom",
                    allocations: normalizeAllocations(investment.allocations, loanAmount),
                    totalAllocated,
                  },
                })
              }
              className="rounded-xl px-4 py-2 text-sm font-medium transition-opacity hover:opacity-90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"
              style={{
                background: investment.allocationMode === "custom" ? "var(--enroll-brand)" : "var(--enroll-soft-bg)",
                color: investment.allocationMode === "custom" ? "white" : "var(--enroll-text-secondary)",
              }}
              aria-pressed={investment.allocationMode === "custom"}
            >
              Custom
            </button>
          </div>
        </DashboardCard>

        <DashboardCard title="Allocation">
          <InvestmentBreakdownTable allocations={allocations} totalAmount={totalAllocated} />
        </DashboardCard>
      </div>
    </LoanStepLayout>
  );
}
