import { useState, useCallback, useEffect } from "react";
import { validateThemeJSON } from "../../../theme/utils";
import type { ThemeColors } from "../../../theme/utils";
import type { ThemeColorsForEditor } from "./types";
import { Collapsible } from "./Collapsible";

const SAMPLE_JSON = JSON.stringify(
  {
    light: {
      primary: "#0052CC",
      secondary: "#E6F0FF",
      accent: "#00C853",
      background: "#FFFFFF",
      surface: "#F8FAFC",
      textPrimary: "#111827",
      textSecondary: "#6B7280",
      border: "#E5E7EB",
      success: "#16A34A",
      warning: "#F59E0B",
      danger: "#DC2626",
      font: "Inter",
    },
    dark: "AUTO_GENERATED",
  },
  null,
  2,
);

interface AdvancedJsonSectionProps {
  /** Current JSON string (synced from visual editor) */
  jsonValue: string;
  /** When user edits JSON and applies, pass parsed light colors (no logo) */
  onApplyFromJson: (lightColors: ThemeColorsForEditor) => void;
  /** Call when JSON string is updated (for controlled input) */
  onJsonChange?: (value: string) => void;
}

export function AdvancedJsonSection({
  jsonValue,
  onApplyFromJson,
  onJsonChange,
}: AdvancedJsonSectionProps) {
  const [localValue, setLocalValue] = useState(jsonValue);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLocalValue(jsonValue);
  }, [jsonValue]);

  const isControlled = onJsonChange !== undefined;
  const value = isControlled ? jsonValue : localValue;

  const handleValidateAndApply = useCallback(() => {
    setError(null);
    const raw = value.trim();
    if (!raw) {
      setError("Please paste or enter theme JSON.");
      return;
    }
    let parsed: unknown;
    try {
      parsed = JSON.parse(raw);
    } catch (err) {
      if (import.meta.env.DEV) console.error("[AdvancedJsonSection] JSON parse failed:", err);
      setError("Invalid JSON syntax. Please check your input.");
      return;
    }
    const obj = parsed as { light: Record<string, unknown>; dark?: unknown };
    const lightRaw = obj.light;
    if (!lightRaw || typeof lightRaw !== "object") {
      setError('Theme must contain a "light" object.');
      return;
    }
    const lightWithLogo: ThemeColors = {
      primary: String(lightRaw.primary ?? "#000000"),
      secondary: String(lightRaw.secondary ?? "#ffffff"),
      accent: String(lightRaw.accent ?? "#000000"),
      background: String(lightRaw.background ?? "#ffffff"),
      surface: String(lightRaw.surface ?? "#ffffff"),
      textPrimary: String(lightRaw.textPrimary ?? "#000000"),
      textSecondary: String(lightRaw.textSecondary ?? "#666666"),
      border: String(lightRaw.border ?? "#e5e7eb"),
      success: String(lightRaw.success ?? "#16a34a"),
      warning: String(lightRaw.warning ?? "#f59e0b"),
      danger: String(lightRaw.danger ?? "#dc2626"),
      font: String(lightRaw.font ?? "Inter"),
      logo: "",
    };
    const validationError = validateThemeJSON({ light: lightWithLogo, dark: {} });
    if (validationError) {
      setError(validationError);
      return;
    }
    const { logo: _logo, ...lightForEditor } = lightWithLogo;
    onApplyFromJson(lightForEditor as ThemeColorsForEditor);
  }, [value, onApplyFromJson]);

  const handleFileUpload = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.name.endsWith(".json")) {
      setError("Please upload a .json file.");
      return;
    }
    const reader = new FileReader();
    reader.onload = (ev) => {
      const text = ev.target?.result;
      if (typeof text === "string") {
        setLocalValue(text);
        if (onJsonChange) onJsonChange(text);
        setError(null);
      }
    };
    reader.readAsText(file);
  }, [onJsonChange]);

  const handleLoadSample = useCallback(() => {
    setLocalValue(SAMPLE_JSON);
    if (onJsonChange) onJsonChange(SAMPLE_JSON);
    setError(null);
  }, [onJsonChange]);

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const v = e.target.value;
    if (!isControlled) setLocalValue(v);
    onJsonChange?.(v);
    setError(null);
  };

  return (
    <Collapsible title="Advanced Theme JSON" defaultOpen={false} aria-label="Advanced theme JSON editor">
      <p className="text-sm mb-4" style={{ color: "var(--color-text-secondary)" }}>
        Paste a JSON theme or upload a .json file. Dark theme is auto-generated if omitted.
      </p>
      <div className="flex flex-wrap gap-3 mb-3">
        <label
          className="inline-flex cursor-pointer items-center gap-2 rounded-lg border px-4 py-2 text-sm font-medium transition-colors hover:opacity-80"
          style={{ borderColor: "var(--color-border)", color: "var(--color-text)" }}
        >
          Upload .json
          <input type="file" accept=".json" className="hidden" onChange={handleFileUpload} />
        </label>
        <button
          type="button"
          onClick={handleLoadSample}
          className="rounded-lg px-4 py-2 text-sm font-medium transition-colors hover:opacity-80"
          style={{ background: "var(--color-primary)", color: "var(--color-text-inverse)" }}
        >
          Load Sample
        </button>
        <button
          type="button"
          onClick={handleValidateAndApply}
          className="rounded-lg border px-4 py-2 text-sm font-medium transition-colors hover:opacity-80"
          style={{ borderColor: "var(--color-primary)", color: "var(--color-primary)" }}
        >
          Apply to editor
        </button>
      </div>
      <textarea
        className="w-full rounded-lg border p-4 font-mono text-xs min-h-[200px] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
        style={{
          background: "var(--color-background)",
          borderColor: error ? "var(--color-danger)" : "var(--color-border)",
          color: "var(--color-text)",
        }}
        placeholder='{ "light": { "primary": "#0052CC", ... } }'
        value={value}
        onChange={handleTextChange}
        aria-label="Theme JSON"
        aria-invalid={!!error}
      />
      {error && (
        <div
          className="mt-3 rounded-lg border px-4 py-3 text-sm"
          style={{
            borderColor: "var(--color-danger)",
            color: "var(--color-danger)",
            background: "rgb(var(--color-danger-rgb) / 0.08)",
          }}
          role="alert"
        >
          {error}
        </div>
      )}
    </Collapsible>
  );
}
