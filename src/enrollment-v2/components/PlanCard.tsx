/**
 * Plan card for Choose Plan step — Figma parity.
 * Structure: ICON, title, description, Ask AI (secondary/ghost), Select Plan (primary / green when selected), Key Benefits with BenefitChip.
 * Selected: blue border, green button, selected badge top-right. Hover: shadow, translateY(-2px). role="radio" aria-selected.
 */
import { motion } from "framer-motion";
import { Check, PiggyBank, Sparkles } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { BenefitChip } from "./BenefitChip";

export interface PlanCardProps {
  id: string;
  planId: string;
  title: string;
  description: string;
  benefits: string[];
  isSelected: boolean;
  onSelect: () => void;
  onAskAI?: () => void;
  icon: LucideIcon;
}

export function PlanCard({
  id,
  title,
  description,
  benefits,
  isSelected,
  onSelect,
  onAskAI,
  icon: Icon,
}: PlanCardProps) {
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      onSelect();
    }
  };

  return (
    <motion.div
      role="radio"
      aria-selected={isSelected}
      aria-checked={isSelected}
      tabIndex={0}
      onClick={onSelect}
      onKeyDown={handleKeyDown}
      initial={false}
      animate={{
        y: 0,
        boxShadow: isSelected
          ? "0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)"
          : "0 1px 3px 0 rgb(0 0 0 / 0.05)",
      }}
      whileHover={{
        y: -4,
        boxShadow: "0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)",
      }}
      transition={{ duration: 0.2 }}
      className={
        `relative rounded-2xl border-2 p-6 cursor-pointer transition-all duration-200 shadow-sm hover:shadow-md hover:-translate-y-0.5 ` +
        (isSelected
          ? "border-[var(--enroll-brand)] ring-2 ring-[var(--enroll-brand)]/20"
          : "border-[var(--enroll-card-border)] hover:border-[var(--enroll-brand)]/50")
      }
      style={{ background: "var(--enroll-card-bg)" }}
    >
      {isSelected && (
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.2 }}
          className="absolute top-4 right-4 z-10 flex items-center gap-1.5 rounded-full bg-[var(--success)] px-3 py-1.5 text-sm font-semibold text-white shadow-md"
        >
          <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ duration: 0.2, delay: 0.05 }}>
            <Check className="w-4 h-4" aria-hidden />
          </motion.span>
          Selected
        </motion.div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 relative z-0">
        {/* Left: icon, title, description, buttons */}
        <div className="min-w-0">
          <div className="flex items-start gap-4 mb-4">
            <div
              className="flex-shrink-0 rounded-xl p-3 flex items-center justify-center border border-[var(--enroll-card-border)]"
              style={{ background: "var(--enroll-soft-bg)", color: "var(--enroll-brand)" }}
              aria-hidden
            >
              <Icon className="w-7 h-7" />
            </div>
            <div className="min-w-0">
              <h3 className="text-xl md:text-2xl font-semibold mb-2" style={{ color: "var(--enroll-text-primary)" }}>
                {title}
              </h3>
              <p className="text-sm text-[var(--text-secondary)] leading-relaxed" style={{ fontFamily: '"Open Sans", sans-serif' }}>
                {description}
              </p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 mt-6">
            {onAskAI && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onAskAI();
                }}
                className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border text-sm font-semibold transition-all duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--enroll-brand)] focus-visible:ring-offset-2"
                style={{ borderColor: "var(--enroll-card-border)", background: "var(--enroll-card-bg)", color: "var(--enroll-text-primary)" }}
                aria-label={`Ask AI about ${title}`}
              >
                <Sparkles className="w-4 h-4" aria-hidden />
                Ask AI about this plan
              </button>
            )}
            <motion.button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onSelect();
              }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className={
                `inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 ` +
                (isSelected
                  ? "bg-[var(--success)] text-white hover:opacity-90 shadow-md focus-visible:ring-[var(--success)]"
                  : "text-white focus-visible:ring-[var(--enroll-brand)]")
              }
              style={!isSelected ? { background: "var(--enroll-brand)" } : undefined}
              aria-label={isSelected ? `Selected: ${title}` : `Select ${title}`}
            >
              {isSelected ? (
                <>
                  <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ duration: 0.2 }}>
                    <Check className="w-5 h-5" aria-hidden />
                  </motion.span>
                  Selected
                </>
              ) : (
                "Select Plan"
              )}
            </motion.button>
          </div>
        </div>

        {/* Right: Key Benefits with chips — divider only on md+ */}
        <div className="min-w-0 md:border-l md:pl-8 border-neutral-200">
          <h4 className="flex items-center gap-2 text-sm font-semibold text-[var(--text-primary)] mb-4 mt-0" style={{ fontFamily: 'Montserrat, sans-serif' }}>
            <PiggyBank className="w-4 h-4 text-[var(--brand-primary)]" aria-hidden />
            Key Benefits
          </h4>
          <div className="flex flex-wrap gap-2 mt-6 md:mt-0">
            {benefits.slice(0, 4).map((benefit, index) => (
              <BenefitChip key={index} label={benefit} />
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
