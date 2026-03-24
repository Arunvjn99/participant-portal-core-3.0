import { branding } from "@/config/branding";

export interface FooterLink {
  label: string;
  href: string;
}

export interface FooterProps {
  /** Company name for copyright. Defaults to branding.footer.companyName or authAppName. */
  companyName?: string;
  /** Optional links shown on the right. Defaults to Privacy, Terms, Support from branding. */
  links?: FooterLink[];
  /** Optional class name for the outer footer element. */
  className?: string;
}

function getDefaultLinks(): FooterLink[] {
  const { privacyLink, termsLink, supportLink } = branding.footer;
  const links: FooterLink[] = [
    { label: privacyLink.label, href: privacyLink.href },
  ];
  if (termsLink?.href) {
    links.push({ label: termsLink.label, href: termsLink.href });
  }
  if (supportLink?.href) {
    links.push({ label: supportLink.label, href: supportLink.href });
  }
  return links;
}

/**
 * Universal app footer for layout-level use. Minimal, professional, white-label safe.
 * Renders on all pages that use DashboardLayout. Uses theme tokens for light/dark mode.
 * Not fixed/sticky; sits at bottom of content with flex layout.
 */
export const Footer = ({
  companyName = branding.footer.companyName ?? branding.authAppName,
  links,
  className = "",
}: FooterProps) => {
  const resolvedLinks = links ?? getDefaultLinks();
  const year = new Date().getFullYear();

  return (
    <footer
      role="contentinfo"
      className={`shrink-0 border-t border-[var(--color-border)] bg-[var(--color-background)] px-4 py-6 sm:px-6 lg:px-8 ${className}`}
    >
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-4 md:flex-row md:items-center md:justify-between md:gap-0">
        <p
          className="text-center text-sm md:text-left"
          style={{ color: "var(--color-text-secondary)" }}
        >
          © {year} {companyName}. All rights reserved.
        </p>
        {resolvedLinks.length > 0 && (
          <nav
            className="flex flex-wrap items-center justify-center gap-x-6 gap-y-1 md:justify-end"
            aria-label="Footer links"
          >
            {resolvedLinks.map(({ label, href }) => (
              <a
                key={href + label}
                href={href}
                className="text-sm no-underline hover:underline focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:ring-offset-2 rounded"
                style={{ color: "var(--color-text-secondary)" }}
              >
                {label}
              </a>
            ))}
          </nav>
        )}
      </div>
    </footer>
  );
};
