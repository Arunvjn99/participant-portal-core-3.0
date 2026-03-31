import { useTranslation } from "react-i18next";
import { cn } from "@/lib/utils";
import { pePanel } from "./dashboardSurfaces";

const LEARNING_BANNER_SRC =
  "https://pmmvggrzowobvbebjzdo.supabase.co/storage/v1/object/public/company-logos/Learningbanner.png";

type Props = {
  title: string;
  description: string;
  href: string;
  className?: string;
};

export function LearningHub({ title, description, href, className }: Props) {
  const { t } = useTranslation();

  return (
    <section className={cn(pePanel, "overflow-hidden", className)}>
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:gap-6">
        <div className="relative h-28 w-full shrink-0 overflow-hidden rounded-lg border border-gray-200 bg-gray-100 sm:h-32 lg:h-32 lg:w-48 lg:shrink-0">
          <img
            src={LEARNING_BANNER_SRC}
            alt=""
            className="h-full w-full object-cover object-center"
            loading="lazy"
            decoding="async"
          />
        </div>
        <div className="min-w-0 flex-1 space-y-2">
          <h2 className="font-dashboard-heading text-base font-semibold text-gray-900">{title}</h2>
          <p className="font-dashboard-body text-sm leading-relaxed text-[var(--color-text-secondary)]">{description}</p>
          <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className="font-dashboard-body inline-flex text-sm font-semibold text-[var(--color-primary)] underline-offset-4 hover:underline"
          >
            {t("dashboard.learnMore")}
          </a>
        </div>
      </div>
    </section>
  );
}
