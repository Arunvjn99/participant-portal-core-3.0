import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Input } from "../ui/Input";
import Button from "../ui/Button";
import type { PersonalDetails } from "../../data/mockProfile";

interface PersonalDetailsSectionProps {
  data: PersonalDetails;
  isEditing: boolean;
  onEdit: () => void;
  onSave: (data: PersonalDetails) => void;
  onCancel: () => void;
}

/**
 * PersonalDetailsSection - Personal information section
 * Editable with confirmation (except DOB)
 */
export const PersonalDetailsSection = ({
  data,
  isEditing,
  onEdit,
  onSave,
  onCancel,
}: PersonalDetailsSectionProps) => {
  const { t } = useTranslation();
  const [formData, setFormData] = useState<PersonalDetails>(data);

  // Calculate age from date of birth
  const calculateAge = (dob: string): number => {
    const today = new Date();
    const birthDate = new Date(dob);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };

  const age = calculateAge(data.dateOfBirth);

  const handleSave = () => {
    const updatedData: PersonalDetails = {
      ...formData,
      lastUpdated: new Date().toISOString().split("T")[0],
    };
    onSave(updatedData);
  };

  const handleCancel = () => {
    setFormData(data); // Reset to original data
    onCancel();
  };

  if (isEditing) {
    return (
      <div className="profile-section">
        <div className="profile-section__header">
          <h2 className="profile-section__title">{t("profile.personalDetails")}</h2>
        </div>
        <div className="profile-section__content">
          <div className="profile-section__form">
            <Input
              label={t("profile.firstName")}
              type="text"
              name="firstName"
              value={formData.firstName}
              onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
              required
            />
            <Input
              label={t("profile.middleName")}
              type="text"
              name="middleName"
              value={formData.middleName || ""}
              onChange={(e) => setFormData({ ...formData, middleName: e.target.value })}
            />
            <Input
              label={t("profile.lastName")}
              type="text"
              name="lastName"
              value={formData.lastName}
              onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
              required
            />
            <div className="profile-section__field">
              <Input
                label={t("profile.legalName")}
                type="text"
                name="legalName"
                value={formData.legalName}
                onChange={(e) => setFormData({ ...formData, legalName: e.target.value })}
                required
              />
              <p className="profile-section__helper-text">{t("profile.legalNameHelper")}</p>
            </div>
            <div className="profile-section__field">
              <label className="profile-section__label">{t("profile.gender")}</label>
              <select
                className="profile-section__select"
                name="gender"
                value={formData.gender || ""}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    gender: e.target.value as PersonalDetails["gender"] | undefined,
                  })
                }
              >
                <option value="">{t("profile.preferNotToSay")}</option>
                <option value="male">{t("profile.male")}</option>
                <option value="female">{t("profile.female")}</option>
                <option value="other">{t("profile.other")}</option>
                <option value="prefer-not-to-say">{t("profile.preferNotToSay")}</option>
              </select>
            </div>
            <div className="profile-section__field profile-section__field--read-only">
              <label className="profile-section__label">{t("profile.dateOfBirth")}</label>
              <div className="profile-section__read-only-value">
                {new Date(data.dateOfBirth).toLocaleDateString(undefined, {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </div>
              <p className="profile-section__helper-text">{t("profile.dateOfBirthCannotChange")}</p>
            </div>
            <div className="profile-section__field profile-section__field--read-only">
              <label className="profile-section__label">{t("profile.age")}</label>
              <div className="profile-section__read-only-value">{t("profile.ageYears", { count: age })}</div>
            </div>
            <div className="profile-section__field">
              <label className="profile-section__label">{t("profile.maritalStatus")}</label>
              <select
                className="profile-section__select"
                name="maritalStatus"
                value={formData.maritalStatus}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    maritalStatus: e.target.value as PersonalDetails["maritalStatus"],
                  })
                }
              >
                <option value="single">{t("profile.single")}</option>
                <option value="married">{t("profile.married")}</option>
                <option value="divorced">{t("profile.divorced")}</option>
                <option value="widowed">{t("profile.widowed")}</option>
                <option value="domestic-partnership">{t("profile.domesticPartnership")}</option>
              </select>
            </div>
            <Input
              label={t("profile.citizenship")}
              type="text"
              name="citizenship"
              value={formData.citizenship}
              onChange={(e) => setFormData({ ...formData, citizenship: e.target.value })}
              required
            />
            <Input
              label={t("profile.residency")}
              type="text"
              name="residency"
              value={formData.residency}
              onChange={(e) => setFormData({ ...formData, residency: e.target.value })}
              required
            />
          </div>
          <div className="profile-section__actions">
            <Button onClick={handleCancel} className="profile-section__button profile-section__button--cancel">
              {t("profile.cancel")}
            </Button>
            <Button onClick={handleSave} className="profile-section__button profile-section__button--save">
              {t("profile.saveChanges")}
            </Button>
          </div>
          {data.lastUpdated && (
            <p className="profile-section__timestamp">{t("profile.lastUpdated", { date: data.lastUpdated })}</p>
          )}
        </div>
      </div>
    );
  }

  const MARITAL_KEYS: Record<string, string> = {
    single: "profile.single",
    married: "profile.married",
    divorced: "profile.divorced",
    widowed: "profile.widowed",
    "domestic-partnership": "profile.domesticPartnership",
  };
  const genderDisplayKey = data.gender ? (data.gender === "prefer-not-to-say" ? "profile.preferNotToSay" : `profile.${data.gender}`) : null;
  const maritalDisplayKey = MARITAL_KEYS[data.maritalStatus] ?? data.maritalStatus;

  return (
    <div className="profile-section">
      <div className="profile-section__header">
        <h2 className="profile-section__title">{t("profile.personalDetails")}</h2>
        <Button onClick={onEdit} className="profile-section__edit-button">
          {t("profile.edit")}
        </Button>
      </div>
      <div className="profile-section__content">
        <div className="profile-section__field-list">
          <div className="profile-section__field-item">
            <span className="profile-section__field-label">{t("profile.firstName")}</span>
            <span className="profile-section__field-value">{data.firstName}</span>
          </div>
          {data.middleName && (
            <div className="profile-section__field-item">
              <span className="profile-section__field-label">{t("profile.middleName")}</span>
              <span className="profile-section__field-value">{data.middleName}</span>
            </div>
          )}
          <div className="profile-section__field-item">
            <span className="profile-section__field-label">{t("profile.lastName")}</span>
            <span className="profile-section__field-value">{data.lastName}</span>
          </div>
          <div className="profile-section__field-item">
            <span className="profile-section__field-label">{t("profile.legalName")}</span>
            <span className="profile-section__field-value">{data.legalName}</span>
          </div>
          {data.gender && (
            <div className="profile-section__field-item">
              <span className="profile-section__field-label">{t("profile.gender")}</span>
              <span className="profile-section__field-value">
                {genderDisplayKey ? t(genderDisplayKey) : data.gender}
              </span>
            </div>
          )}
          <div className="profile-section__field-item">
            <span className="profile-section__field-label">{t("profile.dateOfBirth")}</span>
            <span className="profile-section__field-value">
              {new Date(data.dateOfBirth).toLocaleDateString(undefined, {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </span>
          </div>
          <div className="profile-section__field-item">
            <span className="profile-section__field-label">{t("profile.age")}</span>
            <span className="profile-section__field-value">{t("profile.ageYears", { count: age })}</span>
          </div>
          <div className="profile-section__field-item">
            <span className="profile-section__field-label">{t("profile.maritalStatus")}</span>
            <span className="profile-section__field-value">{t(maritalDisplayKey)}</span>
          </div>
          <div className="profile-section__field-item">
            <span className="profile-section__field-label">{t("profile.citizenship")}</span>
            <span className="profile-section__field-value">{data.citizenship}</span>
          </div>
          <div className="profile-section__field-item">
            <span className="profile-section__field-label">{t("profile.residency")}</span>
            <span className="profile-section__field-value">{data.residency}</span>
          </div>
        </div>
        {data.lastUpdated && (
          <p className="profile-section__timestamp">{t("profile.lastUpdated", { date: data.lastUpdated })}</p>
        )}
      </div>
    </div>
  );
};
