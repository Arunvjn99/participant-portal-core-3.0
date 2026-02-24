import type { ReactNode } from "react";
import ThemeToggle from "../ui/ThemeToggle";
import { AuthFooter } from "./AuthFooter";

interface AuthRightPanelProps {
  children: ReactNode;
}

export const AuthRightPanel = ({ children }: AuthRightPanelProps) => {
  return (
    <div className="relative flex min-h-screen w-full flex-col overflow-x-hidden bg-[var(--color-background)]">
      <div className="flex flex-1 flex-col min-h-0">
        <div className="flex shrink-0 items-center justify-end px-4 py-4 md:px-8 lg:px-12">
          <ThemeToggle />
        </div>
        <div className="flex flex-1 flex-col items-center justify-center overflow-y-auto px-4 py-4 md:px-8 md:py-8 lg:px-12 lg:py-12">
          <div className="w-full max-w-[420px] rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-6 shadow-lg md:p-8 lg:p-10">
            {children}
          </div>
        </div>
      </div>
      <AuthFooter />
    </div>
  );
};
