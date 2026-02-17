/**
 * Retirement Activity Intelligence Center — extended types.
 * Complements core Transaction type with lifecycle, plan, and tax fields.
 */

import type { ReactNode } from "react";
import type { Transaction, TransactionType } from "../../types/transactions";

export type TransactionLifecycleStatus =
  | "pending"
  | "processing"
  | "completed"
  | "failed"
  | "scheduled";

export type TaxType = "Pre-tax" | "Roth" | "After-tax";

export interface ActivityItem extends Transaction {
  /** Lifecycle for StatusTracker / Timeline (derived or explicit) */
  lifecycleStatus?: TransactionLifecycleStatus;
  /** Plan source for multi-plan view */
  planId?: string;
  planName?: string;
  /** Tax classification */
  taxType?: TaxType;
  /** Settlement date when known */
  settlementDate?: string;
  /** Estimated retirement impact in dollars (optional) */
  estimatedRetirementImpact?: number;
  /** ETA for pending/processing (e.g. "3 days") */
  eta?: string;
}

export type PlanOption = {
  id: string;
  label: string;
  type: "current" | "previous" | "ira";
};

export interface MonthlySummaryRow {
  label: string;
  amount: number;
  pct?: number;
}

export type InsightImpactType = "Growth" | "Risk" | "Pending" | "Info";

export interface ActivityInsight {
  id: string;
  title: string;
  description: string;
  impact?: string;
  actionLabel?: string;
  onAction?: () => void;
  type: "contribution" | "withdrawal" | "rollover" | "general" | "warning";
  /** SmartInsights-style impact type for styling */
  impactType?: InsightImpactType;
  value?: string;
  priority?: boolean;
}

export interface ActionTileConfig {
  type: TransactionType;
  title: string;
  subtext: string;
  statusBadge?: string;
  /** Shown as eligibility text (e.g. "$32k Available") */
  eligibilityText?: string;
  route: string;
  icon: ReactNode;
}

export { type Transaction, type TransactionType };
