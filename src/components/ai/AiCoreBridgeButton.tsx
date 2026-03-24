import { useTranslation } from "react-i18next";
import { Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAIAssistantStore } from "@/stores/aiAssistantStore";

export type AiCoreBridgeButtonProps = {
  /** Full prompt sent to Core AI (auto-send). */
  prompt: string;
  className?: string;
  /** Optional override; default asks to discuss the insight. */
  labelKey?: string;
  showIcon?: boolean;
};

/**
 * Opens Core AI with a prefilled prompt. Use on every AI Insight surface.
 */
export function AiCoreBridgeButton({
  prompt,
  className,
  labelKey = "aiSystem.askCoreAIAboutThis",
  showIcon = true,
}: AiCoreBridgeButtonProps) {
  const { t } = useTranslation();

  return (
    <button
      type="button"
      className={cn("ai-core-bridge", className)}
      onClick={() => {
        const p = prompt.trim();
        if (!p) return;
        useAIAssistantStore.getState().openAIModal({ prompt: p, autoSend: true });
      }}
    >
      {showIcon ? <Sparkles className="ai-core-bridge__icon" strokeWidth={2} aria-hidden /> : null}
      <span>{t(labelKey)}</span>
    </button>
  );
}
