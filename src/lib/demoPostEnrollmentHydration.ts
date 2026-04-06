import type { Scenario } from "@/engine/scenarioEngine";
import { scenarioRuntimePayload } from "@/engine/scenarioEngine";
import type { ScenarioPortfolioHolding } from "@/engine/scenarioEngine";
import type { ScenarioId } from "@/data/scenarios";
import { SCENARIOS } from "@/data/scenarios";
import type { PersonaProfile } from "@/types/participantPersona";
import {
  defaultPostEnrollmentDashboardData,
  normalizePostEnrollmentDashboardData,
  type ActivityEntry,
  type PerformancePoint,
  type PortfolioAllocationSlice,
  type PostEnrollmentDashboardData,
  usePostEnrollmentDashboardStore,
} from "@/stores/postEnrollmentDashboardStore";

const MONTHLY_SALARY_ESTIMATE = 4500;

function scalePerformanceToBalance(series: PerformancePoint[], targetEnd: number): PerformancePoint[] {
  const last = series[series.length - 1]?.value ?? targetEnd;
  if (last <= 0) return series.map((p) => ({ ...p, value: Math.max(0, targetEnd * 0.5) }));
  const factor = targetEnd / last;
  return series.map((p, i) => ({
    label: p.label,
    value: Math.max(0, Math.round(p.value * factor * (0.88 + (i / series.length) * 0.12))),
  }));
}

function monthlyFromPercent(grossMonthly: number, pct: number) {
  return Math.max(0, Math.round((grossMonthly * pct) / 100));
}

function holdingsToPortfolio(holdings: ScenarioPortfolioHolding[]): PortfolioAllocationSlice {
  let us = 0;
  let intl = 0;
  let bonds = 0;
  let cash = 0;
  for (const h of holdings) {
    const l = h.label.toLowerCase();
    const id = h.id.toLowerCase();
    if (l.includes("international") || id === "intl") intl += h.pct;
    else if (l.includes("bond") || l.includes("fixed")) bonds += h.pct;
    else if (l.includes("cash") || l.includes("stable")) cash += h.pct;
    else us += h.pct;
  }
  const sum = us + intl + bonds + cash || 1;
  return {
    usStocks: Math.round((us / sum) * 100),
    intlStocks: Math.round((intl / sum) * 100),
    bonds: Math.round((bonds / sum) * 100),
    cash: Math.max(0, 100 - Math.round((us / sum) * 100) - Math.round((intl / sum) * 100) - Math.round((bonds / sum) * 100)),
  };
}

function retirementYearForScenario(scenario: Scenario): number {
  if (scenario.stage === "retired") return new Date().getFullYear();
  switch (scenario.personaKey) {
    case "young_accumulator":
      return 2065;
    case "mid_career":
      return 2048;
    case "at_risk":
      return 2038;
    default:
      return 2042;
  }
}

function scenarioTxToActivity(t: import("@/engine/scenarioEngine").ScenarioActivity): ActivityEntry {
  const typeMap: Record<string, ActivityEntry["type"]> = {
    loan: "loan_payment",
    withdraw: "transfer",
    transfer: "transfer",
    rollover: "transfer",
    rebalance: "rebalance",
  };
  const amt = t.amount.replace(/[^0-9.-]/g, "");
  const num = amt ? Number(amt) : null;
  return {
    id: t.id,
    type: typeMap[t.type] ?? "transfer",
    title: t.description,
    date: t.date,
    amount: num,
    amountIsPositive: num != null ? num >= 0 : undefined,
  };
}

/**
 * Hydrates post-enrollment dashboard store from the active {@link Scenario}.
 * Pre-enrollment scenarios reset to defaults (that page does not read this store).
 */
export function applyScenarioToPostEnrollmentDashboard(scenario: Scenario | null): void {
  if (!scenario || !scenario.account.isEnrolled) {
    usePostEnrollmentDashboardStore.setState({
      data: normalizePostEnrollmentDashboardData(defaultPostEnrollmentDashboardData),
      displayName: "Participant",
    });
    return;
  }

  const d = scenarioRuntimePayload(scenario);
  const grossMonthly = MONTHLY_SALARY_ESTIMATE;
  const userPct = d.contribution;
  const matchPct = Math.min(d.employerMatch, userPct);
  const userMonthly = monthlyFromPercent(grossMonthly, userPct);
  const employerMonthly = monthlyFromPercent(grossMonthly, matchPct);
  const sum = userMonthly + employerMonthly || 1;

  const base = defaultPostEnrollmentDashboardData;
  const performance = scalePerformanceToBalance(base.performance, d.balance);

  const readinessLabelKey =
    scenario.stage === "at_risk"
      ? "dashboard.postEnrollment.peReadinessAtRisk"
      : "dashboard.postEnrollment.onTrack";

  const growthPercent =
    scenario.stage === "at_risk" ? -0.8 : scenario.personaKey === "young_accumulator" ? 3.1 : 2.2;

  const portfolio =
    d.investments.length > 0 ? holdingsToPortfolio(d.investments) : base.portfolio;

  const primaryLoan = d.loans?.[0];
  const loan: PostEnrollmentDashboardData["loan"] = primaryLoan
    ? {
        id: primaryLoan.id,
        productName: primaryLoan.productName,
        remainingPrincipal: primaryLoan.remainingPrincipal,
        originalPrincipal: primaryLoan.originalPrincipal,
        paidPrincipal: primaryLoan.paidPrincipal,
        nextPaymentDate: primaryLoan.nextPaymentDate,
        nextPaymentAmount: primaryLoan.nextPaymentAmount,
        statusLabel: "dashboard.postEnrollment.active",
      }
    : {
        ...base.loan,
        remainingPrincipal: 0,
        originalPrincipal: 12_000,
        paidPrincipal: 12_000,
        nextPaymentDate: base.loan.nextPaymentDate,
        nextPaymentAmount: 0,
        statusLabel: "dashboard.postEnrollment.peLoanPaidOff",
      };

  let activities: ActivityEntry[] =
    d.transactions.length > 0
      ? d.transactions.slice(0, 6).map(scenarioTxToActivity)
      : [...base.activities];

  if (d.transactions.length === 0 && scenario.stage === "retired") {
    activities = [
      {
        id: "dw1",
        type: "transfer",
        title: "Scheduled distribution",
        date: "2026-03-12",
        amount: -4200,
        amountIsPositive: false,
      },
      ...base.activities.slice(0, 3),
    ];
  }

  const tone = d.aiTone;
  const aiRecommendation =
    tone === "at_risk"
      ? "dashboard.postEnrollment.peAiRecommendationAtRisk"
      : tone === "early_investor" || tone === "increase_contribution"
        ? "dashboard.postEnrollment.peAiIncreaseContribution"
        : tone === "retired" || tone === "manage_withdrawals"
          ? "dashboard.postEnrollment.peAiManageWithdrawals"
          : tone === "start_saving"
            ? "dashboard.postEnrollment.peAiStartSaving"
            : base.aiRecommendation;

  const data: PostEnrollmentDashboardData = {
    ...base,
    balance: d.balance,
    growthPercent,
    readinessScore: d.riskScore,
    readinessLabelKey,
    overview: {
      vestedBalance,
      vestedPercent,
      retirementYear: retirementYearForScenario(scenario),
    },
    contributions: {
      userMonthly,
      employerMonthly,
      userPercent: Math.round((userMonthly / sum) * 1000) / 10,
      employerPercent: Math.round((employerMonthly / sum) * 1000) / 10,
    },
    contributionsActive: scenario.stage !== "retired",
    performance,
    portfolio,
    loan,
    activities,
    aiRecommendation,
    alerts: base.alerts,
    nextActions: scenario.ui.showNextActions ? base.nextActions : [],
  };

  const firstName = scenario.user.name.trim().split(/\s+/)[0] ?? scenario.user.name;
  usePostEnrollmentDashboardStore.setState({
    data: normalizePostEnrollmentDashboardData(data),
    displayName: firstName,
  });
}

/** @deprecated Use {@link applyScenarioToPostEnrollmentDashboard} */
export function applyPersonaToPostEnrollmentDashboard(
  persona: PersonaProfile | null,
  _legacy: unknown,
): void {
  if (!persona) {
    applyScenarioToPostEnrollmentDashboard(null);
    return;
  }
  const id = persona.id.replace(/^demo_/, "") as ScenarioId;
  const sc = SCENARIOS[id];
  applyScenarioToPostEnrollmentDashboard(sc ?? null);
}

export function scenarioDefinitionForPersona(persona: PersonaProfile): Scenario | null {
  const raw = persona.id.replace(/^demo_/, "") as ScenarioId;
  return SCENARIOS[raw] ?? null;
}
