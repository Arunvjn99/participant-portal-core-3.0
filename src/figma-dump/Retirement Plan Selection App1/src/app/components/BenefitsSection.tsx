import { TrendingUp, Shield, PiggyBank } from "lucide-react";

interface Benefit {
  icon: React.ReactNode;
  title: string;
  description: string;
}

export function BenefitsSection() {
  const benefits: Benefit[] = [
    {
      icon: <TrendingUp className="w-6 h-6 text-blue-600" />,
      title: "Immediate Impact",
      description: "Contributions are made with after-tax dollars, so you pay taxes now at your current rate."
    },
    {
      icon: <Shield className="w-6 h-6 text-green-600" />,
      title: "Future Benefit",
      description: "Your money grows tax-free, and you can withdraw it tax-free in retirement after age 59½."
    },
    {
      icon: <PiggyBank className="w-6 h-6 text-purple-600" />,
      title: "Tax Diversification",
      description: "Having both pre-tax and after-tax retirement savings gives you flexibility in managing taxes during retirement."
    }
  ];

  return (
    <div>
      <h3 className="text-xl mb-6">What this means for you</h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {benefits.map((benefit, index) => (
          <div key={index} className="bg-white rounded-xl p-6 border shadow-sm">
            <div className="mb-4">{benefit.icon}</div>
            <h4 className="font-semibold mb-2">{benefit.title}</h4>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {benefit.description}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
