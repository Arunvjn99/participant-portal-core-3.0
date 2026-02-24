import { Outlet, useLocation } from "react-router-dom";
import { CoreAIFab } from "../components/ai/CoreAIFab";
import { DemoSwitcher } from "../components/demo/DemoSwitcher";
import { RouteErrorBoundary } from "../components/RouteErrorBoundary";
import { useAISettings } from "../context/AISettingsContext";

const HIDE_CORE_AI_PATHS = ["/"];

/**
 * Root layout - wraps all routes. Renders Outlet + global floating components.
 * Company branding is now handled by ThemeContext via UserContext.
 * Core AI FAB is hidden when user has disabled it in settings.
 */
export const RootLayout = () => {
  const { pathname } = useLocation();
  const { coreAIEnabled } = useAISettings();
  const showCoreAI =
    coreAIEnabled && !HIDE_CORE_AI_PATHS.includes(pathname);

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
