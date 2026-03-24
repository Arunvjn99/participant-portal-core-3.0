You are a senior fintech UX architect designing a Transaction Center for a retirement participant portal (401k platform).

The goal is to implement the existing Transaction Center experience using a Bento-style dashboard layout to improve information density and reduce scrolling.

Do NOT redesign the experience. Keep the original transaction center logic and sections, but arrange them in a compact dashboard layout.

---

USER GOALS

Participants visit this page to:

1. Start a new transaction
2. Track the status of existing transactions
3. Resolve issues with pending transactions
4. Review past activity

The design must prioritize quick actions and transaction visibility.

---

LAYOUT SYSTEM

Use a modern Bento dashboard layout with a 12-column grid.

Max width: 1280–1440px
Grid gap: 24px
Use card-based widgets.

---

ROW 1 — PLAN OVERVIEW

Full width widget.

Display:

Plan Name
Plan Balance
Vested Balance

Example:

401(k) Retirement Plan
Plan Balance: $30,000
Vested Balance: $25,000

This section provides financial context but should remain compact.

---

ROW 2 — QUICK ACTIONS

Full width section with primary transaction actions.

Actions include:

Take a Loan
Withdraw Money
Transfer Funds
Rebalance Investments
Roll Over Funds

Each action should be displayed as a card or button with contextual information.

Example:

Take a Loan
Borrow up to $10,000
Typical approval time: 1–3 days

Quick actions must always be visible without scrolling.

---

ROW 3 — TRANSACTION STATUS

Two widgets side by side.

Left widget (4 columns)

Attention Required

Display transactions that require user action.

Example:

Loan Request
Amount: $5,000
Status: Action Required

Message:
Upload required documents to continue processing.

Primary CTA:
Resolve Issue

Important:
Items shown here should not appear again inside Active Transactions.

---

Right widget (8 columns)

Active Transactions

Display in-progress transactions.

Each transaction should include:

Transaction type
Amount
Submission date
Status badge

Use a timeline progress indicator instead of a simple progress bar.

Example timeline:

Submitted ✓
Processing ●
Approved ○
Funds Sent ○

Include estimated completion time if available.

---

ROW 4 — TRANSACTION CONTEXT

Two widgets side by side.

Left widget (4 columns)

Financial Guidance

Provide contextual financial insights such as:

Contribution optimization
Tax impact warnings
Upcoming loan payments

Example:

Your contribution is 4%. Increasing to 6% unlocks an additional $2,400 yearly in employer matches.

---

Right widget (8 columns)

Recent Transactions

Display transaction history with filters.

Filters:

All
Loans
Withdrawals
Transfers
Rebalance

Each row should include:

Transaction type
Amount
Status
Date

---

DESIGN STYLE

Use a modern fintech dashboard aesthetic.

Use:

card-based layouts
rounded cards
soft shadows
clear typography
status badges
timeline indicators

Status color mapping:

Action Required → Orange
Processing → Blue
Completed → Green

---

UX GOAL

The page should allow users to immediately understand:

• their plan status
• what actions they can take
• whether any transaction requires attention
• the progress of active transactions

The interface should feel like a financial control center rather than a long scrolling page.

---

DELIVERABLE

Generate a detailed UI layout and component structure for this Bento-style Transaction Center page.
