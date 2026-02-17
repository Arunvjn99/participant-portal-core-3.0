import { useTranslation } from "react-i18next";
import Button from "../ui/Button";
import type { EmploymentClassification } from "../../data/mockProfile";

interface EmploymentClassificationSectionProps {
  data: EmploymentClassification;
  isEditing: boolean;
  onEdit: () => void;
  onSave: (data: EmploymentClassification) => void;
  onCancel: () => void;
}

/**
 * EmploymentClassificationSection - Employment classification section
 * Fully read-only with explanation tooltip
 */
export const EmploymentClassificationSection = ({
  data,
  isEditing,
  onEdit,
  onSave,
  onCancel,
}: EmploymentClassificationSectionProps) => {
  const { t } = useTranslation();
  return (
    <div className="profile-section">
      <div className="profile-section__header">
        <h2 className="profile-section__title">{t("profile.employmentClassification")}</h2>
      </div>
      <div className="profile-section__content">
        <div className="profile-section__read-only-notice">
          <p className="profile-section__read-only-text">{t("profile.determinedByEmployment")}</p>
        </div>
        <div className="profile-section__field-list">
          <div className="profile-section__field-item">
            <span className="profile-section__field-label">{t("profile.employeeType")}</span>
            <span className="profile-section__field-value">
              {data.employeeType.charAt(0).toUpperCase() + data.employeeType.slice(1).replace(/-/g, " ")}
            </span>
          </div>
          <div className="profile-section__field-item">
            <span className="profile-section__field-label">{t("profile.unionStatus")}</span>
            <span className="profile-section__field-value">
              {data.unionStatus.charAt(0).toUpperCase() + data.unionStatus.slice(1).replace(/-/g, " ")}
            </span>
          </div>
          <div className="profile-section__field-item">
            <span className="profile-section__field-label">{t("profile.compensationType")}</span>
            <span className="profile-section__field-value">
              {data.compensationType.charAt(0).toUpperCase() + data.compensationType.slice(1)}
            </span>
          </div>
          <div className="profile-section__field-item">
            <span className="profile-section__field-label">{t("profile.eligibilityStatus")}</span>
            <span className="profile-section__field-value">
              {data.eligibilityStatus.charAt(0).toUpperCase() + data.eligibilityStatus.slice(1)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
