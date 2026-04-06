import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { useOtp } from "@/context/OtpContext";
import { useDemoUser } from "@/hooks/useDemoUser";
import { getRoutingVersion, withVersion } from "@/core/version";
import { ScenarioFlowGuard } from "@/engine/flowGuard";

/**
 * Requires BOTH a Supabase session AND OTP verification — OR an active demo persona.
 *  - demo user active → render children (no auth needed)
 *  - loading → render nothing (avoids flash)
 *  - no user → redirect to versioned login
 *  - user but OTP not verified → redirect to versioned verify?mode=login
 *  - user + OTP verified → render children
 */
export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const { isOtpVerified } = useOtp();
  const demoUser = useDemoUser();
  const location = useLocation();
  const version = getRoutingVersion(location.pathname);
  const verifyLoginPath = `${withVersion(version, "/verify")}?mode=login`;

  if (demoUser) return <ScenarioFlowGuard>{children}</ScenarioFlowGuard>;

  if (loading) return null;
  if (!user) return <Navigate to={withVersion(version, "/login")} replace />;
  if (!isOtpVerified) return <Navigate to={verifyLoginPath} replace />;

  return <>{children}</>;
}
