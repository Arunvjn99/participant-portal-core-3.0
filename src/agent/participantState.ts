import { Step } from "./steps";

export type ParticipantState = {
  currentStep: Step;
  planId?: string;
  contribution?: {
    type: "percentage" | "flat";
    value: number;
  };
  investment?: {
    mode: "default" | "manual" | "advisor";
  };
};

export const initialState: ParticipantState = {
  currentStep: "GREETING",
};
