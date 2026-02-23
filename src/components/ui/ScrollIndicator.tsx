import { useState, useEffect, useCallback } from "react";
import { useTranslation } from "react-i18next";
import { ChevronDown } from "lucide-react";

const SCROLL_THRESHOLD_PX = 60;

/**
 * Reusable scroll indicator for the Dashboard hero only.
 * Visible when there is content below the fold; hides after user scrolls > 60px.
 * Uses enrollment design tokens. Subtle bounce + fade-in.
 */
export function ScrollIndicator() {
  const { t } = useTranslation();
  const [visible, setVisible] = useState(false);
  const [hasScrollableContent, setHasScrollableContent] = useState(false);
  const [mounted, setMounted] = useState(false);

  const checkScroll = useCallback(() => {
    setVisible(window.scrollY < SCROLL_THRESHOLD_PX);
  }, []);

  const checkScrollable = useCallback(() => {
    const canScroll =
      document.documentElement.scrollHeight > window.innerHeight + SCROLL_THRESHOLD_PX;
    setHasScrollableContent(canScroll);
  }, []);

  useEffect(() => {
    checkScrollable();
    checkScroll();
    setMounted(true);

    window.addEventListener("scroll", checkScroll, { passive: true });
    window.addEventListener("resize", checkScrollable);

    return () => {
      window.removeEventListener("scroll", checkScroll);
      window.removeEventListener("resize", checkScrollable);
    };
  }, [checkScroll, checkScrollable]);

  const handleClick = () => {
    const hero = document.querySelector("[data-hero-section]");
    if (hero) {
      const top = hero.getBoundingClientRect().bottom + window.scrollY;
      window.scrollTo({ top, behavior: "smooth" });
    } else {
      window.scrollTo({ top: window.innerHeight, behavior: "smooth" });
    }
  };

  const show = visible && hasScrollableContent;
  const opacity = show ? 1 : 0;
  const pointerEvents = show ? "auto" : "none";

  return (
    <div
      role="presentation"
      aria-hidden="true"
      className="scroll-indicator absolute bottom-6 left-1/2 z-10 flex -translate-x-1/2 flex-col items-center gap-1 transition-opacity duration-300 ease-out md:gap-1.5"
      style={{
        opacity: mounted ? opacity : 0,
        pointerEvents,
        color: "var(--enroll-text-muted)",
      }}
    >
      <button
        type="button"
        onClick={handleClick}
        className="flex flex-col items-center gap-1 opacity-[0.7] transition-opacity hover:opacity-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--enroll-brand)] focus-visible:ring-offset-2 rounded-full p-1 md:gap-1.5 md:p-1.5"
        style={{ color: "var(--enroll-text-muted)" }}
        aria-label={t("dashboard.scrollToExplore")}
      >
        <ChevronDown
          className="h-5 w-5 shrink-0 md:h-6 md:w-6"
          style={{ animation: "scroll-indicator-bounce 2.5s ease-in-out infinite" }}
        />
        <span className="text-xs font-medium md:text-sm" style={{ color: "var(--enroll-text-muted)" }}>
          {t("dashboard.scrollToExplore")}
        </span>
      </button>
    </div>
  );
}
