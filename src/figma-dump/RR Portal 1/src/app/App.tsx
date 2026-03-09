import { PlanCard } from "./components/PlanCard";
import { Button } from "./components/ui/button";
import { ChevronRight, ArrowRight, ArrowLeft, Sparkles, Shield } from "lucide-react";
import { ContributionStep } from "./components/ContributionStep";
import { AutoIncreaseStep } from "./components/AutoIncreaseStep";
import { InvestmentStep } from "./components/InvestmentStep";
import { ReadinessStep } from "./components/ReadinessStep";
import { ReviewStep } from "./components/ReviewStep";
import { PostEnrollmentDashboard } from "./components/PostEnrollmentDashboard";
import { PreEnrollmentDashboard } from "./components/PreEnrollmentDashboard";
import { motion } from "motion/react";
import { useState } from "react";
import { StepIndicator } from "./components/StepIndicator";
import { useBranding } from "../hooks/useBranding";
import { BrandSwitcher } from "./components/BrandSwitcher";

// Retirement Plan Selection App
const steps = [
  { id: "plan", label: "Plan" },
  { id: "contribution", label: "Contribution" },
  { id: "auto-increase", label: "Auto Increase" },
  { id: "investment", label: "Investment" },
  { id: "readiness", label: "Readiness" },
  { id: "review", label: "Review" }
];

export default function App() {
  const branding = useBranding();
  const [currentStep, setCurrentStep] = useState(0);
  const [selectedPlanId, setSelectedPlanId] = useState<string>("roth-401k");
  const [showEditDetails, setShowEditDetails] = useState(false);
  const [isAcknowledged, setIsAcknowledged] = useState(false);
  const [isEnrolled, setIsEnrolled] = useState(false);
  const [showPreDashboard, setShowPreDashboard] = useState(true);

  const planOptions = [
    {
      id: "roth-401k",
      title: "Roth 401(k)",
      description: "Contribute after-tax dollars and enjoy tax-free withdrawals in retirement.",
      benefits: [
        "Tax-free withdrawals in retirement",
        "No required minimum distributions (RMDs) during your lifetime",
        "Contributions can be withdrawn anytime without taxes or penalties",
        "Estate planning benefits for your heirs",
        "Employer match goes into traditional 401(k)"
      ]
    },
    {
      id: "traditional-401k",
      title: "Traditional 401(k)",
      description: "Reduce your taxable income now with pre-tax contributions and pay taxes in retirement.",
      benefits: [
        "Lower your current taxable income with pre-tax contributions",
        "Potential for employer matching contributions",
        "Tax-deferred growth on investments",
        "Higher take-home pay compared to Roth",
        "May be in a lower tax bracket during retirement"
      ]
    }
  ];

  const selectedPlan = planOptions.find(plan => plan.id === selectedPlanId) || planOptions[0];

  const userDetails = {
    age: 31,
    retiringAt: 39,
    salary: 45000,
    yearsToRetire: 8
  };

  const handleContinue = () => {
    if (currentStep === steps.length - 1) {
      // Submit enrollment
      setIsEnrolled(true);
    } else if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleEdit = (step: number) => {
    setCurrentStep(step);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-gradient-to-br from-blue-200 to-purple-200 rounded-full blur-3xl opacity-20 -translate-x-1/2 -translate-y-1/2" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-gradient-to-tl from-purple-200 to-blue-200 rounded-full blur-3xl opacity-20 translate-x-1/2 translate-y-1/2" />
      <div className="absolute top-1/2 left-1/4 w-64 h-64 bg-gradient-to-br from-blue-100 to-transparent rounded-full blur-2xl opacity-30" />
      
      {showPreDashboard ? (
        <PreEnrollmentDashboard
          userName="Sarah"
          onStartEnrollment={() => setShowPreDashboard(false)}
        />
      ) : isEnrolled ? (
        <PostEnrollmentDashboard 
          selectedPlan={selectedPlan.title}
          currentContribution={6}
          salary={userDetails.salary}
          userAge={userDetails.age}
          investmentStrategy="Moderate"
          autoIncreaseEnabled={true}
          autoIncreaseRate={1}
          userName="Sarah"
        />
      ) : (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative z-10">
          {/* Step Indicator */}
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-12"
          >
            <StepIndicator steps={steps} currentStep={currentStep} />
          </motion.div>

          {/* Main Content */}
          <div className="grid grid-cols-1 gap-8">
            {currentStep === 0 && (
              <div className="space-y-8">
                {/* Enhanced Header Section */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6 }}
                  className="relative"
                >
                  {/* Stats Cards */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                    
                  </div>

                  {/* Title with decorative elements */}
                  <div className="relative">
                    <div className="absolute -left-4 top-0 w-1 h-16 bg-gradient-to-b from-blue-600 to-purple-600 rounded-full" />
                    <motion.h2 
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.6, delay: 0.3 }}
                      className="text-4xl font-bold text-gray-900 mb-3 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent"
                    >
                      {branding.content.planSelection.title}
                    </motion.h2>
                    <motion.p 
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.6, delay: 0.4 }}
                      className="text-gray-600 text-lg"
                    >
                      {branding.content.planSelection.subtitle}
                    </motion.p>
                  </div>
                </motion.div>

                {/* Plan Cards Grid */}
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.6, delay: 0.5 }}
                  className="space-y-6"
                >
                  {planOptions.map((plan, index) => (
                    <motion.div
                      key={plan.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: 0.6 + index * 0.1 }}
                    >
                      <PlanCard
                        id={plan.id}
                        title={plan.title}
                        description={plan.description}
                        benefits={plan.benefits}
                        isSelected={selectedPlanId === plan.id}
                        onSelect={() => setSelectedPlanId(plan.id)}
                      />
                    </motion.div>
                  ))}
                </motion.div>

                {/* Enhanced Compare Plans Section */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.8 }}
                  className="relative bg-gradient-to-br from-slate-50 to-blue-50 rounded-3xl shadow-lg border border-gray-200 p-8 overflow-hidden"
                >
                  {/* Decorative elements */}
                  <div className="absolute top-0 right-0 w-64 h-64 bg-blue-100 rounded-full blur-3xl opacity-20 translate-x-1/2 -translate-y-1/2" />
                  <div className="absolute bottom-0 left-0 w-48 h-48 bg-purple-100 rounded-full blur-2xl opacity-20 -translate-x-1/2 translate-y-1/2" />
                  <motion.div
                    animate={{ 
                      rotate: [0, 360],
                      scale: [1, 1.1, 1]
                    }}
                    transition={{ 
                      duration: 20,
                      repeat: Infinity,
                      ease: "linear"
                    }}
                    className="absolute top-1/2 left-1/2 w-32 h-32 bg-indigo-100 rounded-full blur-xl opacity-10"
                  />
                  
                  <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                          <Sparkles className="w-6 h-6 text-blue-600" />
                        </div>
                        <h3 className="text-2xl font-bold text-gray-900">{branding.content.planSelection.compareTitle}</h3>
                      </div>
                      <p className="text-gray-600 text-base">
                        {branding.content.planSelection.compareDescription}
                      </p>
                    </div>
                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Button 
                        variant="secondary"
                        size="lg"
                        className="shadow-md font-semibold px-8 whitespace-nowrap"
                      >
                        <Shield className="w-5 h-5 mr-2" />
                        {branding.content.planSelection.compareButtonText}
                      </Button>
                    </motion.div>
                  </div>
                </motion.div>
              </div>
            )}

            {currentStep === 1 && (
              <ContributionStep 
                salary={userDetails.salary} 
                selectedPlan={selectedPlan.title}
              />
            )}

            {currentStep === 2 && (
              <AutoIncreaseStep 
                currentContribution={6}
                salary={userDetails.salary} 
                selectedPlan={selectedPlan.title}
              />
            )}

            {currentStep === 3 && (
              <InvestmentStep 
                currentContribution={6}
                salary={userDetails.salary}
                selectedPlan={selectedPlan.title}
                userAge={userDetails.age}
              />
            )}

            {currentStep === 4 && (
              <ReadinessStep 
                selectedPlan={selectedPlan.title}
                currentContribution={6}
                salary={userDetails.salary}
                userAge={userDetails.age}
                investmentStrategy="Moderate"
              />
            )}

            {currentStep === 5 && (
              <ReviewStep 
                selectedPlan={selectedPlan.title}
                currentContribution={6}
                salary={userDetails.salary}
                userAge={userDetails.age}
                investmentStrategy="Moderate"
                onEdit={handleEdit}
                onAcknowledgmentChange={setIsAcknowledged}
              />
            )}
          </div>

          {/* Navigation Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.9 }}
            className="flex items-center justify-between mt-12 pt-8 border-t border-gray-200"
          >
            <Button
              variant="outline"
              onClick={handleBack}
              disabled={currentStep === 0}
              className="min-w-32 bg-white hover:bg-gray-50"
            >
              <ArrowLeft className="w-4 h-4" />
              Back
            </Button>
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button
                onClick={handleContinue}
                disabled={currentStep === steps.length - 1 && !isAcknowledged}
                className="min-w-32 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-lg"
                size="lg"
              >
                {currentStep === steps.length - 1 ? "Submit" : `Continue to ${steps[currentStep + 1]?.label || "Next"}`}
                <ArrowRight className="w-4 h-4" />
              </Button>
            </motion.div>
          </motion.div>
        </div>
      )}
      
      {/* Brand Switcher (Development Tool) */}
      <BrandSwitcher />
    </div>
  );
}