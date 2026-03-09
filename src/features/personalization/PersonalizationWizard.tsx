import { Modal } from "@/components/ui/Modal";
import { PersonalizationWizardProvider, usePersonalizationWizard } from "./context/PersonalizationWizardContext";
import { WizardHeader } from "./components/WizardHeader";
import { WizardSteps } from "./components/WizardSteps";
import { WizardFooter } from "./components/WizardFooter";
import { AgeStep } from "./components/AgeStep";
import { LocationStep } from "./components/LocationStep";
import { SavingsStep } from "./components/SavingsStep";

interface PersonalizationWizardProps {
  isOpen: boolean;
  onClose: () => void;
  firstName: string;
  currentAge: number;
  birthDateDisplay: string;
  birthYear: number;
}

function WizardContent({ onClose, title, subtitle }: { onClose: () => void; title: string; subtitle: string }) {
  const { state } = usePersonalizationWizard();

  return (
    <div className="personalization-wizard" style={{ display: "flex", flexDirection: "column", minHeight: "min(540px, 80dvh)" }}>
      <WizardHeader title={title} subtitle={subtitle} onClose={onClose} />
      <div className="personalization-wizard__nav-wrap" style={{ padding: "var(--spacing-5) var(--spacing-6) 0" }}>
        <WizardSteps />
      </div>
      <div
        className="personalization-wizard__body"
        style={{
          flex: 1,
          overflowY: "auto",
          padding: "var(--spacing-5) var(--spacing-6) var(--spacing-6)",
        }}
      >
        {state.currentStep === "age" && <AgeStep />}
        {state.currentStep === "location" && <LocationStep />}
        {state.currentStep === "savings" && <SavingsStep />}
      </div>
      <WizardFooter />
    </div>
  );
}

export function PersonalizationWizard({
  isOpen,
  onClose,
  firstName,
  currentAge,
  birthDateDisplay,
  birthYear,
}: PersonalizationWizardProps) {
  const title = `Hi, ${firstName} 👋`;
  const subtitle = "Let's personalize your retirement journey.";

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      wizard
      dialogClassName="personalization-wizard__dialog"
    >
      <PersonalizationWizardProvider
        currentAge={currentAge}
        birthDateDisplay={birthDateDisplay}
        birthYear={birthYear}
        onComplete={onClose}
        onSaveAndExit={onClose}
      >
        <WizardContent onClose={onClose} title={title} subtitle={subtitle} />
      </PersonalizationWizardProvider>
    </Modal>
  );
}
