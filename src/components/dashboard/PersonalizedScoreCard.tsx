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
      className={`flex h-full min-h-[320px] flex-col items-center justify-center rounded-2xl border border-sky-200 bg-sky-50 p-6 shadow-md transition-all duration-200 dark:border-sky-900/50 dark:bg-sky-950/40 dark:shadow-black/20 md:p-8 ${canHover && !reduced ? "hover:border-sky-300 hover:shadow-lg dark:hover:border-sky-700" : ""}`}
      onMouseEnter={handleCardHover}
    >
      {/* Icon: one-time pulse on first card hover */}
      <motion.div
        className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full border border-sky-200 bg-white text-primary shadow-md dark:border-sky-800 dark:bg-slate-800 dark:text-blue-400"
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
      <h3 className="mt-5 text-center text-xl font-bold text-slate-900 dark:text-slate-100 md:text-2xl">
        {t("dashboard.personalizedScoreTitle")}
      </h3>

      {/* Description */}
      <p className="mt-2 text-center text-sm leading-relaxed text-slate-600 dark:text-slate-400">
        {t("dashboard.personalizedScoreDesc")}
      </p>

      {/* CTAs - primary: color shift only, secondary: border + background tint */}
      <div className="mt-6 flex flex-col items-center gap-3 sm:flex-row sm:flex-wrap sm:justify-center">
        <Button className="w-full rounded-lg bg-primary px-6 py-2.5 font-semibold text-white shadow-md transition-colors hover:bg-blue-700 hover:shadow-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 dark:bg-blue-500 dark:hover:bg-blue-600 dark:focus-visible:ring-blue-400 sm:w-auto">
          {t("dashboard.enrolNow")}
        </Button>
        <a
          href="#"
          className="inline-flex w-full items-center justify-center rounded-lg border border-slate-200 bg-white px-6 py-2.5 text-sm font-semibold text-slate-700 no-underline transition-colors hover:bg-slate-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700 dark:focus-visible:ring-blue-400 sm:w-auto"
        >
          {t("dashboard.learnMore")}
        </a>
      </div>
    </article>
  );
};
