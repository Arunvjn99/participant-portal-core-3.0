import type { AssetPreset } from "@/core/ai-assets/illustrationPrompt";
import { buildIllustrationPrompt } from "@/core/ai-assets/illustrationPrompt";

export type { AssetPreset } from "@/core/ai-assets/illustrationPrompt";

export interface GeneratedImageResult {
  blob: Blob;
  /** Revoke with `URL.revokeObjectURL` when discarding the preview. */
  objectUrl: string;
  fullPrompt: string;
}

function wrapLines(ctx: CanvasRenderingContext2D, text: string, x: number, y: number, maxWidth: number, lineHeight: number): void {
  const words = text.split(/\s+/);
  let line = "";
  let yy = y;
  for (let i = 0; i < words.length; i++) {
    const test = line + words[i] + " ";
    if (ctx.measureText(test).width > maxWidth && line.length > 0) {
      ctx.fillText(line.trim(), x, yy);
      line = words[i] + " ";
      yy += lineHeight;
    } else {
      line = test;
    }
  }
  if (line.trim()) ctx.fillText(line.trim(), x, yy);
}

/**
 * Procedural canvas preview — fallback when the image API is unavailable or the request fails.
 */
export async function mockGenerateIllustration(fullPrompt: string): Promise<GeneratedImageResult> {
  const w = 1024;
  const h = 640;
  const canvas = document.createElement("canvas");
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Canvas 2D context unavailable");

  const tile = 14;
  ctx.fillStyle = "#e8eef7";
  ctx.fillRect(0, 0, w, h);
  ctx.fillStyle = "#f4f7fb";
  for (let y = 0; y < h; y += tile) {
    for (let x = 0; x < w; x += tile) {
      if (((x / tile) ^ (y / tile)) & 1) ctx.fillRect(x, y, tile, tile);
    }
  }

  const g = ctx.createRadialGradient(w * 0.72, h * 0.38, 20, w * 0.72, h * 0.38, 320);
  g.addColorStop(0, "rgba(125, 211, 252, 0.55)");
  g.addColorStop(0.45, "rgba(196, 181, 253, 0.25)");
  g.addColorStop(1, "rgba(255,255,255,0)");
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, w, h);

  ctx.fillStyle = "rgba(15, 23, 42, 0.08)";
  ctx.beginPath();
  ctx.roundRect(w * 0.48, h * 0.18, w * 0.44, h * 0.62, 28);
  ctx.fill();

  ctx.fillStyle = "#0f172a";
  ctx.font = "600 24px ui-sans-serif, system-ui, sans-serif";
  ctx.fillText("Internal preview (mock)", 36, 52);
  ctx.font = "13px ui-monospace, monospace";
  ctx.fillStyle = "#334155";
  const excerpt = fullPrompt.length > 420 ? `${fullPrompt.slice(0, 420)}…` : fullPrompt;
  wrapLines(ctx, excerpt, 36, 86, w * 0.42, 17);

  ctx.font = "11px ui-sans-serif, system-ui, sans-serif";
  ctx.fillStyle = "#64748b";
  ctx.fillText("OpenAI unavailable or request failed — mock output.", 36, h - 28);

  const blob: Blob | null = await new Promise((resolve) => canvas.toBlob(resolve, "image/png", 0.92));
  if (!blob) throw new Error("Failed to encode preview image");
  const objectUrl = URL.createObjectURL(blob);
  return { blob, objectUrl, fullPrompt };
}

/**
 * POSTs to `VITE_AI_IMAGE_GEN_URL` (Express proxy with OPENAI_API_KEY).
 * Falls back to {@link mockGenerateIllustration} when the URL is unset or the request fails.
 */
export async function generateIllustrationImage(fullPrompt: string): Promise<GeneratedImageResult> {
  const endpoint = (import.meta.env.VITE_AI_IMAGE_GEN_URL as string | undefined)?.trim();

  if (!endpoint) {
    if (import.meta.env.DEV) {
      console.warn("[aiImageService] VITE_AI_IMAGE_GEN_URL unset — using mock canvas preview.");
    }
    return mockGenerateIllustration(fullPrompt);
  }

  try {
    const res = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ prompt: fullPrompt }),
    });

    if (!res.ok) {
      const errText = await res.text().catch(() => "");
      throw new Error(`Image API ${res.status}${errText ? `: ${errText.slice(0, 120)}` : ""}`);
    }

    const contentType = res.headers.get("Content-Type") ?? "";
    if (!contentType.includes("image")) {
      const errText = await res.text().catch(() => "");
      throw new Error(errText.slice(0, 160) || "Expected image/png from image API");
    }

    const blob = await res.blob();
    if (!blob.size) throw new Error("Empty image from API");

    const objectUrl = URL.createObjectURL(blob);
    return { blob, objectUrl, fullPrompt };
  } catch (err) {
    if (import.meta.env.DEV) {
      console.warn("[aiImageService] Image generation failed, using mock:", err);
    }
    return mockGenerateIllustration(fullPrompt);
  }
}

export function composePromptForPreset(userContext: string, preset: AssetPreset): string {
  return buildIllustrationPrompt(userContext, preset);
}
