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
    "bg-[var(--color-primary)] text-white hover:opacity-90 active:opacity-80 focus:ring-[var(--color-primary)]",
  secondary:
    "border border-[var(--color-border)] bg-transparent text-[var(--color-text)] hover:bg-[var(--color-surface)] focus:ring-[var(--color-primary)]",
  ghost:
    "bg-transparent text-[var(--color-text)] hover:bg-[var(--color-surface)] focus:ring-[var(--color-primary)]",
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
    "inline-flex w-full items-center justify-center gap-2 rounded-lg px-6 py-3 font-medium text-base transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60";

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
