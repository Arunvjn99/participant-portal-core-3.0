import React, { createContext, useContext, useState, ReactNode } from "react";

export interface PersonalizationData {
  retirementAge: number;
  currentAge: number;
  retirementLocation: string;
  currentSavings: number;
  investmentComfort: "conservative" | "balanced" | "growth" | "aggressive";
  wizardCompleted: boolean;
}

export interface EnrollmentData {
  plan: "traditional" | "roth" | null;
  contributionPercent: number;
  contributionSources: {
    preTax: number;
    roth: number;
    afterTax: number;
  };
  autoIncrease: boolean;
  autoIncreaseAmount: number;
  autoIncreaseMax: number;
  riskLevel: "conservative" | "balanced" | "growth" | "aggressive";
  useRecommendedPortfolio: boolean;
  agreedToTerms: boolean;
  salary: number;
  companyPlans: ("traditional" | "roth")[];
  supportsAfterTax: boolean;
}

interface EnrollmentContextType {
  data: EnrollmentData;
  updateData: (updates: Partial<EnrollmentData>) => void;
  personalization: PersonalizationData;
  updatePersonalization: (updates: Partial<PersonalizationData>) => void;
  currentStep: number;
  setCurrentStep: (step: number) => void;
}

const defaultPersonalization: PersonalizationData = {
  retirementAge: 65,
  currentAge: 30,
  retirementLocation: "",
  currentSavings: 0,
  investmentComfort: "balanced",
  wizardCompleted: false,
};

const defaultData: EnrollmentData = {
  plan: null,
  contributionPercent: 6,
  contributionSources: {
    preTax: 100,
    roth: 0,
    afterTax: 0,
  },
  autoIncrease: false,
  autoIncreaseAmount: 1,
  autoIncreaseMax: 15,
  riskLevel: "balanced",
  useRecommendedPortfolio: true,
  agreedToTerms: false,
  salary: 85000,
  companyPlans: ["traditional", "roth"],
  supportsAfterTax: true,
};

const EnrollmentContext = createContext<EnrollmentContextType | undefined>(undefined);

export function EnrollmentProvider({ children }: { children: ReactNode }) {
  const [data, setData] = useState<EnrollmentData>(defaultData);
  const [personalization, setPersonalization] = useState<PersonalizationData>(defaultPersonalization);
  const [currentStep, setCurrentStep] = useState(1);

  const updateData = (updates: Partial<EnrollmentData>) => {
    setData((prev) => ({ ...prev, ...updates }));
  };

  const updatePersonalization = (updates: Partial<PersonalizationData>) => {
    setPersonalization((prev) => ({ ...prev, ...updates }));
  };

  return (
    <EnrollmentContext.Provider value={{ data, updateData, personalization, updatePersonalization, currentStep, setCurrentStep }}>
      {children}
    </EnrollmentContext.Provider>
  );
}

export function useEnrollment() {
  const context = useContext(EnrollmentContext);
  if (!context) throw new Error("useEnrollment must be used within EnrollmentProvider");
  return context;
}