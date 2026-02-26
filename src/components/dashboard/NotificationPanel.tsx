import { useEffect, useRef, useCallback, type ReactNode } from "react";
import { createPortal } from "react-dom";
import { useTranslation } from "react-i18next";

interface NotificationPanelProps {
  open: boolean;
  onClose: () => void;
  /** Optional title override */
  title?: string;
  children?: ReactNode;
}

/**
 * Right-side slide-over notification center. Portal-rendered, fixed right, 360px width.
 * Closes on outside click and ESC; 200ms ease animation.
 */
export function NotificationPanel({
  open,
  onClose,
  title,
  children,
}: NotificationPanelProps) {
  const { t } = useTranslation();
  const panelRef = useRef<HTMLDivElement>(null);
  const previousFocusRef = useRef<HTMLElement | null>(null);

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    },
    [onClose]
  );

  useEffect(() => {
    if (open) {
      previousFocusRef.current = document.activeElement as HTMLElement;
      document.addEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "hidden";
      requestAnimationFrame(() => panelRef.current?.focus());
    } else {
      document.body.style.overflow = "";
      previousFocusRef.current?.focus();
    }
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [open, handleKeyDown]);

  const displayTitle = title ?? t("nav.notifications");

  const content = (
    <>
      {/* Backdrop — outside click closes */}
      <div
        className={`fixed inset-0 z-40 transition-opacity duration-200 ease-out ${open ? "bg-black/30" : "pointer-events-none opacity-0"}`}
        onClick={onClose}
        aria-hidden
      />
      {/* Panel — fixed right, full height, 360px, soft shadow, slide-in */}
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-label={displayTitle}
        tabIndex={-1}
        className={`fixed inset-y-0 right-0 z-50 flex w-full max-w-[360px] flex-col bg-[var(--color-surface)] shadow-[-4px_0_24px_rgba(0,0,0,0.12)] outline-none transition-transform duration-200 ease-out ${
          open ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex shrink-0 items-center justify-between border-b border-[var(--color-border)] px-4 py-3">
          <h2 className="text-base font-semibold text-[var(--color-text)]">{displayTitle}</h2>
          <button
            type="button"
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-lg text-[var(--color-text-secondary)] transition-colors hover:bg-[var(--color-background-secondary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:ring-offset-2"
            aria-label={t("auth.close")}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
              <path d="M18 6 6 18" />
              <path d="m6 6 12 12" />
            </svg>
          </button>
        </div>
        <div className="flex-1 overflow-y-auto px-4 py-4">
          {children ?? (
            <p className="text-sm text-[var(--color-textSecondary)]">You're all caught up. No new notifications.</p>
          )}
        </div>
      </div>
    </>
  );

  if (typeof document === "undefined") return null;
  return createPortal(content, document.body);
}
