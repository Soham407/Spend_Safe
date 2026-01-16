import { AssumptionState } from "@/domain/assumptions/types";

export interface IncomeEventData {
  id: string;
  amount: number;
  event_date: string;
  savings_rate: number;
  created_at: string;
  state?: AssumptionState;
}

export interface SnapshotData {
  safe_to_spend: number;
  total_income: number;
  estimated_savings: number;
  confirmed_safe_to_spend: number;
  pending_count: number;
  oldest_pending_age_days: number;
  degradation_level: string;
  income_event_count: number;
}

export interface PanicSnapshotData {
  confirmed_safe_to_spend: number;
  confirmed_income: number;
  confirmed_savings: number;
  confirmed_count: number;
  pending_safe_to_spend: number;
  pending_income: number;
  pending_savings: number;
  pending_count: number;
  deferred_safe_to_spend: number;
  deferred_income: number;
  deferred_savings: number;
  deferred_count: number;
  total_income: number;
  total_estimated_savings: number;
  total_safe_to_spend: number;
  oldest_pending_age_days: number;
  degradation_level: string;
  income_event_count: number;
  calculated_at: string;
  event_breakdown: Array<{
    income_event_id: string;
    event_date: string;
    amount: number;
    savings_rate: number;
    safe_to_spend: number;
    state: AssumptionState;
    age_days: number;
  }>;
}
