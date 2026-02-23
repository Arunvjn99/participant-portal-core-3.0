import { useState, useCallback } from "react";
import { DashboardLayout } from "../../layouts/DashboardLayout";
import { DashboardHeader } from "../../components/dashboard/DashboardHeader";
import { useTheme } from "../../context/ThemeContext";
import { useUser } from "../../context/UserContext";
import { validateThemeJSON, generateDarkTheme } from "../../theme/utils";
import type { CompanyTheme, ThemeColors } from "../../theme/utils";

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
      logo: "https://example.com/logo.png",
    },
    dark: {},
  },
  null,
  2,
);

export const ThemeSettings = () => {
  const { company } = useUser();
  const { mode, companyTheme, setCompanyBranding, currentColors } = useTheme();

  const [jsonInput, setJsonInput] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [previewActive, setPreviewActive] = useState(false);
  const [savedThemeBackup, setSavedThemeBackup] = useState<CompanyTheme | null>(null);

  const currentJSON = JSON.stringify(
    { light: companyTheme.light, dark: companyTheme.dark },
    null,
    2,
  );

  const handleValidateAndPreview = useCallback(() => {
    setError(null);
    setSuccess(null);

    if (!jsonInput.trim()) {
      setError("Please paste or upload a theme JSON.");
      return;
    }

    let parsed: unknown;
    try {
      parsed = JSON.parse(jsonInput);
    } catch {
      setError("Invalid JSON syntax. Please check your input.");
      return;
    }

    const validationError = validateThemeJSON(parsed);
    if (validationError) {
      setError(validationError);
      return;
    }

    const obj = parsed as { light: ThemeColors; dark?: Partial<ThemeColors> };
    const light = obj.light;
    light.font = light.font || "Inter";
    light.logo = light.logo || "";

    const dark: ThemeColors =
      obj.dark && Object.keys(obj.dark).length > 2
        ? { ...generateDarkTheme(light), ...(obj.dark as ThemeColors) }
        : generateDarkTheme(light);

    if (!previewActive) {
      setSavedThemeBackup({ ...companyTheme });
    }

    setPreviewActive(true);
    setSuccess("Theme preview applied. Click 'Save' to keep or 'Revert' to undo.");

    setCompanyBranding("__preview__");
    const previewTheme: CompanyTheme = { light, dark };
    const colors = mode === "dark" ? previewTheme.dark : previewTheme.light;
    import("../../theme/utils").then(({ applyThemeToDOM }) => {
      applyThemeToDOM(colors);
    });
  }, [jsonInput, companyTheme, mode, previewActive, setCompanyBranding]);

  const handleRevert = useCallback(() => {
    if (savedThemeBackup) {
      const colors =
        mode === "dark" ? savedThemeBackup.dark : savedThemeBackup.light;
      import("../../theme/utils").then(({ applyThemeToDOM }) => {
        applyThemeToDOM(colors);
      });
    }
    setPreviewActive(false);
    setSuccess(null);
    setError(null);
  }, [savedThemeBackup, mode]);

  const handleSave = useCallback(() => {
    setPreviewActive(false);
    setSavedThemeBackup(null);
    setSuccess("Theme saved successfully. (DB persistence coming in Phase 2)");
  }, []);

  const handleFileUpload = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
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
          setJsonInput(text);
          setError(null);
        }
      };
      reader.readAsText(file);
    },
    [],
  );

  const handleLoadSample = useCallback(() => {
    setJsonInput(SAMPLE_JSON);
    setError(null);
  }, []);

  return (
    <DashboardLayout header={<DashboardHeader />}>
      <div className="space-y-8">
        <div>
          <h1 className="text-2xl font-bold" style={{ color: "var(--color-text)" }}>
            Theme Settings
          </h1>
          <p className="mt-1 text-sm" style={{ color: "var(--color-text-secondary)" }}>
            Customize your company branding and visual identity.
          </p>
        </div>

        {/* Current company info */}
        <section
          className="rounded-xl border p-6"
          style={{
            background: "var(--color-surface)",
            borderColor: "var(--color-border)",
          }}
        >
          <h2 className="text-lg font-semibold" style={{ color: "var(--color-text)" }}>
            Current Company
          </h2>
          <p className="mt-1 text-sm" style={{ color: "var(--color-text-secondary)" }}>
            {company?.name ?? "No company loaded"}
          </p>
          <div className="mt-4 flex items-center gap-4">
            <div
              className="h-10 w-10 rounded-lg"
              style={{ backgroundColor: currentColors.primary }}
            />
            <div
              className="h-10 w-10 rounded-lg"
              style={{ backgroundColor: currentColors.secondary }}
            />
            <div
              className="h-10 w-10 rounded-lg"
              style={{ backgroundColor: currentColors.accent }}
            />
            <span className="text-xs" style={{ color: "var(--color-text-secondary)" }}>
              Primary / Secondary / Accent
            </span>
          </div>
        </section>

        {/* Current theme JSON (read only) */}
        <section
          className="rounded-xl border p-6"
          style={{
            background: "var(--color-surface)",
            borderColor: "var(--color-border)",
          }}
        >
          <h2 className="text-lg font-semibold" style={{ color: "var(--color-text)" }}>
            Active Theme JSON
          </h2>
          <pre
            className="mt-3 max-h-64 overflow-auto rounded-lg p-4 text-xs"
            style={{
              background: "var(--color-background-secondary, #f9fafb)",
              color: "var(--color-text-secondary)",
            }}
          >
            {currentJSON}
          </pre>
        </section>

        {/* Upload / paste JSON */}
        <section
          className="rounded-xl border p-6"
          style={{
            background: "var(--color-surface)",
            borderColor: "var(--color-border)",
          }}
        >
          <h2 className="text-lg font-semibold" style={{ color: "var(--color-text)" }}>
            Upload Theme
          </h2>
          <p className="mt-1 text-sm" style={{ color: "var(--color-text-secondary)" }}>
            Paste a JSON theme or upload a .json file. Dark theme is auto-generated if omitted.
          </p>

          <div className="mt-4 flex flex-wrap gap-3">
            <label
              className="inline-flex cursor-pointer items-center gap-2 rounded-lg border px-4 py-2 text-sm font-medium transition-colors hover:opacity-80"
              style={{
                borderColor: "var(--color-border)",
                color: "var(--color-text)",
              }}
            >
              Upload .json
              <input
                type="file"
                accept=".json"
                className="hidden"
                onChange={handleFileUpload}
              />
            </label>
            <button
              type="button"
              onClick={handleLoadSample}
              className="rounded-lg px-4 py-2 text-sm font-medium transition-colors hover:opacity-80"
              style={{
                background: "var(--color-primary)",
                color: "#fff",
              }}
            >
              Load Sample
            </button>
          </div>

          <textarea
            className="mt-4 w-full rounded-lg border p-4 font-mono text-xs"
            style={{
              background: "var(--color-background)",
              borderColor: "var(--color-border)",
              color: "var(--color-text)",
              minHeight: 200,
            }}
            placeholder="Paste theme JSON here…"
            value={jsonInput}
            onChange={(e) => {
              setJsonInput(e.target.value);
              setError(null);
            }}
          />

          {error && (
            <div
              className="mt-3 rounded-lg border px-4 py-3 text-sm"
              style={{
                borderColor: "var(--color-danger)",
                color: "var(--color-danger)",
                background: "var(--color-danger)10",
              }}
              role="alert"
            >
              {error}
            </div>
          )}
          {success && (
            <div
              className="mt-3 rounded-lg border px-4 py-3 text-sm"
              style={{
                borderColor: "var(--color-success)",
                color: "var(--color-success)",
                background: "var(--color-success)10",
              }}
              role="status"
            >
              {success}
            </div>
          )}

          <div className="mt-4 flex flex-wrap gap-3">
            <button
              type="button"
              onClick={handleValidateAndPreview}
              className="rounded-lg px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:opacity-90"
              style={{ background: "var(--color-primary)" }}
            >
              Preview Theme
            </button>
            {previewActive && (
              <>
                <button
                  type="button"
                  onClick={handleSave}
                  className="rounded-lg px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:opacity-90"
                  style={{ background: "var(--color-success)" }}
                >
                  Save
                </button>
                <button
                  type="button"
                  onClick={handleRevert}
                  className="rounded-lg border px-5 py-2.5 text-sm font-semibold transition-colors hover:opacity-90"
                  style={{
                    borderColor: "var(--color-border)",
                    color: "var(--color-text)",
                  }}
                >
                  Revert
                </button>
              </>
            )}
          </div>
        </section>

        {/* Color palette preview */}
        <section
          className="rounded-xl border p-6"
          style={{
            background: "var(--color-surface)",
            borderColor: "var(--color-border)",
          }}
        >
          <h2 className="text-lg font-semibold" style={{ color: "var(--color-text)" }}>
            Color Palette
          </h2>
          <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
            {(
              [
                ["Primary", currentColors.primary],
                ["Secondary", currentColors.secondary],
                ["Accent", currentColors.accent],
                ["Background", currentColors.background],
                ["Surface", currentColors.surface],
                ["Text Primary", currentColors.textPrimary],
                ["Text Secondary", currentColors.textSecondary],
                ["Border", currentColors.border],
                ["Success", currentColors.success],
                ["Warning", currentColors.warning],
                ["Danger", currentColors.danger],
              ] as [string, string][]
            ).map(([label, color]) => (
              <div key={label} className="text-center">
                <div
                  className="mx-auto h-12 w-12 rounded-lg border"
                  style={{
                    backgroundColor: color,
                    borderColor: "var(--color-border)",
                  }}
                />
                <p
                  className="mt-1.5 text-xs font-medium"
                  style={{ color: "var(--color-text-secondary)" }}
                >
                  {label}
                </p>
                <p
                  className="text-[10px] font-mono"
                  style={{ color: "var(--color-text-tertiary, #9ca3af)" }}
                >
                  {color}
                </p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </DashboardLayout>
  );
};
