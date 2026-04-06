import { AnimatePresence, motion } from "framer-motion";
import { ArrowLeft, ArrowRight, Check, X } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";

import { getRoutingVersion, withVersion } from "@/core/version";
import { cn } from "@/lib/utils";
import { useCrpTransactionStore } from "./crpTransactionStore";
import { FLOW_STEP_LABELS, type TransactionType } from "./types";

const ease = [0.4, 0, 0.2, 1] as const;

export function TransactionFlowShell({
  type,
  children,
  canContinue = true,
  onContinue,
  continueLabel,
  hideCta = false,
}: {
  type: TransactionType;
  children: React.ReactNode;
  canContinue?: boolean;
  onContinue?: () => void;
  continueLabel?: string;
  hideCta?: boolean;
}) {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const version = getRoutingVersion(pathname);
  const { activeStep, nextStep, prevStep, resetFlow, completeFlow } =
    useCrpTransactionStore();
  const labels = FLOW_STEP_LABELS[type];
  const isLast = activeStep === labels.length - 2;
  const isConfirm = activeStep === labels.length - 1;

  const handleExit = () => {
    useCrpTransactionStore.getState().saveDraft();
    resetFlow();
    navigate(withVersion(version, "/transactions"));
  };

  const handleContinue = () => {
    if (onContinue) {
      onContinue();
      return;
    }
    if (isLast) {
      completeFlow();
    } else {
      nextStep();
    }
  };

  return (
    <div className="flex min-h-[calc(100dvh-3.5rem)] flex-col bg-background">
      <div className="shrink-0 border-b border-border bg-background px-6 py-3">
        <div className="mx-auto flex max-w-[1100px] items-center justify-between">
          <div className="flex items-center gap-3">
            <h2 className="text-sm font-semibold capitalize text-foreground">
              {type} Request
            </h2>
            <span className="text-xs text-muted-foreground">
              Step {activeStep + 1} of {labels.length}
            </span>
          </div>
          <button
            type="button"
            onClick={handleExit}
            className="flex size-8 items-center justify-center rounded-lg text-muted-foreground transition hover:bg-muted"
            aria-label="Exit flow"
          >
            <X className="size-4" />
          </button>
        </div>
      </div>

      <div className="shrink-0 border-b border-border bg-muted/40 px-6 py-3 dark:bg-slate-900/20">
        <div className="mx-auto max-w-[1100px]">
          <div className="flex items-center gap-0.5">
            {labels.map((label, i) => {
              const isComplete = i < activeStep;
              const isCurrent = i === activeStep;
              return (
                <div key={label} className="flex flex-1 items-center gap-0.5">
                  <div className="flex items-center gap-1.5">
                    <div
                      className={cn(
                        "flex size-6 items-center justify-center rounded-full text-[10px] font-semibold transition-all",
                        isComplete
                          ? "bg-emerald-500 text-white"
                          : isCurrent
                            ? "bg-primary text-primary-foreground shadow-md shadow-primary/30"
                            : "bg-muted text-muted-foreground",
                      )}
                    >
                      {isComplete ? <Check className="size-3" /> : i + 1}
                    </div>
                    <span
                      className={cn(
                        "hidden text-[11px] font-medium lg:inline",
                        isCurrent
                          ? "text-foreground"
                          : isComplete
                            ? "text-emerald-600 dark:text-emerald-400"
                            : "text-muted-foreground",
                      )}
                    >
                      {label}
                    </span>
                  </div>
                  {i < labels.length - 1 && (
                    <div className="mx-0.5 h-px flex-1 bg-border">
                      <motion.div
                        className="h-full bg-emerald-500"
                        initial={{ width: 0 }}
                        animate={{ width: isComplete ? "100%" : "0%" }}
                        transition={{ duration: 0.4, ease }}
                      />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-6 py-5">
        <div className="mx-auto max-w-[1100px]">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeStep}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.25, ease }}
            >
              {children}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {!hideCta && (
        <div className="shrink-0 border-t border-border bg-background px-6 py-3">
          <div className="mx-auto flex max-w-[1100px] items-center justify-between">
            {activeStep > 0 && !isConfirm ? (
              <button
                type="button"
                onClick={prevStep}
                className="inline-flex h-10 items-center gap-2 rounded-lg border border-border bg-background px-4 text-sm font-medium text-foreground transition hover:bg-muted"
              >
                <ArrowLeft className="size-4" />
                Back
              </button>
            ) : (
              <div />
            )}
            {!isConfirm && (
              <button
                type="button"
                disabled={!canContinue}
                onClick={handleContinue}
                className={cn(
                  "inline-flex h-10 items-center gap-2 rounded-lg px-6 text-sm font-semibold text-primary-foreground transition",
                  canContinue
                    ? "bg-primary shadow-md shadow-primary/20 hover:shadow-lg"
                    : "cursor-not-allowed bg-muted text-muted-foreground",
                )}
              >
                {continueLabel ?? (isLast ? "Submit" : "Continue")}
                <ArrowRight className="size-4" />
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
