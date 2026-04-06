import { motion } from "framer-motion";
import { Briefcase, CalendarCheck, MessageSquare, Star, User, Users } from "lucide-react";
import { useTranslation } from "react-i18next";
import { cn } from "@/lib/utils";

type Props = {
  name: string;
  title: string;
  organization: string;
  rating: number;
  experienceYears: number;
  imageSrc: string;
  clientCount: string;
  specialization: string;
  onMessage: () => void;
  onSchedule: () => void;
  className?: string;
};

const ease = [0.25, 0.1, 0.25, 1] as const;

export function AdvisorCard({
  name,
  title,
  organization,
  rating,
  experienceYears,
  imageSrc,
  clientCount,
  specialization,
  onMessage,
  onSchedule,
  className,
}: Props) {
  const { t } = useTranslation();

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease, delay: 0.1 }}
      className={cn(
        "overflow-hidden rounded-2xl bg-gradient-to-br from-primary to-primary/80 p-5 shadow-sm",
        className,
      )}
    >
      <p className="text-[10px] font-bold uppercase tracking-widest text-white/60">
        {t("dashboard.postEnrollment.peAdvisorTitle")}
      </p>

      <div className="mt-3 flex items-start justify-between gap-4">
        <div className="min-w-0">
          <h3 className="text-xl font-bold text-white">{name}</h3>
          <p className="mt-0.5 text-sm text-white/70">{title}</p>
          <p className="mt-0.5 text-xs text-white/60">{organization}</p>
        </div>

        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-white/20">
          {imageSrc ? (
            <img src={imageSrc} alt="" className="h-12 w-12 rounded-full object-cover" />
          ) : (
            <User className="h-6 w-6 text-white/80" aria-hidden />
          )}
        </div>
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-x-3 gap-y-1 rounded-xl bg-white/10 px-3 py-2.5 text-xs text-white/90">
        <span className="flex items-center gap-1">
          <Star className="h-3 w-3" aria-hidden />
          {rating.toFixed(1)} {t("dashboard.postEnrollment.peAdvisorRatingLabel")}
        </span>
        <span className="text-white/40">|</span>
        <span className="flex items-center gap-1">
          <Briefcase className="h-3 w-3" aria-hidden />
          {t("dashboard.postEnrollment.peAdvisorYearsShort", { years: experienceYears })}
        </span>
        <span className="text-white/40">|</span>
        <span className="flex items-center gap-1">
          <Users className="h-3 w-3" aria-hidden />
          {clientCount} {t("dashboard.postEnrollment.peAdvisorClientsLabel")}
        </span>
      </div>

      <p className="mt-3 text-xs text-white/70">{specialization}</p>

      <div className="mt-5 flex items-center gap-3">
        <button
          type="button"
          onClick={onMessage}
          className={cn(
            "flex flex-1 items-center justify-center gap-2 rounded-xl border border-white/30 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-white/10",
            "focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-transparent",
          )}
        >
          <MessageSquare className="h-4 w-4" aria-hidden />
          {t("dashboard.postEnrollment.peAdvisorMessage")}
        </button>
        <button
          type="button"
          onClick={onSchedule}
          className={cn(
            "flex flex-1 items-center justify-center gap-2 rounded-xl bg-white px-4 py-2.5 text-sm font-medium text-primary transition-opacity hover:opacity-90",
            "focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-transparent",
          )}
        >
          <CalendarCheck className="h-4 w-4" aria-hidden />
          {t("dashboard.postEnrollment.peAdvisorScheduleCall")}
        </button>
      </div>
    </motion.div>
  );
}
