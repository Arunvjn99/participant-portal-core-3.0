import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Input } from "../ui/Input";
import Button from "../ui/Button";
import type { ContactInformation } from "../../data/mockProfile";

interface ContactInformationSectionProps {
  data: ContactInformation;
  isEditing: boolean;
  onEdit: () => void;
  onSave: (data: ContactInformation) => void;
  onCancel: () => void;
}

/**
 * ContactInformationSection - Contact information section
 * Edits require verification
 */
export const ContactInformationSection = ({
  data,
  isEditing,
  onEdit,
  onSave,
  onCancel,
}: ContactInformationSectionProps) => {
  const { t } = useTranslation();
  const [formData, setFormData] = useState<ContactInformation>(data);

  const handleSave = () => {
    const updatedData: ContactInformation = {
      ...formData,
      emailVerified: false, // Reset verification on email change
      phoneVerified: false, // Reset verification on phone change
      lastUpdated: new Date().toISOString().split("T")[0],
    };
    onSave(updatedData);
    // TODO: Trigger verification flow
  };

  const handleCancel = () => {
    setFormData(data);
    onCancel();
  };

  if (isEditing) {
    return (
      <div className="profile-section">
        <div className="profile-section__header">
          <h2 className="profile-section__title">{t("profile.contactInformation")}</h2>
        </div>
        <div className="profile-section__content">
          <div className="profile-section__form">
            <div className="profile-section__field">
              <Input
                label={t("profile.email")}
                type="email"
                name="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
              />
              {data.emailVerified && (
                <p className="profile-section__helper-text profile-section__helper-text--verified">
                  ✓ {t("profile.verified")}
                </p>
              )}
              <p className="profile-section__helper-text">{t("profile.verifyEmailAfterSave")}</p>
            </div>
            <div className="profile-section__field">
              <Input
                label={t("profile.phone")}
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                required
              />
              {data.phoneVerified && (
                <p className="profile-section__helper-text profile-section__helper-text--verified">
                  ✓ {t("profile.verified")}
                </p>
              )}
              <p className="profile-section__helper-text">{t("profile.verifyPhoneAfterSave")}</p>
            </div>
            <div className="profile-section__field-group">
              <h3 className="profile-section__field-group-title">{t("profile.primaryAddress")}</h3>
              <Input
                label={t("profile.streetAddress")}
                type="text"
                name="street"
                value={formData.address.street}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    address: { ...formData.address, street: e.target.value },
                  })
                }
                required
              />
              <div className="profile-section__field-row">
                <Input
                  label={t("profile.city")}
                  type="text"
                  name="city"
                  value={formData.address.city}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      address: { ...formData.address, city: e.target.value },
                    })
                  }
                  required
                />
                <Input
                  label={t("profile.state")}
                  type="text"
                  name="state"
                  value={formData.address.state}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      address: { ...formData.address, state: e.target.value },
                    })
                  }
                  required
                />
                <Input
                  label={t("profile.zipCode")}
                  type="text"
                  name="zipCode"
                  value={formData.address.zipCode}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      address: { ...formData.address, zipCode: e.target.value },
                    })
                  }
                  required
                />
              </div>
              <Input
                label={t("profile.country")}
                type="text"
                name="country"
                value={formData.address.country}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    address: { ...formData.address, country: e.target.value },
                  })
                }
                required
              />
            </div>
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

  return (
    <div className="profile-section">
      <div className="profile-section__header">
        <h2 className="profile-section__title">{t("profile.contactInformation")}</h2>
        <Button onClick={onEdit} className="profile-section__edit-button">
          {t("profile.edit")}
        </Button>
      </div>
      <div className="profile-section__content">
        <div className="profile-section__field-list">
          <div className="profile-section__field-item">
            <span className="profile-section__field-label">{t("profile.email")}</span>
            <div className="profile-section__field-value-group">
              <span className="profile-section__field-value">{data.email}</span>
              {data.emailVerified && (
                <span className="profile-section__verified-badge">{t("profile.verified")}</span>
              )}
            </div>
          </div>
          <div className="profile-section__field-item">
            <span className="profile-section__field-label">{t("profile.phone")}</span>
            <div className="profile-section__field-value-group">
              <span className="profile-section__field-value">{data.phone}</span>
              {data.phoneVerified && (
                <span className="profile-section__verified-badge">{t("profile.verified")}</span>
              )}
            </div>
          </div>
          <div className="profile-section__field-item">
            <span className="profile-section__field-label">{t("profile.address")}</span>
            <span className="profile-section__field-value">
              {data.address.street}
              <br />
              {data.address.city}, {data.address.state} {data.address.zipCode}
              <br />
              {data.address.country}
            </span>
          </div>
        </div>
        {data.lastUpdated && (
          <p className="profile-section__timestamp">{t("profile.lastUpdated", { date: data.lastUpdated })}</p>
        )}
      </div>
    </div>
  );
};
