import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Input } from "../ui/Input";
import Button from "../ui/Button";
import type { BankDetails } from "../../data/mockProfile";

interface BankDetailsSectionProps {
  data: BankDetails;
  isEditing: boolean;
  onEdit: () => void;
  onSave: (data: BankDetails) => void;
  onCancel: () => void;
}

/**
 * BankDetailsSection - Bank and payment details section
 * Editable with verification, never shows full numbers
 */
export const BankDetailsSection = ({
  data,
  isEditing,
  onEdit,
  onSave,
  onCancel,
}: BankDetailsSectionProps) => {
  const { t } = useTranslation();
  const [formData, setFormData] = useState<BankDetails>(data);

  const handleSave = () => {
    const updatedData: BankDetails = {
      ...formData,
      accountNumber: `****${formData.accountNumber.slice(-4)}`, // Ensure masking
      routingNumber: `****${formData.routingNumber.slice(-4)}`, // Ensure masking
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
          <h2 className="profile-section__title">{t("profile.bankDetails")}</h2>
        </div>
        <div className="profile-section__content">
          <div className="profile-section__form">
            <Input
              label={t("profile.bankName")}
              type="text"
              name="bankName"
              value={formData.bankName}
              onChange={(e) => setFormData({ ...formData, bankName: e.target.value })}
              required
            />
            <div className="profile-section__field">
              <label className="profile-section__label">{t("profile.accountType")}</label>
              <select
                className="profile-section__select"
                name="accountType"
                value={formData.accountType}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    accountType: e.target.value as BankDetails["accountType"],
                  })
                }
              >
                <option value="checking">{t("profile.checking")}</option>
                <option value="savings">{t("profile.savings")}</option>
              </select>
            </div>
            <div className="profile-section__field">
              <Input
                label={t("profile.accountNumber")}
                type="text"
                name="accountNumber"
                value={formData.accountNumber}
                onChange={(e) => setFormData({ ...formData, accountNumber: e.target.value })}
                required
              />
              <p className="profile-section__helper-text">{t("profile.accountNumberHelper")}</p>
            </div>
            <div className="profile-section__field">
              <Input
                label={t("profile.routingNumber")}
                type="text"
                name="routingNumber"
                value={formData.routingNumber}
                onChange={(e) => setFormData({ ...formData, routingNumber: e.target.value })}
                required
              />
              <p className="profile-section__helper-text">{t("profile.routingNumberHelper")}</p>
            </div>
            <Input
              label={t("profile.accountHolderName")}
              type="text"
              name="accountHolderName"
              value={formData.accountHolderName}
              onChange={(e) => setFormData({ ...formData, accountHolderName: e.target.value })}
              required
            />
            <p className="profile-section__helper-text profile-section__helper-text--warning">
              {t("profile.verifyBankAfterSave")}
            </p>
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
        <h2 className="profile-section__title">{t("profile.bankDetails")}</h2>
        <Button onClick={onEdit} className="profile-section__edit-button">
          {t("profile.edit")}
        </Button>
      </div>
      <div className="profile-section__content">
        <div className="profile-section__field-list">
          <div className="profile-section__field-item">
            <span className="profile-section__field-label">{t("profile.bankName")}</span>
            <span className="profile-section__field-value">{data.bankName}</span>
          </div>
          <div className="profile-section__field-item">
            <span className="profile-section__field-label">{t("profile.accountType")}</span>
            <span className="profile-section__field-value">
              {data.accountType.charAt(0).toUpperCase() + data.accountType.slice(1)}
            </span>
          </div>
          <div className="profile-section__field-item">
            <span className="profile-section__field-label">{t("profile.accountNumber")}</span>
            <span className="profile-section__field-value">{data.accountNumber}</span>
          </div>
          <div className="profile-section__field-item">
            <span className="profile-section__field-label">{t("profile.routingNumber")}</span>
            <span className="profile-section__field-value">{data.routingNumber}</span>
          </div>
          <div className="profile-section__field-item">
            <span className="profile-section__field-label">{t("profile.accountHolderName")}</span>
            <span className="profile-section__field-value">{data.accountHolderName}</span>
          </div>
        </div>
        {data.lastUpdated && (
          <p className="profile-section__timestamp">{t("profile.lastUpdated", { date: data.lastUpdated })}</p>
        )}
      </div>
    </div>
  );
};
