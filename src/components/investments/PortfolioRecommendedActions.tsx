import { ArrowRight, RefreshCw, ShieldAlert, Sparkles, TrendingUp } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { AiCoreBridgeButton } from "@/components/ai/AiCoreBridgeButton";

const actions = [
  {
    title: "Rebalance Portfolio",
    description:
      "Your allocation has drifted 5% from target. Rebalancing reduces risk and locks in gains.",
    improvement: "+0.8% expected annual return",
    icon: RefreshCw,
    iconWrapClass: "inv-portfolio-actions__icon inv-portfolio-actions__icon--blue",
    ctaLabel: "Rebalance Now",
    ctaClass: "inv-portfolio-actions__cta inv-portfolio-actions__cta--blue",
    priority: "AI Recommendation",
    priorityClass: "inv-portfolio-actions__priority inv-portfolio-actions__priority--blue",
    accentClass: "inv-portfolio-actions__accent inv-portfolio-actions__accent--blue",
    to: "/v1/transactions/rebalance",
    coreAiPrompt:
      "I'm viewing an AI Recommendation to rebalance because allocation drifted ~5%. What does that mean for risk and timing?",
  },
  {
    title: "Increase Contribution",
    description: "Increasing from 8% to 10% could add ~$42,000 to your retirement balance by age 65.",
    improvement: "+$42k projected at 65",
    icon: TrendingUp,
    iconWrapClass: "inv-portfolio-actions__icon inv-portfolio-actions__icon--emerald",
    ctaLabel: "Adjust Contribution",
    ctaClass: "inv-portfolio-actions__cta inv-portfolio-actions__cta--emerald",
    priority: "AI Recommendation",
    priorityClass: "inv-portfolio-actions__priority inv-portfolio-actions__priority--emerald",
    accentClass: "inv-portfolio-actions__accent inv-portfolio-actions__accent--emerald",
    to: "/v1/enrollment/contribution",
    coreAiPrompt:
      "I'm viewing an AI Recommendation to increase contributions for higher projected balance. How should I think about tradeoffs with take-home pay?",
  },
  {
    title: "Review Risk Level",
    description: "Market conditions have changed. Consider reviewing your risk tolerance for better alignment.",
    improvement: "Better risk-adjusted returns",
    icon: ShieldAlert,
    iconWrapClass: "inv-portfolio-actions__icon inv-portfolio-actions__icon--amber",
    ctaLabel: "Review Risk",
    ctaClass: "inv-portfolio-actions__cta inv-portfolio-actions__cta--amber",
    priority: "AI Insight",
    priorityClass: "inv-portfolio-actions__priority inv-portfolio-actions__priority--amber",
    accentClass: "inv-portfolio-actions__accent inv-portfolio-actions__accent--amber",
    to: "/v1/enrollment/investments",
    coreAiPrompt:
      "I'm viewing an AI Insight about reviewing risk level after market changes. What questions should I ask myself?",
  },
] as const;

/**
 * AI Recommendations / Insights — demo copy with Core AI bridge on every card.
 */
export function PortfolioRecommendedActions() {
  const navigate = useNavigate();
  const { t } = useTranslation();

  return (
    <section className="inv-portfolio-actions ai-recommendation" aria-labelledby="inv-portfolio-actions-title">
      <div className="inv-portfolio-actions__head">
        <Sparkles className="inv-portfolio-actions__sparkle text-[var(--ai-primary)]" aria-hidden />
        <h2 id="inv-portfolio-actions-title" className="inv-portfolio-actions__title">
          {t("dashboard.insightsTitle")}
        </h2>
      </div>
      <p className="inv-portfolio-actions__subtitle">{t("aiSystem.sampleInsightDisclaimer")}</p>

      <div className="inv-portfolio-actions__grid">
        {actions.map((action) => {
          const Icon = action.icon;
          return (
            <div key={action.title} className="inv-portfolio-actions__card">
              <div className={action.accentClass} aria-hidden />
              <div className="inv-portfolio-actions__card-top">
                <div className={action.iconWrapClass}>
                  <Icon className="inv-portfolio-actions__icon-svg" aria-hidden />
                </div>
                <div>
                  <p className="inv-portfolio-actions__card-title">{action.title}</p>
                  <span className={action.priorityClass}>{action.priority}</span>
                </div>
              </div>
              <p className="inv-portfolio-actions__card-body">{action.description}</p>
              <div className="inv-portfolio-actions__improvement">
                <TrendingUp className="inv-portfolio-actions__improvement-icon" aria-hidden />
                <span>{action.improvement}</span>
              </div>
              <button type="button" className={action.ctaClass} onClick={() => navigate(action.to)}>
                {action.ctaLabel}
                <ArrowRight className="inv-portfolio-actions__cta-arrow" aria-hidden />
              </button>
              <AiCoreBridgeButton prompt={action.coreAiPrompt} className="mt-3" />
            </div>
          );
        })}
      </div>
    </section>
  );
}
