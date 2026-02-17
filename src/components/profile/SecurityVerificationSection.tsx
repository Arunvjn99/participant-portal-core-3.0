import { useState } from "react";
import { useTranslation } from "react-i18next";
import Button from "../ui/Button";
import type { SecurityVerification } from "../../data/mockProfile";

interface SecurityVerificationSectionProps {
  data: SecurityVerification;
  isEditing: boolean;
  onEdit: () => void;
  onSave: (data: SecurityVerification) => void;
  onCancel: () => void;
}

/**
 * SecurityVerificationSection - Security and verification section
 * MFA and recovery editable
 */
export const SecurityVerificationSection = ({
  data,
  isEditing,
  onEdit,
  onSave,
  onCancel,
}: SecurityVerificationSectionProps) => {
  const { t } = useTranslation();
  const [formData, setFormData] = useState<SecurityVerification>(data);

  const handleSave = () => {
    const updatedData: SecurityVerification = {
      ...formData,
      lastUpdated: new Date().toISOString().split("T")[0],
    };
    onSave(updatedData);
  };

  const handleCancel = () => {
    setFormData(data);
    onCancel();
  };

  if (isEditing) {
    return (
      <div className="profile-section">
        <div className="profile-section__header">
          <h2 className="profile-section__title">{t("profile.securityVerification")}</h2>
        </div>
        <div className="profile-section__content">
          <div className="profile-section__form">
            <div className="profile-section__field profile-section__field--read-only">
              <label className="profile-section__label">{t("profile.identityVerification")}</label>
              <div className="profile-section__read-only-value">
                {data.identityVerified ? t("profile.verified") : t("profile.notVerified")}
              </div>
              {data.identityVerificationDate && (
                <p className="profile-section__helper-text">
                  {t("profile.verifiedOn", { date: new Date(data.identityVerificationDate).toLocaleDateString() })}
                </p>
              )}
            </div>
            <div className="profile-section__field">
              <label className="profile-section__label">
                <input
                  type="checkbox"
                  checked={formData.mfaEnabled}
                  onChange={(e) => setFormData({ ...formData, mfaEnabled: e.target.checked })}
                  className="profile-section__checkbox"
                />
                {t("profile.enableMFA")}
              </label>
              {formData.mfaEnabled && (
                <div className="profile-section__field">
                  <label className="profile-section__label">{t("profile.mfaMethod")}</label>
                  <select
                    className="profile-section__select"
                    name="mfaMethod"
                    value={formData.mfaMethod || ""}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        mfaMethod: e.target.value as SecurityVerification["mfaMethod"],
                      })
                    }
                  >
                    <option value="">{t("profile.selectMethod")}</option>
                    <option value="sms">{t("profile.sms")}</option>
                    <option value="email">{t("profile.email")}</option>
                    <option value="authenticator-app">{t("profile.authenticatorApp")}</option>
                  </select>
                </div>
              )}
            </div>
            <div className="profile-section__field profile-section__field--read-only">
              <label className="profile-section__label">{t("profile.lastLogin")}</label>
              <div className="profile-section__read-only-value">
                {new Date(data.lastLogin).toLocaleString(undefined, {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                  hour: "numeric",
                  minute: "2-digit",
                })}
              </div>
            </div>
            <div className="profile-section__field">
              <label className="profile-section__label">{t("profile.recoveryEmail")}</label>
              <input
                type="email"
                className="profile-section__input"
                value={formData.recoveryEmail || ""}
                onChange={(e) => setFormData({ ...formData, recoveryEmail: e.target.value })}
                placeholder={t("profile.enterRecoveryEmail")}
              />
            </div>
            <div className="profile-section__field">
              <label className="profile-section__label">{t("profile.recoveryPhone")}</label>
              <input
                type="tel"
                className="profile-section__input"
                value={formData.recoveryPhone || ""}
                onChange={(e) => setFormData({ ...formData, recoveryPhone: e.target.value })}
                placeholder={t("profile.enterRecoveryPhone")}
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
        <h2 className="profile-section__title">{t("profile.securityVerification")}</h2>
        <Button onClick={onEdit} className="profile-section__edit-button">
          {t("profile.edit")}
        </Button>
      </div>
      <div className="profile-section__content">
        <div className="profile-section__field-list">
          <div className="profile-section__field-item">
            <span className="profile-section__field-label">{t("profile.identityVerification")}</span>
            <div className="profile-section__field-value-group">
              <span className="profile-section__field-value">
                {data.identityVerified ? t("profile.verified") : t("profile.notVerified")}
              </span>
              {data.identityVerified && (
                <span className="profile-section__verified-badge">{t("profile.verified")}</span>
              )}
            </div>
            {data.identityVerificationDate && (
              <p className="profile-section__helper-text">
                {t("profile.verifiedOn", { date: new Date(data.identityVerificationDate).toLocaleDateString() })}
              </p>
            )}
          </div>
          <div className="profile-section__field-item">
            <span className="profile-section__field-label">{t("profile.multiFactorAuth")}</span>
            <div className="profile-section__field-value-group">
              <span className="profile-section__field-value">
                {data.mfaEnabled ? t("profile.enabled") : t("profile.disabled")}
              </span>
              {data.mfaEnabled && data.mfaMethod && (
                <span className="profile-section__field-value">
                  ({data.mfaMethod === "sms" ? t("profile.sms") : data.mfaMethod === "email" ? t("profile.email") : t("profile.authenticatorApp")})
                </span>
              )}
            </div>
          </div>
          <div className="profile-section__field-item">
            <span className="profile-section__field-label">{t("profile.lastLogin")}</span>
            <span className="profile-section__field-value">
              {new Date(data.lastLogin).toLocaleString(undefined, {
                year: "numeric",
                month: "long",
                day: "numeric",
                hour: "numeric",
                minute: "2-digit",
              })}
            </span>
          </div>
          {data.recoveryEmail && (
            <div className="profile-section__field-item">
              <span className="profile-section__field-label">{t("profile.recoveryEmail")}</span>
              <span className="profile-section__field-value">{data.recoveryEmail}</span>
            </div>
          )}
          {data.recoveryPhone && (
            <div className="profile-section__field-item">
              <span className="profile-section__field-label">{t("profile.recoveryPhone")}</span>
              <span className="profile-section__field-value">{data.recoveryPhone}</span>
            </div>
          )}
        </div>
        {data.lastUpdated && (
          <p className="profile-section__timestamp">{t("profile.lastUpdated", { date: data.lastUpdated })}</p>
        )}
      </div>
    </div>
  );
};
