import type { TypographyState, FontFamilyOption, BaseFontSizeOption, HeadingScaleOption } from "./types";

interface TypographySectionProps {
  typography: TypographyState;
  onChange: (typography: TypographyState) => void;
}

const FONT_OPTIONS: { value: FontFamilyOption; label: string }[] = [
  { value: "Inter", label: "Inter" },
  { value: "Open Sans", label: "Open Sans" },
  { value: "Montserrat", label: "Montserrat" },
  { value: "System Default", label: "System Default" },
];

const FONT_SIZE_OPTIONS: { value: BaseFontSizeOption; label: string }[] = [
  { value: 14, label: "14px" },
  { value: 16, label: "16px" },
  { value: 18, label: "18px" },
];

const HEADING_SCALE_OPTIONS: { value: HeadingScaleOption; label: string }[] = [
  { value: "standard", label: "Standard" },
  { value: "large", label: "Large" },
];

export function TypographySection({ typography, onChange }: TypographySectionProps) {
  const update = (patch: Partial<TypographyState>) => onChange({ ...typography, ...patch });

  return (
    <section
      className="rounded-xl border p-5"
      style={{ background: "var(--color-surface)", borderColor: "var(--color-border)" }}
    >
      <h2 className="text-lg font-semibold mb-4" style={{ color: "var(--color-text)" }}>
        Typography
      </h2>

      <div className="space-y-6">
        <div>
          <label htmlFor="theme-editor-font" className="block text-sm font-medium mb-2" style={{ color: "var(--color-text)" }}>
            Font Family
          </label>
          <select
            id="theme-editor-font"
            value={typography.fontFamily}
            onChange={(e) => update({ fontFamily: e.target.value as FontFamilyOption })}
            className="w-full rounded-lg border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
            style={{
              background: "var(--color-background)",
              borderColor: "var(--color-border)",
              color: "var(--color-text)",
            }}
          >
            {FONT_OPTIONS.map(({ value, label }) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="theme-editor-base-size" className="block text-sm font-medium mb-2" style={{ color: "var(--color-text)" }}>
            Base Font Size
          </label>
          <select
            id="theme-editor-base-size"
            value={typography.baseFontSize}
            onChange={(e) => update({ baseFontSize: Number(e.target.value) as BaseFontSizeOption })}
            className="w-full rounded-lg border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
            style={{
              background: "var(--color-background)",
              borderColor: "var(--color-border)",
              color: "var(--color-text)",
            }}
          >
            {FONT_SIZE_OPTIONS.map(({ value, label }) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <span className="block text-sm font-medium mb-2" style={{ color: "var(--color-text)" }}>
            Heading Scale
          </span>
          <div className="flex flex-wrap gap-3" role="radiogroup" aria-label="Heading scale">
            {HEADING_SCALE_OPTIONS.map(({ value, label }) => (
              <label key={value} className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="headingScale"
                  value={value}
                  checked={typography.headingScale === value}
                  onChange={() => update({ headingScale: value })}
                  className="w-4 h-4 accent-[var(--color-primary)]"
                />
                <span className="text-sm" style={{ color: "var(--color-text)" }}>{label}</span>
              </label>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
