import type { ReactNode } from "react";
import ThemeToggle from "../ui/ThemeToggle";
import { AuthFooter } from "./AuthFooter";

interface AuthRightPanelProps {
  children: ReactNode;
}

/** Card and viewport padding for consistent vertical centering and no double stacking. */
const CARD_PADDING = "p-6 md:p-8 lg:p-10";
const VIEWPORT_PX = "px-4 md:px-8 lg:px-12";
const VIEWPORT_PY = "py-6 md:py-8 lg:py-10";

export const AuthRightPanel = ({ children }: AuthRightPanelProps) => {
  return (
    <div className="relative flex min-h-screen w-full flex-col overflow-x-hidden bg-[var(--color-background)]">
      <div className="flex min-h-0 flex-1 flex-col">
        <div className={`flex shrink-0 items-center justify-end ${VIEWPORT_PX} py-4 md:py-5 lg:py-6`}>
          <ThemeToggle />
        </div>
        <div className={`flex flex-1 flex-col items-center justify-center overflow-y-auto ${VIEWPORT_PX} ${VIEWPORT_PY}`}>
          <div className={`w-full max-w-[420px] rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] shadow-lg md:max-w-[520px] lg:max-w-[560px] ${CARD_PADDING}`}>
            {children}
          </div>
        </div>
      </div>
      <AuthFooter />
    </div>
  );
};
