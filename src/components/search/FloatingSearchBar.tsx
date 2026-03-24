import { memo, useMemo } from "react";
import { useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Search } from "lucide-react";
import { shouldShowFloatingSearch } from "@/lib/floatingSearchVisibility";
import { requestOpenGlobalSearch } from "@/hooks/useGlobalSearch";
import { useGlobalSearch } from "@/hooks/useGlobalSearch";

/**
 * Bottom-centered search affordance — same command surface tokens as hero search.
 */
export const FloatingSearchBar = memo(function FloatingSearchBar() {
  const { pathname } = useLocation();
  const { t } = useTranslation();
  const { open } = useGlobalSearch();

  const show = shouldShowFloatingSearch(pathname);

  const shortcutLabel = useMemo(() => {
    if (typeof navigator === "undefined") return "⌘K";
    const isMac = /Mac|iPhone|iPad|iPod/i.test(navigator.userAgent ?? navigator.platform ?? "");
    return isMac ? "⌘K" : "Ctrl+K";
  }, []);

  if (!show || open) return null;

  return (
    <div className="floating-search-bar__dock" data-floating-search>
      <div className="floating-search-bar__inner">
        <button
          type="button"
          onClick={() => requestOpenGlobalSearch()}
          className="search-container search-container--trigger search-container--animated search-container--compact"
          aria-label={t("floatingSearch.openAria")}
          aria-keyshortcuts="Meta+K Control+K"
        >
          <span className="search-container__inner">
            <span className="search-container__icon-slot" aria-hidden>
              <Search className="icon search-container__icon h-5 w-5" strokeWidth={2} />
            </span>
            <span className="search-container__placeholder">{t("floatingSearch.placeholder")}</span>
            <kbd className="search-container__kbd search-container__kbd--collapse-sm">{shortcutLabel}</kbd>
          </span>
        </button>
      </div>
    </div>
  );
});
