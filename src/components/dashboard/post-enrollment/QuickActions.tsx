import { motion } from "framer-motion";
import type { LucideIcon } from "lucide-react";
import { useTranslation } from "react-i18next";
import { cn } from "@/lib/utils";

export type QuickActionItem = {
  id: string;
  label: string;
  description: string;
  detail: string;
  icon: LucideIcon;
  onClick: () => void;
  disabled?: boolean;
};

type Props = {
  actions: QuickActionItem[];
  className?: string;
};

const ease = [0.25, 0.1, 0.25, 1] as const;

export function QuickActions({ actions, className }: Props) {
  const { t } = useTranslation();

  return (
    <section className={cn(className)}>
      <h2 className="mb-4 text-base font-semibold text-foreground">{t("dashboard.postEnrollment.quickActions")}</h2>
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease }}
        className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4"
      >
        {actions.map(({ id, label, description, detail, icon: Icon, onClick, disabled }, i) => (
          <motion.button
            key={id}
            type="button"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, ease, delay: i * 0.05 }}
            onClick={disabled ? undefined : onClick}
            disabled={disabled}
            aria-disabled={disabled}
            className={cn(
              "group flex flex-col items-start gap-3 rounded-2xl border border-border bg-card p-5 text-left shadow-sm transition-shadow focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2",
              disabled ? "cursor-not-allowed opacity-50" : "hover:shadow-md",
            )}
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
              <Icon className="h-5 w-5 text-primary" aria-hidden />
            </div>
            <div>
              <p className="text-sm font-semibold text-foreground">{label}</p>
              <p className="mt-0.5 text-xs text-muted-foreground">{description}</p>
            </div>
            <p className="text-xs text-muted-foreground/70">{detail}</p>
          </motion.button>
        ))}
      </motion.div>
    </section>
  );
}
