import { useEffect, useRef, useCallback, type ReactNode } from "react";
import { useTranslation } from "react-i18next";

interface GuidedFlowDrawerProps {
  open: boolean;
  onClose: () => void;
  title: string;
  currentStep: number;
  totalSteps: number;
  onBack: () => void;
  onNext: () => void;
  canProceed?: boolean;
  isLastStep?: boolean;
  children: ReactNode;
}

export function GuidedFlowDrawer({
  open,
  onClose,
  title,
  currentStep,
  totalSteps,
  onBack,
  onNext,
  canProceed = true,
  isLastStep = false,
  children,
}: GuidedFlowDrawerProps) {
  const { t } = useTranslation();
  const drawerRef = useRef<HTMLDivElement>(null);
  const previousFocusRef = useRef<HTMLElement | null>(null);

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    },
    [onClose],
  );

  useEffect(() => {
    if (open) {
      previousFocusRef.current = document.activeElement as HTMLElement;
      document.addEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "hidden";
      requestAnimationFrame(() => drawerRef.current?.focus());
    } else {
      document.body.style.overflow = "";
      previousFocusRef.current?.focus();
    }
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [open, handleKeyDown]);

  const progressPct = totalSteps > 0 ? ((currentStep + 1) / totalSteps) * 100 : 0;

  return (
    <>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 z-40 transition-opacity duration-250 ${open ? "bg-black/40 backdrop-blur-[2px]" : "pointer-events-none opacity-0"}`}
        onClick={onClose}
        aria-hidden
      />

      {/* Drawer */}
      <div
        ref={drawerRef}
        role="dialog"
        aria-modal="true"
        aria-label={title}
        tabIndex={-1}
        className={`fixed inset-y-0 right-0 z-50 flex w-full flex-col outline-none transition-transform duration-250 ease-out sm:max-w-[520px] lg:max-w-[560px] ${open ? "translate-x-0" : "translate-x-full"}`}
        style={{ backgroundColor: "var(--color-background)" }}
      >
        {/* Header */}
        <div
          className="flex shrink-0 items-center justify-between border-b border-[var(--color-border)] px-5 py-4 sm:px-6"
          style={{ background: "linear-gradient(135deg, var(--color-surface-elevated, var(--color-surface)) 0%, var(--color-surface) 100%)" }}
        >
          <div className="flex flex-col gap-0.5">
            <h2 className="text-lg font-semibold text-[var(--color-text)]">{title}</h2>
            <span className="text-xs text-[var(--color-text-tertiary)]">
              {t("transactionHub.drawer.stepOf", { current: currentStep + 1, total: totalSteps })}
            </span>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-lg transition-colors duration-150 hover:bg-[var(--color-background-secondary)]"
            aria-label={t("transactionHub.drawer.close")}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--color-text-secondary)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
              <path d="M18 6 6 18" />
              <path d="m6 6 12 12" />
            </svg>
          </button>
        </div>

        {/* Progress Bar */}
        <div className="h-1 w-full shrink-0" style={{ backgroundColor: "var(--color-border)" }}>
          <div
            className="h-full rounded-r-full transition-all duration-500 ease-out"
            style={{ width: `${progressPct}%`, backgroundColor: "var(--color-primary)" }}
          />
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto px-5 py-6 sm:px-6">
          {children}
        </div>

        {/* Footer */}
        <div className="flex shrink-0 items-center justify-between border-t border-[var(--color-border)] px-5 py-4 sm:px-6">
          <button
            type="button"
            onClick={currentStep > 0 ? onBack : onClose}
            className="rounded-lg border border-[var(--color-border)] px-4 py-2 text-sm font-medium text-[var(--color-text-secondary)] transition-colors duration-150 hover:bg-[var(--color-background-secondary)]"
          >
            {currentStep > 0 ? t("transactionHub.drawer.back") : t("transactionHub.drawer.close")}
          </button>
          <button
            type="button"
            onClick={onNext}
            disabled={!canProceed}
            className="rounded-lg px-6 py-2 text-sm font-semibold text-white transition-all duration-150 disabled:opacity-50"
            style={{ backgroundColor: canProceed ? "var(--color-primary)" : "var(--color-text-tertiary)" }}
          >
            {isLastStep ? t("transactionHub.drawer.submit") : t("transactionHub.drawer.next")}
          </button>
        </div>
      </div>
    </>
  );
}
