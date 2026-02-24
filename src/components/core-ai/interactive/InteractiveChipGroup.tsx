/**
 * InteractiveChipGroup — A row of selectable preset chips.
 *
 * Used for quick value selection (contribution %, loan amounts, purposes, terms).
 * Presentation-only. Callbacks fire the selected value.
 */

import { motion, useReducedMotion } from "framer-motion";

export interface ChipItem {
  label: string;
  value: string;
}

export interface InteractiveChipGroupProps {
  chips: ChipItem[];
  selectedValue?: string;
  onSelect: (value: string) => void;
  /** Optional label above the chip row */
  label?: string;
}

export function InteractiveChipGroup({ chips, selectedValue, onSelect, label }: InteractiveChipGroupProps) {
  const reduced = useReducedMotion();

  return (
    <div role="group" aria-label={label || "Options"}>
      {label && <p className="text-[11px] font-medium text-[var(--color-textSecondary)] mb-2">{label}</p>}
      <div className="flex flex-wrap gap-2">
        {chips.map((chip, i) => {
          const isSelected = chip.value === selectedValue;
          return (
            <motion.button
              key={chip.value}
              type="button"
              onClick={() => onSelect(chip.value)}
              initial={reduced ? false : { opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.15, delay: i * 0.03 }}
              className={`
                px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-200
                focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-1 focus:ring-offset-white
                ${isSelected
                  ? "bg-primary/10 border border-primary/50 text-primary"
                  : "bg-[var(--color-background)] border border-[var(--color-border)] text-[var(--color-text)] hover:bg-[var(--color-background)] hover:text-[var(--color-text)]"
                }
              `}
              aria-pressed={isSelected}
            >
              {chip.label}
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}
