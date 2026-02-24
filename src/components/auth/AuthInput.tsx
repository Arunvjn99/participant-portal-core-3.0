import * as Label from "@radix-ui/react-label";
import type { InputHTMLAttributes, ChangeEvent } from "react";
import { useId } from "react";

export interface AuthInputProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, "onChange"> {
  label: string;
  error?: string;
  onChange?: (e: ChangeEvent<HTMLInputElement>) => void;
}

export const AuthInput = ({
  label,
  type = "text",
  placeholder,
  value,
  onChange,
  name,
  id,
  error,
  className = "",
  ...props
}: AuthInputProps) => {
  const generatedId = useId();
  const inputId = id ?? name ?? generatedId;
  const errorId = error ? `${inputId}-error` : undefined;

  return (
    <div className="flex w-full flex-col gap-2">
      <Label.Root
        htmlFor={inputId}
        className="text-sm font-medium text-[var(--color-text)]"
      >
        {label}
      </Label.Root>
      <input
        id={inputId}
        type={type}
        name={name}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        aria-invalid={error ? true : undefined}
        aria-describedby={errorId}
        className={`w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-3 text-base text-[var(--color-text)] placeholder:text-[var(--color-textSecondary)] transition-colors focus:border-[var(--color-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/20
          ${error ? "border-[var(--color-danger)] focus:border-[var(--color-danger)] focus:ring-[var(--color-danger)]/20" : ""}
          ${className}`.trim()}
        {...props}
      />
      {error && (
        <span id={errorId} className="text-sm text-[var(--color-danger)]" role="alert">
          {error}
        </span>
      )}
    </div>
  );
};
