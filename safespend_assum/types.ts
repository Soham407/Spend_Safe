
export enum AssumptionState {
  PENDING = 'PENDING',
  CONFIRMED = 'CONFIRMED',
  DEFERRED = 'DEFERRED'
}

export interface IncomeEvent {
  id: string;
  amount: number;
  date: string;
  savingsRate: number; // 0 to 1 (e.g., 0.3 for 30%)
  state: AssumptionState;
  createdAt: number; // timestamp
  notes?: string;
}

export interface UserSettings {
  name: string;
  email: string;
  defaultSavingsRate: number;
}

export interface FinancialSnapshot {
  totalIncome: number;
  estimatedSavings: number;
  safeToSpend: number;
  pendingCount: number;
  degradationLevel: 'low' | 'medium' | 'high';
}

export interface AppState {
  incomeEvents: IncomeEvent[];
  lastRealityCheck: number;
  settings: UserSettings;
}
