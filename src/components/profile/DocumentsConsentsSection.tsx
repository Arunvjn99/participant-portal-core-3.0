import { useTranslation } from "react-i18next";
import Button from "../ui/Button";
import type { Document } from "../../data/mockProfile";

interface DocumentsConsentsSectionProps {
  data: Document[];
}

/**
 * DocumentsConsentsSection - Documents and consents section
 * Read-only with download options
 */
export const DocumentsConsentsSection = ({ data }: DocumentsConsentsSectionProps) => {
  const { t } = useTranslation();
  const handleDownload = (document: Document) => {
    // TODO: Implement download logic
    console.log("Download document:", document.id);
  };

  const groupedDocuments = {
    consent: data.filter((d) => d.type === "consent"),
    taxForm: data.filter((d) => d.type === "tax-form"),
    uploaded: data.filter((d) => d.type === "uploaded"),
  };

  return (
    <div className="profile-section">
      <div className="profile-section__header">
        <h2 className="profile-section__title">{t("profile.documentsConsents")}</h2>
      </div>
      <div className="profile-section__content">
        {groupedDocuments.consent.length > 0 && (
          <div className="profile-section__field-group">
            <h3 className="profile-section__field-group-title">{t("profile.consentHistory")}</h3>
            <div className="profile-section__documents-list">
              {groupedDocuments.consent.map((document) => (
                <div key={document.id} className="profile-section__document-item">
                  <div className="profile-section__document-info">
                    <span className="profile-section__document-name">{document.name}</span>
                    <span className="profile-section__document-date">
                      {new Date(document.date).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </span>
                    <span
                      className={`profile-section__document-status profile-section__document-status--${document.status}`}
                    >
                      {document.status.charAt(0).toUpperCase() + document.status.slice(1)}
                    </span>
                  </div>
                  {document.downloadUrl && (
                    <Button
                      onClick={() => handleDownload(document)}
                      className="profile-section__document-button"
                      type="button"
                    >
                      {t("profile.download")}
                    </Button>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {groupedDocuments.taxForm.length > 0 && (
          <div className="profile-section__field-group">
            <h3 className="profile-section__field-group-title">{t("profile.taxForms")}</h3>
            <div className="profile-section__documents-list">
              {groupedDocuments.taxForm.map((document) => (
                <div key={document.id} className="profile-section__document-item">
                  <div className="profile-section__document-info">
                    <span className="profile-section__document-name">{document.name}</span>
                    <span className="profile-section__document-date">
                      {new Date(document.date).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </span>
                    <span
                      className={`profile-section__document-status profile-section__document-status--${document.status}`}
                    >
                      {document.status.charAt(0).toUpperCase() + document.status.slice(1)}
                    </span>
                  </div>
                  {document.downloadUrl && (
                    <Button
                      onClick={() => handleDownload(document)}
                      className="profile-section__document-button"
                      type="button"
                    >
                      {t("profile.download")}
                    </Button>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {groupedDocuments.uploaded.length > 0 && (
          <div className="profile-section__field-group">
            <h3 className="profile-section__field-group-title">{t("profile.uploadedDocuments")}</h3>
            <div className="profile-section__documents-list">
              {groupedDocuments.uploaded.map((document) => (
                <div key={document.id} className="profile-section__document-item">
                  <div className="profile-section__document-info">
                    <span className="profile-section__document-name">{document.name}</span>
                    <span className="profile-section__document-date">
                      {new Date(document.date).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </span>
                    <span
                      className={`profile-section__document-status profile-section__document-status--${document.status}`}
                    >
                      {document.status.charAt(0).toUpperCase() + document.status.slice(1)}
                    </span>
                  </div>
                  {document.downloadUrl && (
                    <Button
                      onClick={() => handleDownload(document)}
                      className="profile-section__document-button"
                      type="button"
                    >
                      {t("profile.download")}
                    </Button>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {data.length === 0 && (
          <p className="profile-section__empty-state">{t("profile.noDocumentsOnFile")}</p>
        )}
      </div>
    </div>
  );
};
