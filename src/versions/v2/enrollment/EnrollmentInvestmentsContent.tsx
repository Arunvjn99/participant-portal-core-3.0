import { InvestmentProvider } from "@/context/InvestmentContext";
import { useEnrollment } from "@/enrollment/context/EnrollmentContext";
import InvestmentsLayout from "@/app/investments/layout";
import InvestmentsPage from "@/app/investments/page";
import { EnrollmentAiHint } from "@/components/ai/EnrollmentAiHint";

/**
 * Wraps Investments step with InvestmentProvider, passing enrollment-derived props.
 * Contribution sources (preTax, roth, afterTax) define which allocation accordions appear.
 * Must be inside EnrollmentProvider (via EnrollmentLayout).
 */
export const EnrollmentInvestmentsContent = () => {
  const { state } = useEnrollment();
  const { preTax, roth, afterTax } = state.sourceAllocation;
  const hasPreTaxOrRoth = preTax > 0 || roth > 0;
  const hasAfterTax = afterTax > 0;
  const sourceAllocation = { preTax, roth, afterTax };

  return (
    <InvestmentProvider
      sourceAllocation={sourceAllocation}
      hasPreTaxOrRoth={hasPreTaxOrRoth}
      hasAfterTax={hasAfterTax}
      investmentProfile={state.investmentProfile}
    >
      <InvestmentsLayout>
        <div className="mb-4 px-1">
          <EnrollmentAiHint
            titleKey="aiSystem.enrollmentInvestHintTitle"
            bodyKey="aiSystem.enrollmentInvestHint"
            prompt="I'm on the enrollment investment selection step. Help me understand diversification, risk, and how to choose funds for my 401(k)."
          />
        </div>
        <InvestmentsPage />
      </InvestmentsLayout>
    </InvestmentProvider>
  );
};
