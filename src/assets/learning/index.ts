/**
 * Learning resource thumbnail paths. Topic-specific images in public/image/learning/.
 */
export const thumbnails = {
  /** 401(k) basics – intergenerational collaboration, digital literacy */
  learning401k: "/image/learning/learning-401k-basics.png",
  /** Investment strategies – reading, learning, self-improvement */
  learningInvestment: "/image/learning/learning-investment-strategies.png",
  /** Employer match – wellness, partnership, healthy planning */
  learningMatch: "/image/learning/learning-employer-match.png",
  /** Roth vs Traditional – connection, shared planning, later life */
  learningRothVsTraditional: "/image/learning/learning-roth-vs-traditional.png",
} as const;

/**
 * Shared learning resources - used by both pre-enrollment (Dashboard) and post-enrollment (LearningHub).
 */
export interface SharedLearningResource {
  id: string;
  title: string;
  subtitle: string;
  badge: "Video" | "Article";
  imageSrc: string;
}

export const SHARED_LEARNING_RESOURCES: SharedLearningResource[] = [
  { id: "1", title: "Understanding 401(k) Basics", subtitle: "Retirement Education Hub", badge: "Video", imageSrc: thumbnails.learning401k },
  { id: "2", title: "Investment Strategies for Retirement", subtitle: "Financial Planning Institute", badge: "Article", imageSrc: thumbnails.learningInvestment },
  { id: "3", title: "Maximizing Your Employer Match", subtitle: "Retirement Education Hub", badge: "Video", imageSrc: thumbnails.learningMatch },
  { id: "4", title: "Roth vs Traditional: Which is Right?", subtitle: "Financial Planning Institute", badge: "Article", imageSrc: thumbnails.learningRothVsTraditional },
];
