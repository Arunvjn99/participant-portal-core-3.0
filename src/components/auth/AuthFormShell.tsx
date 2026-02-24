import type { ReactNode } from "react";

interface AuthFormShellProps {
  headerSlot?: ReactNode;
  title: string;
  description?: string;
  bodySlot: ReactNode;
}

export const AuthFormShell = ({
  headerSlot,
  title,
  description,
  bodySlot,
}: AuthFormShellProps) => {
  return (
    <div className="flex flex-col">
      {headerSlot && (
        <div className="mb-8 flex flex-col items-start gap-2">
          {headerSlot}
        </div>
      )}
      <h1 className="mb-2 text-2xl font-bold leading-tight text-[var(--color-text)] md:text-3xl">
        {title}
      </h1>
      {description && (
        <p className="mb-8 text-sm leading-relaxed text-[var(--color-textSecondary)] md:text-base">
          {description}
        </p>
      )}
      <div className="flex flex-col gap-6">
        {bodySlot}
      </div>
    </div>
  );
};
