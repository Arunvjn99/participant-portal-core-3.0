/**
 * Learning resources data for the AI Studio prototype test dashboard.
 */
import type { ReactNode } from "react";
import { Zap, ArrowRightLeft, PieChart, TrendingUp } from "lucide-react";

export interface LearningResource {
  id: string;
  title: string;
  subtitle: string;
  readTime: string;
  icon: ReactNode;
}

export const LEARNING_RESOURCES: LearningResource[] = [
  {
    id: "1",
    title: "The Magic of Compound Interest",
    subtitle: "Learn how your savings grow exponentially over time.",
    readTime: "3 min read",
    icon: <Zap className="w-5 h-5 text-amber-500" />,
  },
  {
    id: "2",
    title: "Roth vs Traditional",
    subtitle: "A simple guide to choosing the right tax advantage.",
    readTime: "4 min read",
    icon: <ArrowRightLeft className="w-5 h-5 text-blue-500" />,
  },
  {
    id: "3",
    title: "How Much Should I Save?",
    subtitle: "Finding the perfect contribution rate for your goals.",
    readTime: "5 min read",
    icon: <PieChart className="w-5 h-5 text-teal-500" />,
  },
  {
    id: "4",
    title: "Sustainable Investing 101",
    subtitle: "Aligning your portfolio with your personal values.",
    readTime: "3 min read",
    icon: <TrendingUp className="w-5 h-5 text-emerald-500" />,
  },
];
