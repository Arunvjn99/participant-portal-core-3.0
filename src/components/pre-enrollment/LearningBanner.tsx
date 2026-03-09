import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { BookOpen, ChevronRight } from "lucide-react";
import { Card, CardContent } from "../ui/card";

export function LearningBanner() {
  const { t } = useTranslation();

  return (
    <section>
      <Card className="bg-gradient-to-r from-slate-900 to-slate-800 border-none overflow-hidden relative text-white shadow-lg">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/3 blur-3xl" aria-hidden />
        <CardContent className="p-8 flex flex-col md:flex-row items-center justify-between gap-8 relative z-10">
          <div className="flex items-center gap-6 max-w-xl flex-1">
            <div className="shrink-0 flex items-center justify-center w-14 h-14 rounded-2xl bg-white/10 backdrop-blur-sm" aria-hidden>
              <BookOpen className="h-7 w-7 text-white/90" />
            </div>
            <div className="space-y-4 min-w-0">
              <div className="inline-flex items-center rounded-lg bg-white/10 px-3 py-1 text-sm text-white/90 backdrop-blur-sm w-fit">
                {t("dashboard.learningBannerBadge", "Featured Guide")}
              </div>
              <h2 className="text-2xl font-bold">
                {t("dashboard.learningBannerTitle", "Understanding your retirement plan")}
              </h2>
              <p className="text-white/80 text-lg">
                {t("dashboard.learningBannerDescription", "Learn how contributions, investments, and employer matching work together to build your future wealth.")}
              </p>
            </div>
          </div>
          <Link
            to="/help"
            className="shrink-0 bg-white/10 border border-white/20 text-white hover:bg-white hover:text-[var(--color-text)] min-w-[200px] h-14 text-lg rounded-xl font-semibold flex items-center justify-center gap-2 transition-colors"
          >
            {t("dashboard.exploreLearningCenter", "Explore Learning Center")}
            <ChevronRight className="h-5 w-5" />
          </Link>
        </CardContent>
      </Card>
    </section>
  );
}
