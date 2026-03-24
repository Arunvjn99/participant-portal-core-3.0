import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import type { PortfolioData, Plan } from "@/types/investmentPortfolio";
import { getPerformanceIntelligence } from "@/services/investmentPortfolioAiService";
import { Sparkles, ChevronDown, ChevronUp, TrendingUp, Lightbulb } from "lucide-react";
import { AiCoreBridgeButton } from "@/components/ai/AiCoreBridgeButton";

interface Props {
  data: PortfolioData;
  plans: Plan[];
}

export const AIInsightsPanel: React.FC<Props> = ({ data, plans }) => {
  const { t } = useTranslation();
  const [insights, setInsights] = useState<{
    explanation: string;
    optimization: string;
    isSample: boolean;
  } | null>(null);
  const [expanded, setExpanded] = useState(true);

  useEffect(() => {
    getPerformanceIntelligence(data, plans).then(setInsights);
  }, [data, plans]);

  const bridgePrompt =
    insights != null
      ? `I am viewing the portfolio AI Insight panel. ${insights.explanation} ${insights.optimization} Please explain what I should verify and what questions to ask my plan administrator.`
      : "";

  return (
    <div className="investment-portfolio-ai-panel ai-insight border-[var(--ai-border)]">
      <div
        className="pointer-events-none absolute -right-10 -top-10 h-64 w-64 rounded-full opacity-25 mix-blend-overlay blur-[64px]"
        style={{ backgroundColor: "var(--ai-primary)" }}
      />

      <div className="relative z-10">
        <div
          className="mb-4 flex cursor-pointer items-center justify-between"
          onClick={() => setExpanded(!expanded)}
          onKeyDown={(e) => e.key === "Enter" && setExpanded(!expanded)}
          role="button"
          tabIndex={0}
          aria-expanded={expanded}
        >
          <div className="flex flex-wrap items-center gap-2">
            <span className="ai-insight__icon-wrap">
              <Sparkles className="ai-insight__sparkle text-[var(--ai-primary)]" strokeWidth={2} />
            </span>
            <h3 className="text-sm font-bold uppercase tracking-wide text-[var(--foreground)]">
              {t("aiSystem.aiInsight")}
            </h3>
            {insights?.isSample ? (
              <span className="rounded-full border border-[var(--ai-border)] bg-[var(--ai-bg-soft)] px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-[var(--ai-primary)]">
                {t("aiSystem.sampleInsightBadge")}
              </span>
            ) : null}
          </div>
          {expanded ? (
            <ChevronUp size={18} className="text-muted-foreground" />
          ) : (
            <ChevronDown size={18} className="text-muted-foreground" />
          )}
        </div>

        {expanded && (
          <div className="grid animate-fade-in grid-cols-1 gap-6 md:grid-cols-2">
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                <TrendingUp size={14} aria-hidden />
                {t("investmentPortfolio.performanceAttribution")}
              </div>
              <p className="text-sm font-medium leading-relaxed text-foreground md:text-base">
                &quot;{insights?.explanation || t("investmentPortfolio.analyzingPortfolio")}&quot;
              </p>
            </div>

            <div className="relative space-y-3 md:border-l md:border-border md:pl-6">
              <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[var(--ai-primary)]">
                <Lightbulb size={14} aria-hidden />
                {t("investmentPortfolio.actionableInsight")}
              </div>
              <p className="text-sm leading-relaxed text-muted-foreground">
                {insights?.optimization || t("investmentPortfolio.calculatingOptimization")}
              </p>
              <p className="text-xs text-muted-foreground">{t("aiSystem.sampleInsightDisclaimer")}</p>
              {bridgePrompt ? <AiCoreBridgeButton prompt={bridgePrompt} className="pt-1" /> : null}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
