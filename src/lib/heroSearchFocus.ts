/** Dispatched by the header so the contextual hero search scrolls into view and focuses. */
export const HERO_SEARCH_FOCUS_EVENT = "hero-search-focus";

export function requestHeroSearchFocus() {
  window.dispatchEvent(new CustomEvent(HERO_SEARCH_FOCUS_EVENT));
}
