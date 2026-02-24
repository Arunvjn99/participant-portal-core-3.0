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
      className={`rounded-xl border-2 border-dashed p-6 transition-colors ${
        dragOver && !disabled
          ? "border-[var(--color-primary)] bg-[var(--color-primary)]/5"
          : "border-[var(--color-border)] bg-[var(--color-surface)]"
      } ${disabled ? "opacity-60" : ""}`}
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      initial={reduced ? false : { opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.2 }}
    >
      <p className="mb-2 text-sm font-medium text-[var(--color-text)]">
        {documentType}
        {required && <span className="text-[var(--color-danger)]"> *</span>}
      </p>
      <label className="flex cursor-pointer flex-col items-center gap-2 rounded-lg py-4 text-[var(--color-textSecondary)]">
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
        <ul className="mt-3 space-y-1 text-sm text-[var(--color-textSecondary)]" aria-label="Uploaded files">
          {accepted.map((f) => (
            <li key={f.id}>{f.name}</li>
          ))}
        </ul>
      )}
    </motion.div>
  );
}
