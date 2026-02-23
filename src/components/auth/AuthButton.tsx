import * as Slot from "@radix-ui/react-slot";
import type { ButtonHTMLAttributes, ReactNode } from "react";

type AuthButtonVariant = "primary" | "secondary" | "ghost";

interface AuthButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: AuthButtonVariant;
  asChild?: boolean;
}

const variantStyles: Record<AuthButtonVariant, string> = {
  primary:
    "bg-[var(--color-primary)] text-white hover:bg-[var(--color-primary-hover)] active:bg-[var(--color-primary-active)] focus:ring-[var(--color-primary)]",
  secondary:
    "border border-slate-200 bg-transparent text-slate-900 hover:bg-slate-50 focus:ring-[var(--color-primary)] dark:border-slate-600 dark:text-slate-100 dark:hover:bg-slate-700",
  ghost:
    "bg-transparent text-slate-900 hover:bg-slate-50 focus:ring-[var(--color-primary)] dark:text-slate-100 dark:hover:bg-slate-700",
};

export const AuthButton = ({
  children,
  variant = "primary",
  type = "button",
  disabled,
  className = "",
  asChild,
  ...props
}: AuthButtonProps) => {
  const base =
    "inline-flex w-full items-center justify-center gap-2 rounded-lg px-6 py-3 font-medium text-base transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60 dark:focus:ring-offset-slate-800";

  const Comp = asChild ? Slot.Root : "button";

  return (
    <Comp
      type={asChild ? undefined : type}
      disabled={disabled}
      aria-disabled={disabled}
      className={`${base} ${variantStyles[variant]} ${className}`.trim()}
      {...props}
    >
      {children}
    </Comp>
  );
};
