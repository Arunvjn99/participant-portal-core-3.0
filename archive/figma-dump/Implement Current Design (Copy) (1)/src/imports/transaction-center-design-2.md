You are a senior fintech UX architect and UI designer building the complete transaction system for a retirement participant portal (401k platform).

The goal is to redesign and implement transaction flows that include all required financial fields while maintaining a simple mobile-first user experience.

The design must follow these principles:

Mobile-first design
Bento grid layout for dashboards
Step-based transaction wizard
Progressive disclosure of complex financial fields

The experience must support five transaction types:

Loan
Withdrawal
Transfer
Rebalance
Rollover

Start the flow from the Transaction Center dashboard.

---

TRANSACTION CENTER LAYOUT

Design the Transaction Center as a mobile-first bento dashboard.

Use card-based components that expand into a responsive grid on larger screens.

Required sections:

Plan Overview Card
Display plan name, plan balance, and vested balance.

Quick Actions Card
Provide entry points for starting transactions:

Take Loan
Withdraw Money
Transfer Funds
Rebalance Investments
Roll Over Funds

Each action should be a mini card with icon, title, and description.

Active Transactions Card
Show ongoing transactions with timeline status:

Submitted
Processing
Approved
Funds Sent

Attention Required Card
Highlight transactions that need user action such as missing documents or bank verification.

Recent Transactions Card
Show past transactions with filters.

Financial Guidance Card
Provide contextual financial insights such as employer match opportunities or loan repayment reminders.

---

UNIVERSAL TRANSACTION WIZARD

All transactions must follow a consistent step structure.

Step 1 — Intent
User selects the transaction type and sees eligibility information.

Step 2 — Eligibility
Display plan limits such as maximum loan amount or withdrawal eligibility.

Step 3 — Core Inputs
User enters key data such as loan amount or withdrawal amount.

Step 4 — Advanced Settings
Reveal required financial fields using expandable sections.

Step 5 — Impact Preview
Display financial impact using cards and charts.

Step 6 — Payment or Documents
Collect payment information or required documentation.

Step 7 — Review
Display a summary of all inputs.

Step 8 — Submit
User confirms transaction and enters processing state.

---

LOAN FLOW FIELDS

Include the following loan-related fields distributed across steps.

Eligibility
Maximum loan amount
Outstanding loan balance
Available loan balance

Loan Configuration
Loan amount
Loan term
Loan purpose
Interest rate

Repayment Settings
Repayment frequency
Repayment start date
Repayment method
Payroll deduction

Bank Information
Bank account number
Routing number
Account type

Loan Impact Preview
Monthly repayment amount
Total interest
Loan payoff date
Remaining retirement balance after loan

Documentation
Spousal consent if required
Employment verification if required

Review Screen
Loan summary
Repayment schedule
Fees and interest

---

WITHDRAWAL FLOW FIELDS

Include the following withdrawal fields distributed across steps.

Withdrawal Type
Hardship withdrawal
In-service withdrawal
Termination withdrawal
Required Minimum Distribution (RMD)

Withdrawal Details
Withdrawal amount
Gross vs Net election

Contribution Source Selection
Pre-tax contributions
Roth contributions
Employer contributions
After-tax contributions

Tax Withholding Settings
Federal withholding percentage
State withholding percentage

Payment Method
EFT transfer
Check

Bank Information
Bank account number
Routing number
Account type

Documentation
Proof of hardship
Identity verification
Spousal consent if required

Impact Preview
Tax estimate
Early withdrawal penalty estimate
Remaining retirement balance

Review Screen
Withdrawal summary
Tax withholding selections
Payment method
Processing timeline

---

TRANSFER FLOW

Steps should include:

Transfer type
Source fund selection
Destination fund selection
Amount or percentage selection
Allocation preview
Review and submit

---

REBALANCE FLOW

Steps should include:

Current portfolio allocation
Target allocation editing
Trade preview showing buy and sell actions
Review and submit

---

ROLLOVER FLOW

Steps should include:

Previous employer plan details
Trustee or custodian information
Account number
Plan compatibility validation
Allocation of rollover funds
Document upload
Review and submit

---

UI DESIGN SYSTEM

Use a modern fintech visual style.

Cards should follow a bento layout system.

Each card should include:

Rounded corners
Soft shadows
Subtle gradients
Icon containers

Use color-coded status badges.

Processing = blue
Completed = green
Action required = orange

Use timeline progress indicators for transaction tracking.

Use interactive charts for portfolio allocation and transaction impact.

---

MOBILE-FIRST EXPERIENCE

All flows must be optimized for mobile.

Each wizard step should be presented as a single card containing:

Step indicator
Primary inputs
Contextual helper information
Continue button

Advanced financial fields such as tax settings must appear inside expandable sections to reduce cognitive load.

---

FINAL DELIVERABLE

Generate a full transaction architecture in Figma including:

Transaction Center dashboard
Loan flow
Withdrawal flow
Transfer flow
Rebalance flow
Rollover flow

Each flow must include step screens, UI components, field placement, and visual hierarchy while maintaining a simple mobile-first experience.
