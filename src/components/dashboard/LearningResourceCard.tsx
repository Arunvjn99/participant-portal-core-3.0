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
      className={`flex h-[320px] w-[280px] shrink-0 snap-start flex-col overflow-hidden rounded-2xl elevation-1 bg-[var(--surface-1)] transition-shadow duration-200 focus-within:ring-2 focus-within:ring-[var(--color-primary)] focus-within:ring-offset-2 ${canHover && !reduced ? "hover:shadow-[0px_8px_24px_rgba(16,24,40,0.12)]" : ""}`}
      whileHover={canHover && !reduced ? { y: -4, transition: { duration: 0.2 } } : undefined}
    >
        <div className="group/card flex h-full flex-col">
        {/* Thumbnail - scale 1.05 on card hover (inside overflow-hidden) */}
        <div className="relative aspect-video w-full shrink-0 overflow-hidden bg-[var(--color-background)]">
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
              className="absolute right-2 top-2 rounded-full border border-[var(--color-border)] bg-[var(--color-surface)] px-3 py-1 text-xs font-medium text-[var(--color-textSecondary)] shadow-sm"
              aria-label={`Content type: ${badge}`}
            >
              {badge}
            </span>
          )}
        </div>
        {/* Title + source */}
        <div className="flex min-h-0 flex-1 flex-col p-5">
          <h3 className="line-clamp-2 text-base font-semibold text-[var(--color-text)]">{title}</h3>
          <p className="mt-1 line-clamp-1 text-sm text-[var(--color-textSecondary)]">{subtitle}</p>
        </div>
      </div>
    </motion.article>
  );
};
