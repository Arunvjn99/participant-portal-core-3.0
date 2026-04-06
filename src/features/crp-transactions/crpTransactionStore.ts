import { create } from "zustand";

import type {
  DraftTransaction,
  TransactionFlowData,
  TransactionType,
} from "./types";
import { FLOW_STEP_LABELS } from "./types";

const STORAGE_KEY = "txn-drafts";

function loadDrafts(): DraftTransaction[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as DraftTransaction[]) : [];
  } catch {
    return [];
  }
}

function persistDrafts(drafts: DraftTransaction[]) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(drafts));
  } catch {
    /* quota / private mode */
  }
}

type TransactionState = {
  activeType: TransactionType | null;
  activeStep: number;
  flowData: TransactionFlowData;
  drafts: DraftTransaction[];
  completedType: TransactionType | null;

  startFlow: (type: TransactionType) => void;
  setStep: (step: number) => void;
  nextStep: () => void;
  prevStep: () => void;
  updateFlowData: <T extends TransactionType>(
    type: T,
    data: Partial<TransactionFlowData[T]>,
  ) => void;
  saveDraft: () => void;
  resumeDraft: (id: string) => void;
  deleteDraft: (id: string) => void;
  completeFlow: () => void;
  resetFlow: () => void;
  totalSteps: () => number;
};

const EMPTY_FLOW_DATA: TransactionFlowData = {
  loan: {},
  withdraw: {},
  transfer: {},
  rollover: {},
};

const FLOW_LABELS: Record<TransactionType, string> = {
  loan: "Loan Application",
  withdraw: "Withdrawal Request",
  transfer: "Fund Transfer",
  rollover: "Rollover Request",
};

export const useCrpTransactionStore = create<TransactionState>((set, get) => ({
  activeType: null,
  activeStep: 0,
  flowData: { ...EMPTY_FLOW_DATA },
  drafts: loadDrafts(),
  completedType: null,

  startFlow: (type) =>
    set({
      activeType: type,
      activeStep: 0,
      completedType: null,
      flowData: {
        ...EMPTY_FLOW_DATA,
        [type]: {},
      },
    }),

  setStep: (step) => set({ activeStep: step }),

  nextStep: () => {
    const { activeStep, activeType } = get();
    const max = activeType ? FLOW_STEP_LABELS[activeType].length - 1 : 0;
    if (activeStep < max) {
      set({ activeStep: activeStep + 1 });
      get().saveDraft();
    }
  },

  prevStep: () => {
    const { activeStep } = get();
    if (activeStep > 0) set({ activeStep: activeStep - 1 });
  },

  updateFlowData: (type, data) =>
    set((s) => ({
      flowData: {
        ...s.flowData,
        [type]: { ...s.flowData[type], ...data },
      },
    })),

  saveDraft: () => {
    const { activeType, activeStep, flowData, drafts } = get();
    if (!activeType) return;

    const id = `draft-${activeType}`;
    const total = FLOW_STEP_LABELS[activeType].length;
    const progress = Math.round(((activeStep + 1) / total) * 100);
    const existing = drafts.filter((d) => d.id !== id);
    const draft: DraftTransaction = {
      id,
      type: activeType,
      step: activeStep,
      data: flowData[activeType],
      updatedAt: new Date().toISOString(),
      label: FLOW_LABELS[activeType],
      progress,
    };
    const next = [...existing, draft];
    set({ drafts: next });
    persistDrafts(next);
  },

  resumeDraft: (id) => {
    const { drafts } = get();
    const draft = drafts.find((d) => d.id === id);
    if (!draft) return;
    set({
      activeType: draft.type,
      activeStep: draft.step,
      flowData: {
        ...EMPTY_FLOW_DATA,
        [draft.type]: draft.data,
      },
    });
  },

  deleteDraft: (id) => {
    const next = get().drafts.filter((d) => d.id !== id);
    set({ drafts: next });
    persistDrafts(next);
  },

  completeFlow: () => {
    const { activeType, drafts } = get();
    if (!activeType) return;
    const draftId = `draft-${activeType}`;
    const total = FLOW_STEP_LABELS[activeType].length;
    const next = drafts.filter((d) => d.id !== draftId);
    set({
      activeStep: total - 1,
      completedType: activeType,
      drafts: next,
    });
    persistDrafts(next);
  },

  resetFlow: () =>
    set({
      activeType: null,
      activeStep: 0,
      completedType: null,
      flowData: { ...EMPTY_FLOW_DATA },
    }),

  totalSteps: () => {
    const { activeType } = get();
    return activeType ? FLOW_STEP_LABELS[activeType].length : 0;
  },
}));
