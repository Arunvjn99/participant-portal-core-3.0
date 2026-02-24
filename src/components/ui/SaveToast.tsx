import { useState, useEffect } from "react";
import { ENROLLMENT_SAVED_TOAST_KEY } from "../../enrollment/enrollmentDraftStore";

/**
 * SaveToast - Shows "Your progress has been saved" when user returns from Save & Exit.
 * Renders at top of Dashboard when sessionStorage flag is set.
 */
export const SaveToast = () => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const flag = sessionStorage.getItem(ENROLLMENT_SAVED_TOAST_KEY);
    if (!flag) return;

    sessionStorage.removeItem(ENROLLMENT_SAVED_TOAST_KEY);
    setVisible(true);

    const t = setTimeout(() => setVisible(false), 4000);
    return () => clearTimeout(t);
  }, []);

  if (!visible) return null;

  return (
    <div
      role="status"
      aria-live="polite"
      className="fixed left-1/2 top-6 z-[100] -translate-x-1/2 rounded-lg border border-[var(--color-success)] bg-[var(--color-success-light)] px-6 py-3 text-sm font-medium text-[var(--color-success)] shadow-[var(--shadow-lg)]"
    >
      Your progress has been saved. You can resume anytime.
    </div>
  );
};
