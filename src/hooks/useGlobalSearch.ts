import { useCallback, useEffect, useState } from "react";

export const GLOBAL_SEARCH_OPEN_EVENT = "global-search-open";

export function requestOpenGlobalSearch() {
  window.dispatchEvent(new CustomEvent(GLOBAL_SEARCH_OPEN_EVENT));
}

export function useGlobalSearch() {
  const [open, setOpen] = useState(false);

  const openSearch = useCallback(() => setOpen(true), []);
  const closeSearch = useCallback(() => setOpen(false), []);
  const toggleSearch = useCallback(() => setOpen((o) => !o), []);

  useEffect(() => {
    const onPaletteOpen = () => setOpen(true);
    window.addEventListener(GLOBAL_SEARCH_OPEN_EVENT, onPaletteOpen);
    return () => window.removeEventListener(GLOBAL_SEARCH_OPEN_EVENT, onPaletteOpen);
  }, []);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setOpen((o) => !o);
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  useEffect(() => {
    if (!open) return;
    const onEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        setOpen(false);
      }
    };
    document.addEventListener("keydown", onEsc);
    return () => document.removeEventListener("keydown", onEsc);
  }, [open]);

  return {
    open,
    openSearch,
    closeSearch,
    toggleSearch,
  };
}
