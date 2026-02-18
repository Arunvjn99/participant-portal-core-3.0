import type { Advisor, LearningResource } from "./types";
import { thumbnails as learningThumbnails } from "../../assets/learning";

export const ADVISORS: Advisor[] = [
  {
    id: "1",
    name: "Sarah Chen",
    role: "Financial Wellness Guide",
    bio: "I help people translate their life goals into financial plans. Coffee enthusiast.",
    image: "https://picsum.photos/200/200?random=1",
  },
  {
    id: "2",
    name: "Marcus Thorne",
    role: "Retirement Strategist",
    bio: "Specializing in sustainable investing and long-term growth strategies.",
    image: "https://picsum.photos/200/200?random=2",
  },
  {
    id: "3",
    name: "Elena Rodriguez",
    role: "Plan Specialist",
    bio: "Here to simplify the complex terms and get you set up in minutes.",
    image: "https://picsum.photos/200/200?random=3",
  },
];

export const RESOURCES: LearningResource[] = [
  {
    id: "1",
    title: "The Magic of Compound Interest",
    duration: "2 min read",
    category: "Basics",
    thumbnail: learningThumbnails.learning401k,
  },
  {
    id: "2",
    title: "Roth vs. Traditional: A Simple Guide",
    duration: "3 min read",
    category: "Comparison",
    thumbnail: learningThumbnails.learningRothVsTraditional,
  },
  {
    id: "3",
    title: "How Much is Enough?",
    duration: "4 min read",
    category: "Planning",
    thumbnail: learningThumbnails.learningMatch,
  },
  {
    id: "4",
    title: "Sustainable Investing 101",
    duration: "2 min read",
    category: "Impact",
    thumbnail: learningThumbnails.learningInvestment,
  },
];
