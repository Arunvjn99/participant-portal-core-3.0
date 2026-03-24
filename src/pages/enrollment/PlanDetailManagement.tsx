import { useState } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Printer } from "lucide-react";
import { DashboardLayout } from "@/layouts/DashboardLayout";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { DashboardCard } from "@/components/dashboard/DashboardCard";
import Button from "@/components/ui/Button";
import { MOCK_ENROLLED_PLANS, type EnrolledPlan } from "@/data/mockEnrolledPlans";
import { OptOutModal } from "@/components/enrollment/OptOutModal";
import { getRoutingVersion, withVersion } from "@/core/version";

/**
 * PlanDetailManagement - Detailed management view for a single enrolled plan
 * Read-only summary with controlled-edit CTAs
 */
const formatCurrency = (n: number) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(n);

export const PlanDetailManagement = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const version = getRoutingVersion(pathname);
  const { planId } = useParams<{ planId: string }>();
  const [showOptOutModal, setShowOptOutModal] = useState(false);

  const plan = MOCK_ENROLLED_PLANS.find((p) => p.id === planId);

  if (!plan || plan.status !== "enrolled") {
    return (
      <DashboardLayout header={<DashboardHeader />}>
        <div className="plan-detail-management">
          <div className="plan-detail-management__error">
            <h1>Plan Not Found</h1>
            <p>The requested plan could not be found or is not enrolled.</p>
            <Button onClick={() => navigate(withVersion(version, "/enrollment"))}>Back to Enrollment</Button>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  const handleEditContribution = () => {
    navigate(withVersion(version, "/enrollment/contribution"));
  };

  const handleChangeInvestments = () => {
    navigate(withVersion(version, "/enrollment/investments"));
  };

  const handleEditAutoFeatures = () => {
    // Navigate to auto-features edit page (could be a modal or separate page)
    console.log("Edit auto-features for plan:", plan.id);
  };

  const handleManageBeneficiaries = () => {
    // Navigate to beneficiaries management page
    console.log("Manage beneficiaries for plan:", plan.id);
  };

  const handlePrint = () => {
    window.print();
  };

  const handleOptOut = () => {
    setShowOptOutModal(true);
  };

  const handleOptOutConfirm = () => {
    // TODO: Implement opt-out logic
    console.log("Opting out of plan:", plan.id);
    setShowOptOutModal(false);
    navigate(withVersion(version, "/enrollment"));
  };

  const totalBalance = plan.balance ?? 0;
  const vestedBalance = plan.vestedBalance ?? 0;
  const totalPct = plan.contributionElection?.totalPercentage ?? 0;
  const healthScore = 84;

  return (
    <DashboardLayout header={<DashboardHeader />}>
      <div className="plan-detail-management">
        <div className="plan-detail-management__header">
          <button
            type="button"
            onClick={() => navigate(withVersion(version, "/enrollment"))}
            className="plan-detail-management__back-button"
            aria-label={t("enrollment.backToEnrollment")}
          >
            <span className="plan-detail-management__back-icon" aria-hidden="true">←</span>
            <span className="plan-detail-management__back-text">{t("enrollment.backToEnrollment")}</span>
          </button>
          <div className="plan-detail-management__header-content">
          <div className="plan-detail-management__header-info">
            <div className="flex flex-wrap items-center gap-3">
              <h1 className="plan-detail-management__title">{plan.planName}</h1>
              <span
                className="rounded-full px-3 py-1 text-xs font-bold uppercase tracking-wide"
                style={{
                  backgroundColor: "var(--color-success-light, #ecfdf5)",
                  color: "var(--color-success, #059669)",
                }}
              >
                {t("enrollment.statusEnrolled")}
              </span>
            </div>
            <div className="plan-detail-management__header-meta">
              <span className="plan-detail-management__plan-id">{t("enrollment.planIdLabel")}: {plan.planId}</span>
              <span className="plan-detail-management__plan-type">{plan.planType}</span>
            </div>
          </div>
          <div className="plan-detail-management__header-actions">
            <Button
              onClick={handlePrint}
              className="plan-detail-management__action-button plan-detail-management__action-button--secondary flex items-center gap-2"
            >
              <Printer className="h-4 w-4" aria-hidden />
              {t("enrollment.print")}
            </Button>
            <Button
              onClick={handleOptOut}
              className="plan-detail-management__action-button plan-detail-management__action-button--danger"
            >
              {t("enrollment.optOutPlan")}
            </Button>
          </div>
        </div>
        </div>

        {/* Summary cards: Total Balance, Vested Balance, My Contribution, Health Score */}
        <div className="plan-detail-management__summary-cards grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-5">
            <p className="text-sm font-medium uppercase tracking-wide" style={{ color: "var(--color-text-secondary)" }}>
              {t("enrollment.totalBalance")}
            </p>
            <p className="mt-1 text-2xl font-bold" style={{ color: "var(--color-text)" }}>
              {formatCurrency(totalBalance)}
            </p>
            <p className="mt-0.5 text-sm" style={{ color: "var(--color-success)" }}>+2.4% {t("enrollment.thisMonth")}</p>
          </div>
          <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-5">
            <p className="text-sm font-medium uppercase tracking-wide" style={{ color: "var(--color-text-secondary)" }}>
              {t("enrollment.vestedBalance")}
            </p>
            <p className="mt-1 text-2xl font-bold" style={{ color: "var(--color-text)" }}>
              {formatCurrency(vestedBalance)}
            </p>
            <p className="mt-0.5 text-sm" style={{ color: "var(--color-text-secondary)" }}>{t("enrollment.percentVested")}</p>
          </div>
          <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-5">
            <p className="text-sm font-medium uppercase tracking-wide" style={{ color: "var(--color-text-secondary)" }}>
              {t("enrollment.myContribution")}
            </p>
            <p className="mt-1 text-2xl font-bold" style={{ color: "var(--color-text)" }}>{totalPct}%</p>
            <p className="mt-0.5 text-sm" style={{ color: "var(--color-text-secondary)" }}>
              {t("enrollment.belowEmployerMatch", { percent: "2" })}
            </p>
          </div>
          <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-5">
            <p className="text-sm font-medium uppercase tracking-wide" style={{ color: "var(--color-text-secondary)" }}>
              {t("enrollment.healthScore")}
            </p>
            <p className="mt-1 text-2xl font-bold" style={{ color: "var(--color-text)" }}>{healthScore}/100</p>
            <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-[var(--color-border)]">
              <div
                className="h-full rounded-full transition-all"
                style={{
                  width: `${healthScore}%`,
                  backgroundColor: "var(--color-primary)",
                }}
              />
            </div>
          </div>
        </div>

        {/* Contribution Election */}
        <DashboardCard
          title={t("enrollment.contributionElection")}
          action={
            <Button
              onClick={handleEditContribution}
              className="plan-detail-management__edit-button"
            >
              {t("enrollment.editContribution")}
            </Button>
          }
        >
          <div className="plan-detail-management__contribution-summary">
            {plan.contributionElection ? (
              <div className="plan-detail-management__contribution-breakdown">
                {plan.contributionElection.pretaxPercentage !== undefined &&
                  plan.contributionElection.pretaxPercentage > 0 && (
                    <div className="plan-detail-management__contribution-item">
                      <span className="plan-detail-management__contribution-label">Pre-tax</span>
                      <span className="plan-detail-management__contribution-value">
                        {plan.contributionElection.pretaxPercentage}%
                      </span>
                    </div>
                  )}
                {plan.contributionElection.rothPercentage !== undefined &&
                  plan.contributionElection.rothPercentage > 0 && (
                    <div className="plan-detail-management__contribution-item">
                      <span className="plan-detail-management__contribution-label">Roth</span>
                      <span className="plan-detail-management__contribution-value">
                        {plan.contributionElection.rothPercentage}%
                      </span>
                    </div>
                  )}
                {plan.contributionElection.afterTaxPercentage !== undefined &&
                  plan.contributionElection.afterTaxPercentage > 0 && (
                    <div className="plan-detail-management__contribution-item">
                      <span className="plan-detail-management__contribution-label">After-tax</span>
                      <span className="plan-detail-management__contribution-value">
                        {plan.contributionElection.afterTaxPercentage}%
                      </span>
                    </div>
                  )}
                {plan.contributionElection.catchUpPercentage !== undefined &&
                  plan.contributionElection.catchUpPercentage > 0 && (
                    <div className="plan-detail-management__contribution-item">
                      <span className="plan-detail-management__contribution-label">Catch-up</span>
                      <span className="plan-detail-management__contribution-value">
                        {plan.contributionElection.catchUpPercentage}%
                      </span>
                    </div>
                  )}
                <div className="plan-detail-management__contribution-item plan-detail-management__contribution-item--total">
                  <span className="plan-detail-management__contribution-label">Total</span>
                  <span className="plan-detail-management__contribution-value">
                    {plan.contributionElection.totalPercentage}%
                  </span>
                </div>
              </div>
            ) : (
              <p className="plan-detail-management__no-data">No contribution election on file.</p>
            )}
          </div>
        </DashboardCard>

        {/* Investment Election */}
        <DashboardCard
          title={t("enrollment.investmentElection")}
          action={
            <Button
              onClick={handleChangeInvestments}
              className="plan-detail-management__edit-button"
            >
              {t("enrollment.changeInvestments")}
            </Button>
          }
        >
          <div className="plan-detail-management__investment-summary">
            {plan.investmentElection ? (
              <div className="plan-detail-management__investment-breakdown">
                {plan.investmentElection.pretax.totalPercentage > 0 && (
                  <div className="plan-detail-management__investment-source">
                    <h4 className="plan-detail-management__investment-source-title">Pre-tax</h4>
                    <div className="plan-detail-management__investment-funds">
                      {plan.investmentElection.pretax.funds.map((fund, idx) => (
                        <div key={idx} className="plan-detail-management__investment-fund">
                          <span className="plan-detail-management__fund-name">{fund.fundName}</span>
                          <span className="plan-detail-management__fund-percentage">{fund.percentage}%</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                {plan.investmentElection.roth.totalPercentage > 0 && (
                  <div className="plan-detail-management__investment-source">
                    <h4 className="plan-detail-management__investment-source-title">Roth</h4>
                    <div className="plan-detail-management__investment-funds">
                      {plan.investmentElection.roth.funds.map((fund, idx) => (
                        <div key={idx} className="plan-detail-management__investment-fund">
                          <span className="plan-detail-management__fund-name">{fund.fundName}</span>
                          <span className="plan-detail-management__fund-percentage">{fund.percentage}%</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                {plan.investmentElection.afterTax.totalPercentage > 0 && (
                  <div className="plan-detail-management__investment-source">
                    <h4 className="plan-detail-management__investment-source-title">After-tax</h4>
                    <div className="plan-detail-management__investment-funds">
                      {plan.investmentElection.afterTax.funds.map((fund, idx) => (
                        <div key={idx} className="plan-detail-management__investment-fund">
                          <span className="plan-detail-management__fund-name">{fund.fundName}</span>
                          <span className="plan-detail-management__fund-percentage">{fund.percentage}%</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                {plan.investmentElection.catchUp.totalPercentage > 0 && (
                  <div className="plan-detail-management__investment-source">
                    <h4 className="plan-detail-management__investment-source-title">Catch-up</h4>
                    <div className="plan-detail-management__investment-funds">
                      {plan.investmentElection.catchUp.funds.map((fund, idx) => (
                        <div key={idx} className="plan-detail-management__investment-fund">
                          <span className="plan-detail-management__fund-name">{fund.fundName}</span>
                          <span className="plan-detail-management__fund-percentage">{fund.percentage}%</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <p className="plan-detail-management__no-data">No investment election on file.</p>
            )}
          </div>
        </DashboardCard>

        {/* Auto Features */}
        <DashboardCard
          title={t("enrollment.autoFeatures")}
          action={
            <Button
              onClick={handleEditAutoFeatures}
              className="plan-detail-management__edit-button"
            >
              {t("enrollment.manageFeatures")}
            </Button>
          }
        >
          <div className="plan-detail-management__auto-features">
            {plan.autoFeatures ? (
              <div className="plan-detail-management__auto-features-content">
                <div className="plan-detail-management__auto-feature-item">
                  <span className="plan-detail-management__auto-feature-label">Auto Increase</span>
                  <span className="plan-detail-management__auto-feature-value">
                    {plan.autoFeatures.autoIncrease.enabled
                      ? `Enabled (${plan.autoFeatures.autoIncrease.increasePercentage}% ${plan.autoFeatures.autoIncrease.frequency}, max ${plan.autoFeatures.autoIncrease.maxPercentage}%)`
                      : "Disabled"}
                  </span>
                </div>
                <div className="plan-detail-management__auto-feature-item">
                  <span className="plan-detail-management__auto-feature-label">Annual Limit</span>
                  <span className="plan-detail-management__auto-feature-value">
                    {new Intl.NumberFormat("en-US", {
                      style: "currency",
                      currency: "USD",
                      minimumFractionDigits: 0,
                      maximumFractionDigits: 0,
                    }).format(plan.autoFeatures.limits.annualLimit)}
                  </span>
                </div>
                <div className="plan-detail-management__auto-feature-item">
                  <span className="plan-detail-management__auto-feature-label">Catch-up Limit</span>
                  <span className="plan-detail-management__auto-feature-value">
                    {new Intl.NumberFormat("en-US", {
                      style: "currency",
                      currency: "USD",
                      minimumFractionDigits: 0,
                      maximumFractionDigits: 0,
                    }).format(plan.autoFeatures.limits.catchUpLimit)}
                  </span>
                </div>
                <div className="plan-detail-management__auto-feature-item">
                  <span className="plan-detail-management__auto-feature-label">Employer Match Cap</span>
                  <span className="plan-detail-management__auto-feature-value">
                    {plan.autoFeatures.limits.employerMatchCap}%
                  </span>
                </div>
                {plan.autoFeatures.lastModified && (
                  <div className="plan-detail-management__auto-feature-item">
                    <span className="plan-detail-management__auto-feature-label">Last Modified</span>
                    <span className="plan-detail-management__auto-feature-value">
                      {new Date(plan.autoFeatures.lastModified).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </span>
                  </div>
                )}
              </div>
            ) : (
              <p className="plan-detail-management__no-data">No auto-features configured.</p>
            )}
          </div>
        </DashboardCard>

        {/* Beneficiaries */}
        <DashboardCard
          title={t("enrollment.beneficiaries")}
          action={
            <Button
              onClick={handleManageBeneficiaries}
              className="plan-detail-management__edit-button"
            >
              {t("enrollment.updateBeneficiaries")}
            </Button>
          }
        >
          <div className="plan-detail-management__beneficiaries">
            {plan.beneficiaries ? (
              <div className="plan-detail-management__beneficiaries-content">
                {plan.beneficiaries.primary.length > 0 && (
                  <div className="plan-detail-management__beneficiary-group">
                    <h4 className="plan-detail-management__beneficiary-group-title">Primary</h4>
                    {plan.beneficiaries.primary.map((beneficiary, idx) => (
                      <div key={idx} className="plan-detail-management__beneficiary-item">
                        <span className="plan-detail-management__beneficiary-name">
                          {beneficiary.name}
                        </span>
                        <span className="plan-detail-management__beneficiary-relationship">
                          {beneficiary.relationship}
                        </span>
                        <span className="plan-detail-management__beneficiary-percentage">
                          {beneficiary.percentage}%
                        </span>
                      </div>
                    ))}
                  </div>
                )}
                {plan.beneficiaries.contingent.length > 0 && (
                  <div className="plan-detail-management__beneficiary-group">
                    <h4 className="plan-detail-management__beneficiary-group-title">Contingent</h4>
                    {plan.beneficiaries.contingent.map((beneficiary, idx) => (
                      <div key={idx} className="plan-detail-management__beneficiary-item">
                        <span className="plan-detail-management__beneficiary-name">
                          {beneficiary.name}
                        </span>
                        <span className="plan-detail-management__beneficiary-relationship">
                          {beneficiary.relationship}
                        </span>
                        <span className="plan-detail-management__beneficiary-percentage">
                          {beneficiary.percentage}%
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <p className="plan-detail-management__no-data">No beneficiaries on file.</p>
            )}
          </div>
        </DashboardCard>

        {/* Documents */}
        <DashboardCard title={t("enrollment.documents")}>
          <div className="plan-detail-management__documents">
            <div className="plan-detail-management__document-item">
              <span className="plan-detail-management__document-name">Plan Documents</span>
              <Button
                onClick={() => console.log("View plan documents")}
                className="plan-detail-management__document-button"
              >
                View
              </Button>
            </div>
            <div className="plan-detail-management__document-item">
              <span className="plan-detail-management__document-name">Account Statements</span>
              <Button
                onClick={() => console.log("View statements")}
                className="plan-detail-management__document-button"
              >
                View
              </Button>
            </div>
          </div>
        </DashboardCard>

        {/* Activity Log */}
        <DashboardCard
          title={t("enrollment.activityLog")}
          action={
            <button
              type="button"
              onClick={() => {}}
              className="text-sm font-medium"
              style={{ color: "var(--color-primary)" }}
            >
              {t("enrollment.viewAllActivity")}
            </button>
          }
        >
          <div className="plan-detail-management__activity-log">
            {plan.activityLog && plan.activityLog.length > 0 ? (
              <div className="plan-detail-management__activity-items">
                {plan.activityLog.map((activity, idx) => (
                  <div key={idx} className="plan-detail-management__activity-item">
                    <div className="plan-detail-management__activity-date">
                      {new Date(activity.date).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })}
                    </div>
                    <div className="plan-detail-management__activity-content">
                      <span className="plan-detail-management__activity-action">{activity.action}</span>
                      <span className="plan-detail-management__activity-description">
                        {activity.description}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="plan-detail-management__no-data">No activity recorded.</p>
            )}
          </div>
        </DashboardCard>
      </div>

      {/* Opt-out Modal */}
      <OptOutModal
        isOpen={showOptOutModal}
        onClose={() => setShowOptOutModal(false)}
        onConfirm={handleOptOutConfirm}
        planName={plan.planName}
      />
    </DashboardLayout>
  );
};
