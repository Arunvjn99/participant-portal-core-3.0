import type { ReactNode, ButtonHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

export type ButtonVariant = "primary" | "secondary" | "outline" | "ghost";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  type?: "button" | "submit" | "reset";
  disabled?: boolean;
  variant?: ButtonVariant;
  /** Optional: do not pass Tailwind color classes (bg-*, text-*). Use variant instead. */
  className?: string;
}

const variantClass: Record<ButtonVariant, string> = {
  primary: "button button--primary",
  secondary: "button button--secondary",
  outline: "button button--outline",
  ghost: "button button--ghost",
};

const Button = ({
  children,
  type = "button",
  disabled,
  variant = "primary",
  className,
  onClick,
  ...props
}: ButtonProps) => {
  return (
    <button
      type={type}
      disabled={disabled}
      aria-disabled={disabled}
      className={cn(variantClass[variant], className)}
      onClick={onClick}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;
