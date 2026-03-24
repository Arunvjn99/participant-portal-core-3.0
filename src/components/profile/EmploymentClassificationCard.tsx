import { useState } from "react";
import { useTranslation } from "react-i18next";
import { ProfileCard } from "./ProfileCard";
import type { EmploymentClassification } from "@/data/mockProfile";

interface EmploymentClassificationCardProps {
  data: EmploymentClassification;
  employerName?: string;
}

function formatLabel(s: string): string {
  return s.charAt(0).toUpperCase() + s.slice(1).replace(/-/g, " ");
}

export function EmploymentClassificationCard({ data, employerName }: EmploymentClassificationCardProps) {
  const { t } = useTranslation();
  const [showTooltip, setShowTooltip] = useState(false);

  return (
    <ProfileCard id="employment-classification" title={t("profile.employmentClassification")}>
      <p
        style={{
          fontSize: "0.875rem",
          color: "var(--color-text-secondary)",
          marginBottom: "1rem",
          padding: "0.75rem",
          background: "var(--color-background-secondary)",
          borderRadius: 8,
        }}
      >
        {t("profile.determinedByEmployment")}
      </p>
      <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
        <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
          <span style={{ fontSize: "0.875rem", fontWeight: 500, color: "var(--color-text-secondary)" }}>
            {t("profile.employeeType")}
          </span>
          <span style={{ fontSize: "0.9375rem", color: "var(--color-text)" }}>
            {formatLabel(data.employeeType)}
          </span>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
          <span style={{ fontSize: "0.875rem", fontWeight: 500, color: "var(--color-text-secondary)" }}>
            {t("profile.classificationCategory")}
          </span>
          <span style={{ fontSize: "0.9375rem", color: "var(--color-text)" }}>
            {formatLabel(data.unionStatus)} · {formatLabel(data.compensationType)}
          </span>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
          <span style={{ fontSize: "0.875rem", fontWeight: 500, color: "var(--color-text-secondary)" }}>
            {t("profile.eligibilityStatus")}
          </span>
          <span style={{ fontSize: "0.9375rem", color: "var(--color-text)" }}>
            {formatLabel(data.eligibilityStatus)}
          </span>
        </div>
        {employerName != null && (
          <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
            <span style={{ fontSize: "0.875rem", fontWeight: 500, color: "var(--color-text-secondary)" }}>
              {t("profile.employerName")}
            </span>
            <span style={{ fontSize: "0.9375rem", color: "var(--color-text)" }}>{employerName}</span>
          </div>
        )}
        <div
          style={{ position: "relative", display: "inline-flex", alignItems: "center", gap: 6, marginTop: 4 }}
        >
          <button
            type="button"
            onMouseEnter={() => setShowTooltip(true)}
            onMouseLeave={() => setShowTooltip(false)}
            onFocus={() => setShowTooltip(true)}
            onBlur={() => setShowTooltip(false)}
            aria-label={t("profile.classificationTooltip")}
            style={{
              width: 20,
              height: 20,
              borderRadius: "50%",
              border: "1px solid var(--color-border)",
              background: "var(--color-background-secondary)",
              color: "var(--color-text-secondary)",
              fontSize: "0.75rem",
              fontWeight: 600,
              cursor: "help",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            ?
          </button>
          {showTooltip && (
            <span
              role="tooltip"
              style={{
                position: "absolute",
                left: "100%",
                top: 0,
                marginLeft: 8,
                maxWidth: 260,
                padding: "0.5rem 0.75rem",
                fontSize: "0.8125rem",
                background: "var(--color-text)",
                color: "var(--color-background)",
                borderRadius: 8,
                boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
                zIndex: 10,
              }}
            >
              {t("profile.classificationTooltip")}
            </span>
          )}
        </div>
      </div>
    </ProfileCard>
  );
}
