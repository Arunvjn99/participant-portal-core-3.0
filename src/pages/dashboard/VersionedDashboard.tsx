import { useParams } from "react-router-dom";
import { PreEnrollment } from "@/versions/v1/dashboard/PreEnrollment";
import { Dashboard } from "@/versions/v2/dashboard/Dashboard";

/**
 * Renders the dashboard variant for URL pattern /:version/dashboard.
 * v1 → PreEnrollment (main); v2 → classic Dashboard; any other version → v1.
 */
export function VersionedDashboard() {
  const { version } = useParams<{ version: string }>();

  if (version === "v2") {
    return <Dashboard />;
  }

  return <PreEnrollment />;
}
