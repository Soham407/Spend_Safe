// TRD Section 2: Income Event Core Types
// PRD Section 3.1: User records income (amount + date) and assigns savings rate

export interface IncomeEvent {
  id: string;
  user_id: string;
  amount: number; // Will be wrapped in Decimal in calculations
  event_date: Date;
  savings_rate: number; // 0.0 to 1.0 (0% to 100%)
  created_at: Date;
  updated_at: Date;
}

export interface IncomeEventInput {
  amount: number;
  event_date: Date;
  savings_rate: number;
}
