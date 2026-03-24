/**
 * Whether the bottom floating search bar should render for the current route.
 * The pill is off app-wide; search stays available via header (DashboardHeader) and
 * GlobalSearchHost (⌘K / Ctrl+K). v1 dashboard keeps hero-focused search unchanged.
 */
export function shouldShowFloatingSearch(_pathname: string): boolean {
  return false;
}

/** Vertical space to reserve above the safe area so Core AI FAB clears the search bar. */
export const FLOATING_SEARCH_BOTTOM_OFFSET_REM = 5.75;
