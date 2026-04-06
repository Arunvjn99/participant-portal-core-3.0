import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import { ArrowRight, BookOpen } from "lucide-react";
import { cn } from "@/lib/utils";
import { safeT } from "@/lib/safeT";
import { motionTokens } from "./motion";

const LEARNING_IMAGE =
  "https://pmmvggrzowobvbebjzdo.supabase.co/storage/v1/object/public/company-logos/Learningbanner.png";

const ease = motionTokens.ease;

export function CrpPreEnrollmentEducationCard({ className }: { className?: string }) {
  const { t } = useTranslation();

  const title = safeT(t, "dashboard.learningSimpleTitle", "How much is enough for retirement?");
  const description = safeT(
    t,
    "dashboard.learningDescription",
    "Finding the right contribution rate for your goals.",
  );
  const knowMore = safeT(t, "dashboard.learningKnowMore", "Know more");
  const eyebrow = safeT(t, "dashboard.learningTopicPill", "Learning");

  return (
    <div id="recommended-learning" className={cn("mx-auto max-w-7xl px-4 sm:px-6 lg:px-8", className)}>
      <motion.section
        id="learn-more"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-60px" }}
        transition={{ duration: motionTokens.slow.duration, ease }}
        aria-labelledby="crp-pre-enrollment-learning-title"
      >
        <a
          href="https://enrich.org/"
          target="_blank"
          rel="noopener noreferrer"
          className={cn(
            "group relative flex flex-col gap-5 overflow-hidden rounded-3xl border border-border/60 bg-gradient-to-br from-card/90 via-card/70 to-primary/[0.04] p-5 shadow-lg shadow-primary/[0.06] backdrop-blur-md transition-all duration-300 dark:from-card/80 dark:via-card/60 dark:to-primary/[0.08]",
            "sm:flex-row sm:items-stretch sm:gap-6 sm:p-6",
            "hover:border-primary/25 hover:shadow-xl hover:shadow-primary/[0.08]",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background dark:border-border dark:shadow-black/25",
          )}
        >
          <div
            className="pointer-events-none absolute -right-20 -top-20 size-56 rounded-full bg-primary/[0.08] blur-3xl"
            aria-hidden
          />
          <div
            className="pointer-events-none absolute -bottom-16 -left-16 size-48 rounded-full bg-primary/[0.06] blur-2xl"
            aria-hidden
          />

          <div className="relative w-full shrink-0 sm:w-[42%]">
            <span className="mb-3 inline-flex items-center gap-1.5 rounded-full border border-primary/15 bg-primary/5 px-3 py-1 text-[11px] font-semibold uppercase tracking-wider text-primary">
              <BookOpen className="size-3.5" aria-hidden />
              {eyebrow}
            </span>
            <div className="rounded-2xl border border-border/40 bg-white p-2 shadow-inner ring-1 ring-black/[0.05] dark:border-border/50 dark:bg-zinc-100 dark:shadow-[inset_0_1px_0_rgba(255,255,255,0.06),0_2px_8px_rgba(0,0,0,0.25)] dark:ring-white/12">
              <img
                src={LEARNING_IMAGE}
                alt=""
                className="h-auto w-full rounded-xl object-contain"
              />
            </div>
          </div>

          <div className="relative flex min-w-0 flex-1 flex-col justify-center gap-2 sm:w-[58%] sm:gap-3">
            <h2
              id="crp-pre-enrollment-learning-title"
              className="text-balance text-lg font-semibold leading-snug tracking-tight text-foreground sm:text-xl"
            >
              {title}
            </h2>
            <p className="text-pretty text-sm leading-relaxed text-muted-foreground sm:text-[0.9375rem]">
              {description}
            </p>
            <span className="mt-1 inline-flex items-center gap-1.5 text-sm font-semibold text-primary transition-transform duration-300 group-hover:translate-x-0.5">
              {knowMore}
              <ArrowRight className="size-4" aria-hidden />
            </span>
          </div>
        </a>
      </motion.section>
    </div>
  );
}
