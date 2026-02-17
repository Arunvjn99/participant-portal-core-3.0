import { useState } from "react";
import { useTranslation } from "react-i18next";
import { DashboardLayout } from "../../layouts/DashboardLayout";
import { DashboardHeader } from "../../components/dashboard/DashboardHeader";
import { DashboardCard } from "../../components/dashboard/DashboardCard";
import { MOCK_PROFILE, type ProfileData } from "../../data/mockProfile";
import { PersonalDetailsSection } from "../../components/profile/PersonalDetailsSection";
import { ContactInformationSection } from "../../components/profile/ContactInformationSection";
import { EmploymentInformationSection } from "../../components/profile/EmploymentInformationSection";
import { EmploymentClassificationSection } from "../../components/profile/EmploymentClassificationSection";
import { BeneficiariesSection } from "../../components/profile/BeneficiariesSection";
import { BankDetailsSection } from "../../components/profile/BankDetailsSection";
import { SecurityVerificationSection } from "../../components/profile/SecurityVerificationSection";
import { DocumentsConsentsSection } from "../../components/profile/DocumentsConsentsSection";

export type ProfileSection =
  | "personal-details"
  | "contact-information"
  | "employment-information"
  | "employment-classification"
  | "beneficiaries"
  | "bank-details"
  | "security-verification"
  | "documents-consents";

const PROFILE_SECTION_KEYS: Record<ProfileSection, string> = {
  "personal-details": "profile.personalDetails",
  "contact-information": "profile.contactInformation",
  "employment-information": "profile.employmentInformation",
  "employment-classification": "profile.employmentClassification",
  "beneficiaries": "profile.beneficiaries",
  "bank-details": "profile.bankDetails",
  "security-verification": "profile.securityVerification",
  "documents-consents": "profile.documentsConsents",
};

const PROFILE_SECTIONS: ProfileSection[] = [
  "personal-details",
  "contact-information",
  "employment-information",
  "employment-classification",
  "beneficiaries",
  "bank-details",
  "security-verification",
  "documents-consents",
];

/**
 * Profile - Profile management page with section navigation
 * Supports view and controlled edit modes per section
 */
export const Profile = () => {
  const { t } = useTranslation();
  const [activeSection, setActiveSection] = useState<ProfileSection>("personal-details");
  const [profileData, setProfileData] = useState<ProfileData>(MOCK_PROFILE);
  const [editingSections, setEditingSections] = useState<Set<ProfileSection>>(new Set());

  const handleSectionChange = (section: ProfileSection) => {
    if (editingSections.size > 0) {
      const confirmCancel = window.confirm(t("profile.confirmSwitchSection"));
      if (!confirmCancel) return;
      setEditingSections(new Set());
    }
    setActiveSection(section);
  };

  const handleEdit = (section: ProfileSection) => {
    setEditingSections((prev) => new Set(prev).add(section));
  };

  const handleSave = (section: ProfileSection, updatedData: Partial<ProfileData>) => {
    setProfileData((prev) => ({
      ...prev,
      ...updatedData,
    }));
    setEditingSections((prev) => {
      const next = new Set(prev);
      next.delete(section);
      return next;
    });
  };

  const handleCancel = (section: ProfileSection) => {
    setEditingSections((prev) => {
      const next = new Set(prev);
      next.delete(section);
      return next;
    });
  };

  const renderSectionContent = () => {
    const isEditing = editingSections.has(activeSection);

    switch (activeSection) {
      case "personal-details":
        return (
          <PersonalDetailsSection
            data={profileData.personalDetails}
            isEditing={isEditing}
            onEdit={() => handleEdit("personal-details")}
            onSave={(data) => handleSave("personal-details", { personalDetails: data })}
            onCancel={() => handleCancel("personal-details")}
          />
        );
      case "contact-information":
        return (
          <ContactInformationSection
            data={profileData.contactInformation}
            isEditing={isEditing}
            onEdit={() => handleEdit("contact-information")}
            onSave={(data) => handleSave("contact-information", { contactInformation: data })}
            onCancel={() => handleCancel("contact-information")}
          />
        );
      case "employment-information":
        return (
          <EmploymentInformationSection
            data={profileData.employmentInformation}
            isEditing={isEditing}
            onEdit={() => handleEdit("employment-information")}
            onSave={(data) => handleSave("employment-information", { employmentInformation: data })}
            onCancel={() => handleCancel("employment-information")}
          />
        );
      case "employment-classification":
        return (
          <EmploymentClassificationSection
            data={profileData.employmentClassification}
            isEditing={isEditing}
            onEdit={() => handleEdit("employment-classification")}
            onSave={(data) =>
              handleSave("employment-classification", { employmentClassification: data })
            }
            onCancel={() => handleCancel("employment-classification")}
          />
        );
      case "beneficiaries":
        return (
          <BeneficiariesSection
            data={profileData.beneficiaries}
            isEditing={isEditing}
            onEdit={() => handleEdit("beneficiaries")}
            onSave={(data) => handleSave("beneficiaries", { beneficiaries: data })}
            onCancel={() => handleCancel("beneficiaries")}
          />
        );
      case "bank-details":
        return (
          <BankDetailsSection
            data={profileData.bankDetails}
            isEditing={isEditing}
            onEdit={() => handleEdit("bank-details")}
            onSave={(data) => handleSave("bank-details", { bankDetails: data })}
            onCancel={() => handleCancel("bank-details")}
          />
        );
      case "security-verification":
        return (
          <SecurityVerificationSection
            data={profileData.securityVerification}
            isEditing={isEditing}
            onEdit={() => handleEdit("security-verification")}
            onSave={(data) => handleSave("security-verification", { securityVerification: data })}
            onCancel={() => handleCancel("security-verification")}
          />
        );
      case "documents-consents":
        return <DocumentsConsentsSection data={profileData.documents} />;
      default:
        return null;
    }
  };

  return (
    <DashboardLayout header={<DashboardHeader />}>
      <div className="profile-page">
        <div className="profile-page__header">
          <h1 className="profile-page__title">{t("profile.pageTitle")}</h1>
          <p className="profile-page__description">
            {t("profile.pageDescription")}
          </p>
        </div>

        <div className="profile-page__content">
          {/* Left Navigation */}
          <div className="profile-page__navigation">
            <DashboardCard>
              <nav className="profile-navigation" aria-label={t("profile.sectionsAria")}>
                <ul className="profile-navigation__list">
                  {PROFILE_SECTIONS.map((sectionId) => (
                    <li key={sectionId}>
                      <button
                        type="button"
                        onClick={() => handleSectionChange(sectionId)}
                        className={`profile-navigation__item ${
                          activeSection === sectionId ? "profile-navigation__item--active" : ""
                        } ${editingSections.has(sectionId) ? "profile-navigation__item--editing" : ""}`}
                        aria-current={activeSection === sectionId ? "page" : undefined}
                      >
                        <span className="profile-navigation__label">{t(PROFILE_SECTION_KEYS[sectionId])}</span>
                        {editingSections.has(sectionId) && (
                          <span className="profile-navigation__indicator" aria-hidden>
                            •
                          </span>
                        )}
                      </button>
                    </li>
                  ))}
                </ul>
              </nav>
            </DashboardCard>
          </div>

          {/* Right Content Panel */}
          <div className="profile-page__panel">
            <DashboardCard>{renderSectionContent()}</DashboardCard>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};
