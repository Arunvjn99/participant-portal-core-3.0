/** Parsed loan purpose — always defined; `general` when not specified. */
export type LoanFlowPurpose = "general" | "home" | "medical" | "education";

export type ParsedLoanInput = {
  amount: number | null;
  purpose: LoanFlowPurpose;
};

/**
 * Deterministic parse: dollar amounts (3–6 digit core + optional $/commas) and purpose keywords.
 */
export function parseLoanInput(input: string): ParsedLoanInput {
  const text = input.toLowerCase().trim();

  let amount: number | null = null;

  /* Prefer explicit 3–6 digit loan-style amounts (spec baseline). */
  const compact = text.match(/\b(\d{3,6})\b/);
  if (compact) {
    const n = parseInt(compact[1], 10);
    if (!Number.isNaN(n) && n >= 100 && n <= 500_000) {
      amount = n;
    }
  }

  /* Also accept $5,000 / 5,000 style if no compact hit. */
  if (amount == null) {
    const money = text.match(/\$?\s*([\d,]+(?:\.\d{1,2})?)\b/);
    if (money) {
      const raw = money[1].replace(/,/g, "");
      const n = Math.round(parseFloat(raw));
      if (!Number.isNaN(n) && n >= 100 && n <= 500_000) {
        amount = n;
      }
    }
  }

  let purpose: LoanFlowPurpose = "general";
  if (/\b(house|home|build|building|residence|mortgage|primary residence)\b/.test(text)) {
    purpose = "home";
  } else if (/\b(medical|health|hospital)\b/.test(text)) {
    purpose = "medical";
  } else if (/\b(education|tuition|college|school)\b/.test(text)) {
    purpose = "education";
  }

  return { amount, purpose };
}

export function purposeToReasonValue(purpose: LoanFlowPurpose): string {
  switch (purpose) {
    case "home":
      return "home-purchase";
    case "medical":
      return "medical";
    case "education":
      return "education";
    default:
      return "";
  }
}

/** Configuration page loan type card id. */
export function purposeToLoanTypeId(purpose: LoanFlowPurpose): string {
  return purpose === "home" ? "residential" : "general";
}

export function purposeDisplayLabel(purpose: LoanFlowPurpose): string {
  switch (purpose) {
    case "home":
      return "Home / primary residence";
    case "medical":
      return "Medical";
    case "education":
      return "Education";
    default:
      return "General";
  }
}

/** Narrow store string to flow purpose for form mapping. */
export function storePurposeToParsed(p: string | null): LoanFlowPurpose {
  if (p === "home" || p === "medical" || p === "education") return p;
  return "general";
}
