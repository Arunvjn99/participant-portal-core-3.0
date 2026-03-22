import { useCallback, useEffect, useRef, useState } from "react";
import type { AssetPreset } from "@/core/ai-assets/illustrationPrompt";
import { assetPresetToStoreKey, setUIAsset } from "@/core/store/uiAssetsStore";
import { composePromptForPreset, generateIllustrationImage } from "@/services/aiImageService";
import { uploadAiAssetToSupabase } from "@/services/aiAssetsStorageService";

export interface GeneratedAssetItem {
  id: string;
  preset: AssetPreset;
  fullPrompt: string;
  previewUrl: string;
  blob: Blob;
  savedUrl: string | null;
  saveError: string | null;
}

export interface UseGenerateImageResult {
  items: GeneratedAssetItem[];
  busy: boolean;
  error: string | null;
  savingId: string | null;
  generate: (userContext: string, preset: AssetPreset) => Promise<void>;
  saveToSupabase: (id: string) => Promise<string | null>;
  removeItem: (id: string) => void;
  clearError: () => void;
}

export function useGenerateImage(): UseGenerateImageResult {
  const [items, setItems] = useState<GeneratedAssetItem[]>([]);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [savingId, setSavingId] = useState<string | null>(null);
  const itemsRef = useRef<GeneratedAssetItem[]>([]);
  itemsRef.current = items;

  useEffect(
    () => () => {
      itemsRef.current.forEach((i) => URL.revokeObjectURL(i.previewUrl));
    },
    [],
  );

  const generate = useCallback(async (userContext: string, preset: AssetPreset) => {
    setBusy(true);
    setError(null);
    try {
      const fullPrompt = composePromptForPreset(userContext, preset);
      const { blob, objectUrl, fullPrompt: fp } = await generateIllustrationImage(fullPrompt);
      const id = crypto.randomUUID();
      setItems((prev) => [
        {
          id,
          preset,
          fullPrompt: fp,
          previewUrl: objectUrl,
          blob,
          savedUrl: null,
          saveError: null,
        },
        ...prev,
      ]);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Generation failed");
    } finally {
      setBusy(false);
    }
  }, []);

  const saveToSupabase = useCallback(async (id: string): Promise<string | null> => {
    const item = itemsRef.current.find((i) => i.id === id);
    if (!item) return null;
    setSavingId(id);
    setItems((prev) =>
      prev.map((i) => (i.id === id ? { ...i, saveError: null } : i)),
    );
    try {
      const { publicUrl } = await uploadAiAssetToSupabase(item.blob, item.preset);
      setUIAsset(assetPresetToStoreKey(item.preset), publicUrl);
      setItems((prev) =>
        prev.map((i) => (i.id === id ? { ...i, savedUrl: publicUrl, saveError: null } : i)),
      );
      return publicUrl;
    } catch (e) {
      const msg = e instanceof Error ? e.message : "Save failed";
      setItems((prev) =>
        prev.map((i) => (i.id === id ? { ...i, saveError: msg } : i)),
      );
      return null;
    } finally {
      setSavingId(null);
    }
  }, []);

  const removeItem = useCallback((id: string) => {
    setItems((prev) => {
      const found = prev.find((i) => i.id === id);
      if (found) URL.revokeObjectURL(found.previewUrl);
      return prev.filter((i) => i.id !== id);
    });
  }, []);

  const clearError = useCallback(() => setError(null), []);

  return {
    items,
    busy,
    error,
    savingId,
    generate,
    saveToSupabase,
    removeItem,
    clearError,
  };
}
