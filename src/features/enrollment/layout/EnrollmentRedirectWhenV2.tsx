import { useLocation, Navigate } from "react-router-dom";
import { USE_ENROLLMENT_V2 } from "../../../config/featureFlags";
import { EnrollmentLayout } from "../../../layouts/EnrollmentLayout";

const ENROLLMENT_TO_V2_PATH: Record<string, string> = {
  "/enrollment/choose-plan": "/enrollment-v2/choose-plan",
  "/enrollment/contribution": "/enrollment-v2/contribution",
  "/enrollment/auto-increase": "/enrollment-v2/auto-increase",
  "/enrollment/investments": "/enrollment-v2/investment",
  "/enrollment/review": "/enrollment-v2/review",
};

/**
 * When USE_ENROLLMENT_V2 is true, redirect enrollment step paths to V2.
 * Otherwise render existing EnrollmentLayout (old flow intact).
 */
export function EnrollmentRedirectWhenV2() {
  const { pathname } = useLocation();
  const normalized = pathname.replace(/\/$/, "") || "/";

  if (USE_ENROLLMENT_V2) {
    const v2Path = ENROLLMENT_TO_V2_PATH[normalized];
    if (v2Path) {
      return <Navigate to={v2Path} replace />;
    }
  }

  return <EnrollmentLayout />;
}
