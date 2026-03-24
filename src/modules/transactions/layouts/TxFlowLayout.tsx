import type { ReactNode } from "react";
import { useTranslation } from "react-i18next";

export type TxFlowLayoutProps = {
  title: string;
  subtitle?: string;
  backLabel?: string;
  onBack?: () => void;
  children: ReactNode;
};

/**
 * Transaction flow shell — header + content region; tokens via global.css only.
 */
export function TxFlowLayout({ title, subtitle, backLabel, onBack, children }: TxFlowLayoutProps) {
  const { t } = useTranslation();
  const defaultBack = `← ${t("transactions.backToTransactions")}`;

  return (
    <div className="tx-module-flow">
      <div className="tx-module-flow__inner">
        <header className="tx-module-flow__header">
          {onBack ? (
            <button type="button" onClick={onBack} className="tx-module-flow__back" aria-label={t("transactions.backToTransactions")}>
              {backLabel ?? defaultBack}
            </button>
          ) : null}
          <h1 className="tx-module-flow__title">{title}</h1>
          {subtitle ? <p className="tx-module-flow__subtitle">{subtitle}</p> : null}
        </header>
        <div className="tx-module-flow__body">{children}</div>
      </div>
    </div>
  );
}
