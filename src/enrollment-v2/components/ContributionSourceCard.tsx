import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";
import Button from "../../components/ui/Button";

export type ContributionSourceKey = "preTax" | "roth" | "afterTax";

export interface ContributionSourceCardProps {
  label: string;
  /** Whether this source is enabled (checkbox checked). When false, row is muted and slider disabled. */
  enabled: boolean;
  onEnabledChange: (enabled: boolean) => void;
  percentage: number;
  monthlyAmount: number;
  /** Edit mode: show slider. View mode: show static percentage only. */
  isEditing: boolean;
  onPercentChange: (value: number) => void;
  onAskAI?: () => void;
  /** CSS variable for accent color, e.g. --brand-primary */
  accentVar: string;
  /** When true, checkbox and controls are disabled (e.g. when contribution step is locked). */
  disabled?: boolean;
}

/**
 * Single contribution source row: checkbox, label, Ask AI, slider (when editing + enabled), percentage, amount.
 * Disabled state: muted row, slider hidden/disabled, percentage 0.
 */
export function ContributionSourceCard({
  label,
  enabled,
  onEnabledChange,
  percentage,
  monthlyAmount,
  isEditing,
  onPercentChange,
  onAskAI,
  accentVar,
  disabled = false,
}: ContributionSourceCardProps) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0.96, scale: 0.99 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.2 }}
      className={`rounded-lg border border-gray-200 bg-gray-50 p-2.5 mb-2 transition-all border-l-4 ${
        !enabled ? "opacity-60" : ""
      } ${disabled ? "opacity-90" : ""} dark:bg-[var(--surface-2)] dark:border-[var(--border-subtle)]`}
      style={{ borderLeftColor: enabled ? `var(${accentVar})` : "var(--enroll-card-border)" }}
    >
      <div className="flex items-center justify-between mb-1.5">
        <div className="flex items-center gap-2 flex-wrap">
          <label className={`flex items-center gap-2 ${disabled ? "cursor-not-allowed" : "cursor-pointer"}`}>
            <input
              type="checkbox"
              checked={enabled}
              onChange={(e) => !disabled && onEnabledChange(e.target.checked)}
              disabled={disabled}
              className="w-4 h-4 rounded border-2 border-[var(--border-subtle)] cursor-pointer accent-[var(--brand-primary)] disabled:cursor-not-allowed disabled:opacity-70"
              aria-label={`${label} ${enabled ? "enabled" : "disabled"}`}
            />
            <span
              className="text-sm font-semibold"
              style={{ color: enabled ? "var(--text-primary)" : "var(--text-secondary)" }}
            >
              {label}
            </span>
          </label>
          {onAskAI && enabled && (
            <Button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                onAskAI();
              }}
              className="!bg-transparent hover:!bg-[var(--surface-1)] !border-0 text-xs !py-1 !px-2 inline-flex items-center gap-1"
              style={{ color: "var(--brand-primary)" }}
            >
              <Sparkles className="h-3.5 w-3.5" />
              Ask AI
            </Button>
          )}
        </div>
        <div className="text-right">
          <span
            className="text-sm font-bold tabular-nums"
            style={{ color: enabled ? `var(${accentVar})` : "var(--text-secondary)" }}
          >
            {percentage}%
          </span>
          <span className="text-xs block ml-1.5" style={{ color: "var(--text-secondary)" }}>
            ${Math.round(monthlyAmount).toLocaleString()}/mo
          </span>
        </div>
      </div>
      {isEditing && enabled && (
        <input
          type="range"
          min={0}
          max={100}
          value={percentage}
          onChange={(e) => onPercentChange(Number(e.target.value))}
          className="w-full h-2 rounded-full appearance-none cursor-pointer mt-1 contrib-slider-v2"
          style={{
            background: `linear-gradient(to right, var(${accentVar}) 0%, var(${accentVar}) ${percentage}%, var(--enroll-card-border) ${percentage}%, var(--enroll-card-border) 100%)`,
          }}
          aria-label={`${label} contribution percentage`}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={percentage}
          aria-valuetext={`${percentage} percent`}
        />
      )}
    </motion.div>
  );
}
