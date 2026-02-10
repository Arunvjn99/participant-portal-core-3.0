import type { ReactNode } from "react";

export type BellaLayoutVariant = "fullpage" | "embedded";

export interface BellaScreenLayoutProps {
  /** fullpage: viewport scroll, fixed chrome. embedded: panel scroll, relative chrome. */
  variant: BellaLayoutVariant;
  /** Chrome: theme toggle, close button. Caller applies fixed (fullpage) or relative (embedded) positioning. */
  header: ReactNode;
  /** Chrome: suggested questions + input bar. Caller applies fixed (fullpage) or relative (embedded) positioning. */
  footer: ReactNode;
  /** Main content: mode indicators + greeting or message list + step UI. In embedded, this scrolls inside the panel. */
  children: ReactNode;
}

/**
 * Layout shell for BellaScreen. Abstracts viewport vs panel layout and scrolling.
 * - fullpage: header and footer are positioned by caller (fixed); content flows, document scrolls.
 * - embedded: single column with scrollable middle; header/footer relative, content scrolls inside panel.
 * Used by /voice (fullpage) and future floating panel (embedded). No conversation or agent logic.
 * Respect prefers-reduced-motion: shell has no animations; any motion is in BellaScreen content.
 */
export function BellaScreenLayout({
  variant,
  header,
  footer,
  children,
}: BellaScreenLayoutProps) {
  if (variant === "fullpage") {
    return (
      <>
        {header}
        {children}
        {footer}
      </>
    );
  }

  // embedded: constrained container; scroll is the middle section so messagesEndRef scrollIntoView works inside panel.
  // Future: mount BellaScreen with variant="embedded" inside floating search/command UI here.
  return (
    <div className="flex h-full flex-col overflow-hidden">
      {header}
      <div className="min-h-0 flex-1 overflow-y-auto">{children}</div>
      {footer}
    </div>
  );
}
