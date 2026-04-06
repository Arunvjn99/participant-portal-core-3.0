import { type ReactNode, useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useDemoUser } from "@/hooks/useDemoUser";
import { useScenarioStore } from "@/store/scenarioStore";
import {
  isDemoScenarioPathAllowed,
  resolveDemoScenarioRedirectResolved,
} from "@/engine/demoFlowGuard";

/**
 * When demo/scenario mode is on, enforces route allow-lists and redirects to a safe entry.
 */
export function ScenarioFlowGuard({ children }: { children: ReactNode }) {
  const location = useLocation();
  const navigate = useNavigate();
  const demoUser = useDemoUser();
  const scenario = useScenarioStore((s) => s.scenarioData);
  const isDemoMode = useScenarioStore((s) => s.isDemoMode);
  const lastRedirect = useRef<string | null>(null);

  const active = Boolean(demoUser && isDemoMode && scenario);

  useEffect(() => {
    if (!active || !scenario) return;
    if (isDemoScenarioPathAllowed(location.pathname, scenario)) {
      lastRedirect.current = null;
      return;
    }
    const to = resolveDemoScenarioRedirectResolved(location.pathname, scenario);
    if (lastRedirect.current === to) return;
    lastRedirect.current = to;
    navigate(to, { replace: true });
  }, [active, scenario, location.pathname, navigate]);

  if (!active) return <>{children}</>;

  if (scenario && !isDemoScenarioPathAllowed(location.pathname, scenario)) {
    return null;
  }

  return <>{children}</>;
}
