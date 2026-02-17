import { useState, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { Input } from "../ui/Input";
import Button from "../ui/Button";
import { Modal } from "../ui/Modal";
import type { Beneficiary } from "../../data/mockProfile";

interface BeneficiariesSectionProps {
  data: {
    primary: Beneficiary[];
    contingent: Beneficiary[];
    lastUpdated?: string;
  };
  isEditing: boolean;
  onEdit: () => void;
  onSave: (data: { primary: Beneficiary[]; contingent: Beneficiary[]; lastUpdated?: string }) => void;
  onCancel: () => void;
}

/**
 * BeneficiariesSection - Beneficiaries management section
 * High-sensitivity, validation-heavy, audit-safe
 */
export const BeneficiariesSection = ({
  data,
  isEditing,
  onEdit,
  onSave,
  onCancel,
}: BeneficiariesSectionProps) => {
  const { t } = useTranslation();
  const [primaryBeneficiaries, setPrimaryBeneficiaries] = useState<Beneficiary[]>(data.primary);
  const [contingentBeneficiaries, setContingentBeneficiaries] = useState<Beneficiary[]>(data.contingent);
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  // Calculate totals and validation
  const primaryTotal = useMemo(
    () => primaryBeneficiaries.reduce((sum, b) => sum + b.percentage, 0),
    [primaryBeneficiaries]
  );
  const contingentTotal = useMemo(
    () => contingentBeneficiaries.reduce((sum, b) => sum + b.percentage, 0),
    [contingentBeneficiaries]
  );

  const primaryIsValid = primaryTotal === 100;
  const contingentIsValid = contingentBeneficiaries.length === 0 || contingentTotal === 100;
  const isValid = primaryIsValid && contingentIsValid;

  // Calculate remaining allocation for primary
  const primaryRemaining = useMemo(() => {
    return 100 - primaryTotal;
  }, [primaryTotal]);

  // Calculate remaining allocation for contingent
  const contingentRemaining = useMemo(() => {
    return 100 - contingentTotal;
  }, [contingentTotal]);

  // Status badge text
  const primaryStatus = primaryIsValid ? t("profile.complete") : t("profile.incomplete");
  const contingentStatus = contingentBeneficiaries.length === 0
    ? t("profile.notSet")
    : contingentIsValid
    ? t("profile.complete")
    : t("profile.incomplete");

  const handleAddPrimary = () => {
    const newBeneficiary: Beneficiary = {
      id: `ben-primary-${Date.now()}`,
      name: "",
      relationship: "",
      percentage: 0,
      type: "primary",
    };
    setPrimaryBeneficiaries([...primaryBeneficiaries, newBeneficiary]);
  };

  const handleRemovePrimary = (id: string) => {
    if (primaryBeneficiaries.length === 1) {
      alert(t("profile.atLeastOnePrimaryRequired"));
      return;
    }
    setPrimaryBeneficiaries(primaryBeneficiaries.filter((b) => b.id !== id));
  };

  const handleUpdatePrimary = (id: string, updates: Partial<Beneficiary>) => {
    setPrimaryBeneficiaries(
      primaryBeneficiaries.map((b) => (b.id === id ? { ...b, ...updates } : b))
    );
  };

  const handleAddContingent = () => {
    const newBeneficiary: Beneficiary = {
      id: `ben-contingent-${Date.now()}`,
      name: "",
      relationship: "",
      percentage: 0,
      type: "contingent",
    };
    setContingentBeneficiaries([...contingentBeneficiaries, newBeneficiary]);
  };

  const handleRemoveContingent = (id: string) => {
    setContingentBeneficiaries(contingentBeneficiaries.filter((b) => b.id !== id));
  };

  const handleUpdateContingent = (id: string, updates: Partial<Beneficiary>) => {
    setContingentBeneficiaries(
      contingentBeneficiaries.map((b) => (b.id === id ? { ...b, ...updates } : b))
    );
  };

  const handleSaveClick = () => {
    if (!isValid) return;
    setShowConfirmModal(true);
  };

  const handleConfirmSave = () => {
    onSave({
      primary: primaryBeneficiaries,
      contingent: contingentBeneficiaries,
      lastUpdated: new Date().toISOString().split("T")[0],
    });
    setShowConfirmModal(false);
  };

  const handleCancel = () => {
    setPrimaryBeneficiaries(data.primary);
    setContingentBeneficiaries(data.contingent);
    onCancel();
  };

  // Validate percentage doesn't exceed remaining allocation
  const validatePercentage = (
    value: number,
    currentId: string,
    beneficiaries: Beneficiary[],
    remaining: number
  ): boolean => {
    const currentBeneficiary = beneficiaries.find((b) => b.id === currentId);
    const otherTotal = beneficiaries
      .filter((b) => b.id !== currentId)
      .reduce((sum, b) => sum + b.percentage, 0);
    return value + otherTotal <= 100;
  };

  if (isEditing) {
    return (
      <>
        <div className="profile-section">
          <div className="profile-section__header">
            <h2 className="profile-section__title">{t("profile.beneficiaries")}</h2>
          </div>
          <div className="profile-section__content">
            <div className="profile-section__form">
              {/* Primary Beneficiaries */}
              <div className="profile-section__field-group">
                <div className="profile-section__field-group-header">
                  <div>
                    <h3 className="profile-section__field-group-title">{t("profile.primaryBeneficiaries")}</h3>
                    <p className="profile-section__field-group-description">
                      {t("profile.primaryBeneficiariesDesc")}
                    </p>
                  </div>
                  <Button onClick={handleAddPrimary} className="profile-section__add-button" type="button">
                    {t("profile.addBeneficiary")}
                  </Button>
                </div>

                {primaryBeneficiaries.length === 0 && (
                  <p className="profile-section__empty-state">
                    {t("profile.atLeastOnePrimaryRequired")}
                  </p>
                )}

                {primaryBeneficiaries.map((beneficiary) => {
                  const otherTotal = primaryBeneficiaries
                    .filter((b) => b.id !== beneficiary.id)
                    .reduce((sum, b) => sum + b.percentage, 0);
                  const maxPercentage = 100 - otherTotal;
                  const percentageError =
                    beneficiary.percentage > maxPercentage
                      ? t("profile.cannotExceedRemaining", { max: maxPercentage.toFixed(1) })
                      : null;

                  return (
                    <div key={beneficiary.id} className="profile-section__beneficiary-card">
                      <div className="profile-section__beneficiary-card-header">
                        <h4 className="profile-section__beneficiary-card-title">{t("profile.beneficiary")}</h4>
                        {primaryBeneficiaries.length > 1 && (
                          <Button
                            onClick={() => handleRemovePrimary(beneficiary.id)}
                            className="profile-section__remove-button"
                            type="button"
                            aria-label={t("profile.removeBeneficiaryAria")}
                          >
                            {t("profile.remove")}
                          </Button>
                        )}
                      </div>
                      <div className="profile-section__beneficiary-form">
                        <Input
                          label={t("profile.fullLegalName")}
                          type="text"
                          name={`primary-name-${beneficiary.id}`}
                          value={beneficiary.name}
                          onChange={(e) => handleUpdatePrimary(beneficiary.id, { name: e.target.value })}
                          required
                          placeholder={t("profile.placeholderFullName")}
                        />
                        <Input
                          label={t("profile.relationship")}
                          type="text"
                          name={`primary-relationship-${beneficiary.id}`}
                          value={beneficiary.relationship}
                          onChange={(e) =>
                            handleUpdatePrimary(beneficiary.id, { relationship: e.target.value })
                          }
                          required
                          placeholder={t("profile.placeholderRelationship")}
                        />
                        <div className="profile-section__field">
                          <Input
                            label={t("profile.percentageAllocation")}
                            type="number"
                            name={`primary-percentage-${beneficiary.id}`}
                            value={beneficiary.percentage > 0 ? beneficiary.percentage.toString() : ""}
                            onChange={(e) => {
                              const value = parseFloat(e.target.value) || 0;
                              handleUpdatePrimary(beneficiary.id, { percentage: value });
                            }}
                            min="0"
                            max={maxPercentage}
                            step="0.1"
                            required
                            error={percentageError || undefined}
                          />
                          <p className="profile-section__helper-text">
                            {t("profile.remaining", { pct: primaryRemaining.toFixed(1) })}
                          </p>
                        </div>
                        <div className="profile-section__field">
                          <Input
                            label={t("profile.dateOfBirthOptional")}
                            type="date"
                            name={`primary-dob-${beneficiary.id}`}
                            value={beneficiary.dateOfBirth || ""}
                            onChange={(e) =>
                              handleUpdatePrimary(beneficiary.id, { dateOfBirth: e.target.value || undefined })
                            }
                          />
                        </div>
                      </div>
                    </div>
                  );
                })}

                <div className="profile-section__validation-summary">
                  <div className="profile-section__validation-row">
                    <span className="profile-section__validation-label">{t("profile.primaryTotal")}</span>
                    <span
                      className={`profile-section__validation-value ${
                        primaryIsValid
                          ? "profile-section__validation-value--valid"
                          : "profile-section__validation-value--invalid"
                      }`}
                    >
                      {primaryTotal.toFixed(1)}%
                    </span>
                    <span
                      className={`profile-section__status-badge profile-section__status-badge--${
                        primaryIsValid ? "complete" : "incomplete"
                      }`}
                    >
                      {primaryStatus}
                    </span>
                  </div>
                  {!primaryIsValid && (
                    <p className="profile-section__validation-error" role="alert">
                      {t("profile.primaryMustTotal100")}
                    </p>
                  )}
                </div>
              </div>

              {/* Contingent Beneficiaries */}
              <div className="profile-section__field-group">
                <div className="profile-section__field-group-header">
                  <div>
                    <h3 className="profile-section__field-group-title">{t("profile.contingentBeneficiaries")}</h3>
                    <p className="profile-section__field-group-description">
                      {t("profile.contingentBeneficiariesDescLong")}
                    </p>
                  </div>
                  <Button
                    onClick={handleAddContingent}
                    className="profile-section__add-button"
                    type="button"
                  >
                    {t("profile.addBeneficiary")}
                  </Button>
                </div>

                {contingentBeneficiaries.map((beneficiary) => {
                  const otherTotal = contingentBeneficiaries
                    .filter((b) => b.id !== beneficiary.id)
                    .reduce((sum, b) => sum + b.percentage, 0);
                  const maxPercentage = 100 - otherTotal;
                  const percentageError =
                    beneficiary.percentage > maxPercentage
                      ? t("profile.cannotExceedRemaining", { max: maxPercentage.toFixed(1) })
                      : null;

                  return (
                    <div key={beneficiary.id} className="profile-section__beneficiary-card">
                      <div className="profile-section__beneficiary-card-header">
                        <h4 className="profile-section__beneficiary-card-title">{t("profile.contingentBeneficiary")}</h4>
                        <Button
                          onClick={() => handleRemoveContingent(beneficiary.id)}
                          className="profile-section__remove-button"
                          type="button"
                          aria-label={t("profile.removeBeneficiaryAria")}
                        >
                          {t("profile.remove")}
                        </Button>
                      </div>
                      <div className="profile-section__beneficiary-form">
                        <Input
                          label={t("profile.fullLegalName")}
                          type="text"
                          name={`contingent-name-${beneficiary.id}`}
                          value={beneficiary.name}
                          onChange={(e) => handleUpdateContingent(beneficiary.id, { name: e.target.value })}
                          required
                          placeholder={t("profile.placeholderFullName")}
                        />
                        <Input
                          label={t("profile.relationship")}
                          type="text"
                          name={`contingent-relationship-${beneficiary.id}`}
                          value={beneficiary.relationship}
                          onChange={(e) =>
                            handleUpdateContingent(beneficiary.id, { relationship: e.target.value })
                          }
                          required
                          placeholder={t("profile.placeholderRelationship")}
                        />
                        <div className="profile-section__field">
                          <Input
                            label={t("profile.percentageAllocation")}
                            type="number"
                            name={`contingent-percentage-${beneficiary.id}`}
                            value={beneficiary.percentage > 0 ? beneficiary.percentage.toString() : ""}
                            onChange={(e) => {
                              const value = parseFloat(e.target.value) || 0;
                              handleUpdateContingent(beneficiary.id, { percentage: value });
                            }}
                            min="0"
                            max={maxPercentage}
                            step="0.1"
                            required
                            error={percentageError || undefined}
                          />
                          <p className="profile-section__helper-text">
                            {t("profile.remaining", { pct: contingentRemaining.toFixed(1) })}
                          </p>
                        </div>
                        <div className="profile-section__field">
                          <Input
                            label={t("profile.dateOfBirthOptional")}
                            type="date"
                            name={`contingent-dob-${beneficiary.id}`}
                            value={beneficiary.dateOfBirth || ""}
                            onChange={(e) =>
                              handleUpdateContingent(beneficiary.id, {
                                dateOfBirth: e.target.value || undefined,
                              })
                            }
                          />
                        </div>
                      </div>
                    </div>
                  );
                })}

                {contingentBeneficiaries.length > 0 && (
                  <div className="profile-section__validation-summary">
                    <div className="profile-section__validation-row">
                      <span className="profile-section__validation-label">{t("profile.contingentTotal")}</span>
                      <span
                        className={`profile-section__validation-value ${
                          contingentIsValid
                            ? "profile-section__validation-value--valid"
                            : "profile-section__validation-value--invalid"
                        }`}
                      >
                        {contingentTotal.toFixed(1)}%
                      </span>
                      <span
                        className={`profile-section__status-badge profile-section__status-badge--${
                          contingentIsValid ? "complete" : "incomplete"
                        }`}
                      >
                        {contingentStatus}
                      </span>
                    </div>
                    {!contingentIsValid && (
                      <p className="profile-section__validation-error" role="alert">
                        {t("profile.contingentMustTotal100")}
                      </p>
                    )}
                  </div>
                )}
              </div>
            </div>

            <div className="profile-section__actions">
              <Button onClick={handleCancel} className="profile-section__button profile-section__button--cancel">
                {t("profile.cancel")}
              </Button>
              <Button
                onClick={handleSaveClick}
                disabled={!isValid}
                className="profile-section__button profile-section__button--save"
              >
                {t("profile.saveChanges")}
              </Button>
            </div>
            {!isValid && (
              <p className="profile-section__validation-summary-text" role="alert">
                {t("profile.correctValidationErrors")}
              </p>
            )}
            {data.lastUpdated && (
              <p className="profile-section__timestamp">{t("profile.lastUpdated", { date: data.lastUpdated })}</p>
            )}
          </div>
        </div>

        {/* Confirmation Modal */}
        <BeneficiaryConfirmationModal
          isOpen={showConfirmModal}
          onClose={() => setShowConfirmModal(false)}
          onConfirm={handleConfirmSave}
          primaryBeneficiaries={primaryBeneficiaries}
          contingentBeneficiaries={contingentBeneficiaries}
        />
      </>
    );
  }

  // View Mode
  return (
    <div className="profile-section">
      <div className="profile-section__header">
        <h2 className="profile-section__title">{t("profile.beneficiaries")}</h2>
        <Button onClick={onEdit} className="profile-section__edit-button">
          {t("profile.editBeneficiaries")}
        </Button>
      </div>
      <div className="profile-section__content">
        {/* Primary Beneficiaries Table */}
        <div className="profile-section__beneficiaries-table-group">
          <div className="profile-section__table-header">
            <h3 className="profile-section__table-title">{t("profile.primaryBeneficiaries")}</h3>
            <span
              className={`profile-section__status-badge profile-section__status-badge--${
                primaryIsValid ? "complete" : "incomplete"
              }`}
            >
              {primaryStatus}
            </span>
          </div>
          {primaryBeneficiaries.length > 0 ? (
            <>
              <div className="profile-section__table">
                <div className="profile-section__table-row profile-section__table-row--header">
                  <div className="profile-section__table-cell">{t("profile.name")}</div>
                  <div className="profile-section__table-cell">{t("profile.relationship")}</div>
                  <div className="profile-section__table-cell">Allocation</div>
                  {primaryBeneficiaries.some((b) => b.dateOfBirth) && (
                    <div className="profile-section__table-cell">Date of Birth</div>
                  )}
                </div>
                {primaryBeneficiaries.map((beneficiary) => (
                  <div key={beneficiary.id} className="profile-section__table-row">
                    <div className="profile-section__table-cell">
                      <span className="profile-section__table-cell-value">{beneficiary.name}</span>
                    </div>
                    <div className="profile-section__table-cell">
                      <span className="profile-section__table-cell-value">{beneficiary.relationship}</span>
                    </div>
                    <div className="profile-section__table-cell">
                      <span className="profile-section__table-cell-value profile-section__table-cell-value--percentage">
                        {beneficiary.percentage.toFixed(1)}%
                      </span>
                    </div>
                    {primaryBeneficiaries.some((b) => b.dateOfBirth) && (
                      <div className="profile-section__table-cell">
                        <span className="profile-section__table-cell-value">
                          {beneficiary.dateOfBirth
                            ? new Date(beneficiary.dateOfBirth).toLocaleDateString("en-US", {
                                year: "numeric",
                                month: "short",
                                day: "numeric",
                              })
                            : "—"}
                        </span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
              <div className="profile-section__table-footer">
                <span className="profile-section__table-footer-label">Total:</span>
                <span
                  className={`profile-section__table-footer-value ${
                    primaryIsValid
                      ? "profile-section__table-footer-value--valid"
                      : "profile-section__table-footer-value--invalid"
                  }`}
                >
                  {primaryTotal.toFixed(1)}%
                </span>
              </div>
            </>
          ) : (
            <p className="profile-section__empty-state">No primary beneficiaries on file</p>
          )}
        </div>

        {/* Contingent Beneficiaries Table */}
        {contingentBeneficiaries.length > 0 && (
          <div className="profile-section__beneficiaries-table-group">
            <div className="profile-section__table-header">
              <h3 className="profile-section__table-title">{t("profile.contingentBeneficiaries")}</h3>
              <span
                className={`profile-section__status-badge profile-section__status-badge--${
                  contingentIsValid ? "complete" : "incomplete"
                }`}
              >
                {contingentStatus}
              </span>
            </div>
            <div className="profile-section__table">
              <div className="profile-section__table-row profile-section__table-row--header">
                <div className="profile-section__table-cell">{t("profile.name")}</div>
                <div className="profile-section__table-cell">{t("profile.relationship")}</div>
                <div className="profile-section__table-cell">Allocation</div>
                {contingentBeneficiaries.some((b) => b.dateOfBirth) && (
                  <div className="profile-section__table-cell">{t("profile.dateOfBirthOptional")}</div>
                )}
              </div>
              {contingentBeneficiaries.map((beneficiary) => (
                <div key={beneficiary.id} className="profile-section__table-row">
                  <div className="profile-section__table-cell">
                    <span className="profile-section__table-cell-value">{beneficiary.name}</span>
                  </div>
                  <div className="profile-section__table-cell">
                    <span className="profile-section__table-cell-value">{beneficiary.relationship}</span>
                  </div>
                  <div className="profile-section__table-cell">
                    <span className="profile-section__table-cell-value profile-section__table-cell-value--percentage">
                      {beneficiary.percentage.toFixed(1)}%
                    </span>
                  </div>
                  {contingentBeneficiaries.some((b) => b.dateOfBirth) && (
                    <div className="profile-section__table-cell">
                      <span className="profile-section__table-cell-value">
                        {beneficiary.dateOfBirth
                          ? new Date(beneficiary.dateOfBirth).toLocaleDateString("en-US", {
                              year: "numeric",
                              month: "short",
                              day: "numeric",
                            })
                          : "—"}
                      </span>
                    </div>
                  )}
                </div>
              ))}
            </div>
            <div className="profile-section__table-footer">
              <span className="profile-section__table-footer-label">Total:</span>
              <span
                className={`profile-section__table-footer-value ${
                  contingentIsValid
                    ? "profile-section__table-footer-value--valid"
                    : "profile-section__table-footer-value--invalid"
                }`}
              >
                {contingentTotal.toFixed(1)}%
              </span>
            </div>
          </div>
        )}

        {primaryBeneficiaries.length === 0 && contingentBeneficiaries.length === 0 && (
          <p className="profile-section__empty-state">No beneficiaries on file</p>
        )}

        {data.lastUpdated && (
          <p className="profile-section__timestamp">Last updated: {data.lastUpdated}</p>
        )}
      </div>
    </div>
  );
};

/**
 * BeneficiaryConfirmationModal - Confirmation modal for beneficiary changes
 * Explains legal impact and requires explicit confirmation
 */
interface BeneficiaryConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  primaryBeneficiaries: Beneficiary[];
  contingentBeneficiaries: Beneficiary[];
}

const BeneficiaryConfirmationModal = ({
  isOpen,
  onClose,
  onConfirm,
  primaryBeneficiaries,
  contingentBeneficiaries,
}: BeneficiaryConfirmationModalProps) => {
  const { t } = useTranslation();
  const [confirmed, setConfirmed] = useState(false);

  const handleConfirm = () => {
    if (confirmed) {
      onConfirm();
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} closeOnOverlayClick={false}>
      <div className="beneficiary-confirmation-modal">
        <div className="beneficiary-confirmation-modal__header">
          <h2 className="beneficiary-confirmation-modal__title">{t("profile.confirmBeneficiaryChanges")}</h2>
        </div>

        <div className="beneficiary-confirmation-modal__content">
          <div className="beneficiary-confirmation-modal__warning">
            <p className="beneficiary-confirmation-modal__warning-text">
              {t("profile.legalImplicationsWarning")}
            </p>
          </div>

          <div className="beneficiary-confirmation-modal__summary">
            <h3 className="beneficiary-confirmation-modal__summary-title">{t("profile.summaryOfChanges")}</h3>
            <div className="beneficiary-confirmation-modal__summary-section">
              <h4 className="beneficiary-confirmation-modal__summary-subtitle">{t("profile.primaryBeneficiaries")}</h4>
              <ul className="beneficiary-confirmation-modal__summary-list">
                {primaryBeneficiaries.map((beneficiary) => (
                  <li key={beneficiary.id}>
                    {beneficiary.name} ({beneficiary.relationship}) — {beneficiary.percentage.toFixed(1)}%
                  </li>
                ))}
              </ul>
            </div>
            {contingentBeneficiaries.length > 0 && (
              <div className="beneficiary-confirmation-modal__summary-section">
                <h4 className="beneficiary-confirmation-modal__summary-subtitle">{t("profile.contingentBeneficiaries")}</h4>
                <ul className="beneficiary-confirmation-modal__summary-list">
                  {contingentBeneficiaries.map((beneficiary) => (
                    <li key={beneficiary.id}>
                      {beneficiary.name} ({beneficiary.relationship}) — {beneficiary.percentage.toFixed(1)}%
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          <div className="beneficiary-confirmation-modal__confirmation">
            <label className="beneficiary-confirmation-modal__checkbox-label">
              <input
                type="checkbox"
                id="beneficiary-confirm"
                className="beneficiary-confirmation-modal__checkbox"
                checked={confirmed}
                onChange={(e) => setConfirmed(e.target.checked)}
                required
              />
              <span>{t("profile.confirmBeneficiaryCheckbox")}</span>
            </label>
          </div>
        </div>

        <div className="beneficiary-confirmation-modal__footer">
          <Button
            onClick={onClose}
            className="beneficiary-confirmation-modal__button beneficiary-confirmation-modal__button--cancel"
          >
            {t("profile.cancel")}
          </Button>
          <Button
            onClick={handleConfirm}
            disabled={!confirmed}
            className="beneficiary-confirmation-modal__button beneficiary-confirmation-modal__button--confirm"
          >
            {t("profile.saveChanges")}
          </Button>
        </div>
      </div>
    </Modal>
  );
};
