import { Navigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useOtp } from "../../context/OtpContext";

/**
 * Requires BOTH a Supabase session AND OTP verification.
 *  - loading → render nothing (avoids flash)
 *  - no user → redirect to login
 *  - user but OTP not verified → redirect to /verify?mode=login
 *  - user + OTP verified → render children
 */
export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const { isOtpVerified } = useOtp();

  if (loading) return null;
  if (!user) return <Navigate to="/" replace />;
  if (!isOtpVerified) return <Navigate to="/verify?mode=login" replace />;

  return <>{children}</>;
}
