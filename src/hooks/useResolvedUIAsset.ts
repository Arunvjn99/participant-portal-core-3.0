import { useEffect, useState } from "react";
import { UI_ASSETS, type UIAssetKey } from "@/core/config/uiAssets";
import { getUIAssets, UI_ASSETS_UPDATED_EVENT } from "@/core/store/uiAssetsStore";

function resolveAssetUrl(key: UIAssetKey): string {
  const fromStore = getUIAssets()[key]?.trim() ?? "";
  if (fromStore) return fromStore;
  return (UI_ASSETS[key] as string)?.trim() ?? "";
}

/**
 * URL for a UI asset slot: localStorage override (from /ai-assets save) wins, then static {@link UI_ASSETS}.
 * Re-renders when {@link setUIAsset} dispatches {@link UI_ASSETS_UPDATED_EVENT}.
 */
export function useResolvedUIAsset(key: UIAssetKey): string {
  const [url, setUrl] = useState(() => resolveAssetUrl(key));

  useEffect(() => {
    const update = () => setUrl(resolveAssetUrl(key));
    update();
    window.addEventListener(UI_ASSETS_UPDATED_EVENT, update);
    return () => window.removeEventListener(UI_ASSETS_UPDATED_EVENT, update);
  }, [key]);

  return url;
}
