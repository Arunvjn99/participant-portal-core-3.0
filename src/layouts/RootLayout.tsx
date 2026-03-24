import { Outlet, useLocation } from "react-router-dom";
import { CoreAIFab } from "../components/ai/CoreAIFab";
import { DemoSwitcher } from "../components/demo/DemoSwitcher";
import { RouteErrorBoundary } from "../components/RouteErrorBoundary";
import { SplashScreen } from "../components/SplashScreen";
import { useAISettings } from "../context/AISettingsContext";
import { CoreAIModalProvider } from "../context/CoreAIModalContext";
import { GlobalSearchHost } from "@/components/search/GlobalSearchHost";
import { FloatingSearchBar } from "@/components/search/FloatingSearchBar";

const HIDE_CORE_AI_PATHS = [
  "/",
  "/dashboard",
  "/v1/dashboard",
  "/v2/dashboard",
  "/v1/login",
  "/v2/login",
  "/v1/verify",
  "/v2/verify",
  "/test/pre-enrollment-dashboard",
];

/**
 * Root layout - wraps all routes. Renders Outlet + global floating components.
 * Company branding is now handled by ThemeContext via UserContext.
 * Core AI FAB is hidden when user has disabled it in settings.
 * Core AI modal is owned by CoreAIModalProvider so it can be opened with a pre-filled prompt (e.g. "Ask AI about this plan").
 */
export const RootLayout = () => {
  const { pathname } = useLocation();
  const { coreAIEnabled } = useAISettings();
  const showCoreAI =
    coreAIEnabled && !HIDE_CORE_AI_PATHS.includes(pathname);

  return (
    <CoreAIModalProvider>
      <SplashScreen />
      <RouteErrorBoundary>
        <Outlet />
      </RouteErrorBoundary>
      <GlobalSearchHost />
      <FloatingSearchBar />
      {showCoreAI && <CoreAIFab />}
      <DemoSwitcher />
    </CoreAIModalProvider>
  );
};
