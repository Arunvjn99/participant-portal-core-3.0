You are a senior fintech product designer, UX architect, and retirement domain expert.

Design the complete end-to-end transaction system for a Retirement Participant Portal (401k platform).

Create a full transaction flow architecture in FigJam / Figma including:

User journey
Transaction center
Wizard flows
Business rules
Edge cases
Processing states
Tracking states

The goal is to design a system better than major retirement platforms such as Vanguard, Fidelity, and Betterment.

---

PRIMARY USER JOURNEY

User flow begins with:

Login
→ Participant Dashboard
→ Transaction Center

The Transaction Center is the central hub where users can start, manage, and track all retirement transactions.

---

TRANSACTION CENTER STRUCTURE

The Transaction Center page should include the following sections:

1. Plan Overview
   Display:
   Plan name
   Plan balance
   Vested balance

2. Quick Actions
   Allow users to start transactions quickly:

Take a Loan
Withdraw Money
Transfer Funds
Rebalance Investments
Roll Over Funds

3. Active Transactions
   Show all ongoing transactions with timeline progress.

Stages include:
Submitted
Processing
Approved
Funds Sent

4. Attention Required
   Highlight transactions requiring user action such as:

Missing documents
Bank verification
Admin rejection

Provide a clear "Resolve Issue" action.

5. Recent Transactions
   Display history of completed or past transactions.

Include filters:

All
Loans
Withdrawals
Transfers
Rebalance

6. Financial Guidance
   Provide insights such as:

Employer match opportunity
Loan impact
Upcoming loan payment

---

TRANSACTION TYPES

Design flows for the following transactions:

Loan
Withdrawal
Transfer
Rebalance
Rollover

Each transaction must follow a consistent wizard structure.

---

UNIVERSAL WIZARD STRUCTURE

All transaction flows should follow these steps:

Step 1 – Transaction Details
User chooses transaction type and enters basic information.

Step 2 – Source Selection
User selects plan sources or investments.

Step 3 – Allocation / Amount
User specifies amount, percentage, or allocation.

Step 4 – Payment or Documents
User selects bank account or uploads documents.

Step 5 – Review & Confirm
User reviews full transaction summary and confirms.

---

LOAN FLOW

User selects "Take a Loan".

Steps include:

Eligibility Check
Display maximum loan amount and plan rules.

Loan Amount Entry
User enters desired loan amount.

Repayment Schedule Preview
Display repayment terms and estimated paycheck deduction.

Bank Selection
Choose payment destination.

Review & Confirm
Submit loan request.

Processing Stages:
Submitted
Admin Review
Approved
Funds Sent

---

WITHDRAWAL FLOW

User selects "Withdraw Money".

Steps include:

Select Withdrawal Type
Hardship withdrawal
Normal withdrawal
Age-based withdrawal
RMD withdrawal

Enter Amount
User specifies withdrawal amount.

Tax Impact Preview
Display estimated taxes and penalties.

Payment Method
Choose EFT or check.

Upload Documents
Required for hardship withdrawals.

Review & Confirm
Submit withdrawal request.

Processing stages:
Submitted
Compliance Review
Trade Execution
Funds Sent

---

TRANSFER FLOW

User selects "Transfer Funds".

Steps include:

Select Source Funds
Choose investments to transfer from.

Select Destination Funds
Choose target funds.

Enter Allocation
Specify amount or percentage.

Preview Portfolio Impact
Show allocation change.

Review & Confirm
Submit transfer request.

Processing stages:
Submitted
Trade Execution
Portfolio Updated

---

REBALANCE FLOW

User selects "Rebalance".

Steps include:

View Current Allocation
Display portfolio allocation chart.

Adjust Target Allocation
User edits percentages.

Trade Preview
Show buy/sell actions required.

Review & Confirm
Submit rebalance request.

Processing stages:
Submitted
Trade Execution
Portfolio Updated

---

ROLLOVER FLOW

User selects "Roll Over Funds".

Steps include:

Enter Previous Plan Details
Previous employer name
Plan administrator
Account number

Source Validation
System verifies compatibility.

Specify Allocation
User chooses rollover allocation.

Upload Documents
Upload check details or statements.

Review & Confirm
Submit rollover request.

Processing stages:
Submitted
Admin Review
Funds Received
Allocation Completed

---

SCENARIO HANDLING

Design flows for the following scenarios:

Eligibility scenarios:
Loan not available
Withdrawal restrictions
Rollover incompatibility

Validation scenarios:
Insufficient balance
Invalid allocation
Missing documents

Processing scenarios:
Admin review required
Trade execution delay
Bank verification pending

Failure scenarios:
Trade failure
Document rejection
Transaction cancellation

Completion scenarios:
Funds delivered
Portfolio updated
Balance adjusted

---

SPECIAL STATES

Include design states for:

No active transactions
Multiple active transactions
Draft transactions
Rejected transactions
Transaction resubmission

---

SMART FEATURES

Include UX features that improve user decision-making:

Transaction impact preview
Estimated tax impact
Loan repayment simulation
Portfolio allocation visualization

Provide helpful recommendations when appropriate.

---

DELIVERABLE

Generate a complete transaction architecture including:

Transaction Center layout
Wizard flows for each transaction type
Scenario branches
Decision points
Processing timelines
Exception handling
Completion states

Ensure the design prioritizes:

Clarity
Trust
Financial transparency
Ease of use
Minimal friction

The final experience should feel modern, intelligent, and superior to traditional retirement portals.
