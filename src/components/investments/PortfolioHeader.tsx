type PortfolioHeaderProps = {
  greetingLine: string;
  title: string;
  lastUpdatedLabel: string;
};

/**
 * Page masthead: greeting, title, right-aligned last updated (token-driven styles).
 */
export function PortfolioHeader({ greetingLine, title, lastUpdatedLabel }: PortfolioHeaderProps) {
  return (
    <header className="inv-portfolio-header">
      <div className="inv-portfolio-header__main">
        <p className="inv-portfolio-header__greeting">{greetingLine}</p>
        <h1 className="inv-portfolio-header__title">{title}</h1>
      </div>
      <p className="inv-portfolio-header__updated">{lastUpdatedLabel}</p>
    </header>
  );
}
