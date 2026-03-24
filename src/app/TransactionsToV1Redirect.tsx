import { Navigate, useLocation } from "react-router-dom";

/**
 * Sends legacy `/transactions…` URLs to versioned `/v1/transactions…` (preserves path + query).
 */
export function TransactionsToV1Redirect() {
  const { pathname, search } = useLocation();
  const sub = pathname.replace(/^\/transactions/, "") || "";
  const to = `/v1/transactions${sub}`;
  return <Navigate to={`${to}${search}`} replace />;
}
