import type { ReactNode } from "react";

export type InfoCardProps = {
  title: string;
  children: ReactNode;
  /** Optional icon slot */
  icon?: ReactNode;
};

export function InfoCard({ title, children, icon }: InfoCardProps) {
  return (
    <section className="card">
      <div className="flex items-start gap-3">
        {icon ? <div className="icon-box-soft h-10 w-10 shrink-0 rounded-xl">{icon}</div> : null}
        <div className="min-w-0 flex-1">
          <h2 className="text-lg font-semibold text-foreground">{title}</h2>
          <div className="mt-3 text-sm text-muted-foreground">{children}</div>
        </div>
      </div>
    </section>
  );
}
