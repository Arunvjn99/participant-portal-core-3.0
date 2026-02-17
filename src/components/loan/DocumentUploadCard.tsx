import { useCallback, useState } from "react";
import { motion } from "framer-motion";
import { useReducedMotion } from "framer-motion";
import type { LoanDocumentMeta } from "../../types/loan";

interface DocumentUploadCardProps {
  documentType: string;
  required?: boolean;
  onFilesAccepted: (files: File[]) => void;
  accepted?: LoanDocumentMeta[];
  accept?: string;
  disabled?: boolean;
}

/**
 * Drag-drop upload UI. Stores file metadata only (name, size, type). Accessible.
 */
export function DocumentUploadCard({
  documentType,
  required = false,
  onFilesAccepted,
  accepted = [],
  accept = ".pdf,.doc,.docx",
  disabled = false,
}: DocumentUploadCardProps) {
  const [dragOver, setDragOver] = useState(false);
  const reduced = useReducedMotion();

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setDragOver(false);
      if (disabled) return;
      const files = Array.from(e.dataTransfer.files);
      if (files.length) onFilesAccepted(files);
    },
    [disabled, onFilesAccepted]
  );

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
  }, []);

  const handleFileInput = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = e.target.files ? Array.from(e.target.files) : [];
      if (files.length) onFilesAccepted(files);
      e.target.value = "";
    },
    [onFilesAccepted]
  );

  return (
    <motion.div
      className={`rounded-2xl border-2 border-dashed p-6 transition-colors ${disabled ? "opacity-60" : ""}`}
      style={{
        borderColor: dragOver && !disabled ? "var(--enroll-brand)" : "var(--enroll-card-border)",
        background: dragOver && !disabled ? "rgb(var(--enroll-brand-rgb) / 0.08)" : "var(--enroll-soft-bg)",
      }}
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      initial={reduced ? false : { opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.2 }}
    >
      <p className="mb-2 text-sm font-medium" style={{ color: "var(--enroll-text-secondary)" }}>
        {documentType}
        {required && <span style={{ color: "var(--color-danger)" }}> *</span>}
      </p>
      <label
        className="flex cursor-pointer flex-col items-center gap-2 rounded-xl py-4"
        style={{ color: "var(--enroll-text-muted)" }}
      >
        <input
          type="file"
          accept={accept}
          multiple
          onChange={handleFileInput}
          disabled={disabled}
          className="sr-only"
          aria-label={`Upload ${documentType}`}
        />
        <span className="text-center text-sm">Drag and drop or click to upload</span>
      </label>
      {accepted.length > 0 && (
        <ul className="mt-3 space-y-1 text-sm" style={{ color: "var(--enroll-text-muted)" }} aria-label="Uploaded files">
          {accepted.map((f) => (
            <li key={f.id}>{f.name}</li>
          ))}
        </ul>
      )}
    </motion.div>
  );
}
