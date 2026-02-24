import { MessageCircle, Calendar } from "lucide-react";
import { useTranslation } from "react-i18next";
import { ADVISORS } from "./constants";

export const AdvisorSection = () => {
  const { t } = useTranslation();
  return (
    <section className="py-8 sm:py-12 md:py-16 lg:py-20 bg-[var(--color-surface)] border-t border-[var(--color-border)] w-full rounded-2xl min-w-0 overflow-hidden px-4 sm:px-6 md:px-8">
      <div className="text-center max-w-2xl mx-auto mb-6 sm:mb-8 md:mb-12">
        <h2 className="text-xl sm:text-2xl md:text-3xl font-display font-bold text-[var(--color-text)] mb-2 sm:mb-3 md:mb-4">
          {t("preEnrollment.needGuidance")}
        </h2>
        <p className="text-[var(--color-textSecondary)] text-sm sm:text-base md:text-lg">
          {t("preEnrollment.needGuidanceSubtitle")}
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 md:gap-6 lg:gap-8">
        {ADVISORS.map((advisor) => {
          const name = t(`preEnrollment.advisor${advisor.id}Name` as const);
          const role = t(`preEnrollment.advisor${advisor.id}Role` as const);
          const bio = t(`preEnrollment.advisor${advisor.id}Bio` as const);
          return (
          <div
            key={advisor.id}
            className="flex flex-col items-center text-center p-4 sm:p-5 md:p-6 lg:p-8 rounded-xl sm:rounded-2xl bg-[var(--color-surface)]/80 hover:bg-brand-50/50 transition-colors border border-[var(--color-border)] hover:border-brand-100 hover:shadow-lg shadow-sm group min-w-0"
          >
              <div className="relative mb-4 sm:mb-6">
                <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full overflow-hidden border-4 border-white shadow-lg">
                  <img
                    src={advisor.image}
                    alt={name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="absolute bottom-0 right-0 w-5 h-5 sm:w-6 sm:h-6 bg-[var(--color-success)] border-[3px] sm:border-4 border-white rounded-full" />
              </div>

              <h3 className="text-lg sm:text-xl font-bold text-[var(--color-text)]">{name}</h3>
              <p className="text-brand-600 text-xs sm:text-sm font-medium mb-2 sm:mb-3">{role}</p>
              <p className="text-[var(--color-textSecondary)] mb-4 sm:mb-6 md:mb-8 leading-relaxed text-xs sm:text-sm md:text-base">&quot;{bio}&quot;</p>

              <div className="flex gap-2 sm:gap-3 w-full mt-auto">
                <button
                  type="button"
                  className="flex-1 py-2 sm:py-2.5 px-3 sm:px-4 rounded-xl sm:rounded-2xl bg-[var(--color-surface)] border-2 border-[var(--color-border)] text-[var(--color-text)] font-medium text-xs sm:text-sm hover:border-brand-300 hover:text-brand-600 transition-colors flex items-center justify-center gap-1.5 sm:gap-2"
                >
                  <MessageCircle size={14} className="sm:w-4 sm:h-4" />
                  {t("preEnrollment.chat")}
                </button>
                <button
                  type="button"
                  className="flex-1 py-2 sm:py-2.5 px-3 sm:px-4 rounded-xl sm:rounded-2xl bg-primary text-white font-medium text-xs sm:text-sm hover:bg-primary-hover transition-colors flex items-center justify-center gap-1.5 sm:gap-2 shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
                >
                  <Calendar size={14} className="sm:w-4 sm:h-4" />
                  {t("preEnrollment.book")}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};
