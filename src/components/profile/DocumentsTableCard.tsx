import { useState, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { ProfileCard } from "./ProfileCard";
import type { Document } from "@/data/mockProfile";

const PAGE_SIZE = 5;

function getCategoryLabel(type: Document["type"]): string {
  if (type === "consent") return "Consent";
  if (type === "tax-form") return "Tax Form";
  return "Uploaded";
}

function getFileTypeLabel(type: Document["type"]): string {
  if (type === "consent") return "PDF";
  if (type === "tax-form") return "PDF";
  return "PDF";
}

interface DocumentsTableCardProps {
  data: Document[];
}

export function DocumentsTableCard({ data }: DocumentsTableCardProps) {
  const { t } = useTranslation();
  const [sortKey, setSortKey] = useState<"date" | "fileType">("date");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("desc");
  const [categoryFilter, setCategoryFilter] = useState<string>("");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(0);

  const filtered = useMemo(() => {
    let list = data;
    if (search.trim()) {
      const q = search.trim().toLowerCase();
      list = list.filter(
        (d) =>
          d.name.toLowerCase().includes(q) ||
          getCategoryLabel(d.type).toLowerCase().includes(q) ||
          d.status.toLowerCase().includes(q)
      );
    }
    if (categoryFilter) {
      list = list.filter((d) => getCategoryLabel(d.type) === categoryFilter);
    }
    return list;
  }, [data, search, categoryFilter]);

  const sorted = useMemo(() => {
    const arr = [...filtered];
    arr.sort((a, b) => {
      if (sortKey === "date") {
        const da = new Date(a.date).getTime();
        const db = new Date(b.date).getTime();
        return sortDir === "asc" ? da - db : db - da;
      }
      const fa = getFileTypeLabel(a.type);
      const fb = getFileTypeLabel(b.type);
      const cmp = fa.localeCompare(fb);
      return sortDir === "asc" ? cmp : -cmp;
    });
    return arr;
  }, [filtered, sortKey, sortDir]);

  const categories = useMemo(() => {
    const set = new Set(data.map((d) => getCategoryLabel(d.type)));
    return Array.from(set).sort();
  }, [data]);

  const totalPages = Math.max(1, Math.ceil(sorted.length / PAGE_SIZE));
  const paginated = useMemo(
    () => sorted.slice(page * PAGE_SIZE, page * PAGE_SIZE + PAGE_SIZE),
    [sorted, page]
  );

  const toggleSort = (key: "date" | "fileType") => {
    if (sortKey === key) setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    else {
      setSortKey(key);
      setSortDir("desc");
    }
  };

  const handleDownload = (doc: Document) => {
    if (doc.downloadUrl) window.open(doc.downloadUrl, "_blank");
    else console.log("Download:", doc.id);
  };

  return (
    <ProfileCard id="documents" title={t("profile.documentsConsents")}>
      <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem", alignItems: "center" }}>
          <input
            type="search"
            placeholder={t("profile.searchDocuments")}
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(0);
            }}
            style={{
              padding: "0.5rem 0.75rem",
              border: "1px solid var(--color-border)",
              borderRadius: 8,
              fontSize: "0.875rem",
              minWidth: 200,
            }}
          />
          <select
            value={categoryFilter}
            onChange={(e) => {
              setCategoryFilter(e.target.value);
              setPage(0);
            }}
            style={{
              padding: "0.5rem 0.75rem",
              border: "1px solid var(--color-border)",
              borderRadius: 8,
              fontSize: "0.875rem",
            }}
          >
            <option value="">{t("profile.filterByCategory")}</option>
            {categories.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
          <button
            type="button"
            onClick={() => toggleSort("date")}
            style={{
              padding: "0.5rem 0.75rem",
              border: "1px solid var(--color-border)",
              borderRadius: 8,
              fontSize: "0.875rem",
              background: "var(--color-background-secondary)",
              cursor: "pointer",
            }}
          >
            {t("profile.sortByDate")} {sortKey === "date" ? (sortDir === "asc" ? "↑" : "↓") : ""}
          </button>
          <button
            type="button"
            onClick={() => toggleSort("fileType")}
            style={{
              padding: "0.5rem 0.75rem",
              border: "1px solid var(--color-border)",
              borderRadius: 8,
              fontSize: "0.875rem",
              background: "var(--color-background-secondary)",
              cursor: "pointer",
            }}
          >
            {t("profile.sortByFileType")} {sortKey === "fileType" ? (sortDir === "asc" ? "↑" : "↓") : ""}
          </button>
        </div>

        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.875rem" }}>
            <thead>
              <tr style={{ borderBottom: "2px solid var(--color-border)", background: "var(--color-background-secondary)" }}>
                <th style={{ textAlign: "left", padding: "0.75rem", fontWeight: 600 }}>{t("profile.fileName")}</th>
                <th style={{ textAlign: "left", padding: "0.75rem", fontWeight: 600 }}>{t("profile.fileType")}</th>
                <th style={{ textAlign: "left", padding: "0.75rem", fontWeight: 600 }}>{t("profile.category")}</th>
                <th style={{ textAlign: "left", padding: "0.75rem", fontWeight: 600 }}>{t("profile.uploadedDate")}</th>
                <th style={{ textAlign: "left", padding: "0.75rem", fontWeight: 600 }}>{t("profile.status")}</th>
                <th style={{ textAlign: "right", padding: "0.75rem", fontWeight: 600 }}>{t("profile.actions")}</th>
              </tr>
            </thead>
            <tbody>
              {paginated.length === 0 ? (
                <tr>
                  <td colSpan={6} style={{ padding: "1.5rem", textAlign: "center", color: "var(--color-text-secondary)" }}>
                    {t("profile.noDocumentsOnFile")}
                  </td>
                </tr>
              ) : (
                paginated.map((doc) => (
                  <tr key={doc.id} style={{ borderBottom: "1px solid var(--color-border)" }}>
                    <td style={{ padding: "0.75rem" }}>{doc.name}</td>
                    <td style={{ padding: "0.75rem" }}>{getFileTypeLabel(doc.type)}</td>
                    <td style={{ padding: "0.75rem" }}>{getCategoryLabel(doc.type)}</td>
                    <td style={{ padding: "0.75rem" }}>
                      {new Date(doc.date).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" })}
                    </td>
                    <td style={{ padding: "0.75rem" }}>
                      <span
                        style={{
                          fontSize: "0.75rem",
                          fontWeight: 600,
                          padding: "2px 6px",
                          borderRadius: 4,
                          background:
                            doc.status === "active"
                              ? "var(--color-success-light)"
                              : doc.status === "expired"
                                ? "var(--color-error-light)"
                                : "var(--color-warning-light)",
                          color:
                            doc.status === "active"
                              ? "var(--color-success)"
                              : doc.status === "expired"
                                ? "var(--color-error)"
                                : "var(--color-warning)",
                        }}
                      >
                        {doc.status.charAt(0).toUpperCase() + doc.status.slice(1)}
                      </span>
                    </td>
                    <td style={{ padding: "0.75rem", textAlign: "right" }}>
                      <button
                        type="button"
                        onClick={() => handleDownload(doc)}
                        style={{
                          marginLeft: "0.25rem",
                          padding: "0.25rem 0.5rem",
                          fontSize: "0.8125rem",
                          border: "1px solid var(--color-border)",
                          borderRadius: 6,
                          background: "var(--color-background-secondary)",
                          cursor: "pointer",
                        }}
                      >
                        {t("profile.download")}
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {totalPages > 1 && (
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "0.5rem" }}>
            <span style={{ fontSize: "0.8125rem", color: "var(--color-text-secondary)" }}>
              Page {page + 1} of {totalPages}
            </span>
            <div style={{ display: "flex", gap: "0.25rem" }}>
              <button
                type="button"
                disabled={page === 0}
                onClick={() => setPage((p) => p - 1)}
                style={{
                  padding: "0.375rem 0.75rem",
                  border: "1px solid var(--color-border)",
                  borderRadius: 6,
                  background: "var(--color-background-secondary)",
                  cursor: page === 0 ? "not-allowed" : "pointer",
                  opacity: page === 0 ? 0.5 : 1,
                }}
              >
                Previous
              </button>
              <button
                type="button"
                disabled={page >= totalPages - 1}
                onClick={() => setPage((p) => p + 1)}
                style={{
                  padding: "0.375rem 0.75rem",
                  border: "1px solid var(--color-border)",
                  borderRadius: 6,
                  background: "var(--color-background-secondary)",
                  cursor: page >= totalPages - 1 ? "not-allowed" : "pointer",
                  opacity: page >= totalPages - 1 ? 0.5 : 1,
                }}
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    </ProfileCard>
  );
}
