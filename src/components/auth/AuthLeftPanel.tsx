import type { ReactNode } from "react";
import LeftPanelCarousel from "./LeftPanelCarousel";

interface AuthLeftPanelProps {
  children?: ReactNode;
}

export const AuthLeftPanel = ({ children }: AuthLeftPanelProps) => {
  return (
    <div
      className="flex min-h-full flex-1 flex-col items-center justify-center overflow-x-hidden overflow-y-auto px-12"
      style={{ backgroundColor: "#2F394B" }}
    >
      <div className="flex w-full max-w-[520px] flex-col items-center">
        <LeftPanelCarousel />
        {children}
      </div>
    </div>
  );
};
