interface DashboardSectionTabProps {
  label: string;
  isSelected: boolean;
  onClick: () => void;
}

export const DashboardSectionTab = ({ label, isSelected, onClick }: DashboardSectionTabProps) => {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`pre-enrollment__tab ${isSelected ? "btn-selected" : ""}`}
      aria-pressed={isSelected}
    >
      {label}
    </button>
  );
};
