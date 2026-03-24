import { useMemo } from "react";
import { thumbnails } from "@/assets/learning";
import { advisorAvatars } from "@/assets/avatars";

export type BalanceChartPoint = { x: number; y: number };

export type DashboardAlert = {
  id: string;
  variant: "pending" | "warning" | "required";
  title: string;
  subtitle: string;
  badgeLabel: string;
  progress: number;
  route: string;
};

export type QuickAction = {
  id: string;
  labelKey: string;
  route: string;
  icon: "contribution" | "transfer" | "rebalance" | "rollover" | "profile";
};

export type LearningArticle = {
  id: string;
  titleKey: string;
  readMinutes: number;
  route: string;
};

export type ContributionSlice = {
  id: string;
  labelKey: string;
  percent: number;
  amountLabel: string;
  fillVariant: "primary" | "success";
  progress: number;
};

export type PortfolioSlice = {
  id: string;
  labelKey: string;
  percent: number;
  amount: number;
  tone: "us" | "intl" | "bonds" | "cash";
};

export type ActivityItem = {
  id: string;
  titleKey: string;
  detailKey: string;
  amountLabel?: string;
  dateLabel: string;
  route: string;
};

export type NextActionItem = {
  id: string;
  titleKey: string;
  badgeKey?: "required";
  route: string;
};

export type AdvisorData = {
  name: string;
  roleKey: string;
  bioKey: string;
  avatarSrc: string;
  rating: string;
  experience: string;
  clients: string;
  messageRoute: string;
  scheduleRoute: string;
};

export type LoanData = {
  id: string;
  title: string;
  statusLabelKey: string;
  remainingLabel: string;
  nextPaymentLabel: string;
  percentPaid: number;
  paymentsLeftLabel: string;
  detailRoute: string;
  newRequestRoute: string;
};

export type DashboardOverviewData = {
  balance: {
    totalLabel: string;
    totalValue: number;
    growthPercent: number;
    growthLabelKey: string;
    onTrackLabelKey: string;
    vestedLabel: string;
    retirementYear: number;
    vestedPct: number;
    chartPoints: BalanceChartPoint[];
  };
  alerts: DashboardAlert[];
  readiness: {
    score: number;
    max: number;
    statusLabelKey: string;
    descriptionKey: string;
    simulatorRoute: string;
    simulatorLabelKey: string;
  };
  quickActions: QuickAction[];
  learning: {
    sectionTitleKey: string;
    videoThumbnail: string;
    videoAriaKey: string;
    articles: LearningArticle[];
  };
  contributions: {
    titleKey: string;
    periodLabel: string;
    slices: ContributionSlice[];
    totalBadgeKey: string;
  };
  portfolio: {
    titleKey: string;
    strategyBadgeKey: string;
    slices: PortfolioSlice[];
  };
  activity: {
    titleKey: string;
    viewAllKey: string;
    viewAllRoute: string;
    items: ActivityItem[];
  };
  nextActions: {
    titleKey: string;
    items: NextActionItem[];
  };
  advisor: AdvisorData;
  loan: LoanData;
};

function formatCurrency(n: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(n);
}

/**
 * Aggregated dashboard overview content for the Participants Portal playground screen.
 * Replace with API hooks when backend is available.
 */
export function useDashboardData(): DashboardOverviewData {
  return useMemo(
    () => ({
      balance: {
        totalLabel: "TOTAL BALANCE",
        totalValue: 142_893,
        growthPercent: 4.2,
        growthLabelKey: "dashboardOverview.balance.growth",
        onTrackLabelKey: "dashboardOverview.balance.onTrack",
        vestedLabel: formatCurrency(138_450),
        retirementYear: 2046,
        vestedPct: 100,
        chartPoints: [
          { x: 0, y: 72 },
          { x: 14, y: 68 },
          { x: 28, y: 74 },
          { x: 42, y: 70 },
          { x: 56, y: 78 },
          { x: 70, y: 82 },
          { x: 84, y: 88 },
          { x: 100, y: 92 },
        ],
      },
      alerts: [
        {
          id: "hw-1",
          variant: "pending",
          title: "Hardship Withdrawal",
          subtitle: "Request #HW-482910 · Under review",
          badgeLabel: "PENDING",
          progress: 0.45,
          route: "/transactions",
        },
      ],
      readiness: {
        score: 80,
        max: 100,
        statusLabelKey: "dashboardOverview.readiness.onTrack",
        descriptionKey: "dashboardOverview.readiness.description",
        simulatorRoute: "/investments",
        simulatorLabelKey: "dashboardOverview.readiness.simulator",
      },
      quickActions: [
        { id: "qa-1", labelKey: "dashboardOverview.quick.changeContribution", route: "/enrollment/contribution", icon: "contribution" },
        { id: "qa-2", labelKey: "dashboardOverview.quick.transfer", route: "/transactions/transfer", icon: "transfer" },
        { id: "qa-3", labelKey: "dashboardOverview.quick.rebalance", route: "/transactions/rebalance", icon: "rebalance" },
        { id: "qa-4", labelKey: "dashboardOverview.quick.rollover", route: "/transactions/rollover", icon: "rollover" },
        { id: "qa-5", labelKey: "dashboardOverview.quick.profile", route: "/profile", icon: "profile" },
      ],
      learning: {
        sectionTitleKey: "dashboardOverview.learning.title",
        videoThumbnail: thumbnails.learning401k,
        videoAriaKey: "dashboardOverview.learning.videoAria",
        articles: [
          { id: "a1", titleKey: "dashboardOverview.learning.a1", readMinutes: 4, route: "/help" },
          { id: "a2", titleKey: "dashboardOverview.learning.a2", readMinutes: 6, route: "/help" },
          { id: "a3", titleKey: "dashboardOverview.learning.a3", readMinutes: 8, route: "/help" },
        ],
      },
      contributions: {
        titleKey: "dashboardOverview.contributions.title",
        periodLabel: "October 2024",
        totalBadgeKey: "dashboardOverview.contributions.active",
        slices: [
          {
            id: "you",
            labelKey: "dashboardOverview.contributions.you",
            percent: 6,
            amountLabel: "$450",
            fillVariant: "primary",
            progress: 0.75,
          },
          {
            id: "employer",
            labelKey: "dashboardOverview.contributions.employer",
            percent: 4,
            amountLabel: "+$225",
            fillVariant: "success",
            progress: 0.55,
          },
          {
            id: "total",
            labelKey: "dashboardOverview.contributions.total",
            percent: 10,
            amountLabel: "$675",
            fillVariant: "success",
            progress: 1,
          },
        ],
      },
      portfolio: {
        titleKey: "dashboardOverview.portfolio.title",
        strategyBadgeKey: "dashboardOverview.portfolio.strategy",
        slices: [
          { id: "us", labelKey: "dashboardOverview.portfolio.us", percent: 55, amount: 78_591, tone: "us" },
          { id: "intl", labelKey: "dashboardOverview.portfolio.intl", percent: 25, amount: 35_723, tone: "intl" },
          { id: "bonds", labelKey: "dashboardOverview.portfolio.bonds", percent: 15, amount: 21_434, tone: "bonds" },
          { id: "cash", labelKey: "dashboardOverview.portfolio.cash", percent: 5, amount: 7_145, tone: "cash" },
        ],
      },
      activity: {
        titleKey: "dashboardOverview.activity.title",
        viewAllKey: "dashboardOverview.activity.viewAll",
        viewAllRoute: "/transactions",
        items: [
          {
            id: "act-1",
            titleKey: "dashboardOverview.activity.i1Title",
            detailKey: "dashboardOverview.activity.i1Detail",
            amountLabel: "$450",
            dateLabel: "Oct 12, 2024",
            route: "/transactions",
          },
          {
            id: "act-2",
            titleKey: "dashboardOverview.activity.i2Title",
            detailKey: "dashboardOverview.activity.i2Detail",
            amountLabel: "$225",
            dateLabel: "Oct 12, 2024",
            route: "/transactions",
          },
          {
            id: "act-3",
            titleKey: "dashboardOverview.activity.i3Title",
            detailKey: "dashboardOverview.activity.i3Detail",
            dateLabel: "Oct 2, 2024",
            route: "/transactions",
          },
        ],
      },
      nextActions: {
        titleKey: "dashboardOverview.next.title",
        items: [
          { id: "n1", titleKey: "dashboardOverview.next.beneficiary", badgeKey: "required", route: "/profile" },
          { id: "n2", titleKey: "dashboardOverview.next.risk", route: "/investments" },
        ],
      },
      advisor: {
        name: "Sarah Jenkins",
        roleKey: "dashboardOverview.advisor.role",
        bioKey: "dashboardOverview.advisor.bio",
        avatarSrc: advisorAvatars.maya,
        rating: "4.9",
        experience: "12 yrs",
        clients: "240+",
        messageRoute: "/help",
        scheduleRoute: "/help",
      },
      loan: {
        id: "loan-102",
        title: "General Purpose #102",
        statusLabelKey: "dashboardOverview.loan.active",
        remainingLabel: "$2,450",
        nextPaymentLabel: "$125 · Nov 15",
        percentPaid: 65,
        paymentsLeftLabel: "14 payments left",
        detailRoute: "/transactions/loan/review",
        newRequestRoute: "/transactions/loan/eligibility",
      },
    }),
    [],
  );
}
