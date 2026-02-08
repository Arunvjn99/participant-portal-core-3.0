import { DashboardSectionTab } from "./DashboardSectionTab";

export type DashboardSectionId = "resources" | "advisors" | "value-props";

const SECTIONS: { id: DashboardSectionId; label: string }[] = [
  { id: "resources", label: "Learning Resources" },
  { id: "advisors", label: "Your Advisors" },
  { id: "value-props", label: "Why Choose Our Plan" },
];

interface DashboardSectionTabsProps {
  selectedSection: DashboardSectionId;
  onSectionSelect: (id: DashboardSectionId) => void;
}

export const DashboardSectionTabs = ({ selectedSection, onSectionSelect }: DashboardSectionTabsProps) => {
  return (
    <nav className="pre-enrollment__tabs" aria-label="Dashboard sections">
      {SECTIONS.map(({ id, label }) => (
        <DashboardSectionTab
          key={id}
          label={label}
          isSelected={selectedSection === id}
          onClick={() => onSectionSelect(id)}
        />
      ))}
    </nav>
  );
};
