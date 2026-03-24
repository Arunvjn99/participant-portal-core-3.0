import { useCallback } from "react";
import type { NavigateOptions } from "react-router-dom";
import { useNavigate, useLocation } from "react-router-dom";
import { getRoutingVersion, withVersion } from "@/core/version";

/**
 * Navigate within versioned transaction routes (`/v1/transactions/...`).
 */
export function useVersionedTxNavigate() {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const version = getRoutingVersion(pathname);

  return useCallback(
    (subPath: string, options?: NavigateOptions) => {
      const clean = subPath.replace(/^\//, "");
      const full = clean === "" ? "/transactions" : `/transactions/${clean}`;
      navigate(withVersion(version, full), options);
    },
    [navigate, version],
  );
}
