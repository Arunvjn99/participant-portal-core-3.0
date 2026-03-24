import { memo } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate, useLocation } from "react-router-dom";
import { Sparkles } from "lucide-react";
import { InsightCard } from "@/components/dashboard/shared/InsightCard";
import { AiCoreBridgeButton } from "@/components/ai/AiCoreBridgeButton";
import { CARD_STYLE } from "@/components/dashboard/core/types";
import type { ModuleProps } from "@/components/dashboard/core/types";
import { getRoutingVersion, withVersionIfEnrollment } from "@/core/version";

const ICONS: Record<string, React.ReactNode> = {
  match: <span aria-hidden>💰</span>,
  roth: <span aria-hidden>🔄</span>,
  rebalance: <span aria-hidden>⚖️</span>,
  increase: <span aria-hidden>📈</span>,
  "loan-warning": <span aria-hidden>⚠️</span>,
};

/**
 * AI Recommendations — deterministic cards + Apply action + Core AI bridge on every row.
 */
export const AIInsightsPanel = memo(function AIInsightsPanel({ engine }: ModuleProps) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const version = getRoutingVersion(pathname);
  const actions = engine.recommendedActions;

  const routeMap: Record<string, string> = {
    match: "/enrollment/contribution",
    roth: "/enrollment/contribution",
    rebalance: "/enrollment/investments",
    increase: "/enrollment/contribution",
    "loan-warning": "/transactions/loan/eligibility",
  };

  return (
    <div className="ai-recommendation p-5" style={CARD_STYLE}>
      <div className="mb-4 flex items-center gap-2">
        <span className="ai-insight__icon-wrap" aria-hidden>
          <Sparkles className="ai-insight__sparkle" strokeWidth={2} />
        </span>
        <p className="text-xs font-bold uppercase tracking-wide" style={{ color: "var(--ai-primary)" }}>
          {t("dashboard.insightsTitle")}
        </p>
      </div>

      {actions.length === 0 ? (
        <div className="ai-insight rounded-xl p-4">
          <p className="ai-insight__label">{t("aiSystem.dashboardEmptyInsightTitle")}</p>
          <p className="ai-insight__body mt-1">{t("aiSystem.dashboardEmptyInsightBody")}</p>
          <AiCoreBridgeButton prompt={t("aiSystem.dashboardEmptyInsightPrompt")} className="mt-3" />
        </div>
      ) : (
        <div className="space-y-2.5">
          {actions.map((action, i) => (
            <InsightCard
              key={action.id}
              icon={ICONS[action.type] ?? <span aria-hidden>💡</span>}
              title={action.title}
              description={action.description}
              impact={action.impact}
              actionLabel={t("dashboard.insightsApplySuggestion")}
              coreAiPrompt={`Help me with this AI Recommendation: ${action.title}. ${action.description}`}
              onAction={() =>
                navigate(withVersionIfEnrollment(version, routeMap[action.type] ?? "/enrollment/contribution"))
              }
              index={i}
            />
          ))}
        </div>
      )}

      <p className="mt-3 text-center text-[10px]" style={{ color: "var(--enroll-text-muted)", opacity: 0.85 }}>
        {t("dashboard.insightsGeneratedFromPlan")}
      </p>
    </div>
  );
});
