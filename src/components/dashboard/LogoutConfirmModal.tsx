import * as Dialog from "@radix-ui/react-dialog";
import { useTranslation } from "react-i18next";
import { X } from "lucide-react";

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
};

/**
 * Confirms sign-out from the dashboard header. Separate from the global in-app feedback widget.
 */
export function LogoutConfirmModal({ open, onOpenChange, onConfirm }: Props) {
  const { t } = useTranslation();

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-[10050] bg-black/40 backdrop-blur-sm" />
        <Dialog.Content className="fixed left-1/2 top-1/2 z-[10051] w-[min(100vw-2rem,400px)] -translate-x-1/2 -translate-y-1/2 rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-6 text-[var(--color-text)] shadow-[var(--shadow-lg)] focus:outline-none">
          <div className="flex items-start justify-between gap-3">
            <Dialog.Title className="text-lg font-semibold tracking-tight">
              {t("nav.logOutConfirmTitle")}
            </Dialog.Title>
            <Dialog.Close asChild>
              <button
                type="button"
                className="rounded-lg p-1.5 text-[var(--color-text-secondary)] transition-colors hover:bg-[var(--color-background-secondary)] hover:text-[var(--color-text)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)]"
                aria-label={t("auth.close")}
              >
                <X className="h-5 w-5" aria-hidden />
              </button>
            </Dialog.Close>
          </div>
          <Dialog.Description className="mt-2 text-sm text-[var(--color-text-secondary)]">
            {t("nav.logOutConfirmBody")}
          </Dialog.Description>
          <div className="mt-6 flex flex-wrap justify-end gap-2">
            <Dialog.Close asChild>
              <button
                type="button"
                className="rounded-lg border border-[var(--color-border)] bg-[var(--color-background)] px-4 py-2 text-sm font-semibold text-[var(--color-text)] transition-colors hover:bg-[var(--color-background-secondary)]"
              >
                {t("nav.logOutCancel")}
              </button>
            </Dialog.Close>
            <button
              type="button"
              onClick={() => {
                onOpenChange(false);
                onConfirm();
              }}
              className="rounded-lg bg-[var(--color-primary)] px-4 py-2 text-sm font-semibold text-[var(--color-text-on-primary)] transition-colors hover:opacity-90 focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)] focus-visible:ring-offset-2"
            >
              {t("nav.logOut")}
            </button>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
