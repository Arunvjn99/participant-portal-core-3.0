import { Edit2 } from "lucide-react";

interface RetirementReadinessCardProps {
  score: number;
  yearsToRetirement: number;
  projectedValue: number;
}

export function RetirementReadinessCard({ 
  score, 
  yearsToRetirement, 
  projectedValue 
}: RetirementReadinessCardProps) {
  // Determine status based on score
  const getStatus = (score: number) => {
    if (score < 40) return { text: "NEEDS ATTENTION", color: "amber" };
    if (score < 70) return { text: "ON TRACK", color: "blue" };
    return { text: "EXCELLENT", color: "emerald" };
  };

  const status = getStatus(score);
  
  // Calculate the arc for the semi-circular progress (180 degrees)
  const radius = 50;
  const circumference = Math.PI * radius; // Half circle
  const strokeDashoffset = circumference - (score / 100) * circumference;

  return (
    null
  );
}