import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import type { PortfolioData, Plan } from "../../types/investmentPortfolio";
import { getPerformanceIntelligence } from "../../services/investmentPortfolioAiService";
import {
  Sparkles,
  ChevronDown,
  ChevronUp,
  Lightbulb,
  TrendingUp,
} from "lucide-react";

interface Props {
  data: PortfolioData;
  plans: Plan[];
}

export const AIInsightsPanel: React.FC<Props> = ({ data, plans }) => {
  const { t } = useTranslation();
  const [insights, setInsights] = useState<{
    explanation: string;
    optimization: string;
  } | null>(null);
  const [expanded, setExpanded] = useState(true);

  useEffect(() => {
    getPerformanceIntelligence(data, plans).then(setInsights);
  }, [data, plans]);

  return (
    <div className="investment-portfolio-ai-panel">
      <div
        className="pointer-events-none absolute -mr-10 -mt-10 top-0 right-0 h-64 w-64 rounded-full opacity-20 mix-blend-overlay filter blur-[64px]"
        style={{ backgroundColor: "var(--color-primary)" }}
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
          <div className="flex items-center gap-2">
            <div
              className="rounded-lg border p-1.5"
              style={{
                backgroundColor: "rgba(255,255,255,0.2)",
                borderColor: "rgba(255,255,255,0.3)",
              }}
            >
              <Sparkles size={16} className="text-white/90" />
            </div>
            <h3 className="text-sm font-bold uppercase tracking-wide text-white/90">
              {t("investmentPortfolio.planIntelligence")}
            </h3>
          </div>
          {expanded ? (
            <ChevronUp size={18} className="text-white/70" />
          ) : (
            <ChevronDown size={18} className="text-white/70" />
          )}
        </div>

        {expanded && (
          <div className="grid grid-cols-1 gap-8 animate-fade-in md:grid-cols-2">
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-white/70">
                <TrendingUp size={14} />
                {t("investmentPortfolio.performanceAttribution")}
              </div>
              <p className="text-lg font-medium leading-relaxed text-white/95">
                &quot;{insights?.explanation || t("investmentPortfolio.analyzingPortfolio")}&quot;
              </p>
            </div>

            <div className="relative space-y-3">
              <div className="absolute -left-4 top-0 bottom-0 hidden w-px bg-white/20 md:block" />
              <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[var(--color-success)]">
                <Lightbulb size={14} />
                {t("investmentPortfolio.actionableInsight")}
              </div>
              <p className="text-base leading-relaxed text-white/80">
                {insights?.optimization ||
                  t("investmentPortfolio.calculatingOptimization")}
              </p>
              <button
                type="button"
                className="mt-2 rounded-md bg-white/10 px-3 py-1.5 text-xs font-semibold text-white transition-colors hover:bg-white/20"
              >
                {t("investmentPortfolio.viewDetails")}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
