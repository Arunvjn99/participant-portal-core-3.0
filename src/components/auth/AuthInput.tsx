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
        className="text-sm font-medium text-slate-900 dark:text-slate-100"
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
        className={`w-full rounded-lg border border-slate-200 bg-white px-4 py-3 text-base text-slate-900 placeholder:text-slate-500 transition-colors focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100 dark:placeholder:text-slate-400 dark:focus:border-blue-400 dark:focus:ring-blue-400/20
          ${error ? "border-red-500 focus:border-red-500 focus:ring-red-500/20 dark:border-red-500" : ""}
          ${className}`.trim()}
        {...props}
      />
      {error && (
        <span id={errorId} className="text-sm text-red-500" role="alert">
          {error}
        </span>
      )}
    </div>
  );
};
