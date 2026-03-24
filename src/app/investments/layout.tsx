import { type ReactNode, useState, useCallback, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import { DashboardLayout } from "@/layouts/DashboardLayout";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { EnrollmentStepper } from "@/components/enrollment/EnrollmentStepper";
import { InvestmentProfileWizard } from "@/components/enrollment/InvestmentProfileWizard";
import { AllocationSummary } from "@/components/investments/AllocationSummary";
import { InvestmentsFooter } from "@/components/investments/InvestmentsFooter";
import { InvestmentWizardProvider } from "@/context/InvestmentWizardContext";
import { useEnrollmentOptional } from "@/enrollment/context/EnrollmentContext";
import { stripRoutingVersionPrefix } from "@/core/version";

interface InvestmentsLayoutProps {
  children: ReactNode;
}

export default function InvestmentsLayout({ children }: InvestmentsLayoutProps) {
  const { t } = useTranslation();
  const { pathname } = useLocation();
  const pathSansVersion = stripRoutingVersionPrefix(pathname);
  const isStandalonePortfolio = pathSansVersion === "/investments";
  const isEnrollmentFlow =
    pathSansVersion === "/enrollment/investments" || pathSansVersion.startsWith("/enrollment/investments/");
  const [isWizardOpen, setIsWizardOpen] = useState(false);
  const enrollment = useEnrollmentOptional();
  const openWizard = useCallback(() => setIsWizardOpen(true), []);

  /* Auto-open Investment Profile wizard when entering investments step.
   * Use session flag so we open after "Skip for now" → Continue even when draft has stale investmentProfileCompleted.
   * Future Contributions page clears the flag on mount so coming from there always allows opening. */
  const WIZARD_SESSION_KEY = "enrollment-investment-wizard-completed-session";
  useEffect(() => {
    if (!isEnrollmentFlow || !enrollment) return;
    const completedThisSession = typeof sessionStorage !== "undefined" && sessionStorage.getItem(WIZARD_SESSION_KEY);
    const { investmentProfileCompleted } = enrollment.state;
    const shouldOpen = !completedThisSession || !investmentProfileCompleted;
    if (!shouldOpen) return;
    const id = setTimeout(() => setIsWizardOpen(true), 0);
    return () => clearTimeout(id);
  }, [isEnrollmentFlow, enrollment?.state.investmentProfileCompleted]);

  const handleWizardClose = useCallback(() => {
    setIsWizardOpen(false);
    if (typeof sessionStorage !== "undefined") sessionStorage.setItem(WIZARD_SESSION_KEY, "1");
  }, []);

  if (isStandalonePortfolio) {
    return <>{children}</>;
  }

  const content = (
    <div style={{ background: "var(--enroll-bg)" }} className="w-full min-h-screen pb-12">
      {!isEnrollmentFlow && (
        <div className="enrollment-stepper-section investments-layout__stepper">
          <EnrollmentStepper currentStep={3} title={t("enrollment.investmentElectionsTitle")} subtitle={t("enrollment.investmentElectionsSubtitle")} />
        </div>
      )}

      <div className="max-w-[1200px] mx-auto px-4 md:px-6 py-8 md:py-10">
        {/* ── Hero Header ── */}
        <motion.header
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="mb-8"
        >
          <h1
            className="text-[28px] md:text-[32px] font-bold leading-tight"
            style={{ color: "var(--enroll-text-primary)" }}
          >
            {t("enrollment.chooseHowInvested")}
          </h1>
          <p
            className="mt-1.5 text-base"
            style={{ color: "var(--enroll-text-secondary)" }}
          >
            {t("enrollment.selectOrCustomizeAllocation")}
          </p>
        </motion.header>

        {/* ── Main Grid ── */}
        <InvestmentWizardProvider openWizard={openWizard}>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
            <div className="lg:col-span-2">{children}</div>
            <div className="lg:col-span-1">
              <div className="lg:sticky lg:top-24">
                <AllocationSummary variant="enrollment" />
              </div>
            </div>
          </div>
        </InvestmentWizardProvider>
      </div>

      {/* Footer in same width container so button row fills horizontally (matches Contribution / Future Contributions) */}
      <div className="w-full max-w-[1200px] mx-auto px-4 md:px-6">
        <InvestmentsFooter />
      </div>

      {isEnrollmentFlow && (
        <InvestmentProfileWizard
          isOpen={isWizardOpen}
          onClose={handleWizardClose}
          onComplete={handleWizardClose}
          initialProfile={enrollment?.state.investmentProfile ?? undefined}
        />
      )}
    </div>
  );

  if (isEnrollmentFlow) {
    return content;
  }
  return (
    <DashboardLayout header={<DashboardHeader />}>
      {content}
    </DashboardLayout>
  );
}
