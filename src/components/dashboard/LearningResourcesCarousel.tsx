import { useRef, useState } from "react";
import type { ReactNode } from "react";
import { motion } from "framer-motion";
import { CARD_WIDTH, CARD_GAP } from "./LearningResourceCard";
import { useReducedMotion } from "../../hooks/useReducedMotion";
import { useCanHover } from "../../hooks/useCanHover";

/** Scroll distance = one card width + gap */
const SCROLL_STEP = CARD_WIDTH + CARD_GAP;

/**
 * Horizontal carousel with scroll-snap, hidden scrollbar, arrows outside cards.
 * Arrows fade in on carousel hover (desktop). Tap feedback on click.
 */
interface LearningResourcesCarouselProps {
  children: ReactNode;
}

const ArrowLeft = () => (
  <svg className="h-5 w-5 text-[var(--color-textSecondary)]" viewBox="0 0 20 20" fill="currentColor" aria-hidden>
    <path fillRule="evenodd" d="M12.79 5.23a.75.75 0 01-.02 1.06L8.832 10l3.938 3.71a.75.75 0 11-1.04 1.08l-4.5-4.25a.75.75 0 010-1.08l4.5-4.25a.75.75 0 011.06.02z" clipRule="evenodd" />
  </svg>
);

const ArrowRight = () => (
  <svg className="h-5 w-5 text-[var(--color-textSecondary)]" viewBox="0 0 20 20" fill="currentColor" aria-hidden>
    <path fillRule="evenodd" d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z" clipRule="evenodd" />
  </svg>
);

const arrowBaseClass =
  "absolute top-1/2 z-10 hidden h-10 w-10 -translate-y-1/2 shrink-0 items-center justify-center rounded-full border border-[var(--color-border)] bg-[var(--color-surface)] shadow-md transition-opacity duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)] focus-visible:ring-offset-2 md:flex";

export const LearningResourcesCarousel = ({ children }: LearningResourcesCarouselProps) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);
  const reduced = useReducedMotion();
  const canHover = useCanHover();

  const scroll = (direction: "left" | "right") => {
    const el = scrollRef.current;
    if (!el) return;
    const step = direction === "left" ? -SCROLL_STEP : SCROLL_STEP;
    el.scrollBy({ left: step, behavior: "smooth" });
  };

  const arrowsVisible = reduced ? true : (canHover ? isHovered : true);

  return (
    <div
      className="relative flex items-center"
      onMouseEnter={() => canHover && setIsHovered(true)}
      onMouseLeave={() => canHover && setIsHovered(false)}
    >
      {/* Scroll container */}
      <div
        ref={scrollRef}
        className="flex flex-1 items-stretch gap-4 overflow-x-auto scroll-smooth scrollbar-hide snap-x snap-mandatory px-4 py-2 md:px-12"
        role="list"
        aria-label="Learning resources"
      >
        {children}
      </div>

      {/* Arrows: fade in on carousel hover (desktop), scale on hover, tap feedback */}
      <motion.button
        type="button"
        onClick={() => scroll("left")}
        className={`${arrowBaseClass} left-2`}
        style={{
          opacity: arrowsVisible ? 1 : 0,
          pointerEvents: arrowsVisible ? "auto" : "none",
        }}
        aria-label="Scroll left"
        initial={false}
        animate={{
          opacity: arrowsVisible ? 1 : 0,
          scale: 1,
          transition: { duration: 0.2 },
        }}
        whileHover={canHover && !reduced ? { scale: 1.05 } : undefined}
        whileTap={!reduced ? { scale: 0.98 } : undefined}
      >
        <ArrowLeft />
      </motion.button>
      <motion.button
        type="button"
        onClick={() => scroll("right")}
        className={`${arrowBaseClass} right-2`}
        style={{
          opacity: arrowsVisible ? 1 : 0,
          pointerEvents: arrowsVisible ? "auto" : "none",
        }}
        aria-label="Scroll right"
        initial={false}
        animate={{
          opacity: arrowsVisible ? 1 : 0,
          scale: 1,
          transition: { duration: 0.2 },
        }}
        whileHover={canHover && !reduced ? { scale: 1.05 } : undefined}
        whileTap={!reduced ? { scale: 0.98 } : undefined}
      >
        <ArrowRight />
      </motion.button>
    </div>
  );
};
