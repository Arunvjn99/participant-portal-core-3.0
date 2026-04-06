import { motion } from "framer-motion";
import { ArrowRight, BookOpen } from "lucide-react";
import { useTranslation } from "react-i18next";
import { cn } from "@/lib/utils";

type Props = {
  category: string;
  title: string;
  description: string;
  href: string;
  className?: string;
};

const ease = [0.25, 0.1, 0.25, 1] as const;

export function LearningHub({ category, title, description, href, className }: Props) {
  const { t } = useTranslation();

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease, delay: 0.08 }}
      className={cn("rounded-2xl border border-border bg-card p-5 shadow-sm", className)}
    >
      <div className="flex items-start gap-4">
        <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-xl bg-primary/10">
          <BookOpen className="h-8 w-8 text-primary" aria-hidden />
        </div>

        <div className="min-w-0 flex-1">
          <span className="inline-block rounded-full bg-primary/10 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-primary">
            {category}
          </span>

          <h3 className="mt-2 text-sm font-semibold text-foreground">{title}</h3>

          <p className="mt-1 line-clamp-2 text-xs leading-relaxed text-muted-foreground">{description}</p>

          <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-3 inline-flex items-center gap-1 text-xs font-medium text-primary transition-opacity hover:opacity-80"
          >
            {t("dashboard.postEnrollment.peLearningKnowMore")}
            <ArrowRight className="h-3 w-3" aria-hidden />
          </a>
        </div>
      </div>
    </motion.div>
  );
}
