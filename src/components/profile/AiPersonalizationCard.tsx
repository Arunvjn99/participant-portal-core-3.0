import { useTranslation } from "react-i18next";
import { Sparkles } from "lucide-react";
import { DashboardCard } from "@/components/dashboard/DashboardCard";
import { useAISettings } from "@/context/AISettingsContext";
import { AiCoreBridgeButton } from "@/components/ai/AiCoreBridgeButton";

/**
 * Profile: AI usage, toggles, privacy — wired to {@link AISettingsContext}.
 */
export function AiPersonalizationCard() {
  const { t } = useTranslation();
  const { coreAIEnabled, insightsEnabled, setCoreAIEnabled, setInsightsEnabled } = useAISettings();

  return (
    <DashboardCard className="ai-insight border-[var(--ai-border)]">
      <div className="flex flex-col gap-4 p-1">
        <div className="flex items-start gap-3">
          <span className="ai-insight__icon-wrap" aria-hidden>
            <Sparkles className="ai-insight__sparkle" strokeWidth={2} />
          </span>
          <div>
            <h2 className="text-lg font-semibold text-foreground">{t("aiSystem.profileSectionTitle")}</h2>
            <p className="mt-1 text-sm text-muted-foreground">{t("aiSystem.profileSectionIntro")}</p>
          </div>
        </div>

        <p className="text-sm text-muted-foreground">{t("aiSystem.privacyNote")}</p>

        <div className="flex flex-col gap-3 rounded-lg border border-border bg-muted/30 p-4">
          <label className="flex cursor-pointer items-center justify-between gap-4">
            <span className="text-sm font-medium text-foreground">{t("aiSystem.coreAIToggle")}</span>
            <input
              type="checkbox"
              className="h-4 w-4 accent-[var(--ai-primary)]"
              checked={coreAIEnabled}
              onChange={(e) => setCoreAIEnabled(e.target.checked)}
            />
          </label>
          <label className="flex cursor-pointer items-center justify-between gap-4">
            <span className="text-sm font-medium text-foreground">{t("aiSystem.insightsToggle")}</span>
            <input
              type="checkbox"
              className="h-4 w-4 accent-[var(--ai-primary)]"
              checked={insightsEnabled}
              onChange={(e) => setInsightsEnabled(e.target.checked)}
            />
          </label>
        </div>

        <AiCoreBridgeButton
          prompt={t("aiSystem.profileAskCoreAIPrompt")}
          labelKey="aiSystem.askCoreAI"
        />
      </div>
    </DashboardCard>
  );
}
