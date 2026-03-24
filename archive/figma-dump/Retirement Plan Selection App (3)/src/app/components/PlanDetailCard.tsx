import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Sparkles } from "lucide-react";
import { AskAIButton } from "./AskAIButton";

interface PlanDetailCardProps {
  title: string;
  description: string;
  tags: string[];
  isSelected: boolean;
}

export function PlanDetailCard({ title, description, tags, isSelected }: PlanDetailCardProps) {
  return (
    <div className="bg-gradient-to-br from-blue-600 to-blue-700 text-white rounded-2xl p-8 shadow-xl">
      <div className="flex items-start justify-between mb-4">
        <div>
          <h2 className="text-3xl mb-2">{title}</h2>
          <p className="text-blue-100 text-sm max-w-2xl">{description}</p>
        </div>
        {isSelected && (
          <Badge className="bg-green-500 text-white border-none hover:bg-green-500">
            Selected
          </Badge>
        )}
      </div>

      <div className="flex flex-wrap gap-2 mb-6">
        {tags.map((tag, index) => (
          <Badge
            key={index}
            variant="outline"
            className="bg-white/10 text-white border-white/30 hover:bg-white/20"
          >
            {tag}
          </Badge>
        ))}
      </div>

      <AskAIButton
        className="bg-white/10 text-white border-white/30 hover:bg-white/20 hover:text-white"
      />
    </div>
  );
}