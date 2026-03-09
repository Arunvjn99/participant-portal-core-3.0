import { usePersonalizationWizard } from "../context/PersonalizationWizardContext";

export function WizardFooter() {
  const { saveAndExit, nextStep, isLastStep } = usePersonalizationWizard();

  return (
    <footer
      className="personalization-wizard__footer"
      style={{
        borderTop: "1px solid var(--color-border)",
        background: "var(--color-background-secondary)",
        padding: "var(--spacing-4) var(--spacing-6)",
      }}
    >
      <div className="personalization-wizard__footer-actions">
        <button
          type="button"
          onClick={saveAndExit}
          className="personalization-wizard__footer-ghost"
          style={{
            background: "none",
            border: "none",
            color: "var(--color-text-secondary)",
            fontWeight: 500,
            padding: "var(--spacing-2) var(--spacing-5)",
            borderRadius: "var(--radius-xl)",
          }}
        >
          Save & Exit
        </button>
        <button
          type="button"
          onClick={nextStep}
          className="personalization-wizard__footer-cta"
          style={{
            background: "var(--color-primary)",
            color: "var(--color-text-inverse)",
            border: "none",
            fontWeight: 600,
            padding: "var(--spacing-2) var(--spacing-5)",
            borderRadius: "var(--radius-xl)",
            boxShadow: "var(--shadow-md)",
          }}
        >
          {isLastStep ? "Finish" : "Continue →"}
        </button>
      </div>
    </footer>
  );
}
