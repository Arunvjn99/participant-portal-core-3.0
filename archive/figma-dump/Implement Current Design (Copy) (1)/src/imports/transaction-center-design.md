You are a senior fintech product designer and UX architect.

Design a modern enterprise-grade Transaction Center for a Retirement Participant Portal (401k / retirement savings platform).

The system should help participants manage retirement transactions such as loans, withdrawals, transfers, rebalancing investments, and rollovers.

The design should follow modern fintech UX principles used by Fidelity, Vanguard, and Wealthfront.

The interface is a desktop web application dashboard.

---

PRODUCT GOAL

The transaction center should help users:

• Understand what transactions they are eligible for
• See any transactions currently in progress
• Start new financial transactions safely
• Review past transactions

The experience should prioritize clarity, financial trust, and compliance.

---

PAGE STRUCTURE

Design the page with the following hierarchy:

1. Page header with plan context
2. Transaction eligibility overview
3. Active transaction requests
4. Start a new transaction
5. Recent transaction history

---

1. PAGE HEADER

Show minimal context about the retirement plan.

Display:

Plan Name: 401(k) Retirement Plan
Plan Balance: $30,000
Vested Balance: $25,000

This should be a compact contextual header rather than a large card.

---

2. TRANSACTION ELIGIBILITY

Title: "Your Transaction Eligibility"

Display eligibility cards:

Loan Availability
$10,000 available
Maximum loan per plan: $15,000
Estimated repayment: $96 per paycheck

Withdrawal Eligibility
$5,000 available
Restrictions: Hardship withdrawal only
Estimated tax impact: 10–20%

Pending Transactions
1 active request
Status: In review

This section helps users understand what they can do before starting a transaction.

---

3. ACTIVE REQUESTS

Title: "Active Transactions"

Display cards showing any transactions currently processing.

Example:

Loan Request
Amount: $5,000
Status: Processing
Submitted: March 20

Include a progress indicator showing stages:

Submitted → Processing → Approved → Funds Sent

---

4. START A TRANSACTION

Title: "What would you like to do?"

Show large action cards.

Cards:

Take a Loan
Borrow money from your retirement savings.
Typical processing: 1–3 days

Withdraw Money
Request a withdrawal from your retirement plan.
Taxes and penalties may apply.

Transfer Funds
Move money between accounts or plans.

Rebalance Investments
Adjust your investment allocation.

Roll Over Funds
Move retirement funds to another account.

Each card should include:

• Icon
• Title
• Short description
• CTA arrow

---

5. RECENT TRANSACTIONS

Title: "Recent Transactions"

Show the last 5 transactions.

Example rows:

Loan – $6,000 – Completed – Jan 10, 2024
Withdrawal – $2,000 – Rejected – Dec 12, 2023
Transfer – $1,250 – Completed – Oct 3, 2023

Include filter options for:

All
Loans
Withdrawals
Transfers
Rebalance

---

DESIGN STYLE

Modern fintech UI with:

• card-based layout
• soft shadows
• neutral background
• strong typography hierarchy
• clear icons
• minimal clutter

Typography should be clean and readable for retirement users aged 35–65.

---

UX PRINCIPLES

Follow these principles:

Hick's Law – reduce decision complexity
Progressive Disclosure – show details when needed
Financial Transparency – show eligibility before actions
Trust UX – highlight restrictions, taxes, and timelines

---

DELIVERABLE

Generate a structured UI wireframe and layout description for this Transaction Center page.
