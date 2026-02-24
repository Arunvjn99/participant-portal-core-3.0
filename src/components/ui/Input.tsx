import { useId } from "react";
import type { InputHTMLAttributes, ChangeEvent } from "react";
import { cn } from "@/lib/utils";

export interface InputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "onChange"> {
  label?: string;
  type?: string;
  placeholder?: string;
  value?: string;
  onChange?: (e: ChangeEvent<HTMLInputElement>) => void;
  name?: string;
  id?: string;
  error?: string;
  description?: string;
}

export const Input = ({
  label,
  type = "text",
  placeholder,
  value,
  onChange,
  name,
  id,
  error,
  description,
  className,
  ...props
}: InputProps) => {
  const generatedId = useId();
  const inputId = id ?? name ?? generatedId;
  const errorId = error ? `${inputId}-error` : undefined;
  const descId = description ? `${inputId}-desc` : undefined;

  return (
    <div className="w-full">
      {label && (
        <label
          htmlFor={inputId}
          className="mb-1.5 block text-sm font-medium text-[var(--color-text)]"
        >
          {label}
        </label>
      )}
      <input
        id={inputId}
        type={type}
        name={name}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className={cn(
          "w-full rounded-lg border-2 border-[var(--color-border)] bg-transparent px-3 py-2.5 text-[var(--color-text)] placeholder:text-[var(--color-textSecondary)] outline-none transition-[border-color,box-shadow] duration-200",
          "focus:border-[var(--color-primary)] focus:ring-2 focus:ring-[var(--color-primary)]/20",
          "disabled:cursor-not-allowed disabled:opacity-50",
          error && "border-[var(--color-danger)] focus:border-[var(--color-danger)] focus:ring-[var(--color-danger)]/20",
          className
        )}
        aria-invalid={error ? true : undefined}
        aria-describedby={[errorId, descId].filter(Boolean).join(" ") || undefined}
        {...props}
      />
      {description && !error && (
        <p id={descId} className="mt-1.5 text-xs text-[var(--color-textSecondary)]">
          {description}
        </p>
      )}
      {error && (
        <p id={errorId} className="mt-1.5 text-sm text-[var(--color-danger)]" role="alert">
          {error}
        </p>
      )}
    </div>
  );
};
