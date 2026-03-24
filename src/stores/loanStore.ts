import { create } from "zustand";

export type LoanPrefillData = {
  amount: number | null;
  purpose: string | null;
  loanType: string | null;
};

type LoanStoreState = {
  loanData: LoanPrefillData;
  /** Step index for loan wizard (1–6); used when prefilling from AI. */
  currentStep: number;
  /** True after AI prefill until user dismisses banner. */
  showAiPrefillBanner: boolean;

  initializeLoan: (data: Partial<LoanPrefillData>) => void;
  setStep: (step: number) => void;
  dismissAiPrefillBanner: () => void;
  resetLoanPrefill: () => void;
};

const emptyData: LoanPrefillData = {
  amount: null,
  purpose: null,
  loanType: null,
};

export const useLoanStore = create<LoanStoreState>((set) => ({
  loanData: { ...emptyData },
  currentStep: 1,
  showAiPrefillBanner: false,

  initializeLoan: (data) =>
    set({
      loanData: {
        amount: data.amount ?? null,
        purpose: data.purpose ?? null,
        loanType: data.loanType ?? "general",
      },
      showAiPrefillBanner: data.amount != null,
    }),

  setStep: (step) => set({ currentStep: step }),

  dismissAiPrefillBanner: () => set({ showAiPrefillBanner: false }),

  resetLoanPrefill: () =>
    set({
      loanData: { ...emptyData },
      currentStep: 1,
      showAiPrefillBanner: false,
    }),
}));
