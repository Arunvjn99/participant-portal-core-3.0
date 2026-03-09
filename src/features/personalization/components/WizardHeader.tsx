interface WizardHeaderProps {
  title: string;
  subtitle: string;
  onClose: () => void;
  closeLabel?: string;
}

export function WizardHeader({ title, subtitle, onClose, closeLabel = "Close" }: WizardHeaderProps) {
  return (
    <header
      className="personalization-wizard__header"
      style={{
        background: "var(--banner-gradient)",
        color: "var(--color-text-inverse)",
      }}
    >
      <button
        type="button"
        onClick={onClose}
        className="personalization-wizard__close"
        aria-label={closeLabel}
        style={{
          color: "rgb(var(--color-text-inverse-rgb) / 0.9)",
          background: "rgb(var(--color-text-inverse-rgb) / 0.15)",
        }}
      >
        <CloseIcon />
      </button>
      <div className="personalization-wizard__header-content">
        <h1 className="personalization-wizard__header-title">{title}</h1>
        <p className="personalization-wizard__header-subtitle">{subtitle}</p>
      </div>
    </header>
  );
}

function CloseIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M18 6L6 18M6 6l12 12" />
    </svg>
  );
}
