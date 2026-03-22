import type { AssetPreset } from "@/core/ai-assets/illustrationPrompt";

export type UIAssets = {
  dashboardHero: string;
  enrollmentHero: string;
  aiAssistant: string;
  emptyState: string;
};

const STORAGE_KEY = "ui_assets";

export const UI_ASSETS_UPDATED_EVENT = "ui-assets-updated";

function defaultUIAssets(): UIAssets {
  return {
    dashboardHero: "",
    enrollmentHero: "",
    aiAssistant: "",
    emptyState: "",
  };
}

export function getUIAssets(): UIAssets {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return defaultUIAssets();
    const parsed = JSON.parse(stored) as Partial<UIAssets>;
    return { ...defaultUIAssets(), ...parsed };
  } catch {
    return defaultUIAssets();
  }
}

export function setUIAsset(key: keyof UIAssets, value: string) {
  const current = getUIAssets();
  const updated = { ...current, [key]: value };
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  window.dispatchEvent(new Event(UI_ASSETS_UPDATED_EVENT));
}

const ASSET_PRESET_TO_STORE_KEY: Record<AssetPreset, keyof UIAssets> = {
  "dashboard-hero": "dashboardHero",
  enrollment: "enrollmentHero",
  "ai-assistant": "aiAssistant",
  "empty-state": "emptyState",
};

export function assetPresetToStoreKey(preset: AssetPreset): keyof UIAssets {
  return ASSET_PRESET_TO_STORE_KEY[preset];
}
