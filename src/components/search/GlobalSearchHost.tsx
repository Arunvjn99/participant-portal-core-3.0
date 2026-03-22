import { useCallback } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { getRoutingVersion } from "@/core/version";
import { handleGlobalSearch } from "@/core/search/searchEngine";
import { triggerCoreAI } from "@/core/search/aiBridge";
import { useGlobalSearch } from "@/hooks/useGlobalSearch";
import { GlobalSearchOverlay } from "./GlobalSearchOverlay";

/**
 * Wires command palette to router + Core AI. Mount once under the router (e.g. RootLayout).
 */
export function GlobalSearchHost() {
  const navigate = useNavigate();
  const location = useLocation();
  const { open, closeSearch } = useGlobalSearch();
  const routeVersion = getRoutingVersion(location.pathname);

  const onSearchSubmit = useCallback(
    (query: string) => {
      const result = handleGlobalSearch(query, routeVersion);

      if (result.type === "navigation") {
        navigate(result.route);
        return;
      }

      if (result.type === "action") {
        return;
      }

      if (result.type === "ai") {
        triggerCoreAI(result.prompt);
      }
    },
    [navigate, routeVersion],
  );

  if (!open) return null;

  return <GlobalSearchOverlay onClose={closeSearch} onSearchSubmit={onSearchSubmit} />;
}
