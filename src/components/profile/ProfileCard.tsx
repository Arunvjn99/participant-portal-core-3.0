import type { ReactNode } from "react";

const cardStyle: React.CSSProperties = {
  background: "var(--color-background)",
  border: "1px solid var(--color-border)",
  borderRadius: 12,
  boxShadow: "var(--shadow-sm, 0 1px 3px rgba(0,0,0,0.06))",
  padding: "1.5rem",
};

interface ProfileCardProps {
  id?: string;
  title?: string;
  action?: ReactNode;
  children: ReactNode;
  className?: string;
}

export function ProfileCard({ id, title, action, children, className = "" }: ProfileCardProps) {
  return (
    <article id={id} className={"profile-card " + className} style={cardStyle}>
      {(title != null || action != null) && (
        <header
          className="profile-card__header"
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "1.25rem",
            gap: "0.75rem",
          }}
        >
          {title != null && (
            <h2
              className="profile-card__title"
              style={{ fontSize: "1.125rem", fontWeight: 600, margin: 0, color: "var(--color-text)" }}
            >
              {title}
            </h2>
          )}
          {action != null && <div className="profile-card__action">{action}</div>}
        </header>
      )}
      <div className="profile-card__content">{children}</div>
    </article>
  );
}
