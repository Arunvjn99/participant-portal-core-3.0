import { useEffect, useMemo, useCallback } from "react";
import { motion } from "framer-motion";
import { useNavigate, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { ArrowLeftRight, Landmark, Repeat2, Wallet } from "lucide-react";
import { DashboardLayout } from "@/layouts/DashboardLayout";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { blockDemoNavIfNotAllowed } from "@/lib/demoNav";
import {
  ActiveLoanCard,
  AdvisorCard,
  AlertBanner,
  LearningHub,
  MonthlyContribution,
  NextBestActions,
  PortfolioAllocation,
  PortfolioSummaryCard,
  QuickActions,
  type QuickActionItem,
  ReadinessScore,
  RecentActivity,
} from "@/components/dashboard/post-enrollment";
import { useReadinessScore } from "@/components/dashboard/post-enrollment/hooks/useReadinessScore";
import { PostEnrollmentDashboardSkeleton } from "@/components/dashboard/post-enrollment/PostEnrollmentDashboardSkeleton";
import { useUser } from "@/context/UserContext";
import { advisorAvatars } from "@/assets/avatars";
import { getRoutingVersion, withVersion, withVersionIfEnrollment } from "@/core/version";
import { usePostEnrollmentDashboardStore } from "@/stores/postEnrollmentDashboardStore";
import { useScenarioStore } from "@/store/scenarioStore";

const ease = [0.25, 0.1, 0.25, 1] as const;

export const PostEnrollmentDashboard = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const version = getRoutingVersion(pathname);
  const { profile, loading } = useUser();
  const data = usePostEnrollmentDashboardStore((s) => s.data);
  const displayName = usePostEnrollmentDashboardStore((s) => s.displayName);
  const setUserDisplayName = usePostEnrollmentDashboardStore((s) => s.setUserDisplayName);
  const isDemoMode = useScenarioStore((s) => s.isDemoMode);
  const scenario = useScenarioStore((s) => (s.isDemoMode ? s.scenarioData : null));

  const tryNavigate = useCallback(
    (to: string) => {
      if (blockDemoNavIfNotAllowed(scenario, isDemoMode, to, t("demo.scenarioNavBlocked"))) return;
      navigate(to);
    },
    [navigate, scenario, isDemoMode, t],
  );

  useEffect(() => {
    const first = profile?.name?.trim()?.split(/\s+/)[0];
    if (first) setUserDisplayName(first);
  }, [profile?.name, setUserDisplayName]);

  const readinessInput = useMemo(
    () => ({
      totalBalance: data.balance,
      employeePercent: data.contributions.userPercent,
      employerPercent: data.contributions.employerPercent,
      totalPerMonth: data.contributions.userMonthly + data.contributions.employerMonthly,
    }),
    [data.balance, data.contributions],
  );

  const readiness = useReadinessScore(readinessInput);

  const onTrackVisual = data.readinessLabelKey === "dashboard.postEnrollment.onTrack";

  const quickActions: QuickActionItem[] = useMemo(() => {
    const perms = scenario?.permissions;
    const retired = scenario?.stage === "retired";
    const disLoan = Boolean(perms && (!perms.canTakeLoan || retired));
    const disWithdraw = Boolean(perms && !perms.canWithdraw);
    const disXfer = Boolean(perms && (!perms.canAccessTransactions || retired));
    return [
      {
        id: "loan",
        label: t("dashboard.postEnrollment.cmdQALoanTitle"),
        description: t("dashboard.postEnrollment.cmdQALoanDesc"),
        detail: t("dashboard.postEnrollment.peQALoanDetail"),
        icon: Landmark,
        onClick: () => tryNavigate(withVersion(version, "/transactions/loan/eligibility")),
        disabled: disLoan,
      },
      {
        id: "withdraw",
        label: t("dashboard.postEnrollment.cmdQAWithdrawTitle"),
        description: t("dashboard.postEnrollment.cmdQAWithdrawDesc"),
        detail: t("dashboard.postEnrollment.peQAWithdrawDetail"),
        icon: Wallet,
        onClick: () => tryNavigate(withVersion(version, "/transactions/withdraw")),
        disabled: disWithdraw,
      },
      {
        id: "transfer",
        label: t("dashboard.postEnrollment.peQATransferTitle"),
        description: t("dashboard.postEnrollment.peQATransferDesc"),
        detail: t("dashboard.postEnrollment.peQATransferDetail"),
        icon: ArrowLeftRight,
        onClick: () => tryNavigate(withVersion(version, "/transactions")),
        disabled: disXfer,
      },
      {
        id: "rollover",
        label: t("dashboard.postEnrollment.cmdQARolloverTitle"),
        description: t("dashboard.postEnrollment.cmdQARolloverDesc"),
        detail: t("dashboard.postEnrollment.peQARolloverDetail"),
        icon: Repeat2,
        onClick: () => tryNavigate(withVersion(version, "/transactions/rollover")),
        disabled: disXfer,
      },
    ];
  }, [tryNavigate, scenario, t, version]);

  const advisor = useMemo(
    () => ({
      ...data.advisor,
      imageSrc: data.advisor.imageSrc || advisorAvatars.maya,
    }),
    [data.advisor],
  );

  const showLoanCard = data.loan.remainingPrincipal > 0;

  if (loading) {
    return <PostEnrollmentDashboardSkeleton />;
  }

  return (
    <DashboardLayout header={<DashboardHeader />} fullWidthChildren>
      <div className="min-h-full bg-background pb-20 text-foreground">
        <main className="mx-auto max-w-[1280px] space-y-8 px-4 py-6 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease }}
          >
            <h1 className="text-2xl font-bold tracking-tight text-foreground">
              {t("dashboard.postEnrollment.overviewTitle")}
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">
              {t("dashboard.postEnrollment.overviewSubtitle", { name: displayName })}
            </p>
          </motion.div>

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
            <div className="space-y-6 lg:col-span-2">
              <PortfolioSummaryCard
                balance={data.balance}
                growthPercent={data.growthPercent}
                overview={data.overview}
                performance={data.performance}
                onTrackVisual={onTrackVisual}
                readinessLabelKey={data.readinessLabelKey}
              />

              {(!scenario || scenario.ui.showQuickActions) && <QuickActions actions={quickActions} />}

              <MonthlyContribution
                userMonthly={data.contributions.userMonthly}
                employerMonthly={data.contributions.employerMonthly}
                userPercent={data.contributions.userPercent}
                employerPercent={data.contributions.employerPercent}
                isActive={data.contributionsActive}
              />

              <LearningHub
                category={t(data.learning.categoryKey)}
                title={t(data.learning.titleKey)}
                description={t(data.learning.descriptionKey)}
                href={data.learning.href}
              />

              <PortfolioAllocation
                portfolio={data.portfolio}
                totalBalance={data.balance}
                onViewDetails={() => tryNavigate("/investments")}
                viewDetailsDisabled={Boolean(
                  scenario?.permissions && !scenario.permissions.canAccessInvestments,
                )}
              />

              <RecentActivity items={data.activities} />
            </div>

            <aside className="space-y-6">
              <AlertBanner alerts={data.alerts} />

              <ReadinessScore
                readiness={readiness}
                onLaunchSimulator={() => tryNavigate("/dashboard/investment-portfolio")}
                showWarnings={scenario?.ui.showWarnings ?? false}
                launchDisabled={Boolean(
                  scenario?.permissions && !scenario.permissions.canAccessInvestments,
                )}
              />

              {showLoanCard ? (
                <ActiveLoanCard
                  loan={data.loan}
                  onRequestNew={() => tryNavigate(withVersion(version, "/transactions/loan/eligibility"))}
                  requestNewDisabled={Boolean(
                    scenario?.permissions && (!scenario.permissions.canTakeLoan || scenario.stage === "retired"),
                  )}
                />
              ) : null}

              <NextBestActions
                actions={data.nextActions}
                onAction={(route) => tryNavigate(withVersionIfEnrollment(version, route))}
              />

              <AdvisorCard
                name={advisor.name}
                title={advisor.title}
                organization={advisor.organization}
                rating={advisor.rating}
                experienceYears={advisor.experienceYears}
                imageSrc={advisor.imageSrc}
                clientCount={advisor.clientCount}
                specialization={t(advisor.specializationKey)}
                onMessage={() => tryNavigate("/profile")}
                onSchedule={() => tryNavigate("/profile")}
              />
            </aside>
          </div>
        </main>
      </div>
    </DashboardLayout>
  );
};
