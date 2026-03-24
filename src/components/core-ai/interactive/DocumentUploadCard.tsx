import { useState } from "react";
import type { CoreAIStructuredPayload, DocumentUploadCardPayload } from "@/core/ai/interactive/types";

export interface DocumentUploadCardProps {
  payload: DocumentUploadCardPayload;
  onAction: (payload: CoreAIStructuredPayload) => void;
}

export function DocumentUploadCard({ payload, onAction }: DocumentUploadCardProps) {
  const [touched, setTouched] = useState(false);

  return (
    <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-background)] p-4 shadow-sm">
      <p className="text-sm font-semibold text-[var(--color-text)]">{payload.title}</p>
      {payload.helper && (
        <p className="mt-1 text-xs text-[var(--color-textSecondary)]">{payload.helper}</p>
      )}

      <ul className="mt-3 list-disc space-y-1 pl-4 text-sm text-[var(--color-text)]">
        {payload.items.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>

      <label className="mt-4 flex cursor-pointer flex-col items-center rounded-xl border border-dashed border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-6 text-center transition-colors hover:border-primary">
        <span className="text-xs font-medium text-[var(--color-text)]">Tap to attach (demo)</span>
        <span className="mt-1 text-[10px] text-[var(--color-textSecondary)]">Files stay on this device — full upload happens in loan center.</span>
        <input
          type="file"
          className="sr-only"
          accept=".pdf,.png,.jpg,.jpeg"
          multiple
          onChange={() => setTouched(true)}
        />
      </label>
      {touched && (
        <p className="mt-2 text-[11px] text-[var(--color-success)]">Marked as selected — you can still finalize in the app.</p>
      )}

      <div className="mt-4 flex flex-col gap-2">
        <button
          type="button"
          onClick={() => onAction({ action: "document_upload_card_continue", deferred: false })}
          className="w-full rounded-xl bg-primary py-2.5 text-sm font-medium text-white transition-colors hover:bg-primary-hover"
        >
          Continue to review
        </button>
        <button
          type="button"
          onClick={() => onAction({ action: "document_upload_card_continue", deferred: true })}
          className="w-full rounded-xl border border-[var(--color-border)] py-2.5 text-sm font-medium text-[var(--color-textSecondary)] transition-colors hover:bg-[var(--color-surface)]"
        >
          I&apos;ll upload later
        </button>
      </div>
    </div>
  );
}
