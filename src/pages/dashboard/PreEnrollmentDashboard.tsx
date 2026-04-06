import { Navigate } from "react-router-dom";
import { useUser } from "@/context/UserContext";
import { useScenarioStore } from "@/store/scenarioStore";
import { PreEnrollment } from "@/versions/v1/dashboard/PreEnrollment";

/**
 * Explicit pre-enrollment home at `/dashboard/pre-enrollment`.
 * Enrolled users are sent to the post-enrollment dashboard.
 * Demo personas with a fully enrolled account never stay on this surface (realistic full-app demo).
 */
export function PreEnrollmentDashboard() {
  const { loading, enrollmentStatus } = useUser();
  const scenario = useScenarioStore((s) => (s.isDemoMode ? s.scenarioData : null));

  if (loading) return null;
  if (scenario?.account.isEnrolled) {
    return <Navigate to="/dashboard/post-enrollment" replace />;
  }
  if (enrollmentStatus === "completed") {
    return <Navigate to="/dashboard/post-enrollment" replace />;
  }
  return <PreEnrollment />;
}
