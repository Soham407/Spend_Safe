export interface IncomeEvent {
  id: string;
  user_id: string;
  amount: string; // Decimal string to persist precision
  event_date: Date;
  savings_rate: string; // Decimal string (0.0000 - 1.0000)
  created_at: Date;
  updated_at: Date;
}

export interface IncomeEventInput {
  amount: string;
  event_date: Date;
  savings_rate: string;
}
