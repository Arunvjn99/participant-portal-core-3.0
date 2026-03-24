import { useTranslation } from "react-i18next";
import { Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import { AiCoreBridgeButton } from "./AiCoreBridgeButton";

type EnrollmentAiHintProps = {
  titleKey?: string;
  bodyKey: string;
  prompt: string;
  className?: string;
};

/**
 * Enrollment step strip: deterministic copy + Ask Core AI bridge.
 */
export function EnrollmentAiHint({
  titleKey = "aiSystem.aiInsight",
  bodyKey,
  prompt,
  className,
}: EnrollmentAiHintProps) {
  const { t } = useTranslation();

  return (
    <div className={cn("ai-insight enrollment-ai-hint", className)} role="region" aria-label={t(titleKey)}>
      <div className="enrollment-ai-hint__row">
        <span className="ai-insight__icon-wrap" aria-hidden>
          <Sparkles className="ai-insight__sparkle" strokeWidth={2} />
        </span>
        <div className="min-w-0 flex-1">
          <p className="ai-insight__label">{t(titleKey)}</p>
          <p className="ai-insight__body">{t(bodyKey)}</p>
          <AiCoreBridgeButton prompt={prompt} className="mt-2" />
        </div>
      </div>
    </div>
  );
}
