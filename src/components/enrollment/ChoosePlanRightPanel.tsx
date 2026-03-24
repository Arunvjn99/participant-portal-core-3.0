import { Icon } from "@iconify/react";
import { motion, AnimatePresence } from "framer-motion";
import type { PlanDisplayConfig } from "@/pages/enrollment/planDisplayConfig";

interface ChoosePlanRightPanelProps {
  activePlan: PlanDisplayConfig | null;
  age: number;
  retirementAge: number;
  salary: number;
  yearsToRetire: number;
  /** i18n keys */
  whyThisWorks: string;
  hoverToSee: string;
  yourProfile: string;
  ageLabel: string;
  retiringAtLabel: string;
  salaryLabel: string;
  yearsToGrowLabel: string;
}

export function ChoosePlanRightPanel({
  activePlan,
  age,
  retirementAge,
  salary,
  yearsToRetire,
  whyThisWorks,
  hoverToSee,
  yourProfile,
  ageLabel,
  retiringAtLabel,
  salaryLabel,
  yearsToGrowLabel,
}: ChoosePlanRightPanelProps) {
  const profileCells = [
    { icon: "solar:user-bold-duotone", label: ageLabel, value: `${age}` },
    { icon: "solar:calendar-bold-duotone", label: retiringAtLabel, value: `${retirementAge}` },
    { icon: "solar:dollar-minimalistic-bold-duotone", label: salaryLabel, value: `$${salary?.toLocaleString()}` },
    { icon: "solar:clock-circle-bold-duotone", label: yearsToGrowLabel, value: `${yearsToRetire} yrs` },
  ] as const;

  return (
    <div className="space-y-3 sm:space-y-4">
      <AnimatePresence mode="wait">
        <motion.div
          key={activePlan?.id ?? "empty"}
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -6 }}
          transition={{ duration: 0.18 }}
          className="rounded-xl sm:rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-4 sm:p-5 shadow-sm"
        >
          <p className="text-xs font-semibold uppercase tracking-widest text-[var(--color-text-secondary)] mb-3">
            {whyThisWorks}
          </p>
          {activePlan ? (
            <p className="text-xs sm:text-sm text-[var(--color-text)] leading-relaxed">
              {activePlan.personalizedInsight(age, salary, yearsToRetire)}
            </p>
          ) : (
            <p className="text-xs sm:text-sm text-[var(--color-text-secondary)] italic">
              {hoverToSee}
            </p>
          )}
        </motion.div>
      </AnimatePresence>

      <div className="rounded-xl sm:rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-4 sm:p-5 shadow-sm">
        <p className="text-xs font-semibold uppercase tracking-widest text-[var(--color-text-secondary)] mb-3">
          {yourProfile}
        </p>
        <div className="grid grid-cols-2 gap-2.5" aria-label={yourProfile}>
          {profileCells.map(({ icon, label, value }) => (
            <div
              key={label}
              className="rounded-xl bg-[var(--color-background-secondary)] p-3"
            >
              <Icon
                icon={icon}
                className="text-[var(--color-primary)] mb-1.5"
                width={18}
                aria-hidden
              />
              <p className="text-[10px] text-[var(--color-text-secondary)] mb-0.5">{label}</p>
              <p className="text-sm font-bold text-[var(--color-text)]">{value}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
