import { useState } from "react";
import { motion } from "framer-motion";
import { useReducedMotion } from "../../hooks/useReducedMotion";
import { useCanHover } from "../../hooks/useCanHover";

/**
 * Learning resource card matching Figma 185-1167: aspect-video thumbnail, pill badge, title, source.
 * Fixed dimensions, equal height. Tailwind only. Production-grade motion.
 */
interface LearningResourceCardProps {
  title: string;
  subtitle: string;
  imageSrc: string;
  badge?: "Video" | "Article";
  /** Stagger index for entrance animation */
  index?: number;
}

const PLACEHOLDER_IMAGE =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='320' height='180' viewBox='0 0 320 180'%3E%3Crect fill='%e2e8f0' width='320' height='180'/%3E%3Ctext fill='%94a3b8' font-size='14' x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle'%3EThumbnail%3C/text%3E%3C/svg%3E";

export const CARD_WIDTH = 280;
export const CARD_GAP = 16;

export const LearningResourceCard = ({
  title,
  subtitle,
  imageSrc,
  badge,
  index = 0,
}: LearningResourceCardProps) => {
  const [imgError, setImgError] = useState(false);
  const reduced = useReducedMotion();
  const canHover = useCanHover();
  const src = imgError ? PLACEHOLDER_IMAGE : imageSrc;

  const containerVariants = reduced
    ? {}
    : {
        initial: { opacity: 0, y: 6 },
        animate: {
          opacity: 1,
          y: 0,
          transition: { duration: 0.3, ease: [0.25, 0.1, 0.25, 1], delay: index * 0.05 },
        },
      };

  return (
    <motion.article
      variants={containerVariants}
      initial="initial"
      animate="animate"
      className={`flex h-[320px] w-[280px] shrink-0 snap-start flex-col overflow-hidden rounded-xl border border-slate-200 bg-white shadow-md transition-shadow duration-200 focus-within:ring-2 focus-within:ring-blue-500 focus-within:ring-offset-2 dark:border-slate-700 dark:bg-slate-800 dark:shadow-black/30 dark:focus-within:ring-offset-slate-900 ${canHover && !reduced ? "hover:shadow-lg focus-within:shadow-lg" : ""}`}
      whileHover={canHover && !reduced ? { y: -4, transition: { duration: 0.2 } } : undefined}
    >
        <div className="group/card flex h-full flex-col">
        {/* Thumbnail - scale 1.05 on card hover (inside overflow-hidden) */}
        <div className="relative aspect-video w-full shrink-0 overflow-hidden bg-slate-100 dark:bg-slate-700">
          <img
            src={src}
            alt={title}
            decoding="async"
            loading="lazy"
            className={`h-full w-full object-cover transition-transform duration-200 ${canHover && !reduced ? "group-hover/card:scale-105" : ""}`}
            onError={() => setImgError(true)}
          />
          {badge && (
            <span
              className="absolute right-2 top-2 rounded-full border border-slate-200 bg-white/95 px-3 py-1 text-xs font-medium text-slate-700 shadow-sm dark:border-slate-600 dark:bg-slate-800/95 dark:text-slate-200"
              aria-label={`Content type: ${badge}`}
            >
              {badge}
            </span>
          )}
        </div>
        {/* Title + source */}
        <div className="flex min-h-0 flex-1 flex-col p-5">
          <h3 className="line-clamp-2 text-base font-semibold text-slate-900 dark:text-slate-100">{title}</h3>
          <p className="mt-1 line-clamp-1 text-sm text-slate-500 dark:text-slate-400">{subtitle}</p>
        </div>
      </div>
    </motion.article>
  );
};
