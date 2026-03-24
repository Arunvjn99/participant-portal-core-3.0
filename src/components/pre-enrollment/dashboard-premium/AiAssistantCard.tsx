import { useState, type CSSProperties, type FormEvent } from "react";
import { useTranslation } from "react-i18next";
import { Send } from "lucide-react";
import { cn } from "@/lib/utils";
import { safeT } from "@/lib/safeT";
import { CoreAiBrandMark } from "@/components/core-ai/CoreAiBrandMark";
import { useAIAssistantStore } from "@/stores/aiAssistantStore";

export interface AiAssistantCardProps {
  title: string;
  description: string;
  className?: string;
}

const cardBg: CSSProperties = {
  backgroundImage: `
    radial-gradient(circle at 15% 0%, rgb(var(--color-text-inverse-rgb) / 0.15) 0%, transparent 55%),
    linear-gradient(135deg, rgb(var(--color-primary-rgb) / 0.9) 0%, rgb(var(--color-primary-rgb) / 0.7) 100%)
  `,
};

/**
 * Assistance tile: opens Core AI with optional seed from the inline field.
 */
export function AiAssistantCard({ title, description, className }: AiAssistantCardProps) {
  const { t } = useTranslation();
  const openAIModal = useAIAssistantStore((s) => s.openAIModal);
  const [draft, setDraft] = useState("");

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    const q = draft.trim();
    openAIModal(q || undefined);
    setDraft("");
  };

  return (
    <article
      className={cn(
        "group relative flex h-full flex-col gap-4 overflow-hidden rounded-2xl p-6 shadow-lg transition-all duration-200 ease-out hover:-translate-y-0.5 hover:shadow-xl md:p-8",
        className,
      )}
      style={cardBg}
    >
      {/* Ambient glow — top-right */}
      <div
        className="pointer-events-none absolute -right-10 -top-10 size-40 rounded-full bg-[rgb(var(--color-text-inverse-rgb)/0.10)] blur-3xl opacity-80 transition-opacity duration-300 group-hover:opacity-100 motion-reduce:transition-none"
        aria-hidden
      />

      <div className="relative z-10 flex min-h-0 flex-1 flex-col gap-4">
        {/* Header row: icon + title + badge */}
        <div className="flex items-center justify-between gap-3">
          <div className="flex min-w-0 items-center gap-3">
            <CoreAiBrandMark inverted className="!h-12 !w-12 animate-ai-assistant-breathe" />
            <h3 className="min-w-0 text-base font-semibold leading-snug text-[var(--color-text-inverse)] md:text-lg">
              {title}
            </h3>
          </div>
          <span className="shrink-0 rounded-full border border-[rgb(var(--color-text-inverse-rgb)/0.2)] bg-[rgb(var(--color-text-inverse-rgb)/0.1)] px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-[var(--color-text-inverse)]">
            {safeT(t, "dashboard.assistanceAiBeta", "Beta")}
          </span>
        </div>

        <p className="text-sm leading-relaxed text-[rgb(var(--color-text-inverse-rgb)/0.8)]">
          {description}
        </p>

        {/* Input */}
        <form onSubmit={onSubmit} className="mt-auto">
          <label htmlFor="premium-ai-assist-input" className="sr-only">
            {safeT(t, "dashboard.assistanceAiInputLabel", "Message for Core AI")}
          </label>
          <div className="flex items-center gap-2">
            <input
              id="premium-ai-assist-input"
              type="text"
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              placeholder={safeT(
                t,
                "dashboard.assistanceAiInputPlaceholder",
                "Ask anything about your plan…",
              )}
              autoComplete="off"
              className="min-w-0 flex-1 rounded-full border border-[rgb(var(--color-text-inverse-rgb)/0.2)] bg-[rgb(var(--color-text-inverse-rgb)/0.1)] px-4 py-2.5 text-sm text-[var(--color-text-inverse)] placeholder:text-[rgb(var(--color-text-inverse-rgb)/0.55)] backdrop-blur-sm focus:border-[rgb(var(--color-text-inverse-rgb)/0.35)] focus:outline-none focus:ring-2 focus:ring-[rgb(var(--color-text-inverse-rgb)/0.2)] focus:ring-offset-0"
            />
            <button
              type="submit"
              aria-label={safeT(t, "dashboard.assistanceAiSubmit", "Ask")}
              className="flex size-10 shrink-0 items-center justify-center rounded-full bg-[rgb(var(--color-text-inverse-rgb)/0.15)] text-[var(--color-text-inverse)] transition-all duration-200 ease-out hover:scale-105 hover:bg-[rgb(var(--color-text-inverse-rgb)/0.25)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[rgb(var(--color-text-inverse-rgb)/0.3)] focus-visible:ring-offset-0"
            >
              <Send className="size-4" strokeWidth={2} aria-hidden />
            </button>
          </div>
        </form>
      </div>
    </article>
  );
}
