export enum TransactionStatus {
  COMPLETED = 'Completed',
  PENDING = 'Pending',
  PROCESSING = 'Processing',
  SCHEDULED = 'Scheduled',
  FAILED = 'Failed'
}

export enum TransactionType {
  CONTRIBUTION = 'Contribution',
  WITHDRAWAL = 'Withdrawal',
  LOAN_PAYMENT = 'Loan Repayment',
  DIVIDEND = 'Dividend',
  FEE = 'Administrative Fee',
  ROLLOVER = 'Rollover In',
  TRANSFER = 'Transfer'
}

export interface Plan {
  id: string;
  name: string;
  employer: string;
  type: '401(k)' | 'Roth 401(k)' | 'IRA';
  balance: number;
  currency: string;
  vestedBalance: number;
}

export interface Transaction {
  id: string;
  date: string;
  type: TransactionType;
  description: string;
  amount: number;
  status: TransactionStatus;
  planId: string;
  impact?: {
    taxYear: number;
    vestedAmount: number;
  };
}

export type InsightImpactType = 'Growth' | 'Risk' | 'Pending' | 'Info';

export interface Insight {
  id: string;
  impactType: InsightImpactType;
  title: string;
  description: string;
  actionLabel?: string;
  value?: string;
  priority?: boolean;
}

export interface ChartDataPoint {
  month: string;
  inflow: number;
  outflow: number;
  balance: number;
  projected?: number;
}

// Loan Application Specific Types
export interface LoanConfig {
  interestRate: number;
  originationFee: number;
  minAmount: number;
  maxAmountAbsolute: number;
  maxVestedPercentage: number;
}

export interface LoanFormData {
  amount: number;
  tenureYears: number;
  frequency: 'Monthly' | 'Biweekly';
  purpose: 'General' | 'Residential' | 'Hardship' | 'Education';
  paymentMethod: 'EFT' | 'Check';
  routingNumber: string;
  accountNumber: string;
  accountType: 'Checking' | 'Savings';
  agreedToTerms: boolean;
  agreedToDisclosures: boolean;
  spousalConsent: boolean;
}

// Withdrawal Specific Types
export type WithdrawalCategory = 'Hardship' | 'In-Service' | 'Rollover' | 'Termination';

export interface WithdrawalFormData {
  type: WithdrawalCategory;
  amount: number;
  federalTaxRate: number;
  stateTaxRate: number;
  distributionMethod: 'EFT' | 'Check';
  routingNumber: string;
  accountNumber: string;
  accountType: 'Checking' | 'Savings';
  agreedToTerms: boolean;
  agreedToPenalty: boolean;
  agreedToTax: boolean;
}

export interface WithdrawalConfig {
  penaltyRate: number;
  minAmount: number;
  mandatoryFedWithholding: number;
  processingFee: number;
}

// Transfer (Reallocation) Specific Types
export interface Fund {
  id: string;
  name: string;
  ticker: string;
  category: 'Large Cap' | 'Mid Cap' | 'Small Cap' | 'International' | 'Bond' | 'Target Date';
  riskScore: number; // 1-10
  expenseRatio: number;
  return5Y: number;
  currentAllocation: number; // Percentage 0-100
}

export type TransferIntentType = 'Rebalance' | 'ReduceRisk' | 'Growth' | 'AI_Recommended' | 'Manual';

export interface TransferFormData {
  intent: TransferIntentType;
  sourceId: string; // 'all' or specific source bucket ID
  allocations: Record<string, number>; // fundId -> percentage
  agreedToRisk: boolean;
  agreedToGoals: boolean;
}

// Rollover Specific Types
export type RolloverIntentType = 'Inbound' | 'Outbound' | 'Consolidate' | 'IRA_Inbound';
export type RolloverTaxType = 'Direct' | 'Indirect';
export type RolloverMethodType = 'Electronic' | 'Check_Plan' | 'Check_Participant';
export type InvestmentMapType = 'Current' | 'TargetDate' | 'AI_Recommended';

export interface RolloverFormData {
  intent: RolloverIntentType;
  providerName: string;
  accountType: string;
  accountNumber: string;
  estimatedBalance: number;
  taxTreatment: RolloverTaxType;
  hasRoth: boolean;
  method: RolloverMethodType;
  investmentStrategy: InvestmentMapType;
  agreedToTerms: boolean;
  agreedToTax: boolean;
}