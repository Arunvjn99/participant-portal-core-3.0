import type { ReactNode } from "react";

export type SearchOverlayProps = {
  children: ReactNode;
  onClose: () => void;
  /** Root id for aria */
  labelId: string;
};

/**
 * Full-screen dimmed backdrop + elevated stage for the AI command surface.
 */
export function SearchOverlay({ children, onClose, labelId }: SearchOverlayProps) {
  return (
    <div className="ai-command-root" role="presentation">
      <button
        type="button"
        className="ai-command-scrim"
        aria-hidden
        tabIndex={-1}
        onClick={onClose}
      />
      <div
        className="ai-command-stage"
        role="dialog"
        aria-modal="true"
        aria-labelledby={labelId}
        onClick={(e) => e.stopPropagation()}
      >
        {children}
      </div>
    </div>
  );
}
