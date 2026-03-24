# Transaction system — flow map (Figma: *Implement Current Design (Copy) (1)*)

All routes live under `/:version/transactions/…` in the app router. Shell: `TransactionFlowLayout` + `TransactionHeader` + `TransactionStepper` + `tx-flow-main`.

## Loan

| Step | Route segment |
|------|----------------|
| 1 Eligibility | `loan/eligibility` |
| 2 Simulator | `loan/simulator` |
| 3 Configuration | `loan/configuration` |
| 4 Fees | `loan/fees` |
| 5 Documents | `loan/documents` |
| 6 Review | `loan/review` |

## Withdrawal

| Step | Route segment |
|------|----------------|
| 1 Eligibility | `withdraw` (index) |
| 2 Type | `withdraw/type` |
| 3 Source | `withdraw/source` |
| 4 Fees | `withdraw/fees` |
| 5 Payment | `withdraw/payment` |
| 6 Review | `withdraw/review` |

## Transfer

| Step | Route segment |
|------|----------------|
| 1 Type | `transfer` (index) |
| 2 Source | `transfer/source` |
| 3 Destination | `transfer/destination` |
| 4 Amount | `transfer/amount` |
| 5 Impact | `transfer/impact` |
| 6 Review | `transfer/review` |

## Rebalance

| Step | Route segment |
|------|----------------|
| 1 Current allocation | `rebalance` (index) |
| 2 Target allocation | `rebalance/adjust` |
| 3 Trades | `rebalance/trades` |
| 4 Review | `rebalance/review` |

## Rollover

| Step | Route segment |
|------|----------------|
| 1 Plan / source details | `rollover` (index) |
| 2 Validation | `rollover/validation` |
| 3 Allocation | `rollover/allocation` |
| 4 Documents | `rollover/documents` |
| 5 Review | `rollover/review` |

## Transaction center (hub)

| Route | UI |
|-------|-----|
| `/:version/transactions` | `TransactionsPage` — plan summary, quick actions, attention, drafts, history |

## Shared components (`src/components/transactions/`)

- `TransactionFlowLayout` — full-page shell
- `TransactionHeader` — brand icon, flow title, step N of M, close
- `TransactionStepper` — progress UI
- `TransactionFooter` — back / next actions
- `TransactionCard` / `TransactionMetric` — step content cards
- `TransactionAlert` — warning / info callouts
