/**
 * "Need investment help?" card — Figma Participants Portal: blue gradient, Chat Now + Connect.
 */
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { Sparkles, MessageCircle, Phone } from "lucide-react";

export interface NeedInvestmentHelpCardProps {
  onChatNow?: () => void;
  onConnect?: () => void;
  className?: string;
}

export function NeedInvestmentHelpCard({
  onChatNow,
  onConnect,
  className = "",
}: NeedInvestmentHelpCardProps) {
  const { t } = useTranslation();
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      className={
        `rounded-xl border-2 border-[var(--color-primary)]/30 bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-primary-hover)] ` +
        `shadow-[var(--shadow-lg)] overflow-hidden ${className}`
      }
    >
      <div className="relative px-4 py-4 flex items-center justify-between gap-4 flex-wrap">
        <div className="flex items-center gap-4 min-w-0">
          <div className="w-12 h-12 rounded-xl flex items-center justify-center bg-white/20 border border-white/30 shadow-md flex-shrink-0">
            <Sparkles className="w-6 h-6 text-white" />
          </div>
          <div>
            <h4 className="font-bold text-sm text-white">{t("enrollment.needInvestmentHelp")}</h4>
            <p className="text-xs text-white/90">{t("enrollment.chatWithAI")}</p>
          </div>
        </div>
        <div className="flex items-center gap-2 flex-shrink-0">
          {onChatNow && (
            <button
              type="button"
              onClick={onChatNow}
              className="h-9 px-4 rounded-lg bg-[var(--color-surface)] border-2 border-white/50 text-[var(--color-primary)] text-caption font-semibold shadow-sm hover:bg-[var(--color-background-secondary)] transition-colors flex items-center gap-2"
            >
              <MessageCircle className="w-4 h-4" />
              {t("enrollment.chatNow", "Chat Now")}
            </button>
          )}
          {onConnect && (
            <button
              type="button"
              onClick={onConnect}
              className="h-9 px-4 rounded-lg bg-white/10 border-2 border-white/30 text-white text-caption font-semibold hover:bg-white/20 transition-colors flex items-center gap-2"
            >
              <Phone className="w-4 h-4" />
              {t("enrollment.connect", "Connect")}
            </button>
          )}
        </div>
      </div>
    </motion.div>
  );
}
