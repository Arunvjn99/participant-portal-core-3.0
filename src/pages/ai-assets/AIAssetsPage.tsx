import { useState } from "react";
import { Link } from "react-router-dom";
import { Copy, Loader2, Trash2, Upload } from "lucide-react";
import Button from "@/components/ui/Button";
import { ASSET_PRESET_OPTIONS, ILLUSTRATION_STYLE_BASE } from "@/core/ai-assets/illustrationPrompt";
import type { AssetPreset } from "@/core/ai-assets/illustrationPrompt";
import { useGenerateImage } from "@/hooks/useGenerateImage";
import { isSupabaseConfigured } from "@/lib/supabase";
import { AI_ASSETS_BUCKET } from "@/services/aiAssetsStorageService";

export function AIAssetsPage() {
  const [userContext, setUserContext] = useState("");
  const [preset, setPreset] = useState<AssetPreset>("dashboard-hero");
  const [copiedUrl, setCopiedUrl] = useState<string | null>(null);
  const { items, busy, error, savingId, generate, saveToSupabase, removeItem, clearError } =
    useGenerateImage();

  const supabaseReady = isSupabaseConfigured();

  const handleCopy = async (url: string) => {
    try {
      await navigator.clipboard.writeText(url);
      setCopiedUrl(url);
      setTimeout(() => setCopiedUrl((u) => (u === url ? null : u)), 2000);
    } catch {
      setCopiedUrl(null);
    }
  };

  return (
    <div className="min-h-screen bg-[var(--color-background)] text-[var(--color-text)]">
      <header className="border-b border-[var(--color-border)] bg-[var(--color-background)]/90 backdrop-blur-sm">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 px-4 py-4 sm:px-6">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-[var(--color-textSecondary)]">
              Internal tool
            </p>
            <h1 className="text-xl font-bold text-[var(--color-text)]">AI asset generator</h1>
          </div>
          <Link
            to="/v1/dashboard"
            className="text-sm font-medium text-[var(--color-primary)] hover:underline"
          >
            ← Back to dashboard
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
        <p className="mb-6 max-w-3xl text-sm leading-relaxed text-[var(--color-textSecondary)]">
          Generate 3D-style illustration prompts and previews. Set{" "}
          <code className="rounded bg-[var(--color-surface)] px-1.5 py-0.5 text-xs">
            OPENAI_API_KEY
          </code>{" "}
          in <code className="rounded px-1 text-xs">server/.env</code> and{" "}
          <code className="rounded bg-[var(--color-surface)] px-1.5 py-0.5 text-xs">
            VITE_AI_IMAGE_GEN_URL
          </code>{" "}
          (e.g. <code className="rounded px-1 text-xs">http://localhost:3001/api/generate-image</code>) to call OpenAI{" "}
          <code className="rounded px-1 text-xs">gpt-image-1</code> via the API server; if the URL is unset or the request
          fails, a mock canvas preview is used. Save outputs to Supabase Storage bucket{" "}
          <code className="rounded bg-[var(--color-surface)] px-1.5 py-0.5 text-xs">{AI_ASSETS_BUCKET}</code>
          . After a successful save, the public URL is stored in{" "}
          <code className="rounded px-1 text-xs">localStorage</code> and the matching UI (dashboard hero, enrollment card,
          Core AI FAB, empty state) updates automatically. You can still paste URLs into{" "}
          <code className="rounded bg-[var(--color-surface)] px-1.5 py-0.5 text-xs">uiAssets.ts</code> for defaults or
          shipping without local overrides.
        </p>

        <section className="mb-10 rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-5 shadow-sm md:p-6">
          <h2 className="mb-4 text-sm font-semibold text-[var(--color-text)]">Style prefix (fixed)</h2>
          <p className="mb-6 rounded-lg bg-[var(--color-background-secondary)] p-3 text-xs leading-relaxed text-[var(--color-textSecondary)]">
            {ILLUSTRATION_STYLE_BASE}
          </p>

          <div className="grid gap-4 md:grid-cols-2">
            <label className="flex flex-col gap-2">
              <span className="text-sm font-medium text-[var(--color-text)]">Context (optional)</span>
              <input
                type="text"
                value={userContext}
                onChange={(e) => setUserContext(e.target.value)}
                placeholder="e.g. retirement planning, investment growth, AI assistant"
                className="rounded-xl border border-[var(--color-border)] bg-[var(--color-background)] px-3 py-2.5 text-sm outline-none ring-[var(--color-primary)] focus:ring-2"
              />
            </label>
            <label className="flex flex-col gap-2">
              <span className="text-sm font-medium text-[var(--color-text)]">Preset</span>
              <select
                value={preset}
                onChange={(e) => setPreset(e.target.value as AssetPreset)}
                className="rounded-xl border border-[var(--color-border)] bg-[var(--color-background)] px-3 py-2.5 text-sm outline-none ring-[var(--color-primary)] focus:ring-2"
              >
                {ASSET_PRESET_OPTIONS.map((o) => (
                  <option key={o.value} value={o.value}>
                    {o.label}
                  </option>
                ))}
              </select>
            </label>
          </div>

          <div className="mt-6 flex flex-wrap items-center gap-3">
            <Button
              className="rounded-xl bg-[var(--color-primary)] px-5 py-2.5 font-semibold text-white disabled:opacity-50"
              disabled={busy}
              onClick={() => void generate(userContext, preset)}
            >
              {busy ? (
                <span className="inline-flex items-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
                  Generating…
                </span>
              ) : (
                "Generate"
              )}
            </Button>
            {!supabaseReady && (
              <span className="text-xs text-amber-600 dark:text-amber-400">
                Supabase not configured — Save will fail until env is set.
              </span>
            )}
          </div>

          {error && (
            <div
              role="alert"
              className="mt-4 flex items-center justify-between gap-2 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-800 dark:border-red-900/40 dark:bg-red-950/30 dark:text-red-200"
            >
              <span>{error}</span>
              <button type="button" className="shrink-0 text-red-700 underline dark:text-red-300" onClick={clearError}>
                Dismiss
              </button>
            </div>
          )}
        </section>

        <section>
          <h2 className="mb-4 text-lg font-semibold text-[var(--color-text)]">Gallery</h2>
          {items.length === 0 ? (
            <p className="rounded-xl border border-dashed border-[var(--color-border)] py-12 text-center text-sm text-[var(--color-textSecondary)]">
              No previews yet. Choose a preset and click Generate.
            </p>
          ) : (
            <ul className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {items.map((item) => (
                <li
                  key={item.id}
                  className="flex flex-col overflow-hidden rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] shadow-md"
                >
                  <div className="relative aspect-[4/3] bg-[var(--color-background-secondary)]">
                    <img
                      src={item.previewUrl}
                      alt=""
                      className="h-full w-full object-contain"
                    />
                  </div>
                  <div className="flex flex-1 flex-col gap-2 p-3">
                    <p className="text-xs font-medium text-[var(--color-textSecondary)]">
                      {ASSET_PRESET_OPTIONS.find((o) => o.value === item.preset)?.label ?? item.preset}
                    </p>
                    <details className="text-xs text-[var(--color-textSecondary)]">
                      <summary className="cursor-pointer font-medium text-[var(--color-text)]">Full prompt</summary>
                      <p className="mt-1 max-h-24 overflow-y-auto whitespace-pre-wrap">{item.fullPrompt}</p>
                    </details>
                    <div className="mt-auto flex flex-wrap gap-2 pt-2">
                      <Button
                        className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-lg border border-[var(--color-border)] bg-[var(--color-background)] px-2 py-2 text-xs font-medium"
                        onClick={() => removeItem(item.id)}
                      >
                        <Trash2 className="h-3.5 w-3.5" aria-hidden />
                        Remove
                      </Button>
                      <Button
                        className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-lg bg-[var(--color-primary)] px-2 py-2 text-xs font-semibold text-white disabled:opacity-50"
                        disabled={!supabaseReady || savingId === item.id}
                        onClick={() => void saveToSupabase(item.id)}
                      >
                        {savingId === item.id ? (
                          <Loader2 className="h-3.5 w-3.5 animate-spin" aria-hidden />
                        ) : (
                          <Upload className="h-3.5 w-3.5" aria-hidden />
                        )}
                        Save to Supabase
                      </Button>
                    </div>
                    {item.saveError && (
                      <p className="text-xs text-red-600 dark:text-red-400">{item.saveError}</p>
                    )}
                    {item.savedUrl && (
                      <div className="rounded-lg bg-[var(--color-background-secondary)] p-2">
                        <p className="mb-1 text-[10px] font-semibold uppercase tracking-wide text-[var(--color-textSecondary)]">
                          Public URL (applied to UI automatically; copy for uiAssets.ts if needed)
                        </p>
                        <div className="flex gap-1">
                          <input
                            readOnly
                            value={item.savedUrl}
                            className="min-w-0 flex-1 truncate rounded border border-[var(--color-border)] bg-[var(--color-background)] px-2 py-1 text-[11px]"
                          />
                          <button
                            type="button"
                            className="shrink-0 rounded border border-[var(--color-border)] p-1.5 hover:bg-[var(--color-background)]"
                            aria-label="Copy URL"
                            onClick={() => void handleCopy(item.savedUrl!)}
                          >
                            <Copy className="h-3.5 w-3.5" />
                          </button>
                        </div>
                        {copiedUrl === item.savedUrl && (
                          <p className="mt-1 text-[10px] text-green-600 dark:text-green-400">Copied</p>
                        )}
                      </div>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          )}
        </section>
      </main>
    </div>
  );
}
