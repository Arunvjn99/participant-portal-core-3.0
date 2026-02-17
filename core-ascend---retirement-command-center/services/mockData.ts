import { Plan, Transaction, TransactionType, TransactionStatus, Insight, ChartDataPoint, Fund } from '../types';

export const PLANS: Plan[] = [
  { id: 'p1', name: 'Core Tech 401(k) Plan', employer: 'Core Tech Inc', type: '401(k)', balance: 142894.52, currency: 'USD', vestedBalance: 114315.62 },
  { id: 'p2', name: 'Previous Employer Plan', employer: 'Legacy Corp', type: '401(k)', balance: 45200.00, currency: 'USD', vestedBalance: 45200.00 },
  { id: 'p3', name: 'Personal Roth IRA', employer: 'Individual', type: 'IRA', balance: 12500.00, currency: 'USD', vestedBalance: 12500.00 },
];

export const AVAILABLE_FUNDS: Fund[] = [
  { id: 'f1', name: 'Vanguard Target Retirement 2050', ticker: 'VFIFX', category: 'Target Date', riskScore: 6, expenseRatio: 0.08, return5Y: 8.5, currentAllocation: 60 },
  { id: 'f2', name: 'Fidelity 500 Index Fund', ticker: 'FXAIX', category: 'Large Cap', riskScore: 7, expenseRatio: 0.015, return5Y: 11.2, currentAllocation: 25 },
  { id: 'f3', name: 'T. Rowe Price Blue Chip Growth', ticker: 'TRBCX', category: 'Large Cap', riskScore: 8, expenseRatio: 0.69, return5Y: 12.8, currentAllocation: 15 },
  { id: 'f4', name: 'Vanguard Total Bond Market', ticker: 'VBTLX', category: 'Bond', riskScore: 2, expenseRatio: 0.05, return5Y: 1.2, currentAllocation: 0 },
  { id: 'f5', name: 'Vanguard Total Intl Stock', ticker: 'VTIAX', category: 'International', riskScore: 8, expenseRatio: 0.11, return5Y: 5.4, currentAllocation: 0 },
  { id: 'f6', name: 'Vanguard Small-Cap Index', ticker: 'VSMAX', category: 'Small Cap', riskScore: 9, expenseRatio: 0.05, return5Y: 9.1, currentAllocation: 0 },
];

export const INSIGHTS: Insight[] = [
  {
    id: 'i1',
    impactType: 'Growth',
    title: 'Match Opportunity',
    description: 'Increasing your contribution by 1% will maximize your employer match, adding ~$1,200/year.',
    value: '+$18,400 Projected',
    actionLabel: 'Adjust Rate',
    priority: true
  },
  {
    id: 'i2',
    impactType: 'Pending',
    title: 'Rollover Processing',
    description: 'Your rollover from Legacy Corp is currently being verified by the clearing house.',
    actionLabel: 'Track Status',
    value: 'ETA: 3 Days'
  },
  {
    id: 'i3',
    impactType: 'Risk',
    title: 'Tax Event Warning',
    description: 'Pending loan repayment must be settled before tax filing to avoid penalties.',
    value: 'Action Required'
  }
];

export const CHART_DATA: ChartDataPoint[] = [
  { month: 'Aug', inflow: 1200, outflow: 0, balance: 135000, projected: 135200 },
  { month: 'Sep', inflow: 1250, outflow: 500, balance: 135750, projected: 136100 },
  { month: 'Oct', inflow: 1250, outflow: 0, balance: 137000, projected: 137300 },
  { month: 'Nov', inflow: 2500, outflow: 0, balance: 139500, projected: 138500 }, // Bonus
  { month: 'Dec', inflow: 1300, outflow: 200, balance: 140600, projected: 139800 },
  { month: 'Jan', inflow: 1400, outflow: 0, balance: 142894, projected: 141200 },
];

export const RECENT_TRANSACTIONS: Transaction[] = [
  {
    id: 't1',
    date: '2025-01-15T10:00:00Z',
    type: TransactionType.LOAN_PAYMENT,
    description: 'Loan Repayment - #LN8832',
    amount: -500.00,
    status: TransactionStatus.COMPLETED,
    planId: 'p1',
    impact: { taxYear: 2025, vestedAmount: 500 }
  },
  {
    id: 't2',
    date: '2025-01-12T14:30:00Z',
    type: TransactionType.DIVIDEND,
    description: 'Q4 Dividend Reinvestment',
    amount: 127.50,
    status: TransactionStatus.COMPLETED,
    planId: 'p1',
    impact: { taxYear: 2024, vestedAmount: 127.50 }
  },
  {
    id: 't3',
    date: '2025-01-10T09:00:00Z',
    type: TransactionType.CONTRIBUTION,
    description: 'Employer Match Contribution',
    amount: 127.50,
    status: TransactionStatus.COMPLETED,
    planId: 'p1',
    impact: { taxYear: 2025, vestedAmount: 0 }
  },
  {
    id: 't4',
    date: '2025-01-08T11:20:00Z',
    type: TransactionType.FEE,
    description: 'Quarterly Recordkeeping Fee',
    amount: -12.50,
    status: TransactionStatus.COMPLETED,
    planId: 'p1',
    impact: { taxYear: 2025, vestedAmount: 0 }
  },
  {
    id: 't5',
    date: '2025-01-05T08:00:00Z',
    type: TransactionType.CONTRIBUTION,
    description: 'Employee Deferral',
    amount: 850.00,
    status: TransactionStatus.COMPLETED,
    planId: 'p1',
    impact: { taxYear: 2025, vestedAmount: 850 }
  },
  {
    id: 't6',
    date: '2024-12-28T10:00:00Z',
    type: TransactionType.ROLLOVER,
    description: 'Inbound Rollover from Fidelity',
    amount: 12500.00,
    status: TransactionStatus.COMPLETED,
    planId: 'p3',
  },
  {
    id: 't7',
    date: '2025-01-20T10:00:00Z',
    type: TransactionType.WITHDRAWAL,
    description: 'Hardship Withdrawal Request',
    amount: -2000.00,
    status: TransactionStatus.PENDING,
    planId: 'p1',
  }
];