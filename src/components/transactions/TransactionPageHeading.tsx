export type TransactionPageHeadingProps = {
  title: string;
  subtitle?: string;
};

/**
 * Inner flow page title (analysis / legacy tx-module-flow pages).
 * Full-flow shells use {@link TransactionFlowLayout} + {@link TransactionHeader}.
 */
export function TransactionPageHeading({ title, subtitle }: TransactionPageHeadingProps) {
  return (
    <header className="tx-module-flow__header">
      <h1 className="tx-module-flow__title">{title}</h1>
      {subtitle ? <p className="tx-module-flow__subtitle">{subtitle}</p> : null}
    </header>
  );
}
