import { useNavigate } from "react-router-dom";
import { DashboardLayout } from "../../layouts/DashboardLayout";
import { DashboardHeader } from "../../components/dashboard/DashboardHeader";
import { PostEnrollmentTopBanner } from "../../components/dashboard/PostEnrollmentTopBanner";
import { PlanOverviewCard } from "../../components/dashboard/PlanOverviewCard";
import { GoalSimulatorCard } from "../../components/dashboard/GoalSimulatorCard";
import { RecentTransactionsCard } from "../../components/dashboard/RecentTransactionsCard";
import { RateOfReturnCard } from "../../components/dashboard/RateOfReturnCard";
import { PortfolioTable } from "../../components/dashboard/PortfolioTable";
import { BottomActionCards } from "../../components/dashboard/BottomActionCards";
import { LearningHub } from "../../components/dashboard/LearningHub";
import { OnboardingProgressCard } from "../../components/dashboard/OnboardingProgressCard";
import { AllocationChart } from "../../components/investments/AllocationChart";
import { MOCK_ENROLLMENT_SUMMARY } from "../../data/enrollmentSummary";
import type { EnrollmentSummary } from "../../data/enrollmentSummary";

/**
 * Post-Enrollment Dashboard — Figma 519-4705
 *
 * < xl: Single column, natural reading order (unchanged).
 * ≥ xl: Two-column grid [2fr 1fr], strict row alignment per Figma.
 */
export const PostEnrollmentDashboard = () => {
  const navigate = useNavigate();
  const data: EnrollmentSummary = MOCK_ENROLLMENT_SUMMARY;

  const allocationForChart = data.investmentAllocations.map((r) => ({
    fundId: r.fundId,
    percentage: r.allocationPct,
  }));

  return (
    <DashboardLayout header={<DashboardHeader />}>
      <div
        className="mx-auto max-w-[1200px] px-6"
        role="region"
        aria-label="Post-enrollment dashboard"
      >
        <div className="grid grid-cols-1 gap-6 xl:grid xl:grid-cols-[2fr_1fr] xl:items-start xl:gap-6">
          {/* Row 1 | Left: Retirement Hero Banner (Figma 519-4764) */}
          {data.topBanner && (
            <div className="min-w-0 w-full xl:col-start-1 xl:row-start-1">
              <PostEnrollmentTopBanner
                percentOnTrack={data.topBanner.percentOnTrack}
                subText={data.topBanner.subText}
                actionRoute={data.topBanner.actionRoute}
              />
            </div>
          )}

          {/* Row 2 | Left: Plan Summary Card */}
          {data.planDetails && data.balances && (
            <div className="min-w-0 xl:col-start-1 xl:row-start-2">
              <PlanOverviewCard
                plan={data.planDetails}
                balances={data.balances}
                isWithdrawalRestricted={data.isWithdrawalRestricted}
              />
            </div>
          )}

          {/* Row 1 | Right: Goal Simulator */}
          {data.goalProgress && (
            <div className="min-w-0 xl:col-start-2 xl:row-start-1">
              <GoalSimulatorCard data={data.goalProgress} />
            </div>
          )}

          {/* Row 2 | Right: Current Allocation */}
          {data.investmentAllocations.length > 0 && data.allocationDescription && (
            <article className="ped-current-allocation min-w-0 rounded-xl border border-border bg-card p-6 xl:col-start-2 xl:row-start-2">
              <h2 className="mb-2 text-lg font-semibold text-foreground">Current Allocation</h2>
              <p className="mb-4 text-sm text-muted-foreground">{data.allocationDescription}</p>
              <div className="ped__allocation-chart-wrap">
                <AllocationChart allocations={allocationForChart} centerLabel="Allocated" showValidBadge={false} />
              </div>
              <a href="/investments" className="mt-4 inline-block text-sm font-medium text-primary hover:underline">
                Read full analysis →
              </a>
            </article>
          )}

          {/* Row 3 | Left: Quick Actions */}
          <section className="min-w-0 rounded-xl border border-border bg-card p-6 xl:col-start-1 xl:row-start-3">
            <h2 className="mb-4 text-lg font-semibold text-foreground">Quick Actions</h2>
            <div className="flex flex-wrap gap-4">
              <button type="button" className="ped-qa-btn" onClick={() => navigate("/enrollment/contribution")}>
                <span className="ped-qa-icon">¢</span>
                <span>Change Contribution</span>
              </button>
              <button type="button" className="ped-qa-btn" onClick={() => navigate("/transactions/transfer/start")}>
                <span className="ped-qa-icon">↔</span>
                <span>Transfer Funds</span>
              </button>
              <button type="button" className="ped-qa-btn" onClick={() => navigate("/transactions/rebalance/start")}>
                <span className="ped-qa-icon">⟳</span>
                <span>Rebalance</span>
              </button>
              <button type="button" className="ped-qa-btn" onClick={() => navigate("/transactions/rollover/start")}>
                <span className="ped-qa-icon">↪</span>
                <span>Start Rollover</span>
              </button>
              <button type="button" className="ped-qa-btn" onClick={() => navigate("/profile")}>
                <span className="ped-qa-icon">👤</span>
                <span>Update Profile</span>
              </button>
            </div>
          </section>

          {/* Row 4 | Left: Recent Transactions */}
          {data.transactions.length > 0 && (
            <div className="min-w-0 xl:col-start-1 xl:row-start-4">
              <RecentTransactionsCard transactions={data.transactions} />
            </div>
          )}

          {/* Row 5 | Left: Rate of Return Chart */}
          {data.rateOfReturn && (
            <div className="min-w-0 xl:col-start-1 xl:row-start-5">
              <RateOfReturnCard
                confidencePct={data.rateOfReturn.confidencePct}
                message={data.rateOfReturn.message}
                timeRange={data.rateOfReturn.timeRange}
              />
            </div>
          )}

          {/* Row 4 | Right: Onboarding Progress */}
          {data.onboardingProgress && (
            <div className="hidden min-w-0 xl:col-start-2 xl:row-start-4 xl:block">
              <OnboardingProgressCard
                percentComplete={data.onboardingProgress.percentComplete}
                badgesCompleted={data.onboardingProgress.badgesCompleted}
                badgesTotal={data.onboardingProgress.badgesTotal}
                message={data.onboardingProgress.message}
              />
            </div>
          )}

          {/* Row 5 | Right: Learning Resources */}
          {data.learningResources.length > 0 && (
            <div className="min-w-0 xl:col-start-2 xl:row-start-5">
              <LearningHub items={data.learningResources} />
            </div>
          )}

          {/* Row 6 | Left: Portfolio Table + BottomActionCards + Advisor CTA */}
          <div className="flex min-w-0 flex-col gap-6 xl:col-start-1 xl:row-start-6">
            {data.investmentAllocations.length > 0 && (
              <PortfolioTable rows={data.investmentAllocations} />
            )}
            {data.planDetails && (
              <BottomActionCards contributionPct={data.planDetails.contributionRate} />
            )}
            <section className="flex min-h-fit flex-wrap items-center justify-between gap-4 rounded-xl border border-border bg-card p-6">
              <div>
                <h3 className="text-lg font-semibold text-foreground">Need help deciding?</h3>
                <p className="mt-1 text-sm text-muted-foreground">
                  Our advisors are available to discuss which plan is right for your financial goals.
                </p>
              </div>
              <button
                type="button"
                className="rounded-md border border-border px-5 py-2 font-medium text-foreground transition-colors hover:border-primary hover:text-primary"
                onClick={() => navigate("/investments")}
              >
                Schedule a consultation
              </button>
            </section>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};
