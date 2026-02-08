import * as Checkbox from "@radix-ui/react-checkbox";
import type { ReactNode } from "react";

interface AuthCheckboxProps {
  id?: string;
  name?: string;
  checked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
  children: ReactNode;
}

export const AuthCheckbox = ({
  id,
  name,
  checked,
  onCheckedChange,
  children,
}: AuthCheckboxProps) => {
  return (
    <label
      htmlFor={id}
      className="inline-flex cursor-pointer items-center gap-2 text-sm text-[var(--color-text-secondary)]"
    >
      <Checkbox.Root
        id={id}
        name={name}
        checked={checked}
        onCheckedChange={onCheckedChange}
        className="h-4 w-4 shrink-0 rounded-[var(--radius-sm)] border border-[var(--color-border)] bg-[var(--color-surface)] flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:ring-offset-2 data-[state=checked]:bg-[var(--color-primary)] data-[state=checked]:border-[var(--color-primary)]"
      >
        <Checkbox.Indicator className="text-[var(--color-text-inverse)]">
          ✓
        </Checkbox.Indicator>
      </Checkbox.Root>
      {children}
    </label>
  );
}
