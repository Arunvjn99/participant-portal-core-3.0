import type { ReactNode } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useEnrollment } from "@/enrollment/context/EnrollmentContext";
import { loadEnrollmentDraft } from "@/enrollment/enrollmentDraftStore";
import { getRoutingVersion, withVersion } from "@/core/version";

interface EnrollmentInvestmentsGuardProps {
  children: ReactNode;
}

/**
 * Guard for Investment Elections step - redirects if prerequisites not met.
 * Must be inside EnrollmentProvider.
 * Uses both context and draft so that after "Continue to Investment" from the
 * auto-increase (future-contributions) page we don't redirect to contribution
 * when context has not been hydrated with contributionAmount but draft has it.
 * Also allows through when draft has autoIncrease (user came from auto-increase).
 */
export const EnrollmentInvestmentsGuard = ({ children }: EnrollmentInvestmentsGuardProps) => {
  const { state } = useEnrollment();
  const { pathname } = useLocation();
  const version = getRoutingVersion(pathname);

  if (!state.isInitialized || !state.selectedPlan) {
    return <Navigate to={withVersion(version, "/enrollment/choose-plan")} replace />;
  }

  const hasContributionInState = state.contributionAmount > 0;
  if (!hasContributionInState) {
    const draft = loadEnrollmentDraft();
    if (!draft) {
      return <Navigate to={withVersion(version, "/enrollment/contribution")} replace />;
    }
    const draftContribution = draft.contributionAmount ?? 0;
    const cameFromFutureContributions = draft.autoIncrease !== undefined;
    if (draftContribution <= 0 && !cameFromFutureContributions) {
      return <Navigate to={withVersion(version, "/enrollment/contribution")} replace />;
    }
  }

  return <>{children}</>;
};
