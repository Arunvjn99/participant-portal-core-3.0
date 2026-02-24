import type { ThemeColorsForEditor } from "./types";
import { getContrastRatio, WCAG_AA_MIN_RATIO } from "./contrast";

const COLOR_KEYS: { key: keyof ThemeColorsForEditor; label: string; group: "core" | "semantic" | "surface" }[] = [
  { key: "primary", label: "Primary", group: "core" },
  { key: "secondary", label: "Secondary", group: "core" },
  { key: "accent", label: "Accent", group: "core" },
  { key: "success", label: "Success", group: "semantic" },
  { key: "warning", label: "Warning", group: "semantic" },
  { key: "danger", label: "Error", group: "semantic" },
  { key: "background", label: "Background", group: "surface" },
  { key: "surface", label: "Surface", group: "surface" },
  { key: "border", label: "Border", group: "surface" },
  { key: "textPrimary", label: "Text Primary", group: "surface" },
  { key: "textSecondary", label: "Text Secondary", group: "surface" },
];

const HEX_REGEX = /^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/;

function normalizeHex(value: string): string {
  const v = value.replace(/^#/, "").trim();
  if (v.length === 3) return `#${v[0]}${v[0]}${v[1]}${v[1]}${v[2]}${v[2]}`;
  if (v.length === 6) return `#${v}`;
  return value;
}

interface ColorRowProps {
  label: string;
  value: string;
  initialValue: string;
  onChange: (hex: string) => void;
  onReset: () => void;
  /** Show WCAG contrast warning when ratio vs background < 4.5 */
  showContrastWarning?: boolean;
}

function ColorRow({ label, value, initialValue, onChange, onReset, showContrastWarning }: ColorRowProps) {
  const hex = value.startsWith("#") ? value : `#${value}`;
  const isValid = HEX_REGEX.test(hex);
  const displayHex = hex;

  const handleHexChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value;
    if (raw === "") return;
    const normalized = normalizeHex(raw);
    if (HEX_REGEX.test(normalized)) onChange(normalized);
    else onChange(raw);
  };

  return (
    <div className="py-2">
      <div className="flex flex-wrap items-center gap-2">
        <label className="w-28 text-sm font-medium shrink-0" style={{ color: "var(--color-text)" }}>
          {label}
        </label>
        <input
          type="color"
          value={displayHex}
          onChange={(e) => onChange(e.target.value)}
          className="h-9 w-14 cursor-pointer rounded border shrink-0"
          style={{ borderColor: "var(--color-border)" }}
          aria-label={`${label} color picker`}
        />
        <input
          type="text"
          value={displayHex}
          onChange={handleHexChange}
          className="w-24 rounded-md border px-2 py-1.5 font-mono text-xs"
          style={{
            borderColor: isValid ? "var(--color-border)" : "var(--color-danger)",
            background: "var(--color-background)",
            color: "var(--color-text)",
          }}
          aria-label={`${label} hex value`}
        />
        <button
          type="button"
          onClick={onReset}
          className="text-xs font-medium px-2 py-1.5 rounded-md border transition-colors hover:opacity-90"
          style={{ borderColor: "var(--color-border)", color: "var(--color-text-secondary)" }}
          aria-label={`Reset ${label} to default`}
        >
          Reset
        </button>
      </div>
      {showContrastWarning && (
        <p
          className="mt-1 ml-0 text-xs"
          style={{ color: "var(--color-warning)" }}
          role="status"
        >
          May not meet WCAG AA contrast requirements.
        </p>
      )}
    </div>
  );
}

interface BrandColorsSectionProps {
  colors: ThemeColorsForEditor;
  initialColors: ThemeColorsForEditor;
  onChange: (colors: ThemeColorsForEditor) => void;
}

export function BrandColorsSection({ colors, initialColors, onChange }: BrandColorsSectionProps) {
  const update = (key: keyof ThemeColorsForEditor, value: string) => {
    onChange({ ...colors, [key]: value });
  };

  const background = colors.background;
  const primaryRatio = getContrastRatio(colors.primary, background);
  const textPrimaryRatio = getContrastRatio(colors.textPrimary, background);
  const primaryFailsWCAG = primaryRatio !== null && primaryRatio < WCAG_AA_MIN_RATIO;
  const textPrimaryFailsWCAG = textPrimaryRatio !== null && textPrimaryRatio < WCAG_AA_MIN_RATIO;

  const core = COLOR_KEYS.filter((c) => c.group === "core");
  const semantic = COLOR_KEYS.filter((c) => c.group === "semantic");
  const surface = COLOR_KEYS.filter((c) => c.group === "surface");

  const renderGroup = (title: string, items: typeof COLOR_KEYS) => (
    <div className="mb-6 last:mb-0">
      <h3 className="text-sm font-semibold mb-3" style={{ color: "var(--color-text-secondary)" }}>
        {title}
      </h3>
      <div className="space-y-0">
        {items.map(({ key, label }) => (
          <ColorRow
            key={key}
            label={label}
            value={colors[key]}
            initialValue={initialColors[key]}
            onChange={(v) => update(key, v)}
            onReset={() => update(key, initialColors[key])}
            showContrastWarning={
              (key === "primary" && primaryFailsWCAG) || (key === "textPrimary" && textPrimaryFailsWCAG)
            }
          />
        ))}
      </div>
    </div>
  );

  return (
    <section
      className="rounded-xl border p-5"
      style={{ background: "var(--color-surface)", borderColor: "var(--color-border)" }}
    >
      <h2 className="text-lg font-semibold mb-4" style={{ color: "var(--color-text)" }}>
        Brand Colors
      </h2>
      {renderGroup("Core Colors", core)}
      {renderGroup("Semantic Colors", semantic)}
      {renderGroup("Surface Colors", surface)}
    </section>
  );
}
