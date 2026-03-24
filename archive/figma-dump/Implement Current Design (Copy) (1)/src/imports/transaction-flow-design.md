You are a senior fintech product designer, UX architect, and retirement platform product manager.

Design a completely new transaction flow system for a Retirement Participant Portal (401k / retirement savings platform).

IMPORTANT:
This is NOT a redesign of the current UI.
Create a completely new user experience while preserving all existing business fields and compliance requirements.

The system must support the following participant actions:

• Take a Loan
• Withdraw Money
• Transfer Funds
• Rebalance Investments
• Roll Over Funds

The experience must be modern, clear, and designed for financial confidence.

The interface is a desktop enterprise web application.

---

PRODUCT CONTEXT

Participants use this portal to manage retirement savings.

Transactions involve financial risk, taxes, compliance rules, and plan restrictions.

The system must:

• prevent mistakes
• clearly explain financial impact
• guide users step by step
• reduce support requests
• ensure regulatory transparency

The UX should feel similar to modern fintech products like Fidelity, Vanguard, Wealthfront, or Robinhood.

---

CORE UX PRINCIPLE

Every transaction should follow a consistent flow:

1. Eligibility
2. Simulation
3. Configuration
4. Financial Impact
5. Documents (if required)
6. Review & Submit

This ensures users understand consequences before submitting a request.

---

TRANSACTION ENTRY SCREEN

When the user clicks a quick action card (Loan, Withdrawal, Transfer, etc.), they should enter a guided flow.

The system should begin with an eligibility screen rather than a form.

---

FLOW 1: LOAN REQUEST

Step 1 — Loan Eligibility

Display a clear overview:

Maximum Loan Available: $10,000
Interest Rate: 8%
Maximum Term: 5 years
Estimated Monthly Payment Range

Show plan restrictions if applicable.

Primary action:

"Simulate Loan"

---

Step 2 — Loan Simulator

Provide interactive controls:

Loan amount slider
Tenure slider

Display live calculations:

Monthly payment
Total interest
Loan payoff timeline

Also show:

Projected retirement impact.

Example:
"Taking this loan could reduce your retirement balance by $8,200 by retirement age."

---

Step 3 — Loan Configuration

Collect required fields from the existing system:

Loan type
Reason for loan
Disbursement method
Bank selection / Add bank

Fields should appear in grouped cards.

---

Step 4 — Fees and Charges

Display transparent breakdown:

Transaction Fee
TPA Fee
EFT Fee
Redemption Fee

Show:

Net loan amount
Gross loan amount

---

Step 5 — Documents

Allow document upload if required.

Example documents:

Check leaf
Promissory note
Purchase agreement

Support both:

Upload manually
Use DocuSign integration

---

Step 6 — Review & Submit

Final confirmation page should show:

Loan amount
Monthly payment
Interest rate
Fees
Repayment frequency
Tenure

Provide a repayment schedule preview.

Users must confirm they understand the terms.

Primary action:

Submit Loan Request

---

FLOW 2: WITHDRAWAL REQUEST

Step 1 — Withdrawal Eligibility

Display:

Available withdrawal amount
Restrictions (hardship withdrawal etc.)
Estimated tax impact

Example:

Available to withdraw: $5,000
Estimated tax withholding: 10–20%

Primary action:

Continue

---

Step 2 — Withdrawal Type

Options:

Hardship withdrawal
One-time withdrawal
Full balance withdrawal

Explain each option with short descriptions.

---

Step 3 — Source Selection

Allow users to select where funds should come from.

Display investment sources such as:

Pretax
Aftertax
Investment funds

Use allocation sliders instead of large tables.

Example:

Fund A – $2,000
Fund B – $1,000

---

Step 4 — Fee & Tax Preview

Show a transparent breakdown:

Withdrawal amount
Taxes
Redemption fee
Final payout

---

Step 5 — Payment Method

Choose disbursement:

Electronic Funds Transfer (EFT)
Mail check

If mail check is selected:

Allow address selection:

Use employee address
Custom address

---

Step 6 — Review & Submit

Display full withdrawal summary.

Include:

Withdrawal type
Payment method
Taxes
Final payout amount

---

FLOW 3: TRANSFER / REBALANCE

Step 1 — Current Allocation

Display current portfolio allocation.

Use charts or visual cards.

Example:

Fund A – 40%
Fund B – 35%
Fund C – 25%

---

Step 2 — Adjust Allocation

Allow users to adjust investment percentages using sliders.

Show live updates.

---

Step 3 — Portfolio Impact

Display how the new allocation changes risk profile.

Example:

Current risk level: Moderate
New risk level: Moderate–High

---

Step 4 — Review & Submit

Show before vs after allocation comparison.

---

GAMIFICATION ELEMENTS

Add subtle behavioral design elements to encourage better financial decisions.

Examples:

Retirement health score
Savings impact visualization
Smart financial recommendations

Example:

"Taking a loan will reduce your projected retirement savings by $8,200."

Provide encouraging feedback where appropriate.

---

DESIGN STYLE

Use modern fintech UI patterns:

• card-based layouts
• clear typography
• step progress indicators
• visual charts for financial impact
• contextual help icons
• minimal form fields

The UI must be readable for users aged 35–65.

---

DELIVERABLE

Generate a structured UI wireframe and flow description for:

Loan flow
Withdrawal flow
Transfer / rebalance flow

Include:

• screen structure
• UI components
• interaction behavior
• visual hierarchy
• example content

This output should help a product designer directly translate the design into Figma.
