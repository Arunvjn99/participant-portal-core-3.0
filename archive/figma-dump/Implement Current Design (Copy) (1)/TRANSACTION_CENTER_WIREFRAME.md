# Transaction Center - Next-Generation Design
## Component Structure & Layout Wireframe

---

## Page Layout Structure

```
┌─────────────────────────────────────────────────────────────┐
│ Transaction Center                                           │
│ Track, manage, and start retirement transactions            │
│                                                              │
│ ┌────────────┬────────────┬────────────┐                   │
│ │ Plan Name  │ Balance    │ Vested     │                   │
│ │ 401(k)     │ $30,000    │ $25,000    │                   │
│ └────────────┴────────────┴────────────┘                   │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│ 1. ATTENTION REQUIRED (Conditional)                         │
│ ┌─────────────────────────────────────────────────────────┐ │
│ │ ⚠  Loan Request                    [Resolve Issue]      │ │
│ │    Amount: $5,000  [Action Required]                    │ │
│ │                                                          │ │
│ │    Upload required documents to continue processing.    │ │
│ └─────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│ 2. ACTIVE TRANSACTIONS                                       │
│ ┌─────────────────────────────────────────────────────────┐ │
│ │ Loan Request                           [Action Required] │ │
│ │ Amount: $5,000  •  March 6, 2026                        │ │
│ │                                                          │ │
│ │ Submitted ✓ → Processing ● → Approved ○ → Funds Sent ○ │ │
│ │ 🕐 Pending document upload                              │ │
│ └─────────────────────────────────────────────────────────┘ │
│ ┌─────────────────────────────────────────────────────────┐ │
│ │ Hardship Withdrawal                       [Processing]   │ │
│ │ Amount: $3,200  •  March 8, 2026                        │ │
│ │                                                          │ │
│ │ Submitted ✓ → Processing ● → Approved ○ → Funds Sent ○ │ │
│ │ 🕐 Estimated completion: March 12, 2026                 │ │
│ └─────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│ 3. QUICK ACTIONS                                             │
│ ┌──────────┐  ┌──────────┐  ┌──────────┐                  │
│ │ 💰 Take  │  │ 💵 With- │  │ ⇄ Trans- │                  │
│ │    Loan  │  │    draw  │  │    fer   │                  │
│ │          │  │          │  │          │                  │
│ │ Up to    │  │ Available│  │ Reallo-  │                  │
│ │ $10,000  │  │ $5,000   │  │ cate     │                  │
│ │ 1-3 days │  │ Tax 10-  │  │ No fees  │                  │
│ │          │  │ 20%      │  │          │                  │
│ │[Start]   │  │[Start]   │  │[Start]   │                  │
│ └──────────┘  └──────────┘  └──────────┘                  │
│                                                              │
│ ┌──────────┐  ┌──────────┐                                 │
│ │ 📊 Reba- │  │ 🔄 Roll  │                                 │
│ │    lance │  │    Over  │                                 │
│ │          │  │          │                                 │
│ │ Moderate │  │ Consoli- │                                 │
│ │ risk     │  │ date     │                                 │
│ │ 6mo ago  │  │ No tax   │                                 │
│ │          │  │          │                                 │
│ │[Start]   │  │[Start]   │                                 │
│ └──────────┘  └──────────┘                                 │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│ 4. FINANCIAL GUIDANCE                                        │
│ ┌─────────────────────────────────────────────────────────┐ │
│ │ 📈 Retirement Impact Overview                           │ │
│ │ ┌──────────┬─────────────┬──────────────┐              │ │
│ │ │Available │ Monthly Rep │ Projected    │              │ │
│ │ │Loan      │ $96/paycheck│ Balance      │              │ │
│ │ │$10,000   │             │ $420,000     │              │ │
│ │ └──────────┴─────────────┴──────────────┘              │ │
│ └─────────────────────────────────────────────────────────┘ │
│                                                              │
│ ┌─────────────────────────────────────────────────────────┐ │
│ │ ⚠ Consider Your Options                                 │ │
│ │ Taking a loan may reduce retirement savings by $8,200   │ │
│ └─────────────────────────────────────────────────────────┘ │
│                                                              │
│ ┌─────────────────────────────────────────────────────────┐ │
│ │ 💰 Maximize Your Contributions                          │ │
│ │ Increase to 6% to receive full employer match          │ │
│ └─────────────────────────────────────────────────────────┘ │
│                                                              │
│ ┌─────────────────────────────────────────────────────────┐ │
│ │ 📅 Quarterly Rebalancing                                │ │
│ │ Portfolio not rebalanced in 6 months [Review →]        │ │
│ └─────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│ 5. TRANSACTION HISTORY                    [Export]          │
│ ┌─────────────────────────────────────────────────────────┐ │
│ │ [All] [Loans] [Withdrawals] [Transfers] [Rebalance]    │ │
│ │ 🔍 Search transactions...                               │ │
│ └─────────────────────────────────────────────────────────┘ │
│                                                              │
│ ┌─────────────────────────────────────────────────────────┐ │
│ │ Type     │ Amount  │ Status      │ Date       │ Action  │ │
│ ├──────────┼─────────┼─────────────┼────────────┼─────────┤ │
│ │ Loan     │ $5,000  │[Action Req] │ Mar 6 2026 │[View]   │ │
│ │ Withdraw │ $3,200  │[Processing] │ Mar 8 2026 │[View]   │ │
│ │ Rebalance│   —     │[Processing] │ Mar 9 2026 │[View]   │ │
│ │ Transfer │ $1,500  │[Completed]  │ Mar 5 2026 │[View]   │ │
│ │ Loan     │ $2,000  │[Completed]  │ Feb 28 2026│[View]   │ │
│ └─────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
```

---

## Component Details

### 1. Attention Required
- **Visibility**: Conditional (only when action needed)
- **Style**: Amber border, amber background, prominent placement
- **Components**: 
  - Alert icon
  - Transaction type heading
  - Amount and status badge
  - Descriptive message
  - Primary CTA button

### 2. Active Transactions
- **Layout**: Vertical stacked cards
- **Visual Timeline**: 
  - ✓ Completed steps (filled circle, blue)
  - ● Current step (filled circle, blue, pulsing)
  - ○ Upcoming steps (empty circle, gray)
  - Connecting lines between steps
- **Status Badges**:
  - Action Required: Amber
  - Processing: Blue
  - Completed: Green
- **Information Displayed**:
  - Transaction type
  - Amount
  - Submission date
  - Estimated completion

### 3. Quick Actions
- **Layout**: Responsive grid (3 columns desktop, 2 tablet, 1 mobile)
- **Card Structure**:
  - Icon with background (blue tint)
  - Title
  - Description
  - Contextual information (bold, blue text)
  - Additional info (smaller, gray text)
  - "Get Started" button
- **Hover Effects**: Shadow lift, icon background intensifies

### 4. Financial Guidance
- **Retirement Impact Panel**:
  - Gradient background (blue to purple)
  - 3-column grid with key metrics
  - Icon with background
- **Recommendation Cards**:
  - Color-coded by type:
    - Warnings: Amber
    - Opportunities: Green
    - Information: Blue
  - Icon, heading, description
  - Optional CTA link

### 5. Transaction History
- **Filter Buttons**: Pill-style, active state in blue
- **Search Bar**: Icon prefix, full-width
- **Table**:
  - Sortable columns
  - Status badges (color-coded)
  - Row hover states
  - Action buttons per row
- **Export**: Button in header

---

## Design Tokens

### Colors
- Primary: Blue (#3b82f6)
- Success: Green (#10b981)
- Warning: Amber (#f59e0b)
- Error: Red (#ef4444)
- Gray scale: 50, 100, 200, 300, 600, 700, 900

### Typography
- Headings: Semibold
- Body: Regular
- Labels: Medium
- Captions: Small, 500 weight

### Spacing
- Section gaps: 32px (8 units)
- Card padding: 24px (6 units)
- Element gaps: 16px (4 units)

### Shadows
- Cards: sm
- Hover: lg
- Active: none

---

## Interaction Patterns

### Quick Actions
- Click anywhere on card to start flow
- Hover: shadow lift + icon background change

### Active Transactions
- Visual timeline shows progress
- Status badges indicate urgency
- Estimated completion provides clarity

### Transaction History
- Filter by type
- Search by keyword
- Export to CSV/PDF
- Click row to view details

### Financial Guidance
- Contextual recommendations
- Action links for relevant flows
- Visual hierarchy (warnings > opportunities > info)

---

## Responsive Behavior

### Desktop (1024px+)
- Full 3-column grid for Quick Actions
- Side-by-side layout for guidance panels
- Full table for history

### Tablet (768px - 1023px)
- 2-column grid for Quick Actions
- Stacked guidance panels
- Full table with horizontal scroll

### Mobile (< 768px)
- Single column for all sections
- Card-based history (not table)
- Simplified timeline (vertical dots)
- Sticky header with plan info

---

## Accessibility

- Color contrast: WCAG AA minimum
- Focus indicators: Visible on all interactive elements
- Screen reader: Proper ARIA labels
- Keyboard navigation: Tab order follows visual hierarchy
- Status announcements: Live regions for updates

---

## Implementation Notes

1. **Attention Required**: Use conditional rendering based on backend flag
2. **Active Transactions**: Real-time updates via WebSocket or polling
3. **Quick Actions**: Navigate to multi-step flows (Loan, Withdrawal, Transfer)
4. **Financial Guidance**: Personalized based on user data and behavior
5. **Transaction History**: Paginated, with backend filtering and search

---

## Future Enhancements

- Push notifications for status changes
- In-app chat for support
- Document preview/upload from history
- Transaction templates for repeat actions
- Financial health score dashboard integration
