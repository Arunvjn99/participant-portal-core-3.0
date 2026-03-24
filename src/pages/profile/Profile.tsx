import { useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { DashboardLayout } from "@/layouts/DashboardLayout";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { DashboardCard } from "@/components/dashboard/DashboardCard";
import { MOCK_PROFILE, type ProfileData } from "@/data/mockProfile";
import { ProfileHeaderCard } from "@/components/profile/ProfileHeaderCard";
import { ContactInformationCard } from "@/components/profile/ContactInformationCard";
import { EmploymentClassificationCard } from "@/components/profile/EmploymentClassificationCard";
import { BeneficiariesCard } from "@/components/profile/BeneficiariesCard";
import { DocumentsTableCard } from "@/components/profile/DocumentsTableCard";
import { NotificationsCard } from "@/components/profile/NotificationsCard";
import { AiPersonalizationCard } from "@/components/profile/AiPersonalizationCard";

type ProfileSectionId =
  | "profile-header"
  | "contact"
  | "employment-classification"
  | "beneficiaries"
  | "documents"
  | "notifications"
  | "ai-personalization";

const PROFILE_SECTIONS: { id: ProfileSectionId; labelKey: string }[] = [
  { id: "profile-header", labelKey: "profile.personalDetails" },
  { id: "contact", labelKey: "profile.contactInformation" },
  { id: "employment-classification", labelKey: "profile.employmentClassification" },
  { id: "beneficiaries", labelKey: "profile.beneficiaries" },
  { id: "documents", labelKey: "profile.documentsConsents" },
  { id: "notifications", labelKey: "profile.notificationsPreferences" },
  { id: "ai-personalization", labelKey: "aiSystem.profileSectionTitle" },
];

/**
 * Profile - Card-based profile page with sidebar navigation (scroll-to-section).
 */
export const Profile = () => {
  const { t } = useTranslation();
  const panelRef = useRef<HTMLDivElement>(null);
  const [profileData, setProfileData] = useState<ProfileData>(MOCK_PROFILE);

  const scrollToSection = (id: ProfileSectionId) => {
    const el = document.getElementById(id);
    el?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <DashboardLayout header={<DashboardHeader />}>
      <div className="profile-page">
        <div className="profile-page__header">
          <h1 className="profile-page__title">{t("profile.pageTitle")}</h1>
          <p className="profile-page__description">{t("profile.pageDescription")}</p>
        </div>

        <div className="profile-page__content">
          {/* Left Navigation */}
          <div className="profile-page__navigation">
            <DashboardCard>
              <nav className="profile-navigation" aria-label={t("profile.sectionsAria")}>
                <ul className="profile-navigation__list">
                  {PROFILE_SECTIONS.map(({ id, labelKey }) => (
                    <li key={id}>
                      <button
                        type="button"
                        onClick={() => scrollToSection(id)}
                        className="profile-navigation__item"
                      >
                        <span className="profile-navigation__label">{t(labelKey)}</span>
                      </button>
                    </li>
                  ))}
                </ul>
              </nav>
            </DashboardCard>
          </div>

          {/* Right Content Panel - scrollable card column */}
          <div ref={panelRef} className="profile-page__panel">
            <div
              className="profile-page__cards"
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "1.5rem",
                padding: "0 0 2rem 0",
              }}
            >
              <ProfileHeaderCard
                fullName={profileData.personalDetails.legalName}
                status={profileData.securityVerification?.identityVerified ? "verified" : "complete"}
                lastUpdated={profileData.personalDetails.lastUpdated}
              />
              <ContactInformationCard
                data={profileData.contactInformation}
                onSave={(data) =>
                  setProfileData((prev) => ({ ...prev, contactInformation: data }))
                }
              />
              <EmploymentClassificationCard
                data={profileData.employmentClassification}
                employerName={profileData.employmentInformation.employerName}
              />
              <BeneficiariesCard
                data={profileData.beneficiaries}
                onSave={(data) =>
                  setProfileData((prev) => ({ ...prev, beneficiaries: data }))
                }
              />
              <DocumentsTableCard data={profileData.documents} />
              <NotificationsCard />
              <div id="ai-personalization">
                <AiPersonalizationCard />
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};
