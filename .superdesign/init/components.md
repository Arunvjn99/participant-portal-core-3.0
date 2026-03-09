# Shared UI Components

Framework: **React**. CSS: **Tailwind** + CSS variables. Primitives: custom (`src/components/ui/`), **Radix** (checkbox, dialog, label, slot), **MUI** in places. Utility: `cn` from `@/lib/utils` (clsx).

Below: **full source** for key shared UI primitives. For other components (e.g. DashboardHeader, EnrollmentHeaderWithStepper, PlanSelectionCard), read the files under `src/components/` and `src/features/` when designing a specific page.

---

## 1. Button

**Path**: `src/components/ui/Button.tsx`  
**Props**: `children`, `type?`, `disabled?`, `className?`, `onClick?`, ...HTMLButtonAttributes

```tsx
import type { ReactNode, ButtonHTMLAttributes } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  type?: "button" | "submit" | "reset";
  disabled?: boolean;
  className?: string;
}

const Button = ({ children, type = "button", disabled, className, onClick, ...props }: ButtonProps) => {
  return (
    <button
      type={type}
      disabled={disabled}
      aria-disabled={disabled}
      className={`button ${className || ""}`}
      onClick={onClick}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;
```

(Uses `.button` class from `src/index.css`.)

---

## 2. Card (compound)

**Path**: `src/components/ui/card.tsx`  
**Exports**: Card, CardHeader, CardFooter, CardTitle, CardAction, CardDescription, CardContent

```tsx
import * as React from "react";
import { cn } from "@/lib/utils";

function Card({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card"
      className={cn(
        "bg-surface-secondary text-foreground-primary flex flex-col gap-4 sm:gap-6 rounded-xl border border-border-subtle py-4 sm:py-6 shadow-sm transition-shadow duration-200",
        className
      )}
      {...props}
    />
  );
}

function CardHeader({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-header"
      className={cn(
        "grid auto-rows-min grid-rows-[auto_auto] items-start gap-2 px-4 sm:px-6 has-data-[slot=card-action]:grid-cols-[1fr_auto] [.border-b]:pb-6",
        className
      )}
      {...props}
    />
  );
}

function CardTitle({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-title"
      className={cn("leading-none font-semibold text-foreground-primary", className)}
      {...props}
    />
  );
}

function CardDescription({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-description"
      className={cn("text-sm text-foreground-secondary", className)}
      {...props}
    />
  );
}

function CardAction({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-action"
      className={cn(
        "col-start-2 row-span-2 row-start-1 self-start justify-self-end",
        className
      )}
      {...props}
    />
  );
}

function CardContent({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-content"
      className={cn("px-4 sm:px-6 text-foreground-primary", className)}
      {...props}
    />
  );
}

function CardFooter({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-footer"
      className={cn("flex items-center px-4 sm:px-6 [.border-t]:pt-6", className)}
      {...props}
    />
  );
}

export {
  Card,
  CardHeader,
  CardFooter,
  CardTitle,
  CardAction,
  CardDescription,
  CardContent,
};
```

---

## 3. Switch

**Path**: `src/components/ui/Switch.tsx`  
**Props**: `checked`, `onCheckedChange`, `disabled?`, `label?`, `description?`, `id?`, `aria-label?`, `className?`

```tsx
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
```

---

## 4. EnrollmentPageContent

**Path**: `src/components/enrollment/EnrollmentPageContent.tsx`  
**Purpose**: Wrapper for enrollment step pages: title, optional subtitle/badge, max-w-[1200px], padding, enrollment background token.

```tsx
import type { ReactNode } from "react";

interface EnrollmentPageContentProps {
  title: string;
  subtitle?: string;
  badge?: ReactNode;
  children: ReactNode;
}

export function EnrollmentPageContent({
  title,
  subtitle,
  badge,
  children,
}: EnrollmentPageContentProps) {
  return (
    <div
      className="w-full min-h-0 pb-12 md:pb-16"
      style={{ background: "var(--enroll-bg)" }}
    >
      <div className="max-w-[1200px] mx-auto px-4 md:px-6">
        <header className="mb-8">
          {badge && <div className="mb-2">{badge}</div>}
          <h1
            className="text-xl md:text-2xl font-bold leading-tight"
            style={{ color: "var(--enroll-text-primary)" }}
          >
            {title}
          </h1>
          {subtitle && (
            <p
              className="mt-1 text-base leading-relaxed"
              style={{ color: "var(--enroll-text-secondary)" }}
            >
              {subtitle}
            </p>
          )}
        </header>
        {children}
      </div>
    </div>
  );
}
```

---

## 5. cn (utils)

**Path**: `src/lib/utils.ts`

```ts
import { clsx, type ClassValue } from "clsx"

export function cn(...inputs: ClassValue[]) {
  return clsx(inputs)
}
```

---

## Other UI / feature components

- **Auth**: `AuthLayout`, `AuthInput`, `AuthPasswordInput`, `AuthOTPInput`, `AuthFooter`, `AuthLeftPanel`, `AuthRightPanel`, `AuthFormShell` — under `src/components/auth/`
- **Enrollment**: `EnrollmentFooter`, `EnrollmentHeaderWithStepper`, `HeaderStepper`, `EnrollmentStepper`, `PlanSelectionCard`, `PlanDetailsPanel`, `PlanRail`, `EnrollmentPageContent` — under `src/components/enrollment/`
- **Dashboard**: `DashboardHeader`, `DashboardCard`, `DashboardSection`, `NotificationPanel`, etc. — under `src/components/dashboard/`
- **Brand**: `Logo`, `CoreLogo`, `CoreProductBranding` — under `src/components/brand/`
- **Radix-based**: `input-otp` — `src/components/ui/input-otp.tsx`  
When designing a page, include the actual component files used by that page as `--context-file`.
