import { motion } from "framer-motion";
import { ArrowRight, ArrowLeft } from "lucide-react";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

/** Figma “Implement Current Design” flow primitives — theme-aware (light + dark). */

export function FlowPageHeader({ title, description }: { title: string; description: string }) {
  return (
    <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, ease: "easeOut" }}>
      <h2 className="mb-2 text-[26px] font-extrabold leading-[34px] tracking-tight text-foreground">{title}</h2>
      <p className="text-sm font-medium leading-[22px] text-muted">{description}</p>
    </motion.div>
  );
}

export function FlowCard({
  children,
  padding = "24px 28px",
  delay = 0,
}: {
  children: ReactNode;
  padding?: string;
  delay?: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut", delay }}
    >
      <div className="rounded-2xl border border-border bg-card" style={{ padding }}>
        {children}
      </div>
    </motion.div>
  );
}

export function FlowCardTitle({ children }: { children: ReactNode }) {
  return <h3 className="mb-5 text-[15px] font-bold tracking-tight text-foreground">{children}</h3>;
}

export function FlowLabel({ children }: { children: ReactNode }) {
  return <p className="mb-1 text-xs font-medium text-muted">{children}</p>;
}

export function FlowValue({ children, size = 20 }: { children: ReactNode; size?: number }) {
  return (
    <p className="font-extrabold tracking-tight text-foreground" style={{ fontSize: size }}>
      {children}
    </p>
  );
}

const BANNER_VARIANTS: Record<"info" | "warning" | "error" | "success", string> = {
  info: cn(
    "rounded-[14px] border px-4 py-3.5",
    "border-primary/25 bg-primary/10 text-foreground",
    "dark:border-primary/35 dark:bg-primary/15",
    "[&_strong]:text-primary",
  ),
  warning: cn(
    "rounded-[14px] border px-4 py-3.5",
    "border-amber-500/35 bg-amber-500/10 text-amber-950",
    "dark:border-amber-500/30 dark:bg-amber-500/15 dark:text-amber-50",
  ),
  error: cn(
    "rounded-[14px] border px-4 py-3.5",
    "border-danger/35 bg-danger/10 text-red-950",
    "dark:border-danger/40 dark:bg-danger/15 dark:text-red-100",
  ),
  success: cn(
    "rounded-[14px] border px-4 py-3.5",
    "border-emerald-500/35 bg-emerald-500/10 text-emerald-950",
    "dark:border-emerald-500/30 dark:bg-emerald-500/15 dark:text-emerald-50",
  ),
};

export function FlowInfoBanner({
  children,
  variant = "info",
}: {
  children: ReactNode;
  variant?: "info" | "warning" | "error" | "success";
}) {
  return <div className={BANNER_VARIANTS[variant]}>{children}</div>;
}

export function FlowNavButtons({
  backLabel = "Back",
  nextLabel,
  onBack,
  onNext,
  disabled = false,
  isSubmitting = false,
}: {
  backLabel?: string;
  nextLabel: string;
  onBack: () => void;
  onNext: () => void;
  disabled?: boolean;
  isSubmitting?: boolean;
}) {
  return (
    <div className="fig-flow-actions flex items-center justify-between pt-4">
      <button type="button" className="btn btn-outline flex items-center gap-2" onClick={onBack}>
        <ArrowLeft className="txn-icon--16" strokeWidth={2} aria-hidden />
        {backLabel}
      </button>
      <button
        type="button"
        className="btn btn-primary flex items-center gap-2"
        onClick={onNext}
        disabled={disabled || isSubmitting}
      >
        {isSubmitting ? "Submitting..." : nextLabel}
        {!isSubmitting && <ArrowRight className="txn-icon--16" strokeWidth={2} aria-hidden />}
      </button>
    </div>
  );
}

export function FlowSuccessState({ title, description }: { title: string; description: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="flex flex-col items-center justify-center py-16"
    >
      <div
        className={cn(
          "mb-5 flex h-16 w-16 items-center justify-center rounded-full border",
          "border-emerald-500/30 bg-emerald-500/10 dark:border-emerald-500/25 dark:bg-emerald-500/15",
        )}
      >
        <svg
          width="32"
          height="32"
          viewBox="0 0 24 24"
          fill="none"
          className="text-emerald-600 dark:text-emerald-400"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
          <polyline points="22 4 12 14.01 9 11.01" />
        </svg>
      </div>
      <h2 className="mb-2 text-[26px] font-extrabold tracking-tight text-foreground">{title}</h2>
      <p className="mb-6 max-w-[400px] text-center text-sm font-medium leading-[22px] text-muted">{description}</p>
      <p className="text-xs font-medium text-muted-foreground">Redirecting to dashboard...</p>
    </motion.div>
  );
}
