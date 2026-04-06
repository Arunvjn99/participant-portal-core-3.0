import { Navigate, useLocation } from "react-router-dom";
import { DEFAULT_VERSION, getRoutingVersion } from "@/core/version";
import { demoNavigateTarget, entryPathForPersona } from "@/data/demoScenarios";
import { useDemoUser } from "@/hooks/useDemoUser";

/**
 * Legacy `/demo` entry: redirects to the real route for the active demo persona.
 * Prefer navigating directly from the scenario picker (Login modal).
 */
export function DemoDashboard() {
  const user = useDemoUser();
  const location = useLocation();
  const version = getRoutingVersion(location.pathname) || DEFAULT_VERSION;

  if (!user) {
    return <Navigate to="/" replace />;
  }

  const path = entryPathForPersona(user);
  const target = demoNavigateTarget(version, path);
  return <Navigate to={target} replace />;
}
