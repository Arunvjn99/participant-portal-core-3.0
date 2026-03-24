You are a senior fintech UX architect and product designer.

Design a next-generation Transaction Center for a retirement participant portal (401k platform).

The goal is to transform a simple transaction page into an intelligent financial command center that helps users track, start, and understand retirement transactions.

The interface must support the following actions:

• Loan requests
• Withdrawals
• Fund transfers
• Investment rebalancing
• Rollovers

The design should be modern, highly readable, and optimized for financial trust.

---

PAGE STRUCTURE

The transaction center should include these sections in order:

1. Attention Required
2. Active Transactions
3. Quick Actions
4. Financial Guidance
5. Transaction History

---

1. ATTENTION REQUIRED

If any transaction requires user action (for example document upload), display it prominently at the top.

Example:

Loan Request
Amount: $5,000
Status: Action Required

Message:
Upload required documents to continue processing.

Primary CTA:
Resolve Issue

---

2. ACTIVE TRANSACTIONS

Display current in-progress transactions grouped by status.

Statuses:

Action Required
Processing
Completed

Each transaction should display:

Transaction type
Amount
Submission date
Status badge

Include a visual timeline instead of a simple progress bar.

Example timeline:

Submitted ✓
Processing ●
Approved ○
Funds Sent ○

Also display estimated completion time.

---

3. QUICK ACTIONS

Provide large action cards for starting transactions.

Cards:

Take a Loan
Withdraw Money
Transfer Funds
Rebalance Investments
Roll Over Funds

Each card should include contextual information.

Example:

Take a Loan
Borrow up to $10,000
Typical approval time: 1–3 business days

Withdraw Money
Available withdrawal amount: $5,000
Estimated tax impact: 10–20%

---

4. FINANCIAL GUIDANCE

Provide contextual financial insights to help users make better decisions.

Example panel:

Retirement Impact

Available loan: $10,000
Estimated monthly repayment: $96 per paycheck
Projected retirement balance: $420,000

Add recommendations such as:

Taking a loan may reduce your retirement savings. Consider other options if possible.

---

5. TRANSACTION HISTORY

Display recent transactions with filters.

Filters:

All
Loans
Withdrawals
Transfers
Rebalance

Include search functionality.

Each row should show:

Transaction type
Amount
Status
Date

---

DESIGN STYLE

Modern fintech dashboard style.

Use:

card-based layouts
clear typography
status badges
visual timelines
subtle shadows
accessible color contrast

The UI should feel modern like Wealthfront or Fidelity but remain simple for retirement participants aged 35–65.

---

DELIVERABLE

Generate a detailed UI layout and component structure for this next-generation Transaction Center page.
