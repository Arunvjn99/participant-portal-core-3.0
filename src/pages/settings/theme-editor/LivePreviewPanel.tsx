import type { BrandingState } from "./types";

function getShadowCss(level: BrandingState["experience"]["shadowLevel"]): string {
  switch (level) {
    case "none":
      return "none";
    case "soft":
      return "0 1px 3px rgba(0,0,0,0.08)";
    case "elevated":
      return "0 4px 12px rgba(0,0,0,0.12)";
    default:
      return "0 1px 3px rgba(0,0,0,0.08)";
  }
}

function getDensityPadding(density: BrandingState["experience"]["density"]): string {
  switch (density) {
    case "compact":
      return "12px 16px";
    case "comfortable":
      return "16px 20px";
    case "spacious":
      return "20px 24px";
    default:
      return "16px 20px";
  }
}

function getFontFamily(font: BrandingState["typography"]["fontFamily"]): string {
  if (font === "System Default") return "system-ui, Avenir, Helvetica, Arial, sans-serif";
  return `"${font}", system-ui, sans-serif`;
}

interface LivePreviewPanelProps {
  branding: BrandingState;
}

export function LivePreviewPanel({ branding }: LivePreviewPanelProps) {
  const { colors, experience, typography } = branding;
  const cardRadius = experience.cardRadius;
  const buttonRadius = experience.buttonRadius;
  const shadow = getShadowCss(experience.shadowLevel);
  const densityPadding = getDensityPadding(experience.density);
  const fontFamily = getFontFamily(typography.fontFamily);
  const baseFontSize = typography.baseFontSize;
  const headingScale = typography.headingScale === "large" ? 1.35 : 1.2;

  const previewStyle: React.CSSProperties = {
    // Colors
    ["--preview-primary" as string]: colors.primary,
    ["--preview-secondary" as string]: colors.secondary,
    ["--preview-accent" as string]: colors.accent,
    ["--preview-background" as string]: colors.background,
    ["--preview-surface" as string]: colors.surface,
    ["--preview-text" as string]: colors.textPrimary,
    ["--preview-text-secondary" as string]: colors.textSecondary,
    ["--preview-border" as string]: colors.border,
    ["--preview-success" as string]: colors.success,
    ["--preview-warning" as string]: colors.warning,
    ["--preview-danger" as string]: colors.danger,
    // Typography
    fontFamily,
    fontSize: `${baseFontSize}px`,
    lineHeight: 1.5,
    color: colors.textPrimary,
    background: colors.background,
    padding: densityPadding,
    borderRadius: cardRadius,
    boxShadow: shadow,
  };

  return (
    <div
      className="rounded-xl border overflow-hidden lg:sticky lg:top-24"
      style={{
        background: "var(--color-surface)",
        borderColor: "var(--color-border)",
        boxShadow: "0 4px 20px rgba(0,0,0,0.06)",
      }}
    >
      <div className="px-4 py-3 border-b" style={{ borderColor: "var(--color-border)" }}>
        <h3 className="text-sm font-semibold" style={{ color: "var(--color-text)" }}>
          Live Preview
        </h3>
      </div>
      <div className="p-4 min-h-[360px]" style={{ background: colors.background }}>
        <div style={previewStyle} className="rounded-lg border space-y-4">
          {/* Mock header */}
          <div
            className="flex items-center justify-between rounded-lg border-b px-3 py-2"
            style={{
              borderColor: "var(--preview-border)",
              background: "var(--preview-surface)",
              borderRadius: `${buttonRadius}px ${buttonRadius}px 0 0`,
            }}
          >
            <span className="font-semibold" style={{ color: "var(--preview-text)", fontSize: `${Math.round(baseFontSize * 0.95)}px` }}>
              Dashboard
            </span>
            <span
              className="w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-semibold"
              style={{ background: colors.primary }}
            >
              U
            </span>
          </div>

          {/* Sample card */}
          <div
            className="rounded-lg border p-4"
            style={{
              background: colors.surface,
              borderColor: colors.border,
              borderRadius: `${cardRadius}px`,
              boxShadow: shadow,
            }}
          >
            <h4
              className="font-semibold mb-2"
              style={{ color: colors.textPrimary, fontSize: `${Math.round(baseFontSize * headingScale)}px` }}
            >
              Sample Card Title
            </h4>
            <p className="text-sm mb-4" style={{ color: colors.textSecondary }}>
              This is sample body text. The quick brown fox jumps over the lazy dog.
            </p>
            <div className="flex gap-2 flex-wrap">
              <button
                type="button"
                className="px-3 py-1.5 font-medium text-white rounded-md transition-opacity hover:opacity-90"
                style={{
                  background: colors.primary,
                  borderRadius: `${buttonRadius}px`,
                }}
              >
                Primary
              </button>
              <button
                type="button"
                className="px-3 py-1.5 font-medium rounded-md border transition-opacity hover:opacity-90"
                style={{
                  borderColor: colors.border,
                  color: colors.textPrimary,
                  background: colors.surface,
                  borderRadius: `${buttonRadius}px`,
                }}
              >
                Secondary
              </button>
            </div>
          </div>

          {/* Alert */}
          <div
            className="rounded-lg px-3 py-2 flex items-center gap-2"
            style={{
              background: `${colors.success}18`,
              border: `1px solid ${colors.success}40`,
              color: colors.success,
              borderRadius: `${buttonRadius}px`,
            }}
          >
            <span className="text-sm font-medium">Success message</span>
          </div>

          {/* Mini widget */}
          <div
            className="rounded-lg border p-3"
            style={{
              background: colors.surface,
              borderColor: colors.border,
              borderRadius: `${cardRadius}px`,
            }}
          >
            <p className="text-xs font-medium mb-1" style={{ color: colors.textSecondary }}>
              Mini Widget
            </p>
            <p className="text-sm font-semibold" style={{ color: colors.primary }}>
              $12,450
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
