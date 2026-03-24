import { useCallback, useState } from "react";
import { useTranslation } from "react-i18next";
import { useLocation, useNavigate } from "react-router-dom";
import { Download } from "lucide-react";
import { DashboardLayout } from "@/layouts/DashboardLayout";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { useUser } from "@/context/UserContext";
import { getRoutingVersion, withVersion } from "@/core/version";
import { useDashboardData } from "@/hooks/useDashboardData";
import {
  ActivityList,
  AdvisorCard,
  AlertCard,
  ContributionCard,
  DashboardHero,
  LearningSection,
  LoanCard,
  NextActions,
  PortfolioCard,
  QuickActions,
  ReadinessCard,
} from "@/components/dashboard/overview";
import "@/styles/dashboard-screen.css";

/**
 * Production overview dashboard (Figma: Participants Portal Playground — node 1603-533).
 * Route: /dashboard/overview
 */
export function ParticipantsOverviewDashboard() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const { profile } = useUser();
  const data = useDashboardData();
  const version = getRoutingVersion(pathname);
  const [exportNotice, setExportNotice] = useState(false);

  const resolveHref = useCallback(
    (path: string) => {
      if (path.startsWith("/transactions") || path.startsWith("/enrollment")) {
        return withVersion(version, path);
      }
      return path;
    },
    [version],
  );

  const go = useCallback((path: string) => navigate(resolveHref(path)), [navigate, resolveHref]);

  const displayName = profile?.name?.split(" ")[0] ?? "John";

  return (
    <DashboardLayout header={<DashboardHeader />}>
      <div className="dashboard-screen" data-page="participants-overview">
        <header className="dashboard-screen__header-row">
          <div>
            <h1 className="dashboard-screen__title">{t("dashboardOverview.pageTitle")}</h1>
            <p className="dashboard-screen__subtitle">
              {t("dashboardOverview.welcome", { name: displayName })}
            </p>
          </div>
          <button
            type="button"
            className="btn btn-outline dashboard-screen-export-btn"
            onClick={() => {
              setExportNotice(true);
              window.setTimeout(() => setExportNotice(false), 3200);
            }}
          >
            <Download className="h-4 w-4" strokeWidth={2} aria-hidden />
            {t("dashboardOverview.exportReport")}
          </button>
        </header>

        {exportNotice ? (
          <div className="dashboard-screen-toast" role="status">
            {t("dashboardOverview.exportDone")}
          </div>
        ) : null}

        <div className="dashboard-screen__grid">
          <div className="dashboard-screen__col">
            <DashboardHero
              totalLabel={data.balance.totalLabel}
              totalValue={data.balance.totalValue}
              growthPercent={data.balance.growthPercent}
              growthLabelKey={data.balance.growthLabelKey}
              onTrackLabelKey={data.balance.onTrackLabelKey}
              vestedLabel={data.balance.vestedLabel}
              retirementYear={data.balance.retirementYear}
              vestedPct={data.balance.vestedPct}
              chartPoints={data.balance.chartPoints}
              onNavigate={() => go("/investments")}
            />

            <QuickActions titleKey="dashboardOverview.quick.title" actions={data.quickActions} onNavigate={go} />

            <LearningSection
              sectionTitleKey={data.learning.sectionTitleKey}
              videoThumbnail={data.learning.videoThumbnail}
              videoAriaKey={data.learning.videoAriaKey}
              articles={data.learning.articles}
              onPlayVideo={() => go("/help")}
              onOpenArticle={(path) => go(path)}
            />

            <ContributionCard
              titleKey={data.contributions.titleKey}
              periodLabel={data.contributions.periodLabel}
              totalBadgeKey={data.contributions.totalBadgeKey}
              slices={data.contributions.slices}
              onNavigate={go}
              detailRoute="/enrollment/contribution"
            />

            <PortfolioCard
              titleKey={data.portfolio.titleKey}
              strategyBadgeKey={data.portfolio.strategyBadgeKey}
              slices={data.portfolio.slices}
              onNavigate={go}
              detailRoute="/investments"
            />

            <ActivityList
              titleKey={data.activity.titleKey}
              viewAllKey={data.activity.viewAllKey}
              items={data.activity.items}
              viewAllRoute={data.activity.viewAllRoute}
              onViewAll={go}
              onOpenItem={go}
            />
          </div>

          <div className="dashboard-screen__col">
            {data.alerts.map((alert) => (
              <AlertCard key={alert.id} alert={alert} onNavigate={go} />
            ))}

            <ReadinessCard
              score={data.readiness.score}
              max={data.readiness.max}
              statusLabelKey={data.readiness.statusLabelKey}
              descriptionKey={data.readiness.descriptionKey}
              simulatorLabelKey={data.readiness.simulatorLabelKey}
              onLaunchSimulator={() => go(data.readiness.simulatorRoute)}
            />

            <NextActions
              titleKey={data.nextActions.titleKey}
              items={data.nextActions.items}
              onNavigate={go}
              requiredBadgeKey="dashboardOverview.next.required"
            />

            <AdvisorCard
              advisor={data.advisor}
              onMessage={() => go(data.advisor.messageRoute)}
              onSchedule={() => go(data.advisor.scheduleRoute)}
            />

            <LoanCard
              loan={data.loan}
              titleKey="dashboardOverview.loan.title"
              onOpenLoan={() => go(data.loan.detailRoute)}
              onNewRequest={() => go(data.loan.newRequestRoute)}
              remainingLabelKey="dashboardOverview.loan.remaining"
              nextPaymentLabelKey="dashboardOverview.loan.nextPayment"
              paidOffLabelKey="dashboardOverview.loan.paidOff"
            />
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
