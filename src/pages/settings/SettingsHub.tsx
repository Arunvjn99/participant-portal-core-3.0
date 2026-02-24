import { useState } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { DashboardLayout } from "../../layouts/DashboardLayout";
import { DashboardHeader } from "../../components/dashboard/DashboardHeader";
import { DashboardCard } from "../../components/dashboard/DashboardCard";
import { useTheme } from "../../context/ThemeContext";
import { useAISettings } from "../../context/AISettingsContext";
import { SUPPORTED_LANGS, normalizeLanguage } from "../../constants/locales";
import { Switch } from "../../components/ui/Switch";

export type SettingsSection =
  | "appearance"
  | "ai-preferences"
  | "notifications"
  | "documents";

const SETTINGS_SECTION_KEYS: Record<SettingsSection, string> = {
  appearance: "settings.sections.appearance",
  "ai-preferences": "settings.sections.aiPreferences",
  notifications: "settings.sections.notifications",
  documents: "settings.sections.documents",
};

const SETTINGS_SECTIONS: SettingsSection[] = [
  "appearance",
  "ai-preferences",
  "notifications",
  "documents",
];

export const SettingsHub = () => {
  const { t, i18n } = useTranslation();
  const [activeSection, setActiveSection] = useState<SettingsSection>("appearance");
  const { mode, setMode } = useTheme();
  const { coreAIEnabled, insightsEnabled, setCoreAIEnabled, setInsightsEnabled } = useAISettings();

  const currentLang = normalizeLanguage(i18n.language ?? "en");

  const handleLanguageChange = (code: string) => {
    i18n.changeLanguage(code);
  };

  const renderContent = () => {
    switch (activeSection) {
      case "appearance": {
        return (
          <div className="space-y-8">
            <div>
              <h2 className="text-xl font-semibold" style={{ color: "var(--color-text)" }}>
                {t("settings.appearance.title")}
              </h2>
              <p className="mt-1 text-sm" style={{ color: "var(--color-text-secondary)" }}>
                {t("settings.appearance.subtitle")}
              </p>
            </div>

            {/* Theme: Light / Dark / System */}
            <section
              className="rounded-xl border p-6"
              style={{
                background: "var(--color-surface)",
                borderColor: "var(--color-border)",
              }}
            >
              <h3 className="text-base font-semibold" style={{ color: "var(--color-text)" }}>
                {t("settings.appearance.themeLabel")}
              </h3>
              <p className="mt-1 text-sm" style={{ color: "var(--color-text-secondary)" }}>
                {t("settings.appearance.themeHint")}
              </p>
              <div className="mt-4 flex flex-wrap gap-3">
                {(["light", "dark", "system"] as const).map((m) => (
                  <button
                    key={m}
                    type="button"
                    onClick={() => setMode(m)}
                    aria-pressed={mode === m}
                    className="rounded-lg border-2 px-4 py-2.5 text-sm font-medium transition-all"
                    style={{
                      borderColor: mode === m ? "var(--color-primary)" : "var(--color-border)",
                      background: mode === m ? "rgb(var(--color-primary-rgb, 0 82 204) / 0.08)" : "transparent",
                      color: mode === m ? "var(--color-primary)" : "var(--color-text)",
                    }}
                  >
                    {t(`settings.appearance.theme.${m}`)}
                  </button>
                ))}
              </div>
            </section>

            {/* Language */}
            <section
              className="rounded-xl border p-6"
              style={{
                background: "var(--color-surface)",
                borderColor: "var(--color-border)",
              }}
            >
              <h3 className="text-base font-semibold" style={{ color: "var(--color-text)" }}>
                {t("settings.appearance.languageLabel")}
              </h3>
              <p className="mt-1 text-sm" style={{ color: "var(--color-text-secondary)" }}>
                {t("settings.appearance.languageHint")}
              </p>
              <div className="mt-4">
                <select
                  value={currentLang}
                  onChange={(e) => handleLanguageChange(e.target.value)}
                  aria-label={t("settings.appearance.languageLabel")}
                  className="w-full max-w-xs rounded-lg border px-4 py-2.5 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
                  style={{
                    background: "var(--color-background)",
                    borderColor: "var(--color-border)",
                    color: "var(--color-text)",
                  }}
                >
                  {SUPPORTED_LANGS.map(({ code, labelKey }) => (
                    <option key={code} value={code}>
                      {t(labelKey)}
                    </option>
                  ))}
                </select>
              </div>
            </section>

            {/* Accent color placeholder */}
            <section
              className="rounded-xl border p-6"
              style={{
                background: "var(--color-surface)",
                borderColor: "var(--color-border)",
              }}
            >
              <h3 className="text-base font-semibold" style={{ color: "var(--color-text)" }}>
                {t("settings.appearance.accentLabel")}
              </h3>
              <p className="mt-1 text-sm" style={{ color: "var(--color-text-secondary)" }}>
                {t("settings.appearance.accentHint")}
              </p>
              <div className="mt-4 flex items-center gap-3 rounded-lg border p-4" style={{ borderColor: "var(--color-border)" }}>
                <div
                  className="h-10 w-10 shrink-0 rounded-lg border"
                  style={{ backgroundColor: "var(--color-primary)", borderColor: "var(--color-border)" }}
                />
                <span className="text-sm" style={{ color: "var(--color-text-secondary)" }}>
                  {t("settings.appearance.accentPlaceholder")}
                </span>
              </div>
            </section>

            {/* Link to full theme customization */}
            <section>
              <Link
                to="/settings/theme"
                className="inline-flex items-center gap-2 text-sm font-medium transition-colors hover:opacity-90"
                style={{ color: "var(--color-primary)" }}
              >
                {t("settings.appearance.customizeThemeLink")}
                <span aria-hidden>→</span>
              </Link>
            </section>
          </div>
        );
      }

      case "ai-preferences": {
        return (
          <div className="space-y-8">
            <div>
              <h2 className="text-xl font-semibold" style={{ color: "var(--color-text)" }}>
                {t("settings.ai.title")}
              </h2>
              <p className="mt-1 text-sm" style={{ color: "var(--color-text-secondary)" }}>
                {t("settings.ai.subtitle")}
              </p>
            </div>

            <section
              className="rounded-xl border p-6"
              style={{
                background: "var(--color-surface)",
                borderColor: "var(--color-border)",
              }}
            >
              <div className="space-y-6">
                <Switch
                  checked={coreAIEnabled}
                  onCheckedChange={setCoreAIEnabled}
                  label={t("settings.ai.coreAILabel")}
                  description={t("settings.ai.coreAIHint")}
                  aria-label={t("settings.ai.coreAILabel")}
                />
                <Switch
                  checked={insightsEnabled}
                  onCheckedChange={setInsightsEnabled}
                  label={t("settings.ai.insightsLabel")}
                  description={t("settings.ai.insightsHint")}
                  aria-label={t("settings.ai.insightsLabel")}
                />
              </div>
            </section>
          </div>
        );
      }

      case "notifications": {
        return (
          <div className="space-y-8">
            <div>
              <h2 className="text-xl font-semibold" style={{ color: "var(--color-text)" }}>
                {t("settings.sections.notifications")}
              </h2>
            </div>
            <section
              className="rounded-xl border border-dashed p-8 text-center"
              style={{
                background: "var(--color-surface)",
                borderColor: "var(--color-border)",
              }}
            >
              <p className="text-sm font-medium" style={{ color: "var(--color-text-secondary)" }}>
                {t("settings.notifications.comingSoon")}
              </p>
            </section>
          </div>
        );
      }

      case "documents": {
        return (
          <div className="space-y-8">
            <div>
              <h2 className="text-xl font-semibold" style={{ color: "var(--color-text)" }}>
                {t("settings.sections.documents")}
              </h2>
            </div>
            <section
              className="rounded-xl border p-6"
              style={{
                background: "var(--color-surface)",
                borderColor: "var(--color-border)",
              }}
            >
              <ul className="space-y-2" role="list">
                <li>
                  <span className="text-sm" style={{ color: "var(--color-text-secondary)" }}>
                    {t("settings.documents.placeholder1")}
                  </span>
                </li>
                <li>
                  <span className="text-sm" style={{ color: "var(--color-text-secondary)" }}>
                    {t("settings.documents.placeholder2")}
                  </span>
                </li>
                <li>
                  <span className="text-sm" style={{ color: "var(--color-text-secondary)" }}>
                    {t("settings.documents.placeholder3")}
                  </span>
                </li>
              </ul>
            </section>
          </div>
        );
      }

      default:
        return null;
    }
  };

  return (
    <DashboardLayout header={<DashboardHeader />}>
      <div className="settings-page">
        <div className="settings-page__header">
          <h1 className="settings-page__title">{t("settings.pageTitle")}</h1>
          <p className="settings-page__description">{t("settings.pageDescription")}</p>
        </div>

        <div className="settings-page__content">
          <nav
            className="settings-page__navigation"
            aria-label={t("settings.sectionsAria")}
          >
            <DashboardCard>
              <ul className="flex flex-col gap-0.5">
                {SETTINGS_SECTIONS.map((sectionId) => (
                  <li key={sectionId}>
                    <button
                      type="button"
                      onClick={() => setActiveSection(sectionId)}
                      className={`settings-navigation__item w-full rounded-lg px-3 py-2.5 text-left text-sm font-medium transition-colors ${
                        activeSection === sectionId ? "settings-navigation__item--active" : ""
                      }`}
                      style={
                        activeSection === sectionId
                          ? { color: "var(--color-primary)", background: "rgb(var(--color-primary-rgb, 0 82 204) / 0.08)" }
                          : { color: "var(--color-text)" }
                      }
                      aria-current={activeSection === sectionId ? "page" : undefined}
                    >
                      {t(SETTINGS_SECTION_KEYS[sectionId])}
                    </button>
                  </li>
                ))}
              </ul>
            </DashboardCard>
          </nav>

          <div className="settings-page__panel">
            <DashboardCard>{renderContent()}</DashboardCard>
          </div>
        </div>
      </div>

      <style>{`
        .settings-page { padding: 0 1rem 2rem; max-width: 1280px; margin: 0 auto; }
        .settings-page__header { margin-bottom: 1.5rem; }
        .settings-page__title { font-size: 1.5rem; font-weight: 700; color: var(--color-text); }
        .settings-page__description { margin-top: 0.25rem; font-size: 0.875rem; color: var(--color-text-secondary); }
        .settings-page__content { display: grid; grid-template-columns: 1fr; gap: 1.5rem; }
        @media (min-width: 1024px) {
          .settings-page__content { grid-template-columns: 240px 1fr; align-items: start; }
        }
        .settings-page__navigation { min-width: 0; }
        .settings-page__panel { min-width: 0; }
        .settings-navigation__item:hover { opacity: 0.9; background: var(--color-background-secondary, #f3f4f6); }
        .settings-navigation__item--active:hover { opacity: 1; }
      `}</style>
    </DashboardLayout>
  );
};
