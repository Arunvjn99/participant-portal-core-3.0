import { useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { ProfileCard } from "./ProfileCard";

interface ProfileHeaderCardProps {
  fullName: string;
  status?: "verified" | "complete";
  lastUpdated?: string;
}

const cardStyle: React.CSSProperties = {
  background: "var(--color-background)",
  border: "1px solid var(--color-border)",
  borderRadius: "12px",
  boxShadow: "var(--shadow-sm, 0 1px 3px rgba(0,0,0,0.06))",
  padding: "1.5rem 1.5rem",
};

export function ProfileHeaderCard({ fullName, status = "complete", lastUpdated }: ProfileHeaderCardProps) {
  const { t } = useTranslation();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !file.type.startsWith("image/")) return;
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);
    e.target.value = "";
  };

  const statusLabel = status === "verified" ? t("profile.verified") : t("profile.complete");

  return (
    <article id="profile-header" className="profile-card profile-header-card" style={cardStyle}>
      <div
        className="profile-header-card__inner"
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "1rem",
          textAlign: "center",
        }}
      >
        <div style={{ position: "relative" }}>
          <button
            type="button"
            onClick={handleAvatarClick}
            className="profile-header-card__avatar-wrap"
            style={{
              display: "block",
              padding: 0,
              border: "none",
              background: "none",
              cursor: "pointer",
              borderRadius: "50%",
            }}
            aria-label={t("profile.uploadPhoto")}
          >
            <div
              style={{
                width: 96,
                height: 96,
                borderRadius: "50%",
                overflow: "hidden",
                background: "var(--color-background-secondary)",
                border: "2px solid var(--color-border)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              {previewUrl ? (
                <img
                  src={previewUrl}
                  alt=""
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                />
              ) : (
                <span
                  style={{
                    fontSize: "2rem",
                    color: "var(--color-text-secondary)",
                    fontWeight: 600,
                  }}
                  aria-hidden
                >
                  {fullName.charAt(0).toUpperCase()}
                </span>
              )}
            </div>
            <span
              className="profile-header-card__upload-label"
              style={{
                position: "absolute",
                bottom: 0,
                left: "50%",
                transform: "translateX(-50%)",
                fontSize: "0.7rem",
                fontWeight: 600,
                padding: "2px 8px",
                borderRadius: 6,
                background: "var(--color-primary)",
                color: "var(--color-text-on-primary)",
                whiteSpace: "nowrap",
              }}
            >
              {t("profile.upload")}
            </span>
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            style={{ position: "absolute", width: 0, height: 0, opacity: 0, pointerEvents: "none" }}
            aria-hidden
          />
        </div>
        <div>
          <h1
            className="profile-header-card__name"
            style={{
              fontSize: "1.25rem",
              fontWeight: 600,
              margin: 0,
              color: "var(--color-text)",
            }}
          >
            {fullName}
          </h1>
          <span
            className="profile-header-card__badge"
            style={{
              display: "inline-block",
              marginTop: "0.35rem",
              fontSize: "0.75rem",
              fontWeight: 600,
              padding: "2px 8px",
              borderRadius: 9999,
              background: "var(--color-success-light)",
              color: "var(--color-success)",
            }}
          >
            {statusLabel}
          </span>
        </div>
        {lastUpdated && (
          <p
            className="profile-header-card__updated"
            style={{
              fontSize: "0.8125rem",
              color: "var(--color-text-secondary)",
              margin: 0,
            }}
          >
            {t("profile.lastUpdated", { date: lastUpdated })}
          </p>
        )}
      </div>
    </article>
  );
}
