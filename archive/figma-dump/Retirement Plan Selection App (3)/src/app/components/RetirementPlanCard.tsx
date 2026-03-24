import { Check } from "lucide-react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";

interface RetirementPlanCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  benefits: string[];
  contributionLimit: string;
  bestFor: string;
  onSelect: () => void;
}

export function RetirementPlanCard({
  icon,
  title,
  description,
  benefits,
  contributionLimit,
  bestFor,
  onSelect,
}: RetirementPlanCardProps) {
  return (
    <Card className="hover:shadow-lg transition-shadow duration-300 h-full flex flex-col">
      <CardHeader>
        <div className="flex items-center gap-3 mb-2">
          <div className="p-3 bg-primary/10 rounded-lg text-primary">
            {icon}
          </div>
          <CardTitle>{title}</CardTitle>
        </div>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      
      <CardContent className="flex-1 space-y-4">
        <div>
          <h5 className="font-semibold mb-2 text-sm">Key Benefits:</h5>
          <ul className="space-y-2">
            {benefits.map((benefit, index) => (
              <li key={index} className="flex items-start gap-2 text-sm">
                <Check className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                <span className="text-muted-foreground">{benefit}</span>
              </li>
            ))}
          </ul>
        </div>
        
        <div className="pt-4 border-t space-y-2">
          <div className="text-sm">
            <span className="font-semibold">2026 Contribution Limit: </span>
            <span className="text-muted-foreground">{contributionLimit}</span>
          </div>
          <div className="text-sm">
            <span className="font-semibold">Best For: </span>
            <span className="text-muted-foreground">{bestFor}</span>
          </div>
        </div>
      </CardContent>
      
      <CardFooter>
        <Button onClick={onSelect} className="w-full">
          Select This Plan
        </Button>
      </CardFooter>
    </Card>
  );
}
