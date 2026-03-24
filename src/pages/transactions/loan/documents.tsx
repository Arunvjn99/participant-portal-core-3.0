import { useState } from "react";
import { motion } from "framer-motion";
import { Upload, FileText, CheckCircle2, X } from "lucide-react";
import { FlowPageHeader, FlowNavButtons } from "@/components/transactions/FigmaFlowUI";
import { useVersionedTxNavigate } from "../lib/nav";

interface UploadedFile {
  id: string;
  name: string;
  size: string;
  docType: string;
}

const REQUIRED_DOCS = [
  { name: "Check Leaf", description: "Voided check or bank statement", required: true },
  { name: "Promissory Note", description: "Legal agreement to repay the loan", required: true },
  { name: "Spousal Consent", description: "Required if married — spouse must consent to the loan", required: true },
  { name: "Purchase Agreement", description: "Required for residential loans", required: false },
  { name: "Employment Verification", description: "Proof of current employment status (if required by plan)", required: false },
];

export default function LoanDocumentsPage() {
  const go = useVersionedTxNavigate();
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [useDocuSign, setUseDocuSign] = useState(false);

  const handleUpload = (docType: string) => {
    setUploadedFiles((prev) => [
      ...prev,
      { id: Math.random().toString(), name: `${docType}_document.pdf`, size: "234 KB", docType },
    ]);
  };

  const handleRemove = (id: string) => setUploadedFiles((prev) => prev.filter((f) => f.id !== id));

  const handleDocuSign = () => {
    setUseDocuSign(true);
    setTimeout(() => {
      REQUIRED_DOCS.filter((d) => d.required).forEach((d) => handleUpload(d.name));
    }, 800);
  };

  const allRequiredDone =
    useDocuSign ||
    REQUIRED_DOCS.filter((d) => d.required).every((d) => uploadedFiles.some((f) => f.docType === d.name));

  return (
    <div className="space-y-6 w-full">
      <FlowPageHeader
        title="Required Documents"
        description="Upload the necessary documents or sign electronically via DocuSign."
      />

      {/* DocuSign Banner */}
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, ease: "easeOut", delay: 0.05 }}>
        <div
          style={{
            background: "linear-gradient(135deg, color-mix(in srgb, var(--color-primary) 14%, var(--background)) 0%, color-mix(in srgb, var(--color-primary) 10%, var(--muted)) 100%)",
            border: "1px solid color-mix(in srgb, var(--color-primary) 35%, var(--border))",
            borderRadius: 16,
            padding: "24px 28px",
          }}
        >
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              <h3 style={{ fontSize: 15, fontWeight: 700, color: "var(--foreground)", letterSpacing: "-0.3px", marginBottom: 8 }}>
                Sign with DocuSign
              </h3>
              <p style={{ fontSize: 13, fontWeight: 500, color: "var(--color-text-secondary)", marginBottom: 16, lineHeight: "20px" }}>
                Complete all required documents electronically in minutes with DocuSign&apos;s secure platform.
              </p>
              {useDocuSign && (
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                  <span className="text-[13px] font-semibold text-emerald-700 dark:text-emerald-300">
                    DocuSign completed successfully
                  </span>
                </div>
              )}
            </div>
            {!useDocuSign && (
              <button
                type="button"
                onClick={handleDocuSign}
                className="flex-shrink-0 cursor-pointer transition-all duration-200"
                style={{
                  background: "var(--color-primary)",
                  color: "var(--btn-primary-text)",
                  padding: "10px 16px",
                  borderRadius: 10,
                  fontSize: 13,
                  fontWeight: 600,
                  border: "none",
                  boxShadow: "0 4px 12px rgba(37,99,235,0.3)",
                }}
              >
                Sign with DocuSign
              </button>
            )}
          </div>
        </div>
      </motion.div>

      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full" style={{ borderTop: "1px solid var(--border)" }} />
        </div>
        <div className="relative flex justify-center">
          <span style={{ padding: "0 16px", background: "var(--color-background-secondary)", fontSize: 12, fontWeight: 500, color: "var(--color-text-tertiary)" }}>
            or upload manually
          </span>
        </div>
      </div>

      {/* Document List */}
      <div className="space-y-4">
        {REQUIRED_DOCS.map((doc, i) => {
          const isUploaded = uploadedFiles.some((f) => f.docType === doc.name);
          return (
            <motion.div
              key={doc.name}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 + i * 0.04 }}
            >
              <div style={{ background: "var(--card-bg)", borderRadius: 16, border: "1px solid var(--border)", padding: "20px 24px" }}>
                <div className="flex items-start justify-between" style={{ marginBottom: isUploaded ? 8 : 0 }}>
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
                      className="flex items-center gap-2 cursor-pointer transition-all duration-200 flex-shrink-0"
                      style={{
                        background: "var(--card-bg)",
                        border: "1.5px solid var(--border)",
                        color: "var(--color-text-secondary)",
                        padding: "8px 14px",
                        borderRadius: 10,
                        fontSize: 12,
                        fontWeight: 600,
                      }}
                    >
                      <Upload style={{ width: 14, height: 14 }} />
                      Upload
                    </button>
                  )}
                </div>

                {uploadedFiles
                  .filter((f) => f.docType === doc.name)
                  .map((file) => (
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
                      <button
                        type="button"
                        onClick={() => handleRemove(file.id)}
                        className="flex items-center justify-center cursor-pointer"
                        style={{ width: 28, height: 28, borderRadius: 7, border: "1px solid var(--border)", background: "var(--card-bg)", color: "var(--color-text-secondary)" }}
                      >
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
        backLabel="Back to Fees"
        nextLabel="Continue to Review"
        onBack={() => go("loan/fees")}
        onNext={() => go("loan/review")}
        disabled={!allRequiredDone}
      />
    </div>
  );
}
