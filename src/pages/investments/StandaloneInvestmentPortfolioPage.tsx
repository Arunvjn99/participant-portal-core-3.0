import { useMemo } from "react";
import type { User } from "@supabase/supabase-js";
import { DashboardLayout } from "@/layouts/DashboardLayout";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { useAuth } from "@/context/AuthContext";
import { useDemoUser } from "@/hooks/useDemoUser";
import { investmentDemoOverridesFromScenario } from "@/lib/scenarioInvestmentHydration";
import { CrpInvestmentPortfolioClient } from "@/features/crp-investment-portfolio";
import { useScenarioStore } from "@/store/scenarioStore";

function firstNameFromUser(user: User | null): string {
  const meta = user?.user_metadata as Record<string, unknown> | undefined;
  const a = meta?.first_name;
  if (typeof a === "string" && a.trim()) return a.trim();
  const b = meta?.full_name;
  if (typeof b === "string" && b.trim()) return b.trim().split(/\s+/)[0] ?? "there";
  const c = meta?.name;
  if (typeof c === "string" && c.trim()) return c.trim().split(/\s+/)[0] ?? "there";
  return "there";
}

function greetingLine(user: User | null, demoFirstName?: string | null): string {
  const h = new Date().getHours();
  const part = h < 12 ? "morning" : h < 17 ? "afternoon" : "evening";
  if (demoFirstName) return `Good ${part}, ${demoFirstName}`;
  if (user) return `Good ${part}, ${firstNameFromUser(user)}`;
  return `Good ${part}, welcome back`;
}

/**
 * Standalone `/investments` — core-retirement-platform portfolio dashboard (mock data).
 */
export function StandaloneInvestmentPortfolioPage() {
  const { user } = useAuth();
  const demoUser = useDemoUser();
  const scenario = useScenarioStore((s) => (s.isDemoMode ? s.scenarioData : null));
  const invOverrides = useMemo(() => investmentDemoOverridesFromScenario(scenario), [scenario]);
  const demoFirstName = demoUser?.name?.trim()?.split(/\s+/)[0] ?? null;

  const lastUpdatedLabel = `Last updated: ${new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date())}`;

  return (
    <DashboardLayout header={<DashboardHeader />} fullWidthChildren>
      <CrpInvestmentPortfolioClient
        greetingLine={greetingLine(user, demoFirstName)}
        lastUpdatedLabel={lastUpdatedLabel}
        portfolioDataPartial={invOverrides?.portfolioDataPartial}
        allocationsOverride={invOverrides?.allocations}
        chartDataOverride={invOverrides?.chartData}
      />
    </DashboardLayout>
  );
}

export default StandaloneInvestmentPortfolioPage;
