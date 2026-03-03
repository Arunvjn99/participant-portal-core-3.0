import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { DashboardLayout } from "../../layouts/DashboardLayout";
import { DashboardHeader } from "../../components/dashboard/DashboardHeader";
import { useUser } from "../../context/UserContext";
import { MOCK_ENROLLMENT_SUMMARY } from "../../data/enrollmentSummary";
import { RecentTransactionsCard } from "../../components/dashboard/RecentTransactionsCard";
import { GoalSimulatorCard } from "../../components/dashboard/GoalSimulatorCard";
import { ProgressBar } from "../../components/dashboard/shared/ProgressBar";

/**
 * Post-Enrollment Dashboard — Figma Participants Portal Playground (node 1188-3129).
 * Uses global CSS (.post-enrollment-dashboard__*) and design tokens only.
 * Responsive, light/dark via CSS variables. No hardcoded colors.
 * Route: /dashboard/post-enrollment
 */
export const PostEnrollmentDashboard = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { profile } = useUser();
  const data = MOCK_ENROLLMENT_SUMMARY;
  const plan = data.planDetails;
  const balances = data.balances;
  const goal = data.goalProgress;
  const topBanner = data.topBanner ?? { percentOnTrack: 85, subText: "", actionRoute: "/enrollment/contribution" };

  const displayName = profile?.name ?? "Satish";
  const totalBalance = plan?.totalBalance ?? balances?.vestedBalance ?? 342000;
  const vestedBalance = balances?.vestedBalance ?? 310500;
  const contributionRate = plan?.contributionRate ?? 12;
  const ytdReturn = plan?.ytdReturn ?? 8.4;

  const formatCurrency = (n: number) =>
    new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(n);
  const formatDate = () => {
    const d = new Date();
    return d.toLocaleString("en-US", { weekday: "long", hour: "numeric", minute: "2-digit" });
  };

  return (
    <DashboardLayout header={<DashboardHeader />}>
      <div className="post-enrollment-dashboard" role="region" aria-label={t("dashboard.shellAriaRegion")}>
        {/* Greeting */}
        <section className="post-enrollment-dashboard__zone-a">
          <div className="flex flex-wrap items-center gap-3">
            <h1 className="post-enrollment-dashboard__greeting">
              <span className="block text-base font-medium text-[var(--color-text-secondary)]">{t("dashboard.greetingTitle")}</span>
              <span className="block text-2xl md:text-3xl font-semibold text-[var(--color-text)]">{displayName}</span>
            </h1>
            <div
              className="h-10 w-10 rounded-full border-2 border-[var(--color-border)] bg-[var(--color-background-secondary)]"
              style={{ boxShadow: "var(--shadow-sm)" }}
              aria-hidden
            />
          </div>
          <p className="mt-1 text-base" style={{ color: "var(--color-text-secondary)" }}>
            {t("dashboard.postEnrollment.retirementProgress")}
          </p>
        </section>

        {/* Hero: % on track + CTA */}
        <section className="post-enrollment-dashboard__hero">
          <div className="flex flex-wrap items-center gap-8">
            <div
              className="relative flex h-24 w-24 shrink-0 items-center justify-center rounded-full"
              style={{
                background: "rgba(255,255,255,0.15)",
                backdropFilter: "blur(6px)",
              }}
            >
              <svg className="h-20 w-20 -rotate-90" viewBox="0 0 80 80">
                <circle
                  cx="40"
                  cy="40"
                  r="36"
                  fill="none"
                  stroke="rgba(255,255,255,0.4)"
                  strokeWidth="8"
                />
                <circle
                  cx="40"
                  cy="40"
                  r="36"
                  fill="none"
                  stroke="white"
                  strokeWidth="8"
                  strokeDasharray={2 * Math.PI * 36}
                  strokeDashoffset={2 * Math.PI * 36 * (1 - topBanner.percentOnTrack / 100)}
                  strokeLinecap="round"
                />
              </svg>
              <span
                className="absolute inset-0 flex items-center justify-center text-2xl font-bold"
                style={{ color: "var(--color-text-inverse)" }}
              >
                {topBanner.percentOnTrack}%
              </span>
            </div>
            <div>
              <h2 className="post-enrollment-dashboard__hero-title">
                {t("dashboard.postEnrollment.onTrackPct", { percent: topBanner.percentOnTrack })}
              </h2>
              <p className="post-enrollment-dashboard__hero-subtext">
                {t("dashboard.postEnrollment.resilientStrategy")}
              </p>
            </div>
          </div>
          <button
            type="button"
            className="post-enrollment-dashboard__hero-cta"
            onClick={() => navigate(topBanner.actionRoute)}
          >
            {t("dashboard.postEnrollment.optimizeStrategy")}
          </button>
        </section>

        {/* Key metrics */}
        <div className="post-enrollment-dashboard__metrics">
          <div className="post-enrollment-dashboard__metric-card">
            <p className="post-enrollment-dashboard__metric-label">{t("dashboard.postEnrollment.totalBalance")}</p>
            <p className="post-enrollment-dashboard__metric-value">{formatCurrency(totalBalance)}</p>
            <span className="post-enrollment-dashboard__metric-trend post-enrollment-dashboard__metric-trend--up">
              +2.1%
            </span>
          </div>
          <div className="post-enrollment-dashboard__metric-card">
            <p className="post-enrollment-dashboard__metric-label">{t("dashboard.postEnrollment.vestedBalance")}</p>
            <p className="post-enrollment-dashboard__metric-value">{formatCurrency(vestedBalance)}</p>
            <span className="post-enrollment-dashboard__metric-trend post-enrollment-dashboard__metric-trend--up">
              +1.8%
            </span>
          </div>
          <div className="post-enrollment-dashboard__metric-card">
            <p className="post-enrollment-dashboard__metric-label">{t("dashboard.postEnrollment.contributionRate")}</p>
            <p className="post-enrollment-dashboard__metric-value">{contributionRate}%</p>
            <span className="post-enrollment-dashboard__metric-badge">{t("dashboard.postEnrollment.active")}</span>
          </div>
          <div className="post-enrollment-dashboard__metric-card">
            <p className="post-enrollment-dashboard__metric-label">{t("dashboard.postEnrollment.ytdReturn")}</p>
            <p className="post-enrollment-dashboard__metric-value">+{ytdReturn}%</p>
            <span className="post-enrollment-dashboard__metric-trend post-enrollment-dashboard__metric-trend--up">
              +0.4%
            </span>
          </div>
        </div>

        {/* Quick actions */}
        <div className="post-enrollment-dashboard__quick-actions">
          <span className="post-enrollment-dashboard__quick-actions-label">
            {t("dashboard.postEnrollment.quickActions")}
          </span>
          <button
            type="button"
            className="post-enrollment-dashboard__quick-action-btn"
            onClick={() => navigate("/enrollment/contribution")}
          >
            {t("dashboard.postEnrollment.increaseContribution")}
          </button>
          <button
            type="button"
            className="post-enrollment-dashboard__quick-action-btn"
            onClick={() => navigate("/transactions/rebalance/start")}
          >
            {t("dashboard.postEnrollment.rebalancePortfolio")}
          </button>
          <button
            type="button"
            className="post-enrollment-dashboard__quick-action-btn"
            onClick={() => navigate("/transactions/loan/start")}
          >
            {t("dashboard.postEnrollment.startLoan")}
          </button>
          <button
            type="button"
            className="post-enrollment-dashboard__quick-action-btn post-enrollment-dashboard__quick-action-btn--primary"
          >
            {t("dashboard.postEnrollment.taxCenter")}
          </button>
        </div>

        {/* Two-column content */}
        <div className="post-enrollment-dashboard__content-grid">
          <div className="post-enrollment-dashboard__content-left">
            {/* Critical Insights */}
            <article className="post-enrollment-dashboard__card">
              <h2 className="post-enrollment-dashboard__card-title">
                {t("dashboard.postEnrollment.criticalInsights")}
              </h2>
              <div className="post-enrollment-dashboard__insight post-enrollment-dashboard__insight--warning">
                <p className="post-enrollment-dashboard__insight-title">
                  {t("dashboard.postEnrollment.contributionBelowMatch")}
                </p>
                <p className="post-enrollment-dashboard__insight-desc">
                  {t("dashboard.postEnrollment.missingMatchFunds")}
                </p>
              </div>
              <div className="post-enrollment-dashboard__insight post-enrollment-dashboard__insight--danger">
                <p className="post-enrollment-dashboard__insight-title">
                  {t("dashboard.postEnrollment.riskAlertTech")}
                </p>
                <p className="post-enrollment-dashboard__insight-desc">
                  {t("dashboard.postEnrollment.techExceedsRecommended")}
                </p>
              </div>
            </article>

            {/* Performance Growth */}
            <article className="post-enrollment-dashboard__card">
              <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
                <h2 className="post-enrollment-dashboard__card-title m-0">
                  {t("dashboard.postEnrollment.performanceGrowth")}
                </h2>
                <div className="flex gap-2">
                  {["1Y", "3Y", "5Y"].map((label) => (
                    <button
                      key={label}
                      type="button"
                      className="px-3 py-1.5 text-sm font-medium rounded-lg border border-[var(--color-border)] bg-[var(--card-bg)]"
                      style={{ color: "var(--color-text)" }}
                    >
                      {label}
                    </button>
                  ))}
                </div>
              </div>
              <p className="text-sm mb-4" style={{ color: "var(--color-text-secondary)" }}>
                {t("dashboard.postEnrollment.projectedVsActual")}
              </p>
              <div
                className="h-48 rounded-xl flex items-end justify-around gap-1 p-2"
                style={{ background: "var(--color-background-secondary)" }}
              >
                {[40, 55, 45, 70, 65, 80, 75].map((h, i) => (
                  <div
                    key={i}
                    className="flex-1 min-w-0 rounded-t"
                    style={{
                      height: `${h}%`,
                      background: "var(--color-primary)",
                    }}
                  />
                ))}
              </div>
            </article>

            {/* Recent Transactions */}
            <RecentTransactionsCard transactions={data.transactions} />
          </div>

          <div className="post-enrollment-dashboard__content-right">
            {/* Upcoming Milestones */}
            <article className="post-enrollment-dashboard__card">
              <h2 className="post-enrollment-dashboard__card-title">
                {t("dashboard.postEnrollment.upcomingMilestones")}
              </h2>
              <div className="space-y-3">
                <div className="flex gap-3">
                  <span className="shrink-0 text-[var(--color-text-secondary)]" aria-hidden>📅</span>
                  <div>
                    <p className="font-semibold text-sm m-0" style={{ color: "var(--color-text)" }}>
                      {t("dashboard.postEnrollment.catchUpReset")}
                    </p>
                    <p className="text-xs m-0 mt-0.5" style={{ color: "var(--color-text-secondary)" }}>
                      {t("dashboard.postEnrollment.catchUpResetDesc")}
                    </p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <span className="shrink-0 text-[var(--color-text-secondary)]" aria-hidden>📋</span>
                  <div>
                    <p className="font-semibold text-sm m-0" style={{ color: "var(--color-text)" }}>
                      {t("dashboard.postEnrollment.annualStrategyReview")}
                    </p>
                    <p className="text-xs m-0 mt-0.5" style={{ color: "var(--color-text-secondary)" }}>
                      {t("dashboard.postEnrollment.annualStrategyReviewDesc")}
                    </p>
                  </div>
                </div>
              </div>
            </article>

            {/* Portfolio Health */}
            <article className="post-enrollment-dashboard__card">
              <div className="flex items-center justify-between mb-4">
                <h2 className="post-enrollment-dashboard__card-title m-0">
                  {t("dashboard.postEnrollment.portfolioHealth")}
                </h2>
                <span
                  className="text-[10px] font-bold uppercase px-2 py-1 rounded-full"
                  style={{
                    background: "var(--color-success)",
                    color: "var(--color-text-inverse)",
                  }}
                >
                  {t("dashboard.postEnrollment.optimal")}
                </span>
              </div>
              <div className="post-enrollment-dashboard__health-bar-wrap">
                <p className="post-enrollment-dashboard__health-bar-label">
                  {t("dashboard.postEnrollment.usEquities")}
                </p>
                <ProgressBar value={65} height={8} />
              </div>
              <div className="post-enrollment-dashboard__health-bar-wrap">
                <p className="post-enrollment-dashboard__health-bar-label">
                  {t("dashboard.postEnrollment.intlEquities")}
                </p>
                <ProgressBar value={20} height={8} />
              </div>
              <div className="post-enrollment-dashboard__health-bar-wrap">
                <p className="post-enrollment-dashboard__health-bar-label">
                  {t("dashboard.postEnrollment.fixedIncome")}
                </p>
                <ProgressBar value={15} height={8} />
              </div>
              <p className="text-3xl font-bold mt-4 mb-0" style={{ color: "var(--color-text)" }}>
                92
              </p>
              <p className="text-[10px] font-bold uppercase tracking-wider mt-0.5" style={{ color: "var(--color-text-secondary)" }}>
                {t("dashboard.postEnrollment.healthScore")} {t("dashboard.postEnrollment.excellentDiversification")}
              </p>
            </article>

            {/* Goal Simulator */}
            {goal && (
              <GoalSimulatorCard data={goal} />
            )}

            {/* Active Requests */}
            <article className="post-enrollment-dashboard__card">
              <h2 className="post-enrollment-dashboard__card-title">
                {t("dashboard.postEnrollment.activeRequests")}
              </h2>
              <div className="space-y-3">
                <div className="flex flex-wrap items-start justify-between gap-2 p-3 rounded-xl border border-[var(--color-border)]">
                  <div>
                    <p className="font-semibold text-sm m-0" style={{ color: "var(--color-text)" }}>
                      {t("dashboard.postEnrollment.generalPurposeLoan")}
                    </p>
                    <p className="text-[10px] uppercase mt-1" style={{ color: "var(--color-text-secondary)" }}>
                      {t("dashboard.postEnrollment.verification")}
                    </p>
                  </div>
                  <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded" style={{ background: "var(--color-warning-bg, rgba(245,158,11,0.2))", color: "var(--color-warning, #f59e0b)" }}>
                    {t("dashboard.postEnrollment.underReview")}
                  </span>
                  <p className="text-xs w-full m-0" style={{ color: "var(--color-text-secondary)" }}>
                    {t("dashboard.postEnrollment.etaDays", { count: 2 })}
                  </p>
                </div>
                <div className="flex flex-wrap items-start justify-between gap-2 p-3 rounded-xl border border-[var(--color-border)]">
                  <div>
                    <p className="font-semibold text-sm m-0" style={{ color: "var(--color-text)" }}>
                      {t("dashboard.postEnrollment.externalRolloverIn")}
                    </p>
                    <p className="text-[10px] uppercase mt-1" style={{ color: "var(--color-text-secondary)" }}>
                      {t("dashboard.postEnrollment.fundsTransfer")}
                    </p>
                  </div>
                  <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded" style={{ background: "rgba(16,185,129,0.15)", color: "var(--color-success)" }}>
                    {t("dashboard.postEnrollment.inProgress")}
                  </span>
                  <p className="text-xs w-full m-0" style={{ color: "var(--color-text-secondary)" }}>
                    {t("dashboard.postEnrollment.etaToday")}
                  </p>
                </div>
              </div>
            </article>
          </div>
        </div>

        {/* Page footer */}
        <div className="post-enrollment-dashboard__footer">
          <p className="m-0">
            {t("dashboard.postEnrollment.dataUpdated", { date: formatDate() })}
          </p>
          <nav className="post-enrollment-dashboard__footer-links" aria-label="Footer links">
            <a href="/privacy">{t("dashboard.postEnrollment.privacyPolicy")}</a>
            <a href="/security">{t("dashboard.postEnrollment.securityCenter")}</a>
            <a href="/support">{t("dashboard.postEnrollment.contactSupport")}</a>
          </nav>
        </div>
      </div>
    </DashboardLayout>
  );
};
