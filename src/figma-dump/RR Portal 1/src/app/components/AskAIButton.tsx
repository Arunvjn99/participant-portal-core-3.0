import { Sparkles, Zap } from "lucide-react";
import { Button } from "./ui/button";
import { motion } from "motion/react";

interface AskAIButtonProps {
  onClick?: (e: React.MouseEvent) => void;
  children?: React.ReactNode;
  className?: string;
  variant?: "default" | "outline" | "secondary" | "ghost" | "link" | "destructive";
  size?: "default" | "sm" | "lg" | "icon";
  fullWidth?: boolean;
}

export function AskAIButton({ 
  onClick, 
  children = "Ask AI about this plan",
  className = "",
  variant = "outline",
  size = "default",
  fullWidth = false
}: AskAIButtonProps) {
  const widthClass = fullWidth ? "w-full" : "";
  
  return (
    null
  );
}
