import { useState } from "react";
import { motion } from "framer-motion";
import { Upload, FileText, CheckCircle2, X } from "lucide-react";
import { FlowPageHeader, FlowNavButtons } from "@/components/transactions/FigmaFlowUI";
import { useVersionedTxNavigate } from "../lib/nav";

const DOCS = [
  { name: "Spousal Consent Form", description: "Required if married and balance exceeds $5,000", required: true },
  { name: "Prior Plan Statement", description: "Most recent account statement from previous plan", required: true },
  { name: "Distribution Check", description: "If rolling over via check from prior plan", required: false },
];

interface UploadedFile { id: string; name: string; size: string; docType: string; }

export default function RolloverDocumentsPage() {
  const go = useVersionedTxNavigate();
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);

  const handleUpload = (docType: string) => {
    setUploadedFiles((prev) => [...prev, { id: Math.random().toString(), name: `${docType}.pdf`, size: "312 KB", docType }]);
  };

  const handleRemove = (id: string) => setUploadedFiles((prev) => prev.filter((f) => f.id !== id));

  const allRequired = DOCS.filter((d) => d.required).every((d) => uploadedFiles.some((f) => f.docType === d.name));

  return (
    <div className="space-y-4 w-full">
      <FlowPageHeader
        title="Required Documents"
        description="Upload any required forms — for example spousal consent or plan statements."
      />

      <div className="space-y-4">
        {DOCS.map((doc, i) => {
          const isUploaded = uploadedFiles.some((f) => f.docType === doc.name);
          return (
            <motion.div
              key={doc.name}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.05 + i * 0.04 }}
            >
              <div style={{ background: "var(--card-bg)", borderRadius: 16, border: "1px solid var(--border)", padding: "20px 24px" }}>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2.5" style={{ marginBottom: 4 }}>
                      <h3 style={{ fontSize: 14, fontWeight: 700, color: "var(--foreground)" }}>{doc.name}</h3>
                      {doc.required && (
                        <span
                          className="rounded-md px-2 py-0.5 text-[11px] font-bold"
                          style={{
                            background: "color-mix(in srgb, var(--color-danger) 18%, var(--background))",
                            color: "var(--color-danger)",
                          }}
                        >
                          Required
                        </span>
                      )}
                    </div>
                    <p style={{ fontSize: 12, fontWeight: 500, color: "var(--color-text-secondary)" }}>{doc.description}</p>
                  </div>
                  {isUploaded ? (
                    <CheckCircle2 className="h-6 w-6 flex-shrink-0 text-emerald-600 dark:text-emerald-400" />
                  ) : (
                    <button
                      type="button"
                      onClick={() => handleUpload(doc.name)}
                      className="flex items-center gap-2 cursor-pointer flex-shrink-0"
                      style={{ background: "var(--card-bg)", border: "1.5px solid var(--border)", color: "var(--color-text-secondary)", padding: "8px 14px", borderRadius: 10, fontSize: 12, fontWeight: 600 }}
                    >
                      <Upload style={{ width: 14, height: 14 }} />
                      Upload
                    </button>
                  )}
                </div>
                {uploadedFiles.filter((f) => f.docType === doc.name).map((file) => (
                  <div
                    key={file.id}
                    className="flex items-center justify-between"
                    style={{ padding: "10px 14px", background: "var(--color-background-secondary)", borderRadius: 10, border: "1px solid var(--border)", marginTop: 8 }}
                  >
                    <div className="flex items-center gap-3">
                      <FileText style={{ width: 18, height: 18, color: "var(--color-text-secondary)" }} />
                      <div>
                        <p style={{ fontSize: 13, fontWeight: 600, color: "var(--foreground)" }}>{file.name}</p>
                        <p style={{ fontSize: 11, fontWeight: 500, color: "var(--color-text-tertiary)" }}>{file.size}</p>
                      </div>
                    </div>
                    <button type="button" onClick={() => handleRemove(file.id)} style={{ width: 28, height: 28, borderRadius: 7, border: "1px solid var(--border)", background: "var(--card-bg)", color: "var(--color-text-secondary)", cursor: "pointer" }}>
                      <X style={{ width: 14, height: 14 }} />
                    </button>
                  </div>
                ))}
              </div>
            </motion.div>
          );
        })}
      </div>

      <FlowNavButtons
        backLabel="Back to Validation"
        nextLabel="Continue to Allocation"
        onBack={() => go("rollover/validation")}
        onNext={() => go("rollover/allocation")}
        disabled={!allRequired}
      />
    </div>
  );
}
