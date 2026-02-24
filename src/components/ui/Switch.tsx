import { useId } from "react";
import { cn } from "@/lib/utils";

export interface SwitchProps {
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
  disabled?: boolean;
  label?: string;
  description?: string;
  id?: string;
  "aria-label"?: string;
  className?: string;
}

export const Switch = ({
  checked,
  onCheckedChange,
  disabled = false,
  label,
  description,
  id: propId,
  "aria-label": ariaLabel,
  className,
}: SwitchProps) => {
  const generatedId = useId();
  const id = propId ?? generatedId;

  return (
    <div className={cn("flex flex-col gap-1", className)}>
      <label
        htmlFor={id}
        className={cn(
          "inline-flex cursor-pointer items-center gap-3",
          disabled && "cursor-not-allowed opacity-60"
        )}
      >
        <span
          role="switch"
          tabIndex={disabled ? -1 : 0}
          id={id}
          aria-checked={checked}
          aria-label={ariaLabel ?? label ?? "Toggle"}
          aria-describedby={description ? `${id}-desc` : undefined}
          className={cn(
            "relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:ring-offset-2",
            checked
              ? "bg-[var(--color-primary)]"
              : "bg-[var(--color-border)]",
            disabled && "cursor-not-allowed opacity-50"
          )}
          onClick={() => !disabled && onCheckedChange(!checked)}
          onKeyDown={(e) => {
            if (disabled) return;
            if (e.key === " " || e.key === "Enter") {
              e.preventDefault();
              onCheckedChange(!checked);
            }
          }}
        >
          <span
            className={cn(
              "pointer-events-none inline-block h-5 w-5 translate-y-0.5 rounded-full bg-surface-primary shadow-sm ring-0 transition duration-200",
              checked ? "translate-x-5" : "translate-x-0.5"
            )}
            aria-hidden
          />
        </span>
        {(label || description) && (
          <span className="flex flex-col gap-0.5">
            {label && (
              <span className="text-sm font-medium text-[var(--color-text)]">
                {label}
              </span>
            )}
            {description && (
              <span id={`${id}-desc`} className="text-xs text-[var(--color-textSecondary)]">
                {description}
              </span>
            )}
          </span>
        )}
      </label>
    </div>
  );
};
