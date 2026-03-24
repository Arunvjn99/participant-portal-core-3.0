# Transaction Center - Bento Dashboard Layout
## Implementation Documentation

---

## Layout Structure

The Transaction Center uses a Bento-style dashboard with a 12-column grid system for optimal information density and reduced scrolling.

```
┌────────────────────────────────────────────────────────────────────────┐
│                     TRANSACTION CENTER DASHBOARD                        │
│                        Max Width: 1440px                               │
└────────────────────────────────────────────────────────────────────────┘

┌────────────────────────────────────────────────────────────────────────┐
│ ROW 1 - PLAN OVERVIEW (12 columns, Full Width)                        │
│ ┌────────────────────────────────────────────────────────────────────┐ │
│ │ 401(k) Retirement Plan │ Plan Balance: $30,000 │ Vested: $25,000  │ │
│ └────────────────────────────────────────────────────────────────────┘ │
└────────────────────────────────────────────────────────────────────────┘
                              ↓ 24px gap

┌────────────────────────────────────────────────────────────────────────┐
│ ROW 2 - QUICK ACTIONS (12 columns, Full Width, 5 equal cards)        │
│ ┌──────┐  ┌──────┐  ┌──────┐  ┌──────┐  ┌──────┐                    │
│ │ 💰   │  │ 💵   │  │ ⇄    │  │ 📊   │  │ 🔄   │                    │
│ │ Loan │  │Withdw│  │Trans │  │Rebal │  │ Roll │                    │
│ │      │  │      │  │      │  │      │  │      │                    │
│ │Up to │  │Avail │  │Reall │  │Curr: │  │Conso │                    │
│ │$10k  │  │$5k   │  │ocate │  │Mod   │  │lidat │                    │
│ │1-3d  │  │10-20%│  │NoFee │  │6mo   │  │NoTax │                    │
│ └──────┘  └──────┘  └──────┘  └──────┘  └──────┘                    │
└────────────────────────────────────────────────────────────────────────┘
                              ↓ 24px gap

┌────────────────────────────────────────────────────────────────────────┐
│ ROW 3 - TRANSACTION STATUS (Split: 4 + 8 columns)                    │
│ ┌─────────────────────┬──────────────────────────────────────────────┐ │
│ │ ATTENTION REQUIRED  │ ACTIVE TRANSACTIONS                          │ │
│ │ (4 columns)         │ (8 columns)                                  │ │
│ │                     │                                              │ │
│ │ ┌─────────────────┐ │ ┌──────────────────────────────────────────┐ │ │
│ │ │ ⚠ Loan Request  │ │ │ Hardship Withdrawal                      │ │ │
│ │ │ Amount: $5,000  │ │ │ $3,200 • March 8, 2026  [Processing]     │ │ │
│ │ │ [Action Req'd]  │ │ │                                          │ │ │
│ │ │                 │ │ │ Submitted ✓ → Processing ● → Approved ○  │ │ │
│ │ │ Upload docs to  │ │ │ 🕐 Est: March 12, 2026                   │ │ │
│ │ │ continue        │ │ └──────────────────────────────────────────┘ │ │
│ │ │                 │ │                                              │ │
│ │ │ [Resolve Issue] │ │ ┌──────────────────────────────────────────┐ │ │
│ │ └─────────────────┘ │ │ Investment Rebalance                     │ │ │
│ │                     │ │ — • March 9, 2026  [Processing]          │ │ │
│ │                     │ │                                          │ │ │
│ │                     │ │ Submitted ✓ → Processing ✓ → Approved ●  │ │ │
│ │                     │ │ 🕐 Est: Next trading day                 │ │ │
│ │                     │ │                                          │ │ │
│ │                     │ └──────────────────────────────────────────┘ │ │
│ └─────────────────────┴──────────────────────────────────────────────┘ │
└────────────────────────────────────────────────────────────────────────┘
                              ↓ 24px gap

┌────────────────────────────────────────────────────────────────────────┐
│ ROW 4 - TRANSACTION CONTEXT (Split: 4 + 8 columns)                   │
│ ┌─────────────────────┬──────────────────────────────────────────────┐ │
│ │ FINANCIAL GUIDANCE  │ RECENT TRANSACTIONS                          │ │
│ │ (4 columns)         │ (8 columns)                                  │ │
│ │                     │                                              │ │
│ │ ┌─────────────────┐ │ [All] [Loans] [Withdrawals] [Transfers]    │ │
│ │ │ 📈 Employer     │ │                                              │ │
│ │ │    Match        │ │ Type     │Amount│Status    │Date            │ │
│ │ │ 4% → 6% =      │ │ ─────────┼──────┼──────────┼────────────   │ │
│ │ │ $2,400/year    │ │ Transfer │$1,500│Completed │Mar 5 2026     │ │
│ │ └─────────────────┘ │ Loan     │$2,000│Completed │Feb 28 2026    │ │
│ │                     │ Withdraw │$1,000│Completed │Feb 15 2026    │ │
│ │ ┌─────────────────┐ │ Rebalance│  —   │Completed │Jan 20 2026    │ │
│ │ │ ⚠ Loan Impact   │ │                                              │ │
│ │ │ May reduce by   │ │                                              │ │
│ │ │ $8,200          │ │                                              │ │
│ │ └─────────────────┘ │                                              │ │
│ │                     │                                              │ │
│ │ ┌─────────────────┐ │                                              │ │
│ │ │ 💰 Next Payment │ │                                              │ │
│ │ │ $203 on         │ │                                              │ │
│ │ │ March 15, 2026  │ │                                              │ │
│ │ └─────────────────┘ │                                              │ │
│ └─────────────────────┴──────────────────────────────────────────────┘ │
└────────────────────────────────────────────────────────────────────────┘
```

---

## Grid System

### Desktop (1024px+)
- **Max width**: 1440px
- **Grid**: 12 columns
- **Gap**: 24px
- **Row 1**: 12 columns (full width)
- **Row 2**: 12 columns (5 equal cards)
- **Row 3**: 4 + 8 columns
- **Row 4**: 4 + 8 columns

### Tablet (768px - 1023px)
- **Row 2**: 3 columns (wraps to 2 rows)
- **Row 3**: Stack vertically (12 + 12)
- **Row 4**: Stack vertically (12 + 12)

### Mobile (< 768px)
- All rows stack vertically
- Full width cards

---

## Component Hierarchy

```
Dashboard
├── Row 1: Plan Overview (Card)
│   ├── Plan Name
│   ├── Plan Balance
│   └── Vested Balance
│
├── Row 2: Quick Actions (Grid)
│   ├── QuickActionButton (Take a Loan)
│   ├── QuickActionButton (Withdraw Money)
│   ├── QuickActionButton (Transfer Funds)
│   ├── QuickActionButton (Rebalance)
│   └── QuickActionButton (Roll Over)
│
├── Row 3: Transaction Status (Grid 4+8)
│   ├── Column 1 (4 cols): Attention Required
│   │   └── AttentionRequiredCompact
│   └── Column 2 (8 cols): Active Transactions
│       └── Card → ActiveTransactionsCompact
│
└── Row 4: Transaction Context (Grid 4+8)
    ├── Column 1 (4 cols): Financial Guidance
    │   └── FinancialGuidanceCompact
    └── Column 2 (8 cols): Recent Transactions
        └── Card → RecentTransactionsCompact
```

---

## Key Design Principles

### 1. Information Density
- Compact cards with essential information
- Smaller font sizes (text-xs, text-sm)
- Efficient use of space

### 2. Visual Hierarchy
- Row 1: Context (plan details)
- Row 2: Actions (most prominent, always visible)
- Row 3: Status (urgent items + active tracking)
- Row 4: History + Guidance (reference information)

### 3. No Duplication
- Transactions in "Attention Required" are excluded from "Active Transactions"
- Uses `excludeId` prop to filter

### 4. Scanning Efficiency
- Quick Actions visible without scrolling
- Color-coded status badges (Amber, Blue, Green)
- Visual timelines for progress tracking
- Compact tables for history

---

## Color System

### Status Colors
- **Action Required**: Amber (#f59e0b)
  - Background: amber-50
  - Border: amber-400
  - Badge: amber-200 text
  
- **Processing**: Blue (#3b82f6)
  - Background: blue-50
  - Badge: blue-100 text
  
- **Completed**: Green (#10b981)
  - Background: green-50
  - Badge: green-100 text

### Guidance Cards
- Employer Match: Blue-purple gradient
- Warnings: Amber background
- Positive actions: Green background

---

## Typography Scale

- **Page Title**: text-lg (18px)
- **Section Headers**: text-lg font-semibold
- **Card Titles**: text-sm font-semibold
- **Body Text**: text-xs (12px)
- **Labels**: text-xs text-gray-600
- **Badges**: text-[10px]

---

## Spacing System

- **Row gaps**: 24px (mb-6)
- **Card padding**: 16-24px (p-4, p-6)
- **Element gaps**: 12-16px (gap-3, gap-4)
- **Compact spacing**: 8-12px (gap-2, gap-3)

---

## Interaction Patterns

### Quick Actions
- Hover: shadow-lg + border-blue-300
- Click: Navigate to flow
- Visual feedback: icon background intensifies

### Transaction Cards
- Hover: border color change
- Compact timeline with status indicators
- Estimated completion always visible

### Filters
- Active state: Blue background with white text
- Inactive: Gray background
- Click: Filter table immediately

---

## Accessibility

- **Color contrast**: WCAG AA minimum for all text
- **Focus states**: Visible keyboard navigation
- **ARIA labels**: Screen reader support
- **Interactive areas**: Minimum 44px touch targets (mobile)

---

## Performance Considerations

- Grid uses CSS Grid for efficient layout
- Conditional rendering for Attention Required section
- Filtered transactions calculated in component
- No unnecessary re-renders

---

## Future Enhancements

1. **Drag & Drop**: Reorder quick actions by preference
2. **Widgets**: Collapsible sections
3. **Customization**: Show/hide sections
4. **Real-time updates**: WebSocket for status changes
5. **Notifications**: Badge count on Attention Required
6. **Quick filters**: Saved filter presets

---

## Component Files

- `/src/app/Dashboard.tsx` - Main Bento layout
- `/src/app/components/AttentionRequiredCompact.tsx` - Compact alert widget
- `/src/app/components/ActiveTransactionsCompact.tsx` - Transaction timeline
- `/src/app/components/QuickActionButton.tsx` - Action cards
- `/src/app/components/FinancialGuidanceCompact.tsx` - Guidance cards
- `/src/app/components/RecentTransactionsCompact.tsx` - History table

---

## Layout Measurements

```
Desktop Breakpoints:
- Max container: 1440px
- Grid columns: 12
- Column width: ~96px (calculated)
- Gutter: 24px

Row Heights (approximate):
- Row 1: 80px (compact plan overview)
- Row 2: 120px (quick actions)
- Row 3: 280-320px (transaction status)
- Row 4: 280-320px (context)

Total viewport usage: ~900px
- Above fold on 1080p display (1920x1080)
- Minimal scrolling required
```
