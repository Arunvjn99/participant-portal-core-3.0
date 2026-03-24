import { assistantMessage } from "../messageUtils";
import { getUserFinancials } from "../context/userFinancials";
import type { CoreAIStructuredPayload } from "../interactive/types";
import type { LocalAIResult, LocalFlowState } from "../types";
import {
  parseLoanInput,
  purposeDisplayLabel,
  type LoanFlowPurpose,
} from "../utils/parseLoanInput";
import { isGuidedLoanContext, runGuidedLoanFlow, startGuidedLoanFlow } from "./loanGuidedFlow";

function isAffirmative(input: string): boolean {
  return /^(yes|yeah|yep|sure|ok|okay|proceed|go|apply|continue|start)\b/i.test(input.trim());
}

function isNegative(input: string): boolean {
  return /^(no|nope|cancel|stop|never|not now)\b/i.test(input.trim());
}

function purposeStoreValue(p: LoanFlowPurpose): string {
  return p;
}

function wantsMaxOnly(input: string): boolean {
  const t = input.toLowerCase();
  return (
    !/\d{3,6}/.test(t) &&
    /\b(max|maximum|as much as possible|highest|full eligible|what i can)\b/.test(t)
  );
}

/**
 * Loan flow: discovery → amount → **6-step guided chat** (eligibility → … → review) → submit / configuration.
 */
export function loanFlow(
  state: LocalFlowState,
  input: string,
  structured: CoreAIStructuredPayload | null = null,
): LocalAIResult {
  const trimmed = input.trim();
  let { amount, purpose } = parseLoanInput(trimmed);
  const financials = getUserFinancials();
  const maxLoan = financials.maxLoan;
  const ctx = state.context;

  if (state.step === 2) {
    if (isGuidedLoanContext(ctx)) {
      return runGuidedLoanFlow(state, trimmed, structured);
    }

    if (ctx.awaitingMaxConfirm === true) {
      const suggested = ctx.suggestedAmount as number;
      const storedPurpose = (ctx.purpose as LoanFlowPurpose) ?? "general";

      if (isAffirmative(trimmed)) {
        return startGuidedLoanFlow(suggested, purposeStoreValue(storedPurpose), financials);
      }
      if (isNegative(trimmed)) {
        return {
          messages: [
            assistantMessage(
              "Understood. You can enter a **lower amount** anytime, or say **apply loan** to see your snapshot again.",
            ),
          ],
          nextState: null,
        };
      }
      return {
        messages: [
          assistantMessage(
            `Reply **yes** to borrow **$${suggested.toLocaleString()}**, or **no** to stop. You can also type a **new dollar amount**.`,
          ),
        ],
        nextState: { type: "loan", step: 2, context: { ...ctx } },
      };
    }

    return { messages: [assistantMessage("Let me know how you’d like to proceed, or start with **apply loan**.")], nextState: null };
  }

  if (state.step === 0) {
    if (amount != null) {
      if (amount <= maxLoan) {
        return startGuidedLoanFlow(amount, purposeStoreValue(purpose), financials);
      }
      return {
        messages: [
          assistantMessage(
            [
              `You asked for **$${amount.toLocaleString()}**.`,
              "",
              `Based on your **vested balance** snapshot (**$${financials.vestedBalance.toLocaleString()}**), the most you can borrow right now is **$${maxLoan.toLocaleString()}** (mock **50%** rule).`,
              "",
              `Would you like to **proceed with $${maxLoan.toLocaleString()}**? Reply **yes** or **no**.`,
              "",
              `Purpose noted: **${purposeDisplayLabel(purpose)}**.`,
            ].join("\n"),
          ),
        ],
        nextState: {
          type: "loan",
          step: 2,
          context: {
            awaitingMaxConfirm: true,
            suggestedAmount: maxLoan,
            maxLoan,
            purpose: purposeStoreValue(purpose),
          },
        },
      };
    }

    return {
      messages: [
        assistantMessage(
          [
            "Here’s a quick snapshot of your **retirement loan** capacity (mock data):",
            "",
            `**Total balance:** $${financials.totalBalance.toLocaleString()}`,
            `**Vested balance:** $${financials.vestedBalance.toLocaleString()}`,
            `**You can borrow up to:** $${maxLoan.toLocaleString()}`,
            "",
            "**How much would you like to borrow?** You can add a purpose (e.g. “**$4,500 for a house**” or “**medical 3000 loan**”).",
          ].join("\n"),
        ),
      ],
      nextState: {
        type: "loan",
        step: 1,
        context: { maxLoan },
      },
    };
  }

  if (state.step === 1) {
    const cap = (ctx.maxLoan as number) ?? maxLoan;

    if (amount == null && wantsMaxOnly(trimmed)) {
      amount = cap;
      purpose = parseLoanInput(trimmed).purpose;
    }

    if (amount == null) {
      return {
        messages: [
          assistantMessage(
            "I need a **valid dollar amount** (for example **3000** or **$4,500**). You can also say **max** to use your full eligible amount.",
          ),
        ],
        nextState: { type: "loan", step: 1, context: { ...ctx } },
      };
    }

    if (amount <= cap) {
      return startGuidedLoanFlow(amount, purposeStoreValue(purpose), financials);
    }

    return {
      messages: [
        assistantMessage(
          [
            `You requested **$${amount.toLocaleString()}**, but your **max eligible** loan is **$${cap.toLocaleString()}**.`,
            "",
            `Would you like to **proceed with $${cap.toLocaleString()}** instead? Reply **yes** or **no**.`,
            "",
            `Purpose: **${purposeDisplayLabel(purpose)}**.`,
          ].join("\n"),
        ),
      ],
      nextState: {
        type: "loan",
        step: 2,
        context: {
          awaitingMaxConfirm: true,
          suggestedAmount: cap,
          maxLoan: cap,
          purpose: purposeStoreValue(purpose),
        },
      },
    };
  }

  return { messages: [], nextState: null };
}
