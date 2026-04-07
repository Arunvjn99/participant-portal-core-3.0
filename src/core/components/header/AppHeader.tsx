import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { motion, useReducedMotion } from "framer-motion";
import { useTheme } from "@/core/context/ThemeContext";
import { useUser } from "@/core/context/UserContext";
import { cn } from "@/core/lib/utils";
import { motionOffset, motionTransition } from "@/core/motion/motionTokens";
import { HeaderActions } from "./HeaderActions";
import { HeaderMobileNavDialog, HeaderNav } from "./HeaderNav";
import { getHeaderNavMode } from "./headerNavConfig";

const headerChrome =
  "sticky top-0 z-50 flex h-16 w-full shrink-0 flex-col border-b border-border bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/80";

function HeaderLogo({
  logoUrl,
  brandLabel,
  ariaLabel,
  companyLogoAlt,
}: {
  logoUrl: string;
  brandLabel: string;
  ariaLabel: string;
  companyLogoAlt: string;
}) {
  return (
    <Link
      to="/dashboard"
      className={cn(
        "header-logo min-w-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background",
        !logoUrl && "max-w-full",
      )}
      aria-label={ariaLabel}
    >
      {logoUrl ? (
        <div className="header-logo__frame">
          <img
            src={logoUrl}
            alt={companyLogoAlt}
            className="h-8 w-auto max-w-[var(--header-logo-max-width)] object-contain"
            decoding="async"
            loading="eager"
          />
        </div>
      ) : (
        <span className="block max-w-36 truncate text-sm font-semibold text-foreground sm:max-w-48 md:text-base lg:max-w-xs">
          {brandLabel}
        </span>
      )}
    </Link>
  );
}

export function AppHeader() {
  const { t } = useTranslation();
  const { enrollmentStatus, company, profile } = useUser();
  const { currentColors } = useTheme();
  const reduceMotion = useReducedMotion();

  const mode = useMemo(() => getHeaderNavMode(enrollmentStatus), [enrollmentStatus]);
  const logoUrl = currentColors.logo?.trim() ?? "";
  const brandLabel = company?.name?.trim() || profile?.name?.trim() || t("header.logoAria");

  /**
   * True center nav: left + right in normal flow (`z-10`), main nav absolutely centered
   * (`left-1/2 -translate-x-1/2`) so asymmetric right-side width does not pull the bar off-center.
   */
  const inner = (
    <div className="container-app flex h-full min-h-0 min-w-0 items-center">
      {/* LEFT GROUP: hamburger (mobile) + logo + desktop nav */}
      <div className="flex min-w-0 items-center gap-xl">
        <HeaderMobileNavDialog mode={mode} />
        <HeaderLogo
          logoUrl={logoUrl}
          brandLabel={brandLabel}
          ariaLabel={t("header.logoAria")}
          companyLogoAlt={t("header.companyLogoAlt")}
        />
        <nav className="hidden md:flex items-center gap-xl ml-md" aria-label="Main">
          <HeaderNav mode={mode} variant="desktop" />
        </nav>
      </div>

      {/* RIGHT GROUP */}
      <div className="ml-auto flex min-w-0 shrink-0 items-center gap-md">
        <HeaderActions />
      </div>
    </div>
  );

  if (reduceMotion) {
    return <header className={headerChrome}>{inner}</header>;
  }

  return (
    <motion.header
      className={headerChrome}
      initial={{ y: -motionOffset.headerEnterY, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={motionTransition({ duration: "normal", ease: "smooth" })}
    >
      {inner}
    </motion.header>
  );
}
