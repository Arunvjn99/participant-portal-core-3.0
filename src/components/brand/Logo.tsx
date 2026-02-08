import { AscendLogo } from "./AscendLogo";

interface LogoProps {
  className?: string;
  /** "full" = icon + Ascend (auth). "icon" = icon only (dashboard with separate app name). */
  variant?: "full" | "icon";
}

export const Logo = ({ className, variant = "full" }: LogoProps) => {
  return <AscendLogo className={className} variant={variant} />;
};
