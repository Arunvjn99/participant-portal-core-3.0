import type { ReactNode } from "react";
import { motion } from "framer-motion";
import { Check } from "lucide-react";
import Button from "../../../components/ui/Button";
import { IconContainer } from "../../../shared/ui/IconContainer";
import { PlanBenefitChip } from "../../../shared/ui/PlanBenefitChip";
import type { SelectedPlanId } from "../../../enrollment/context/EnrollmentContext";

export interface PlanCardV2Props {
  id: string;
  planId: SelectedPlanId;
  title: string;
  description: string;
  benefits: string[];
  isSelected: boolean;
  onSelect: () => void;
  /** Optional: show "Ask AI" help */
  onAskAI?: () => void;
  /** Optional: icon shown in a container next to title (e.g. TrendingUp, Shield) */
  icon?: ReactNode;
}

/**
 * Plan card for V2 choose-plan step. Uses theme tokens; no hardcoded colors.
 * Hover animation, selected badge, soft elevation, chip-style benefits, icon container.
 */
export function PlanCardV2({
  id,
  title,
  description,
  benefits,
  isSelected,
  onSelect,
  onAskAI,
  icon,
}: PlanCardV2Props) {
  return (
    <motion.div
      role="button"
      tabIndex={0}
      onClick={onSelect}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onSelect();
        }
      }}
      initial={false}
      whileHover={{ scale: 1.01, y: -2 }}
      whileTap={{ scale: 0.995 }}
      transition={{ type: "spring", stiffness: 400, damping: 25 }}
      className={`relative rounded-2xl border-2 p-8 cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand-primary)] focus-visible:ring-offset-2 transition-[box-shadow,border-color] duration-200 ${isSelected ? "ring-4 ring-[var(--brand-primary)]/20" : "hover:shadow-[var(--shadow-md)]"} ${!isSelected ? "hover:border-[var(--brand-primary)]/50" : ""}`}
      style={{
        background: "var(--surface-1)",
        color: "var(--text-primary)",
        borderColor: isSelected ? "var(--brand-primary)" : "var(--border-subtle)",
        boxShadow: isSelected ? "var(--shadow-lg)" : "var(--shadow-sm)",
      }}
    >
      {/* Selected badge */}
      {isSelected && (
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", stiffness: 500, damping: 30 }}
          className="absolute -top-3 right-6 z-10 flex items-center gap-1.5 rounded-full px-4 py-2 text-sm font-semibold text-white shadow-md"
          style={{ background: "var(--brand-primary)" }}
        >
          <Check className="w-4 h-4 flex-shrink-0" aria-hidden />
          Selected
        </motion.div>
      )}

      <div className="flex flex-col md:flex-row gap-8 relative z-10">
        <div className="md:w-1/3">
          <div className="flex items-start gap-4 mb-4">
            {icon != null && (
              <IconContainer size="lg" accent="brand">
                {icon}
              </IconContainer>
            )}
            <div className="min-w-0 flex-1">
              <h3
                className="text-xl md:text-2xl font-semibold mb-2"
                style={{ color: "var(--text-primary)" }}
              >
                {title}
              </h3>
              <p
                className="text-sm leading-relaxed"
                style={{ color: "var(--text-secondary)" }}
              >
                {description}
              </p>
            </div>
          </div>
          <div className="flex flex-col gap-3">
            {onAskAI && (
              <Button
                type="button"
                variant="secondary"
                className="w-full"
                onClick={(e) => {
                  e.stopPropagation();
                  onAskAI();
                }}
              >
                Ask AI
              </Button>
            )}
            <Button
              type="button"
              variant="secondary"
              className="w-full"
              onClick={(e) => {
                e.stopPropagation();
                onSelect();
              }}
            >
              {isSelected ? (
                <>
                  <Check className="w-5 h-5 mr-2 inline" aria-hidden />
                  Selected
                </>
              ) : (
                "Select Plan"
              )}
            </Button>
          </div>
        </div>

        <div
          className="md:w-2/3 md:border-l md:pl-8 pt-0 md:pt-0"
          style={{ borderColor: "var(--border-subtle)" }}
        >
          <h4
            className="text-sm font-semibold mb-4"
            style={{ color: "var(--text-primary)" }}
          >
            Key Benefits
          </h4>
          <div className="flex flex-wrap gap-3">
            {benefits.slice(0, 4).map((benefit, index) => (
              <PlanBenefitChip
                key={`${id}-benefit-${index}`}
                id={index === 0 ? undefined : undefined}
                label={benefit}
              />
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
