import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { useOtp } from "@/context/OtpContext";
import { getRoutingVersion, withVersion } from "@/core/version";

/**
 * Requires BOTH a Supabase session AND OTP verification.
 *  - loading → render nothing (avoids flash)
 *  - no user → redirect to versioned login
 *  - user but OTP not verified → redirect to versioned verify?mode=login
 *  - user + OTP verified → render children
 */
export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const { isOtpVerified } = useOtp();
  const location = useLocation();
  const version = getRoutingVersion(location.pathname);
  const verifyLoginPath = `${withVersion(version, "/verify")}?mode=login`;

  if (loading) return null;
  if (!user) return <Navigate to={withVersion(version, "/login")} replace />;
  if (!isOtpVerified) return <Navigate to={verifyLoginPath} replace />;

  return <>{children}</>;
}
