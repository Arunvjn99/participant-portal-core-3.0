import type { ReactNode } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { Check, Sparkles, PiggyBank } from "lucide-react";

export interface PlanCardProps {
  /** Plan id (e.g. roth_401k) – used for Roth vs Traditional styling */
  id?: string;
  title: string;
  description: string;
  benefits: string[];
  isSelected: boolean;
  onSelect: () => void;
  onAskAI?: () => void;
  icon?: ReactNode;
  askAriaLabel?: string;
  selectedLabel?: string;
  selectPlanLabel?: string;
  keyBenefitsLabel?: string;
}

/**
 * Plan selection card – reference UI from Retirement Plan Selection App.
 * Gradient overlays, decorative circles, benefits as pills, Selected badge, theme-aware (light/dark).
 */
export function PlanCard({
  id = "",
  title,
  description,
  benefits,
  isSelected,
  onSelect,
  onAskAI,
  icon,
  askAriaLabel = "Ask AI about this plan",
  selectedLabel = "Selected",
  selectPlanLabel = "Select Plan",
  keyBenefitsLabel = "Key Benefits",
}: PlanCardProps) {
  const reduced = useReducedMotion();
  const isRoth = id.toLowerCase().includes("roth");

  return (
    <motion.div
      role="radio"
      aria-selected={isSelected}
      aria-label={`${title}, ${isSelected ? selectedLabel : selectPlanLabel}`}
      tabIndex={0}
      onClick={() => onSelect()}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onSelect();
        }
      }}
      whileHover={reduced ? undefined : { scale: 1.01 }}
      transition={{ duration: 0.2 }}
      className="choose-plan-card relative rounded-2xl border-2 p-6 cursor-pointer transition-all duration-300 overflow-hidden"
      style={{
        background: "var(--enroll-card-bg)",
        borderColor: isSelected ? "var(--enroll-brand)" : "var(--enroll-card-border)",
        boxShadow: isSelected ? "var(--enroll-elevation-2)" : undefined,
      }}
      data-selected={isSelected}
    >
      {/* Gradient overlays – theme-aware */}
      <div
        className="absolute top-0 right-0 w-96 h-96 opacity-[0.07] pointer-events-none rounded-full blur-3xl -translate-y-1/3 translate-x-1/3"
        style={{
          background: isRoth
            ? "linear-gradient(to bottom right, var(--enroll-brand), var(--enroll-accent))"
            : "linear-gradient(to bottom right, #9333ea, #ec4899)",
        }}
      />
      <div
        className="absolute bottom-0 left-0 w-72 h-72 opacity-[0.05] pointer-events-none rounded-full blur-3xl translate-y-1/3 -translate-x-1/4"
        style={{
          background: isRoth
            ? "linear-gradient(to top right, #06b6d4, var(--enroll-brand))"
            : "linear-gradient(to top right, #6366f1, #9333ea)",
        }}
      />
      <div
        className="absolute -bottom-8 -left-8 w-32 h-32 rounded-full opacity-20 blur-2xl"
        style={{
          background: isRoth
            ? "linear-gradient(to bottom right, rgb(var(--enroll-brand-rgb) / 0.3), rgb(var(--enroll-accent-rgb) / 0.2))"
            : "linear-gradient(to bottom right, #c084fc, #f472b6)",
        }}
      />
      <div
        className="absolute inset-0 opacity-[0.02] pointer-events-none"
        style={{
          backgroundImage:
            "repeating-linear-gradient(60deg, transparent, transparent 25px, currentColor 25px, currentColor 50px)",
        }}
      />

      {/* Selected badge */}
      {isSelected && (
        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
          className="absolute -top-3 -right-3 z-30 flex items-center gap-1.5 rounded-lg px-3 py-1.5 font-medium shadow-lg text-white"
          style={{ background: "var(--enroll-brand)" }}
          aria-hidden
        >
          <Check className="w-4 h-4" strokeWidth={2.5} />
          {selectedLabel}
        </motion.div>
      )}

      <div className="flex flex-col md:flex-row gap-6 relative z-10">
        {/* Left – icon, title, description, Ask AI, Select button */}
        <div className="md:w-1/3 min-w-0">
          <div className="flex items-center gap-3 mb-3">
            {icon != null && (
              <motion.div
                whileHover={reduced ? undefined : { rotate: [0, -10, 10, -10, 0], scale: 1.1 }}
                transition={{ duration: 0.5 }}
                className="flex items-center justify-center w-12 h-12 rounded-xl flex-shrink-0 relative"
                style={{
                  background: isRoth
                    ? "linear-gradient(135deg, rgb(var(--enroll-brand-rgb) / 0.12), rgb(var(--enroll-accent-rgb) / 0.08))"
                    : "linear-gradient(135deg, rgb(147 51 234 / 0.15), rgb(236 72 153 / 0.1))",
                }}
              >
                {icon}
                <motion.div
                  animate={reduced ? {} : { scale: [1, 1.2, 1], opacity: [0.5, 0.8, 0.5] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="absolute -top-1 -right-1 w-3 h-3 rounded-full"
                  style={{ background: "var(--enroll-brand)" }}
                />
              </motion.div>
            )}
            <h3 className="text-2xl font-semibold min-w-0" style={{ color: "var(--enroll-text-primary)" }}>
              {title}
            </h3>
          </div>
          <p className="text-sm mb-4 md:mb-6" style={{ color: "var(--enroll-text-secondary)" }}>
            {description}
          </p>
          {onAskAI != null && (
            <motion.button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onAskAI();
              }}
              className="flex items-center gap-2 px-2 py-1 rounded-lg text-xs font-medium mb-3 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[var(--enroll-brand)]"
              style={{
                background: "rgb(var(--enroll-brand-rgb) / 0.1)",
                color: "var(--enroll-brand)",
              }}
              aria-label={askAriaLabel}
            >
              <Sparkles className="w-3 h-3" />
              {askAriaLabel}
            </motion.button>
          )}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onSelect();
            }}
            className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg font-semibold text-sm transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[var(--enroll-brand)]"
            style={
              isSelected
                ? {
                    background: "linear-gradient(to right, rgb(var(--enroll-accent-rgb) / 0.2), rgb(var(--enroll-accent-rgb) / 0.15))",
                    color: "var(--enroll-accent)",
                    border: "2px solid var(--enroll-accent)",
                  }
                : {
                    background: "var(--enroll-soft-bg)",
                    color: "var(--enroll-text-primary)",
                    border: "1px solid var(--enroll-card-border)",
                  }
            }
          >
            {isSelected ? (
              <>
                <Check className="w-5 h-5" />
                {selectedLabel}
              </>
            ) : (
              selectPlanLabel
            )}
          </button>
        </div>

        {/* Right – Key Benefits as pills */}
        <div className="md:w-2/3 md:border-l min-w-0 md:pl-6 border-t pt-4 md:pt-0 md:border-t-0" style={{ borderColor: "var(--enroll-card-border)" }}>
          <div className="flex items-center gap-2 mb-4">
            <PiggyBank className="w-5 h-5" style={{ color: "var(--enroll-accent)" }} />
            <h4 className="text-sm font-semibold" style={{ color: "var(--enroll-text-primary)" }}>
              {keyBenefitsLabel}
            </h4>
          </div>
          <div className="flex flex-wrap gap-2">
            {benefits.slice(0, 4).map((benefit, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
                className="inline-flex items-center gap-2 rounded-lg px-3 py-2 border transition-shadow"
                style={{
                  background: "var(--enroll-soft-bg)",
                  borderColor: "var(--enroll-card-border)",
                }}
              >
                <Check className="w-4 h-4 flex-shrink-0" style={{ color: "var(--enroll-accent)" }} strokeWidth={2.5} />
                <span className="text-sm" style={{ color: "var(--enroll-text-secondary)" }}>
                  {benefit}
                </span>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
