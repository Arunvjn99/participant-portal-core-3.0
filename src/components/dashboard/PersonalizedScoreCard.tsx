import { useState } from "react";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import Button from "../ui/Button";
import { PadlockIcon } from "../../assets/dashboard/icons";
import { useReducedMotion } from "../../hooks/useReducedMotion";
import { useCanHover } from "../../hooks/useCanHover";

/**
 * Goal Simulator / Personalized Score card. Matches Figma 472-2685.
 * Sits right of Learning Resources on desktop. Height matches Learning Resources section.
 * Production-grade motion: hover border + shadow, icon pulse on first hover.
 */
export const PersonalizedScoreCard = () => {
  const { t } = useTranslation();
  const [hasPulsed, setHasPulsed] = useState(false);
  const reduced = useReducedMotion();
  const canHover = useCanHover();

  const handleCardHover = () => {
    if (canHover && !reduced && !hasPulsed) {
      setHasPulsed(true);
    }
  };

  return (
    <article
      className={`flex h-full min-h-[320px] flex-col items-center justify-center rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-6 shadow-md transition-all duration-200 md:p-8 ${canHover && !reduced ? "hover:border-[var(--color-primary)] hover:shadow-lg" : ""}`}
      onMouseEnter={handleCardHover}
    >
      {/* Icon: one-time pulse on first card hover */}
      <motion.div
        className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full border border-[var(--color-border)] bg-[var(--color-surface)] text-primary shadow-md"
        aria-hidden
        animate={
          canHover && !reduced && hasPulsed
            ? { scale: [1, 1.05, 1], transition: { duration: 0.4, ease: [0.25, 0.1, 0.25, 1] } }
            : {}
        }
      >
        <PadlockIcon size={32} />
      </motion.div>

      {/* Title */}
      <h3 className="mt-5 text-center text-xl font-bold text-[var(--color-text)] md:text-2xl">
        {t("dashboard.personalizedScoreTitle")}
      </h3>

      {/* Description */}
      <p className="mt-2 text-center text-sm leading-relaxed text-[var(--color-textSecondary)]">
        {t("dashboard.personalizedScoreDesc")}
      </p>

      {/* CTAs - primary: color shift only, secondary: border + background tint */}
      <div className="mt-6 flex flex-col items-center gap-3 sm:flex-row sm:flex-wrap sm:justify-center">
        <Button className="w-full rounded-lg bg-primary px-6 py-2.5 font-semibold text-white shadow-md transition-colors hover:bg-primary-hover hover:shadow-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 sm:w-auto">
          {t("dashboard.enrolNow")}
        </Button>
        <a
          href="#"
          className="inline-flex w-full items-center justify-center rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] px-6 py-2.5 text-sm font-semibold text-[var(--color-text)] no-underline transition-colors hover:bg-[var(--color-background)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)] focus-visible:ring-offset-2 sm:w-auto"
        >
          {t("dashboard.learnMore")}
        </a>
      </div>
    </article>
  );
};
