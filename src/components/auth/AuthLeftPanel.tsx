import type { ReactNode } from "react";

const LEFT_PANEL_IMAGE_URL =
  "https://pmmvggrzowobvbebjzdo.supabase.co/storage/v1/object/public/company-logos/Container.png";

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
        <img
          src={LEFT_PANEL_IMAGE_URL}
          alt=""
          className="w-full max-w-[520px] object-contain"
        />
        <h2 className="mt-8 text-center text-2xl font-bold text-white sm:text-3xl md:text-4xl">
          Empower your oversight
        </h2>
        <p className="mt-2 text-center text-sm text-white/80 sm:text-base">
          Sign in to gain clear visibility into every plan&apos;s performance
        </p>
        {children}
      </div>
    </div>
  );
};
