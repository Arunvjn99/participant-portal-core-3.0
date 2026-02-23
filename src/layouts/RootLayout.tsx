import { useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { CoreAIFab } from "../components/ai/CoreAIFab";
import { DemoSwitcher } from "../components/demo/DemoSwitcher";
import { RouteErrorBoundary } from "../components/RouteErrorBoundary";
import { useUser } from "../context/UserContext";

const HIDE_CORE_AI_PATHS = ["/"];

const DEFAULT_BRAND_PRIMARY = "#2563eb";
const DEFAULT_BRAND_SECONDARY = "#1e40af";

/**
 * Root layout - wraps all routes. Renders Outlet + global floating components.
 * CoreAIFab opens the unified CoreAIModal (chat + voice in one modal).
 * DemoSwitcher manages its own visibility internally.
 * RouteErrorBoundary catches render/commit errors (e.g. portal + key remount) and shows a friendly UI.
 */
export const RootLayout = () => {
  const { pathname } = useLocation();
  const showCoreAI = !HIDE_CORE_AI_PATHS.includes(pathname);
  const { company } = useUser();

  useEffect(() => {
    const root = document.documentElement;
    root.style.setProperty("--brand-primary", company?.brand_primary ?? DEFAULT_BRAND_PRIMARY);
    root.style.setProperty("--brand-secondary", company?.brand_secondary ?? DEFAULT_BRAND_SECONDARY);
  }, [company]);

  return (
    <>
      <RouteErrorBoundary>
        <Outlet />
      </RouteErrorBoundary>
      {showCoreAI && <CoreAIFab />}
      <DemoSwitcher />
    </>
  );
};
