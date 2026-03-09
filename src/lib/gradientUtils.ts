/**
 * Returns a gradient CSS value derived from the primary theme color.
 * Used by GradientHeader and other wizard UI.
 */
export function getPrimaryGradient(): string {
  return "linear-gradient(135deg, var(--brand-primary) 0%, var(--brand-hover, var(--brand-primary)) 50%, var(--brand-active, var(--brand-primary)) 100%)";
}
