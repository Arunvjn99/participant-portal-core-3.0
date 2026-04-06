import { create } from "zustand";

export type PortfolioAllocationSlice = {
  usStocks: number;
  intlStocks: number;
  bonds: number;
  cash: number;
};

export type LoanSlice = {
  id: string;
  productName: string;
  remainingPrincipal: number;
  originalPrincipal: number;
  paidPrincipal: number;
  nextPaymentDate: string;
  nextPaymentAmount: number;
  statusLabel: string;
  /** Shown as “Originated …” on the active-loan card (ISO date). */
  originDate?: string;
};

export type ActivityEntry = {
  id: string;
  type: "contribution" | "dividend" | "loan_payment" | "transfer" | "rebalance";
  title: string;
  date: string;
  amount: number | null;
  amountIsPositive?: boolean;
};

export type NextBestActionIcon = "Shield" | "Target" | "TrendingUp" | "Users" | "AlertTriangle";

export type NextBestAction = {
  id: string;
  title: string;
  description: string;
  priority: "required" | "recommended" | "optional";
  route: string;
  icon?: NextBestActionIcon;
};

export type PostEnrollmentOverviewMetrics = {
  vestedBalance: number;
  vestedPercent: number;
  retirementYear: number;
};

export type PostEnrollmentAlert = {
  id: string;
  type: "warning" | "info" | "success" | "error";
  title: string;
  subtitle: string;
  status: string;
  action: string;
};

export type PerformancePoint = { label: string; value: number };

export type PostEnrollmentDashboardData = {
  balance: number;
  growthPercent: number;
  readinessScore: number;
  readinessLabelKey: string;
  overview: PostEnrollmentOverviewMetrics;
  contributions: { userMonthly: number; employerMonthly: number; userPercent: number; employerPercent: number };
  contributionsActive: boolean;
  portfolio: PortfolioAllocationSlice;
  loan: LoanSlice;
  activities: ActivityEntry[];
  aiRecommendation: string;
  performance: PerformancePoint[];
  nextActions: NextBestAction[];
  alerts: PostEnrollmentAlert[];
  advisor: {
    name: string;
    title: string;
    organization: string;
    rating: number;
    experienceYears: number;
    imageSrc: string;
    nextAvailable: string;
    clientCount: string;
    specializationKey: string;
  };
  learning: {
    categoryKey: string;
    titleKey: string;
    descriptionKey: string;
    href: string;
  };
};

/** Slightly uneven series so the monotone curve reads as organic growth, not a flat ramp. */
const defaultPerformance: PerformancePoint[] = [
  { label: "Jan", value: 292_100 },
  { label: "Feb", value: 295_800 },
  { label: "Mar", value: 302_400 },
  { label: "Apr", value: 299_200 },
  { label: "May", value: 307_650 },
  { label: "Jun", value: 311_900 },
  { label: "Jul", value: 309_400 },
  { label: "Aug", value: 316_200 },
  { label: "Sep", value: 318_800 },
  { label: "Oct", value: 315_100 },
  { label: "Nov", value: 321_900 },
  { label: "Dec", value: 324_560.21 },
];

export const defaultPostEnrollmentDashboardData: PostEnrollmentDashboardData = {
  balance: 324_560.21,
  growthPercent: 2.4,
  readinessScore: 80,
  readinessLabelKey: "dashboard.postEnrollment.onTrack",
  overview: {
    vestedBalance: 276_320,
    vestedPercent: 85,
    retirementYear: 2042,
  },
  contributions: {
    userMonthly: 450,
    employerMonthly: 225,
    userPercent: 66.7,
    employerPercent: 33.3,
  },
  contributionsActive: true,
  portfolio: {
    usStocks: 55,
    intlStocks: 25,
    bonds: 15,
    cash: 5,
  },
  loan: {
    id: "loan-1",
    productName: "General purpose loan",
    remainingPrincipal: 4_200,
    originalPrincipal: 12_000,
    paidPrincipal: 7_800,
    nextPaymentDate: "2026-04-01",
    nextPaymentAmount: 186.5,
    statusLabel: "dashboard.postEnrollment.active",
    originDate: "2024-03-12",
  },
  activities: [
    {
      id: "a1",
      type: "contribution",
      title: "Payroll contribution",
      date: "2026-03-14",
      amount: 1200,
      amountIsPositive: true,
    },
    {
      id: "a2",
      type: "dividend",
      title: "Dividend reinvestment",
      date: "2026-03-10",
      amount: 42.18,
      amountIsPositive: true,
    },
    {
      id: "a3",
      type: "loan_payment",
      title: "Loan payment",
      date: "2026-03-01",
      amount: -186.5,
      amountIsPositive: false,
    },
    {
      id: "a4",
      type: "transfer",
      title: "In-plan transfer",
      date: "2026-02-22",
      amount: null,
    },
  ],
  aiRecommendation: "dashboard.postEnrollment.peAiRecommendation",
  performance: defaultPerformance,
  nextActions: [
    {
      id: "nba1",
      title: "dashboard.postEnrollment.peNextBeneficiaryTitle",
      description: "dashboard.postEnrollment.peNextBeneficiaryDesc",
      priority: "required",
      route: "/profile",
      icon: "AlertTriangle",
    },
    {
      id: "nba2",
      title: "dashboard.postEnrollment.peNextRiskTitle",
      description: "dashboard.postEnrollment.peNextRiskDesc",
      priority: "recommended",
      route: "/enrollment/investments",
      icon: "Target",
    },
  ],
  alerts: [],
  advisor: {
    name: "Sarah Jenkins",
    title: "CFP®",
    organization: "Strategic Wealth Management",
    rating: 4.9,
    experienceYears: 14,
    imageSrc: "",
    nextAvailable: "dashboard.postEnrollment.peAdvisorNextAvail",
    clientCount: "250+",
    specializationKey: "dashboard.postEnrollment.peAdvisorSpecialization",
  },
  learning: {
    categoryKey: "dashboard.postEnrollment.peLearningCategory",
    titleKey: "dashboard.postEnrollment.peLearningTitle",
    descriptionKey: "dashboard.postEnrollment.peLearningDesc",
    href: "https://enrich.org/",
  },
};

/**
 * Merges partial or legacy dashboard payloads with defaults so new fields (e.g. `overview`)
 * are never missing at runtime.
 */
export function normalizePostEnrollmentDashboardData(
  raw: Partial<PostEnrollmentDashboardData>,
): PostEnrollmentDashboardData {
  const base = defaultPostEnrollmentDashboardData;
  return {
    ...base,
    ...raw,
    overview: {
      ...base.overview,
      ...(raw.overview ?? {}),
    },
    contributions: {
      ...base.contributions,
      ...(raw.contributions ?? {}),
    },
    portfolio: {
      ...base.portfolio,
      ...(raw.portfolio ?? {}),
    },
    loan: {
      ...base.loan,
      ...(raw.loan ?? {}),
    },
    advisor: {
      ...base.advisor,
      ...(raw.advisor ?? {}),
    },
    learning: {
      ...base.learning,
      ...(raw.learning ?? {}),
    },
    nextActions: raw.nextActions ?? base.nextActions,
    alerts: raw.alerts ?? base.alerts,
    performance:
      raw.performance && raw.performance.length > 0 ? raw.performance : base.performance,
    activities: raw.activities ?? base.activities,
    contributionsActive: raw.contributionsActive ?? base.contributionsActive,
  };
}

type Store = {
  data: PostEnrollmentDashboardData;
  setUserDisplayName: (name: string) => void;
  /** Merge display name into advisor-facing copy only if needed — keep balance from mock */
  displayName: string;
};

export const usePostEnrollmentDashboardStore = create<Store>((set) => ({
  data: normalizePostEnrollmentDashboardData(defaultPostEnrollmentDashboardData),
  displayName: "Arun",
  setUserDisplayName: (name) => set({ displayName: name }),
}));
