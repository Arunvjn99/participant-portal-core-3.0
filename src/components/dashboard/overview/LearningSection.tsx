import { BookOpen, FileText, LineChart, Play } from "lucide-react";
import { useTranslation } from "react-i18next";
import type { LearningArticle } from "@/hooks/useDashboardData";

const ARTICLE_ICONS = [BookOpen, FileText, LineChart] as const;

export type LearningSectionProps = {
  sectionTitleKey: string;
  videoThumbnail: string;
  videoAriaKey: string;
  articles: LearningArticle[];
  onPlayVideo: () => void;
  onOpenArticle: (path: string) => void;
};

export function LearningSection({
  sectionTitleKey,
  videoThumbnail,
  videoAriaKey,
  articles,
  onPlayVideo,
  onOpenArticle,
}: LearningSectionProps) {
  const { t } = useTranslation();

  return (
    <div className="dashboard-screen-card">
      <h2 className="dashboard-screen-section-title">{t(sectionTitleKey)}</h2>
      <div className="dashboard-screen-learning">
        <div className="dashboard-screen-learning__video">
          <img className="dashboard-screen-learning__thumb" src={videoThumbnail} alt="" />
          <button
            type="button"
            className="dashboard-screen-learning__play"
            onClick={onPlayVideo}
            aria-label={t(videoAriaKey)}
          >
            <span className="dashboard-screen-learning__play-icon">
              <Play className="ml-1 h-7 w-7" fill="currentColor" aria-hidden />
            </span>
          </button>
        </div>
        <ul className="dashboard-screen-learning__list">
          {articles.map((article, index) => {
            const Icon = ARTICLE_ICONS[index % ARTICLE_ICONS.length];
            return (
              <li key={article.id}>
                <button
                  type="button"
                  className="dashboard-screen-learning__article"
                  onClick={() => onOpenArticle(article.route)}
                >
                  <Icon className="dashboard-screen-learning__article-icon h-5 w-5 shrink-0" strokeWidth={2} />
                  <div>
                    <p className="dashboard-screen-learning__article-title">{t(article.titleKey)}</p>
                    <p className="dashboard-screen-learning__article-meta">
                      {t("dashboardOverview.learning.minRead", { n: article.readMinutes })}
                    </p>
                  </div>
                </button>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}
