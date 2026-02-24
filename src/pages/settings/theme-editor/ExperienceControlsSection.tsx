import type { ExperienceState, ShadowLevel, LayoutDensity } from "./types";

interface ExperienceControlsSectionProps {
  experience: ExperienceState;
  onChange: (experience: ExperienceState) => void;
}

const SHADOW_OPTIONS: { value: ShadowLevel; label: string }[] = [
  { value: "none", label: "None" },
  { value: "soft", label: "Soft" },
  { value: "elevated", label: "Elevated" },
];

const DENSITY_OPTIONS: { value: LayoutDensity; label: string }[] = [
  { value: "compact", label: "Compact" },
  { value: "comfortable", label: "Comfortable" },
  { value: "spacious", label: "Spacious" },
];

export function ExperienceControlsSection({ experience, onChange }: ExperienceControlsSectionProps) {
  const update = (patch: Partial<ExperienceState>) => onChange({ ...experience, ...patch });

  return (
    <section
      className="rounded-xl border p-5"
      style={{ background: "var(--color-surface)", borderColor: "var(--color-border)" }}
    >
      <h2 className="text-lg font-semibold mb-4" style={{ color: "var(--color-text)" }}>
        Experience Controls
      </h2>

      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium mb-2" style={{ color: "var(--color-text)" }}>
            Card Radius ({experience.cardRadius}px)
          </label>
          <input
            type="range"
            min={0}
            max={24}
            value={experience.cardRadius}
            onChange={(e) => update({ cardRadius: Number(e.target.value) })}
            className="w-full h-2 rounded-full appearance-none cursor-pointer accent-[var(--color-primary)] transition-opacity duration-150"
            style={{ background: "var(--color-border)" }}
            aria-label="Card radius in pixels"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2" style={{ color: "var(--color-text)" }}>
            Button Radius ({experience.buttonRadius}px)
          </label>
          <input
            type="range"
            min={0}
            max={24}
            value={experience.buttonRadius}
            onChange={(e) => update({ buttonRadius: Number(e.target.value) })}
            className="w-full h-2 rounded-full appearance-none cursor-pointer accent-[var(--color-primary)] transition-opacity duration-150"
            style={{ background: "var(--color-border)" }}
            aria-label="Button radius in pixels"
          />
        </div>

        <div>
          <span className="block text-sm font-medium mb-2" style={{ color: "var(--color-text)" }}>
            Shadow Level
          </span>
          <div className="flex flex-wrap gap-3" role="radiogroup" aria-label="Shadow level">
            {SHADOW_OPTIONS.map(({ value, label }) => (
              <label key={value} className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="shadowLevel"
                  value={value}
                  checked={experience.shadowLevel === value}
                  onChange={() => update({ shadowLevel: value })}
                  className="w-4 h-4 accent-[var(--color-primary)]"
                />
                <span className="text-sm" style={{ color: "var(--color-text)" }}>{label}</span>
              </label>
            ))}
          </div>
        </div>

        <div>
          <span className="block text-sm font-medium mb-2" style={{ color: "var(--color-text)" }}>
            Layout Density
          </span>
          <div className="flex flex-wrap gap-3" role="radiogroup" aria-label="Layout density">
            {DENSITY_OPTIONS.map(({ value, label }) => (
              <label key={value} className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="density"
                  value={value}
                  checked={experience.density === value}
                  onChange={() => update({ density: value })}
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
