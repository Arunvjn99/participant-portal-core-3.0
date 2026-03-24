import { useState, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { Input } from "../ui/Input";
import Button from "../ui/Button";
import { Modal } from "../ui/Modal";
import { ProfileCard } from "./ProfileCard";
import type { Beneficiary } from "@/data/mockProfile";

interface BeneficiariesCardProps {
  data: { primary: Beneficiary[]; contingent: Beneficiary[]; lastUpdated?: string };
  onSave: (data: { primary: Beneficiary[]; contingent: Beneficiary[]; lastUpdated?: string }) => void;
}

type BeneficiaryType = "primary" | "contingent";

export function BeneficiariesCard({ data, onSave }: BeneficiariesCardProps) {
  const { t } = useTranslation();
  const [primary, setPrimary] = useState<Beneficiary[]>(data.primary);
  const [contingent, setContingent] = useState<Beneficiary[]>(data.contingent);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<Partial<Beneficiary> & { type: BeneficiaryType }>({
    name: "",
    relationship: "",
    dateOfBirth: "",
    percentage: 0,
    type: "primary",
  });

  const primaryTotal = useMemo(() => primary.reduce((s, b) => s + b.percentage, 0), [primary]);
  const contingentTotal = useMemo(() => contingent.reduce((s, b) => s + b.percentage, 0), [contingent]);
  const primaryValid = Math.abs(primaryTotal - 100) < 0.01;
  const contingentValid = contingent.length === 0 || Math.abs(contingentTotal - 100) < 0.01;

  const openAdd = (type: BeneficiaryType) => {
    setEditingId(null);
    setForm({ name: "", relationship: "", dateOfBirth: "", percentage: 0, type });
    setModalOpen(true);
  };

  const openEdit = (b: Beneficiary) => {
    setEditingId(b.id);
    setForm({
      id: b.id,
      name: b.name,
      relationship: b.relationship,
      dateOfBirth: b.dateOfBirth ?? "",
      percentage: b.percentage,
      type: b.type,
    });
    setModalOpen(true);
  };

  const handleModalSave = () => {
    if (!form.name?.trim() || !form.relationship?.trim() || form.percentage == null) return;
    const type = form.type;
    const payload: Beneficiary = {
      id: editingId ?? `ben-${type}-${Date.now()}`,
      name: form.name.trim(),
      relationship: form.relationship.trim(),
      percentage: Math.max(0, Math.min(100, form.percentage)),
      type,
      dateOfBirth: form.dateOfBirth?.trim() || undefined,
    };
    if (editingId) {
      if (type === "primary") {
        setPrimary(primary.map((b) => (b.id === editingId ? payload : b)));
      } else {
        setContingent(contingent.map((b) => (b.id === editingId ? payload : b)));
      }
    } else {
      if (type === "primary") setPrimary([...primary, payload]);
      else setContingent([...contingent, payload]);
    }
    setModalOpen(false);
  };

  const remove = (id: string, type: BeneficiaryType) => {
    if (type === "primary" && primary.length <= 1) return;
    if (type === "primary") setPrimary(primary.filter((b) => b.id !== id));
    else setContingent(contingent.filter((b) => b.id !== id));
  };

  const action = (
    <Button onClick={() => openAdd("primary")} type="button" variant="outline" className="profile-card__add-beneficiary">
      {t("profile.addBeneficiary")}
    </Button>
  );

  return (
    <ProfileCard id="beneficiaries" title={t("profile.beneficiaries")} action={action}>
      <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
        <div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.5rem" }}>
            <h3 style={{ fontSize: "1rem", fontWeight: 600, margin: 0 }}>{t("profile.primaryBeneficiaries")}</h3>
            <span style={{ fontSize: "0.75rem", fontWeight: 600, padding: "2px 8px", borderRadius: 9999, background: primaryValid ? "var(--color-success-light)" : "var(--color-warning-light)", color: primaryValid ? "var(--color-success)" : "var(--color-warning)" }}>
              {primaryValid ? t("profile.complete") : t("profile.incomplete")} ({primaryTotal.toFixed(0)}%)
            </span>
          </div>
          {primary.length === 0 ? (
            <p style={{ fontSize: "0.875rem", color: "var(--color-text-secondary)" }}>{t("profile.atLeastOnePrimaryRequired")}</p>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
              {primary.map((b) => (
                <div key={b.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "0.5rem 0", borderBottom: "1px solid var(--color-border)" }}>
                  <div>
                    <span style={{ fontWeight: 500 }}>{b.name}</span>
                    <span style={{ fontSize: "0.875rem", color: "var(--color-text-secondary)", marginLeft: "0.5rem" }}>{b.relationship}</span>
                    <span style={{ fontSize: "0.875rem", fontWeight: 600, marginLeft: "0.5rem" }}>{b.percentage.toFixed(1)}%</span>
                  </div>
                  <div style={{ display: "flex", gap: "0.25rem" }}>
                    <button type="button" onClick={() => openEdit(b)} style={{ padding: "0.25rem 0.5rem", fontSize: "0.8125rem", border: "1px solid var(--color-border)", borderRadius: 6, background: "var(--color-background-secondary)", cursor: "pointer" }}>{t("profile.edit")}</button>
                    <button type="button" onClick={() => remove(b.id, "primary")} disabled={primary.length <= 1} style={{ padding: "0.25rem 0.5rem", fontSize: "0.8125rem", border: "1px solid var(--color-border)", borderRadius: 6, background: "var(--color-background-secondary)", cursor: primary.length <= 1 ? "not-allowed" : "pointer", opacity: primary.length <= 1 ? 0.5 : 1 }}>{t("profile.remove")}</button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
        <div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.5rem" }}>
            <h3 style={{ fontSize: "1rem", fontWeight: 600, margin: 0 }}>{t("profile.contingentBeneficiaries")}</h3>
            <button type="button" onClick={() => openAdd("contingent")} style={{ fontSize: "0.8125rem", fontWeight: 600, color: "var(--color-primary)", background: "none", border: "none", cursor: "pointer" }}>+ {t("profile.addBeneficiary")}</button>
          </div>
          {contingent.length === 0 ? (
            <p style={{ fontSize: "0.875rem", color: "var(--color-text-secondary)" }}>{t("profile.notSet")}</p>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
              {contingent.map((b) => (
                <div key={b.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "0.5rem 0", borderBottom: "1px solid var(--color-border)" }}>
                  <div>
                    <span style={{ fontWeight: 500 }}>{b.name}</span>
                    <span style={{ fontSize: "0.875rem", color: "var(--color-text-secondary)", marginLeft: "0.5rem" }}>{b.relationship}</span>
                    <span style={{ fontSize: "0.875rem", fontWeight: 600, marginLeft: "0.5rem" }}>{b.percentage.toFixed(1)}%</span>
                  </div>
                  <div style={{ display: "flex", gap: "0.25rem" }}>
                    <button type="button" onClick={() => openEdit(b)} style={{ padding: "0.25rem 0.5rem", fontSize: "0.8125rem", border: "1px solid var(--color-border)", borderRadius: 6, background: "var(--color-background-secondary)", cursor: "pointer" }}>{t("profile.edit")}</button>
                    <button type="button" onClick={() => remove(b.id, "contingent")} style={{ padding: "0.25rem 0.5rem", fontSize: "0.8125rem", border: "1px solid var(--color-border)", borderRadius: 6, background: "var(--color-background-secondary)", cursor: "pointer" }}>{t("profile.remove")}</button>
                  </div>
                </div>
              ))}
              <span style={{ fontSize: "0.75rem", fontWeight: 600, color: contingentValid ? "var(--color-success)" : "var(--color-warning)" }}>{t("profile.contingentTotal")} {contingentTotal.toFixed(0)}%</span>
            </div>
          )}
        </div>
        {!primaryValid && <p style={{ fontSize: "0.875rem", color: "var(--color-error)" }} role="alert">{t("profile.primaryMustTotal100")}</p>}
        <div style={{ display: "flex", justifyContent: "flex-end", gap: "0.5rem" }}>
          <Button
            disabled={!primaryValid || !contingentValid}
            onClick={() => onSave({ primary, contingent, lastUpdated: new Date().toISOString().split("T")[0] })}
          >
            {t("profile.saveChanges")}
          </Button>
        </div>
        {data.lastUpdated && <p style={{ fontSize: "0.8125rem", color: "var(--color-text-secondary)" }}>{t("profile.lastUpdated", { date: data.lastUpdated })}</p>}
      </div>

      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} closeOnOverlayClick={false}>
        <div style={{ padding: "1rem", maxWidth: 400 }}>
          <h3 style={{ marginBottom: "1rem", fontSize: "1.125rem" }}>{editingId ? t("profile.edit") : t("profile.addBeneficiary")}</h3>
          <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
            <Input label={t("profile.fullLegalName")} value={form.name ?? ""} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} placeholder={t("profile.placeholderFullName")} />
            <Input label={t("profile.relationship")} value={form.relationship ?? ""} onChange={(e) => setForm((f) => ({ ...f, relationship: e.target.value }))} placeholder={t("profile.placeholderRelationship")} />
            <Input label={t("profile.dateOfBirthOptional")} type="date" value={form.dateOfBirth ?? ""} onChange={(e) => setForm((f) => ({ ...f, dateOfBirth: e.target.value }))} />
            <div>
              <label style={{ fontSize: "0.875rem", fontWeight: 500, display: "block", marginBottom: 4 }}>{t("profile.percentageAllocation")}</label>
              <input type="number" min={0} max={100} step={0.1} value={form.percentage ?? 0} onChange={(e) => setForm((f) => ({ ...f, percentage: parseFloat(e.target.value) || 0 }))} style={{ width: "100%", padding: "0.5rem", border: "1px solid var(--color-border)", borderRadius: 8 }} />
            </div>
            <div>
              <label style={{ fontSize: "0.875rem", fontWeight: 500, display: "block", marginBottom: 4 }}>Type</label>
              <select value={form.type} onChange={(e) => setForm((f) => ({ ...f, type: e.target.value as BeneficiaryType }))} style={{ width: "100%", padding: "0.5rem", border: "1px solid var(--color-border)", borderRadius: 8 }}>
                <option value="primary">{t("profile.primary")}</option>
                <option value="contingent">{t("profile.secondary")}</option>
              </select>
            </div>
          </div>
          <div style={{ display: "flex", gap: "0.5rem", justifyContent: "flex-end", marginTop: "1rem" }}>
            <Button variant="outline" onClick={() => setModalOpen(false)}>{t("profile.cancel")}</Button>
            <Button onClick={handleModalSave} disabled={!form.name?.trim() || !form.relationship?.trim()}>{t("profile.saveChanges")}</Button>
          </div>
        </div>
      </Modal>
    </ProfileCard>
  );
}
