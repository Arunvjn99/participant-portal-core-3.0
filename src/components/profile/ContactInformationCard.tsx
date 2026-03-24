import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Input } from "../ui/Input";
import Button from "../ui/Button";
import { ProfileCard } from "./ProfileCard";
import type { ContactInformation } from "@/data/mockProfile";

interface ContactInformationCardProps {
  data: ContactInformation;
  onSave: (data: ContactInformation) => void;
}

export function ContactInformationCard({ data, onSave }: ContactInformationCardProps) {
  const { t } = useTranslation();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<ContactInformation>(data);

  const handleSave = () => {
    onSave({
      ...formData,
      emailVerified: formData.email !== data.email ? false : data.emailVerified,
      phoneVerified: formData.phone !== data.phone ? false : data.phoneVerified,
      lastUpdated: new Date().toISOString().split("T")[0],
    });
    setIsEditing(false);
  };

  const handleCancel = () => {
    setFormData(data);
    setIsEditing(false);
  };

  const editBtn = (
    <button
      type="button"
      onClick={() => setIsEditing(true)}
      style={{
        fontSize: "0.875rem",
        fontWeight: 600,
        padding: "0.375rem 0.75rem",
        borderRadius: 8,
        border: "1px solid var(--color-border)",
        background: "var(--color-background-secondary)",
        color: "var(--color-text)",
        cursor: "pointer",
      }}
    >
      {t("profile.edit")}
    </button>
  );

  return (
    <ProfileCard id="contact" title={t("profile.contactInformation")} action={!isEditing ? editBtn : undefined}>
      {isEditing ? (
        <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          <Input label={t("profile.email")} type="email" name="email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} required />
          {data.emailVerified && <p style={{ fontSize: "0.8125rem", color: "var(--color-success)" }}>✓ {t("profile.verified")}</p>}
          <Input label={t("profile.phone")} type="tel" name="phone" value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} required />
          {data.phoneVerified && <p style={{ fontSize: "0.8125rem", color: "var(--color-success)" }}>✓ {t("profile.verified")}</p>}
          <Input label={t("profile.streetAddress")} type="text" name="street" value={formData.address.street} onChange={(e) => setFormData({ ...formData, address: { ...formData.address, street: e.target.value } })} required />
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "0.75rem" }}>
            <Input label={t("profile.city")} type="text" name="city" value={formData.address.city} onChange={(e) => setFormData({ ...formData, address: { ...formData.address, city: e.target.value } })} required />
            <Input label={t("profile.state")} type="text" name="state" value={formData.address.state} onChange={(e) => setFormData({ ...formData, address: { ...formData.address, state: e.target.value } })} required />
            <Input label={t("profile.zipCode")} type="text" name="zipCode" value={formData.address.zipCode} onChange={(e) => setFormData({ ...formData, address: { ...formData.address, zipCode: e.target.value } })} required />
          </div>
          <Input label={t("profile.country")} type="text" name="country" value={formData.address.country} onChange={(e) => setFormData({ ...formData, address: { ...formData.address, country: e.target.value } })} required />
          <div style={{ display: "flex", gap: "0.75rem", justifyContent: "flex-end", marginTop: "0.5rem" }}>
            <Button onClick={handleCancel} variant="outline">{t("profile.cancel")}</Button>
            <Button onClick={handleSave}>{t("profile.saveChanges")}</Button>
          </div>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
          <div>
            <span style={{ fontSize: "0.875rem", fontWeight: 500, color: "var(--color-text-secondary)" }}>{t("profile.email")}</span>
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginTop: 2 }}>
              <span style={{ fontSize: "0.9375rem", color: "var(--color-text)" }}>{data.email}</span>
              {data.emailVerified && <span style={{ fontSize: "0.75rem", fontWeight: 600, padding: "2px 6px", borderRadius: 4, background: "var(--color-success-light)", color: "var(--color-success)" }}>{t("profile.verified")}</span>}
            </div>
          </div>
          <div>
            <span style={{ fontSize: "0.875rem", fontWeight: 500, color: "var(--color-text-secondary)" }}>{t("profile.phone")}</span>
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginTop: 2 }}>
              <span style={{ fontSize: "0.9375rem", color: "var(--color-text)" }}>{data.phone}</span>
              {data.phoneVerified && <span style={{ fontSize: "0.75rem", fontWeight: 600, padding: "2px 6px", borderRadius: 4, background: "var(--color-success-light)", color: "var(--color-success)" }}>{t("profile.verified")}</span>}
            </div>
          </div>
          <div>
            <span style={{ fontSize: "0.875rem", fontWeight: 500, color: "var(--color-text-secondary)" }}>{t("profile.address")}</span>
            <p style={{ fontSize: "0.9375rem", color: "var(--color-text)", margin: "2px 0 0 0" }}>{data.address.street}<br />{data.address.city}, {data.address.state} {data.address.zipCode}<br />{data.address.country}</p>
          </div>
          {data.lastUpdated && <p style={{ fontSize: "0.8125rem", color: "var(--color-text-secondary)", marginTop: "0.5rem" }}>{t("profile.lastUpdated", { date: data.lastUpdated })}</p>}
        </div>
      )}
    </ProfileCard>
  );
}
