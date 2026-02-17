import { useTranslation } from "react-i18next";
import Button from "../ui/Button";
import type { EmploymentInformation } from "../../data/mockProfile";

interface EmploymentInformationSectionProps {
  data: EmploymentInformation;
  isEditing: boolean;
  onEdit: () => void;
  onSave: (data: EmploymentInformation) => void;
  onCancel: () => void;
}

/**
 * EmploymentInformationSection - Employment information section
 * Fully read-only with HR tooltip
 */
export const EmploymentInformationSection = ({
  data,
  isEditing,
  onEdit,
  onSave,
  onCancel,
}: EmploymentInformationSectionProps) => {
  const { t } = useTranslation();
  return (
    <div className="profile-section">
      <div className="profile-section__header">
        <h2 className="profile-section__title">{t("profile.employmentInformation")}</h2>
      </div>
      <div className="profile-section__content">
        <div className="profile-section__read-only-notice">
          <p className="profile-section__read-only-text">{t("profile.managedByHR")}</p>
        </div>
        <div className="profile-section__field-list">
          <div className="profile-section__field-item">
            <span className="profile-section__field-label">{t("profile.employerName")}</span>
            <span className="profile-section__field-value">{data.employerName}</span>
          </div>
          <div className="profile-section__field-item">
            <span className="profile-section__field-label">{t("profile.employeeId")}</span>
            <span className="profile-section__field-value">{data.employeeId}</span>
          </div>
          <div className="profile-section__field-item">
            <span className="profile-section__field-label">{t("profile.hireDate")}</span>
            <span className="profile-section__field-value">
              {new Date(data.hireDate).toLocaleDateString(undefined, {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </span>
          </div>
          <div className="profile-section__field-item">
            <span className="profile-section__field-label">{t("profile.employmentStatus")}</span>
            <span className="profile-section__field-value">
              {data.employmentStatus.charAt(0).toUpperCase() +
                data.employmentStatus.slice(1).replace(/-/g, " ")}
            </span>
          </div>
          <div className="profile-section__field-item">
            <span className="profile-section__field-label">{t("profile.workLocation")}</span>
            <span className="profile-section__field-value">{data.workLocation}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
