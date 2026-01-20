import type { Transaction } from "../types/transactions";
import { MOCK_TRANSACTIONS } from "./mockTransactions";

/**
 * In-memory transaction store for POC
 * In production, this would be replaced with API calls
 */
class TransactionStore {
  private transactions: Map<string, Transaction> = new Map();

  constructor() {
    // Initialize with existing mock transactions
    Object.values(MOCK_TRANSACTIONS).forEach((txn) => {
      this.transactions.set(txn.id, txn);
    });
  }

  /**
   * Create a new draft transaction
   */
  createDraft(type: Transaction["type"]): Transaction {
    const id = `txn-${Date.now()}`;
    const draft: Transaction = {
      id,
      type,
      status: "draft",
      amount: 0,
      dateInitiated: new Date().toISOString().split("T")[0],
      retirementImpact: {
        level: "low",
        rationale: "Draft transaction - impact will be calculated upon completion.",
      },
      isIrreversible: false,
      legalConfirmations: [],
    };

    this.transactions.set(id, draft);
    return draft;
  }

  /**
   * Get transaction by ID
   */
  getTransaction(id: string): Transaction | undefined {
    return this.transactions.get(id);
  }

  /**
   * Update transaction
   */
  updateTransaction(id: string, updates: Partial<Transaction>): Transaction | undefined {
    const existing = this.transactions.get(id);
    if (!existing) return undefined;

    const updated = { ...existing, ...updates };
    this.transactions.set(id, updated);
    return updated;
  }

  /**
   * Get all transactions
   */
  getAllTransactions(): Transaction[] {
    return Array.from(this.transactions.values());
  }

  /**
   * Get transactions by status
   */
  getTransactionsByStatus(status: Transaction["status"]): Transaction[] {
    return Array.from(this.transactions.values()).filter((txn) => txn.status === status);
  }

  /**
   * Get transactions by type
   */
  getTransactionsByType(type: Transaction["type"]): Transaction[] {
    return Array.from(this.transactions.values()).filter((txn) => txn.type === type);
  }
}

/**
 * Factory function to create TransactionStore instance
 * Must be called inside React component/hook to avoid module-scope initialization
 */
export function createTransactionStore(): TransactionStore {
  return new TransactionStore();
}

// Legacy export for backward compatibility - creates instance on first access
// TODO: Migrate all usages to use createTransactionStore() inside components
let _transactionStoreInstance: TransactionStore | null = null;
export const transactionStore = new Proxy({} as TransactionStore, {
  get(_target, prop) {
    if (!_transactionStoreInstance) {
      _transactionStoreInstance = new TransactionStore();
    }
    const value = _transactionStoreInstance[prop as keyof TransactionStore];
    if (typeof value === 'function') {
      return value.bind(_transactionStoreInstance);
    }
    return value;
  }
});
