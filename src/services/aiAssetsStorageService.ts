import { supabase } from "@/lib/supabase";
import type { AssetPreset } from "@/core/ai-assets/illustrationPrompt";

/** Supabase Storage bucket for generated illustrations (create in dashboard + policies). */
export const AI_ASSETS_BUCKET = "ai-assets";

export interface UploadAiAssetResult {
  path: string;
  publicUrl: string;
}

/**
 * Uploads a PNG (or other image blob) to `ai-assets` bucket under `generated/{preset}/`.
 *
 * Dashboard setup (once per project):
 * - Storage → New bucket `ai-assets` (public if you need anonymous read of URLs)
 * - Policy: authenticated users can INSERT; public read optional for `getPublicUrl`
 */
export async function uploadAiAssetToSupabase(
  blob: Blob,
  preset: AssetPreset,
  fileBaseName?: string,
): Promise<UploadAiAssetResult> {
  if (!supabase) {
    throw new Error("Supabase not configured. Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY.");
  }

  const ext = blob.type.includes("webp") ? "webp" : blob.type.includes("jpeg") ? "jpg" : "png";
  const safeBase = (fileBaseName ?? `asset-${crypto.randomUUID().slice(0, 8)}`).replace(/[^a-zA-Z0-9-_]/g, "-");
  const path = `generated/${preset}/${Date.now()}-${safeBase}.${ext}`;

  const { error } = await supabase.storage.from(AI_ASSETS_BUCKET).upload(path, blob, {
    cacheControl: "3600",
    upsert: false,
    contentType: blob.type || "image/png",
  });

  if (error) {
    throw new Error(error.message || "Upload failed");
  }

  const { data } = supabase.storage.from(AI_ASSETS_BUCKET).getPublicUrl(path);
  if (!data?.publicUrl) {
    throw new Error("Could not resolve public URL for uploaded asset");
  }

  return { path, publicUrl: data.publicUrl };
}
