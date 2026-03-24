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
    <Button
      variant={variant}
      size={size}
      onClick={onClick}
      className={`relative overflow-hidden group ${widthClass} ${className}`}
    >
      {/* Shimmer Animation */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
        initial={{ x: "-100%" }}
        animate={{ x: "200%" }}
        transition={{
          duration: 2,
          repeat: Infinity,
          repeatDelay: 1,
          ease: "easeInOut"
        }}
      />
      
      {/* Icon with pulse animation */}
      <motion.div
        className="relative mr-2"
        animate={{
          scale: [1, 1.2, 1],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      >
        <Sparkles className="w-4 h-4" />
      </motion.div>
      
      {/* Button text */}
      <span className="relative font-semibold">{children}</span>
    </Button>
  );
}
