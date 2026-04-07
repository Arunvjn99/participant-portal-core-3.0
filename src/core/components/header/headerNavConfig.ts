/**
 * Central navigation config for {@link AppHeader} — pre- vs post-enrollment modes.
 */

export type HeaderNavMode = "pre" | "post";

export type NavMatch = "exact" | "prefix";

export type NavLinkItem = {
  type: "link";
  labelKey: string;
  to: string;
  match: NavMatch;
};

export type NavDropdownItem = {
  labelKey: string;
  to: string;
  match: NavMatch;
};

export type NavDropdownEntry = {
  type: "dropdown";
  labelKey: string;
  items: NavDropdownItem[];
};

export type NavConfigEntry = NavLinkItem | NavDropdownEntry;

export const NAV_CONFIG: Record<HeaderNavMode, NavConfigEntry[]> = {
  pre: [
    { type: "link", labelKey: "header.nav.dashboard", to: "/dashboard", match: "exact" },
    { type: "link", labelKey: "header.nav.plans", to: "/plans", match: "prefix" },
    { type: "link", labelKey: "header.nav.profile", to: "/profile", match: "prefix" },
  ],
  post: [
    { type: "link", labelKey: "header.nav.dashboard", to: "/dashboard", match: "exact" },
    { type: "link", labelKey: "header.nav.investments", to: "/investments", match: "prefix" },
    { type: "link", labelKey: "header.nav.transactions", to: "/transactions", match: "prefix" },
    {
      type: "dropdown",
      labelKey: "header.nav.more",
      items: [
        { labelKey: "header.nav.settings", to: "/settings", match: "prefix" },
        { labelKey: "header.nav.help", to: "/help", match: "exact" },
      ],
    },
  ],
};

export function getHeaderNavMode(enrollmentStatus: string | null): HeaderNavMode {
  return enrollmentStatus === "completed" ? "post" : "pre";
}

export function isNavPathActive(pathname: string, to: string, match: NavMatch): boolean {
  if (match === "exact") {
    return pathname === to || pathname === `${to}/`;
  }
  return pathname === to || pathname.startsWith(`${to}/`);
}

export function flattenNavEntries(entries: NavConfigEntry[]): { labelKey: string; to: string; match: NavMatch }[] {
  const out: { labelKey: string; to: string; match: NavMatch }[] = [];
  for (const e of entries) {
    if (e.type === "link") {
      out.push({ labelKey: e.labelKey, to: e.to, match: e.match });
    } else {
      for (const item of e.items) {
        out.push({ labelKey: item.labelKey, to: item.to, match: item.match });
      }
    }
  }
  return out;
}
