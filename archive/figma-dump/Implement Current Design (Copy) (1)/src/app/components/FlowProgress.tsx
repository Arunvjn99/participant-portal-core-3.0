import { Check } from "lucide-react";
import { motion } from "motion/react";

interface Step {
  number: number;
  label: string;
  path: string;
}

interface FlowProgressProps {
  steps: Step[];
  currentStep: number;
}

export function FlowProgress({ steps, currentStep }: FlowProgressProps) {
  return (
    <div className="w-full py-4 sm:py-8">
      <div className="max-w-4xl mx-auto">
        {/* Mobile: compact horizontal stepper */}
        <div className="sm:hidden">
          <div className="flex items-center justify-between mb-3 px-1">
            <span
              style={{
                fontSize: 12,
                fontWeight: 700,
                color: "#1E293B",
              }}
            >
              Step {currentStep} of {steps.length}
            </span>
            <span
              style={{
                fontSize: 12,
                fontWeight: 500,
                color: "#64748B",
              }}
            >
              {steps[currentStep - 1]?.label}
            </span>
          </div>
          {/* Progress bar */}
          <div
            className="overflow-hidden"
            style={{
              height: 6,
              borderRadius: 3,
              background: "#E2E8F0",
            }}
          >
            <motion.div
              className="h-full"
              style={{
                borderRadius: 3,
                background: "#2563EB",
              }}
              initial={{ width: 0 }}
              animate={{
                width: `${((currentStep) / steps.length) * 100}%`,
              }}
              transition={{ duration: 0.5, ease: "easeOut" }}
            />
          </div>
          {/* Step dots */}
          <div className="flex items-center justify-between mt-2 px-0.5">
            {steps.map((step) => {
              const isComplete = step.number < currentStep;
              const isCurrent = step.number === currentStep;
              return (
                <div
                  key={step.number}
                  className="rounded-full transition-all duration-200"
                  style={{
                    width: 8,
                    height: 8,
                    background: isComplete
                      ? "#2563EB"
                      : isCurrent
                        ? "#2563EB"
                        : "#E2E8F0",
                    boxShadow: isCurrent
                      ? "0 0 0 3px rgba(37,99,235,0.15)"
                      : undefined,
                  }}
                />
              );
            })}
          </div>
        </div>

        {/* Desktop: full stepper */}
        <div className="hidden sm:block relative">
          {/* Progress Line */}
          <div
            className="absolute top-5 left-0 right-0"
            style={{ height: 2, background: "#E2E8F0" }}
          >
            <motion.div
              className="h-full"
              style={{ background: "#2563EB" }}
              initial={{ width: 0 }}
              animate={{
                width: `${((currentStep - 1) / (steps.length - 1)) * 100}%`,
              }}
              transition={{ duration: 0.5, ease: "easeOut" }}
            />
          </div>

          {/* Steps */}
          <div className="relative flex justify-between">
            {steps.map((step) => {
              const isComplete = step.number < currentStep;
              const isCurrent = step.number === currentStep;

              return (
                <div key={step.number} className="flex flex-col items-center">
                  <motion.div
                    initial={{ scale: 0.8 }}
                    animate={{ scale: 1 }}
                    className="flex items-center justify-center mb-2 transition-all duration-200"
                    style={{
                      width: 40,
                      height: 40,
                      borderRadius: 20,
                      background:
                        isComplete || isCurrent ? "#2563EB" : "#fff",
                      color:
                        isComplete || isCurrent ? "#fff" : "#94A3B8",
                      border:
                        !isComplete && !isCurrent
                          ? "2px solid #E2E8F0"
                          : "none",
                      boxShadow:
                        isCurrent
                          ? "0 0 0 4px rgba(37,99,235,0.12), 0 4px 12px rgba(37,99,235,0.3)"
                          : isComplete
                            ? "0 4px 12px rgba(37,99,235,0.3)"
                            : undefined,
                    }}
                  >
                    {isComplete ? (
                      <Check className="w-5 h-5" />
                    ) : (
                      <span
                        style={{
                          fontSize: 14,
                          fontWeight: 700,
                        }}
                      >
                        {step.number}
                      </span>
                    )}
                  </motion.div>
                  <p
                    className="text-center"
                    style={{
                      fontSize: 12,
                      maxWidth: 120,
                      fontWeight: isCurrent ? 700 : isComplete ? 600 : 500,
                      color: isCurrent
                        ? "#1E293B"
                        : isComplete
                          ? "#475569"
                          : "#94A3B8",
                    }}
                  >
                    {step.label}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
