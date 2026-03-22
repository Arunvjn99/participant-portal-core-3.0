/**
 * Canonical style prefix for all product illustrations generated via /ai-assets.
 * Append preset context + user context before sending to an image model.
 */
export const ILLUSTRATION_STYLE_BASE =
  "3D soft illustration in modern fintech style, friendly human character interacting with financial elements like coins, charts, savings, rounded shapes, smooth surfaces, pastel color palette, soft diffused lighting, subtle realistic shadows, minimal clean composition, slight isometric perspective, high-quality render, isolated on transparent background, no background, high-quality 3D render, soft shadows, no background, transparent PNG, centered composition, no cropping, clean edges";

export type AssetPreset =
  | "dashboard-hero"
  | "enrollment"
  | "ai-assistant"
  | "empty-state";

export const ASSET_PRESET_OPTIONS: { value: AssetPreset; label: string }[] = [
  { value: "dashboard-hero", label: "Dashboard Hero" },
  { value: "enrollment", label: "Enrollment" },
  { value: "ai-assistant", label: "AI Assistant" },
  { value: "empty-state", label: "Empty State" },
];

/** Scene / layout hints per preset — concatenated after the style base. */
export const ASSET_PRESET_CONTEXT: Record<AssetPreset, string> = {
  "dashboard-hero":
    "Scene: wide horizontal hero composition, subject weighted to the right third, generous clear area on the left for marketing copy overlay, cinematic depth.",
  enrollment:
    "Scene: welcoming onboarding moment, clipboard or checklist motif, gentle forward momentum, optimistic mood.",
  "ai-assistant":
    "Scene: conversational AI companion, subtle holographic UI accents, spark or chat motif, trustworthy and approachable.",
  "empty-state":
    "Scene: calm minimal negative space, small centered focal illustration, suitable for empty list or no-data UI.",
};

/**
 * Builds the full prompt sent to the generator API (or mock).
 * @param userContext — e.g. "retirement planning", "investment growth"
 */
export function buildIllustrationPrompt(userContext: string, preset: AssetPreset): string {
  const trimmed = userContext.trim();
  const contextLine = trimmed.length > 0 ? ` Additional focus: ${trimmed}.` : "";
  return `${ILLUSTRATION_STYLE_BASE} ${ASSET_PRESET_CONTEXT[preset]}${contextLine}`;
}
