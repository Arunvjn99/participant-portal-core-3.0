import { useState, useMemo, useCallback, useRef, useEffect } from "react";
import { DashboardLayout } from "../../layouts/DashboardLayout";
import { DashboardHeader } from "../../components/dashboard/DashboardHeader";
import { useTheme } from "../../context/ThemeContext";
import { useUser } from "../../context/UserContext";
import {
  defaultBrandingFromColors,
  type BrandingState,
  type FontFamilyOption,
  type ThemeColorsForEditor,
} from "./theme-editor/types";
import type { ThemeColors } from "../../theme/utils";
import { generateDarkTheme } from "../../theme/utils";
import { serializeBranding } from "./theme-editor/serialization";
import { upsertCompanyBranding } from "../../services/companyBrandingService";
import { BrandColorsSection } from "./theme-editor/BrandColorsSection";
import { ExperienceControlsSection } from "./theme-editor/ExperienceControlsSection";
import { TypographySection } from "./theme-editor/TypographySection";
import { LivePreviewPanel } from "./theme-editor/LivePreviewPanel";
import { AdvancedJsonSection } from "./theme-editor/AdvancedJsonSection";

function stripLogoFromColors(colors: ThemeColors): ThemeColorsForEditor {
  const { logo: _logo, ...rest } = colors;
  return rest;
}

export const ThemeSettings = () => {
  const {
    currentColors,
    setCompanyBranding,
    setTemporaryTheme,
    clearTemporaryTheme,
    overrideTheme,
  } = useTheme();
  const { company, profile } = useUser();

  const canEditBranding =
    profile?.role === "admin" || profile?.role === "super_admin";

  const initialBranding = useMemo(
    () => defaultBrandingFromColors(currentColors),
    [currentColors],
  );

  const [branding, setBranding] = useState<BrandingState>(initialBranding);

  const [lastSavedSnapshot, setLastSavedSnapshot] = useState<string>("");
  const [saveStatus, setSaveStatus] = useState<"idle" | "success" | "error">("idle");
  const [saveErrorMessage, setSaveErrorMessage] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const snapshotInitialized = useRef(false);
  useEffect(() => {
    if (snapshotInitialized.current) return;
    snapshotInitialized.current = true;
    try {
      setLastSavedSnapshot(JSON.stringify(serializeBranding(initialBranding)));
    } catch {
      setLastSavedSnapshot(JSON.stringify(serializeBranding(branding)));
    }
  }, [initialBranding]);

  const serialized = useMemo(() => serializeBranding(branding), [branding]);
  const serializedString = JSON.stringify(serialized);
  const hasUnsavedChanges =
    lastSavedSnapshot !== "" && serializedString !== lastSavedSnapshot;

  const initialColorsForEditor = useMemo(
    () => stripLogoFromColors(currentColors),
    [currentColors],
  );

  const resetToCurrentTheme = useCallback(() => {
    setBranding(defaultBrandingFromColors(currentColors));
  }, [currentColors]);

  const jsonString = useMemo(
    () => JSON.stringify({ light: branding.colors }, null, 2),
    [branding.colors],
  );

  const updateMeta = useCallback(() => ({ lastModified: Date.now() }), []);

  const handleApplyFromJson = useCallback(
    (lightColors: ThemeColorsForEditor) => {
      const fontFamily: FontFamilyOption = ["Inter", "Open Sans", "Montserrat"].includes(lightColors.font)
        ? (lightColors.font as FontFamilyOption)
        : "System Default";
      setBranding((prev) => ({
        ...prev,
        colors: { ...lightColors },
        typography: { ...prev.typography, fontFamily },
        meta: updateMeta(),
      }));
    },
    [updateMeta],
  );

  const buildFullThemeFromBranding = useCallback((): { light: ThemeColors; dark: ThemeColors } => {
    const logoUrl = company?.logo_url?.trim() || "";
    const light: ThemeColors = { ...branding.colors, logo: logoUrl };
    const dark = generateDarkTheme(light);
    return { light, dark };
  }, [branding.colors, company?.logo_url]);

  const handlePreviewGlobally = useCallback(() => {
    const theme = buildFullThemeFromBranding();
    setTemporaryTheme(theme);
  }, [buildFullThemeFromBranding, setTemporaryTheme]);

  const handleResetPreview = useCallback(() => {
    clearTemporaryTheme();
  }, [clearTemporaryTheme]);

  const handleSaveBranding = useCallback(async () => {
    if (!hasUnsavedChanges || !company?.id || !canEditBranding) return;
    const payload = serializeBranding(branding);
    setSaveStatus("idle");
    setSaveErrorMessage(null);
    setSaving(true);
    const result = await upsertCompanyBranding(company.id, payload);
    setSaving(false);
    if (result) {
      setLastSavedSnapshot(JSON.stringify(payload));
      setSaveStatus("success");
      clearTemporaryTheme();
      const { light, dark } = buildFullThemeFromBranding();
      setCompanyBranding(company.name, { light, dark }, company.logo_url);
      setTimeout(() => setSaveStatus("idle"), 3000);
    } else {
      setSaveStatus("error");
      setSaveErrorMessage("Failed to save branding. Please try again.");
    }
  }, [branding, hasUnsavedChanges, company, canEditBranding, setCompanyBranding, clearTemporaryTheme, buildFullThemeFromBranding]);

  const isPreviewActive = overrideTheme !== null;

  return (
    <DashboardLayout header={<DashboardHeader />}>
      <div className="theme-settings-page">
        <header className="theme-settings-page__header">
          <h1 className="theme-settings-page__title">Brand & Experience Configuration</h1>
          <p className="theme-settings-page__description">
            Customize your company&apos;s visual identity and UI behavior.
          </p>
          <p className="theme-settings-page__note text-xs mt-2" style={{ color: "var(--color-text-secondary)" }}>
            Dark mode is auto-generated from light theme.
          </p>
          {!canEditBranding && (
            <div
              className="mt-3 rounded-lg border px-4 py-3 text-sm"
              style={{
                borderColor: "var(--color-warning)",
                background: "rgba(245, 158, 11, 0.1)",
                color: "var(--color-text)",
              }}
              role="alert"
            >
              You do not have permission to modify company branding. You can still preview changes.
            </div>
          )}
          {company?.name && (
            <p className="text-sm mt-1" style={{ color: "var(--color-text-secondary)" }}>
              Company: {company.name}
            </p>
          )}
        </header>

        <div className="theme-settings-page__layout">
          <div className="theme-settings-page__controls">
            {/* Status messages */}
            {isPreviewActive && (
              <div
                className="rounded-lg border px-4 py-3 text-sm"
                style={{
                  borderColor: "var(--color-primary)",
                  background: "rgba(0, 82, 204, 0.08)",
                  color: "var(--color-primary)",
                }}
                role="status"
              >
                Global preview is active. All pages reflect these colors. Refresh to discard.
              </div>
            )}
            {saveStatus === "success" && (
              <div
                className="rounded-lg border px-4 py-3 text-sm"
                style={{
                  borderColor: "var(--color-success)",
                  background: "rgba(22, 163, 74, 0.1)",
                  color: "var(--color-success)",
                }}
                role="status"
              >
                Branding saved successfully.
              </div>
            )}
            {saveStatus === "error" && saveErrorMessage && (
              <div
                className="rounded-lg border px-4 py-3 text-sm"
                style={{
                  borderColor: "var(--color-danger)",
                  background: "rgba(220, 38, 38, 0.08)",
                  color: "var(--color-danger)",
                }}
                role="alert"
              >
                {saveErrorMessage}
              </div>
            )}
            {hasUnsavedChanges && (
              <div
                className="theme-settings-page__unsaved"
                style={{
                  display: "inline-block",
                  padding: "6px 12px",
                  borderRadius: "8px",
                  background: "var(--color-warning)",
                  color: "#fff",
                  fontSize: "12px",
                  fontWeight: 600,
                }}
              >
                Unsaved Changes
              </div>
            )}

            <BrandColorsSection
              colors={branding.colors}
              initialColors={initialColorsForEditor}
              onChange={(colors) =>
                setBranding((p) => ({ ...p, colors, meta: updateMeta() }))
              }
            />

            <div className="theme-settings-page__divider" />

            <ExperienceControlsSection
              experience={branding.experience}
              onChange={(experience) =>
                setBranding((p) => ({ ...p, experience, meta: updateMeta() }))
              }
            />

            <div className="theme-settings-page__divider" />

            <TypographySection
              typography={branding.typography}
              onChange={(typography) => {
                const font = typography.fontFamily === "System Default" ? "system-ui" : typography.fontFamily;
                setBranding((p) => ({
                  ...p,
                  typography,
                  colors: { ...p.colors, font },
                  meta: updateMeta(),
                }));
              }}
            />

            <div className="theme-settings-page__divider" />

            <AdvancedJsonSection
              jsonValue={jsonString}
              onApplyFromJson={handleApplyFromJson}
            />

            <div className="theme-settings-page__divider" />

            {/* Action buttons */}
            <div className="theme-settings-page__actions flex flex-wrap gap-3 pt-4 items-center">
              <button
                type="button"
                onClick={handleSaveBranding}
                disabled={!hasUnsavedChanges || !canEditBranding || saving}
                className="rounded-lg px-5 py-2.5 text-sm font-semibold text-white transition-opacity hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
                style={{ background: "var(--color-primary)" }}
              >
                {saving ? "Saving\u2026" : "Save Branding"}
              </button>

              <button
                type="button"
                onClick={handlePreviewGlobally}
                className="rounded-lg border px-5 py-2.5 text-sm font-semibold transition-opacity hover:opacity-90"
                style={{
                  borderColor: "var(--color-primary)",
                  color: "var(--color-primary)",
                }}
              >
                Preview Globally
              </button>

              {isPreviewActive && (
                <button
                  type="button"
                  onClick={handleResetPreview}
                  className="rounded-lg border px-5 py-2.5 text-sm font-semibold transition-opacity hover:opacity-90"
                  style={{
                    borderColor: "var(--color-danger)",
                    color: "var(--color-danger)",
                  }}
                >
                  Reset Preview
                </button>
              )}

              <button
                type="button"
                onClick={resetToCurrentTheme}
                className="rounded-lg border px-5 py-2.5 text-sm font-semibold transition-opacity hover:opacity-90"
                style={{
                  borderColor: "var(--color-border)",
                  color: "var(--color-text)",
                }}
              >
                Reset to Current Theme
              </button>
            </div>
          </div>

          <aside className="theme-settings-page__preview">
            <LivePreviewPanel branding={branding} />
          </aside>
        </div>
      </div>

      <style>{`
        .theme-settings-page { max-width: 1400px; margin: 0 auto; padding: 0 1rem 2rem; }
        .theme-settings-page__header { margin-bottom: 1.5rem; }
        .theme-settings-page__title { font-size: 1.5rem; font-weight: 700; color: var(--color-text); }
        .theme-settings-page__description { margin-top: 0.25rem; font-size: 0.875rem; color: var(--color-text-secondary); }
        .theme-settings-page__note { opacity: 0.9; }
        .theme-settings-page__layout { display: grid; grid-template-columns: 1fr; gap: 1.5rem; }
        @media (min-width: 1024px) {
          .theme-settings-page__layout { grid-template-columns: 60% 1fr; align-items: start; }
        }
        .theme-settings-page__controls { min-width: 0; display: flex; flex-direction: column; gap: 1.25rem; }
        .theme-settings-page__preview { min-width: 0; }
        .theme-settings-page__divider { height: 1px; background: var(--color-border); margin: 0.25rem 0; }
      `}</style>
    </DashboardLayout>
  );
};
