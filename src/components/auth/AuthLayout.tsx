import type { ReactNode } from "react";
import { AuthLeftPanel } from "./AuthLeftPanel";
import { AuthRightPanel } from "./AuthRightPanel";

interface AuthLayoutProps {
  left?: ReactNode;
  children: ReactNode;
}

/**
 * Shared Auth layout: 50/50 on lg, left hidden below lg.
 * Parent: flex min-h-screen. Right panel owns footer.
 */
export const AuthLayout = ({ left, children }: AuthLayoutProps) => {
  return (
    <div className="flex min-h-screen w-full flex-col lg:flex-row">
      <div className="hidden lg:block lg:w-1/2 lg:min-h-screen">
        {left ?? <AuthLeftPanel />}
      </div>
      <div className="flex min-h-screen w-full flex-1 flex-col lg:w-1/2">
        <AuthRightPanel>{children}</AuthRightPanel>
      </div>
    </div>
  );
};
