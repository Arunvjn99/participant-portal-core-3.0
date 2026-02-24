import * as Label from "@radix-ui/react-label";
import { Eye, EyeOff } from "lucide-react";
import { useState, useId } from "react";
import type { InputHTMLAttributes, ChangeEvent } from "react";

export interface AuthPasswordInputProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, "onChange" | "type"> {
  label: string;
  error?: string;
  onChange?: (e: ChangeEvent<HTMLInputElement>) => void;
}

export const AuthPasswordInput = ({
  label,
  placeholder,
  value,
  onChange,
  name,
  id,
  error,
  ...props
}: AuthPasswordInputProps) => {
  const [isVisible, setIsVisible] = useState(false);
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
      <div className="relative">
        <input
          id={inputId}
          type={isVisible ? "text" : "password"}
          name={name}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          aria-invalid={error ? true : undefined}
          aria-describedby={errorId}
          className={`h-[2.75rem] w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-3 pr-12 text-base text-[var(--color-text)] placeholder:text-[var(--color-textSecondary)] transition-colors focus:border-[var(--color-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/20
            ${error ? "border-[var(--color-danger)] focus:border-[var(--color-danger)] focus:ring-[var(--color-danger)]/20" : ""}
          `}
          {...props}
        />
        <button
          type="button"
          onClick={() => setIsVisible((prev) => !prev)}
          className="absolute right-3 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded text-[var(--color-textSecondary)] transition-colors hover:text-[var(--color-text)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:ring-offset-2"
          aria-label={isVisible ? "Hide password" : "Show password"}
          aria-pressed={isVisible}
        >
          {isVisible ? (
            <EyeOff className="h-4 w-4 shrink-0" aria-hidden />
          ) : (
            <Eye className="h-4 w-4 shrink-0" aria-hidden />
          )}
        </button>
      </div>
      {error && (
        <span id={errorId} className="text-sm text-[var(--color-danger)]" role="alert">
          {error}
        </span>
      )}
    </div>
  );
};
