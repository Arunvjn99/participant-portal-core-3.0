import { create } from "zustand";

export type FeedbackToastVariant = "success" | "error";

type FeedbackState = {
  isOpen: boolean;
  rating: number | null;
  comment: string;
  toastMessage: string | null;
  toastVariant: FeedbackToastVariant;
  /** @deprecated Prefer {@link FeedbackState.openFeedback} */
  open: () => void;
  /** @deprecated Prefer {@link FeedbackState.closeFeedback} */
  close: () => void;
  /** Opens the global feedback modal (resets draft fields). */
  openFeedback: () => void;
  /** Closes the global feedback modal. */
  closeFeedback: () => void;
  setRating: (rating: number | null) => void;
  setComment: (comment: string) => void;
  showToast: (message: string, variant?: FeedbackToastVariant) => void;
  dismissToast: () => void;
};

const initialDraft = { rating: null as number | null, comment: "" };

export const useFeedbackStore = create<FeedbackState>((set) => ({
  isOpen: false,
  rating: null,
  comment: "",
  toastMessage: null,
  toastVariant: "success",
  open: () => set({ isOpen: true, ...initialDraft }),
  close: () => set({ isOpen: false }),
  openFeedback: () => set({ isOpen: true, ...initialDraft }),
  closeFeedback: () => set({ isOpen: false }),
  setRating: (rating) => set({ rating }),
  setComment: (comment) => set({ comment }),
  showToast: (message, variant = "success") =>
    set({ toastMessage: message, toastVariant: variant }),
  dismissToast: () => set({ toastMessage: null }),
}));
