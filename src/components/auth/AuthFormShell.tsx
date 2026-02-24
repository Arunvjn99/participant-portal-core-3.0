import type { ReactNode } from "react";

/** Spacing: logo→title 24px, title→description 8px, description→form 24px, form body sections 24px. */
const AUTH_HEADER_LOGO_MB = "mb-6";
const AUTH_TITLE_MB = "mb-2";
const AUTH_DESCRIPTION_MB = "mb-6";
const AUTH_BODY_GAP = "gap-6";

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
        <div className={`flex flex-col items-start ${AUTH_HEADER_LOGO_MB}`}>
          {headerSlot}
        </div>
      )}
      <h1 className={`text-2xl font-bold leading-tight text-[var(--color-text)] md:text-3xl ${AUTH_TITLE_MB}`}>
        {title}
      </h1>
      {description && (
        <p className={`text-sm leading-relaxed text-[var(--color-textSecondary)] md:text-base ${AUTH_DESCRIPTION_MB}`}>
          {description}
        </p>
      )}
      <div className={`flex flex-col ${AUTH_BODY_GAP}`}>
        {bodySlot}
      </div>
    </div>
  );
};
