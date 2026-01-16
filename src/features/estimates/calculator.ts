// TRD Section 3: Calculation & Logic Constraints
// PRD Section 3.1: Calculate safe-to-spend based on assumptions
// Use decimal.js for financial precision

import Decimal from "decimal.js";
import { IncomeEvent } from "../income/types";
import { Assumption, AssumptionState } from "../assumptions/types";
import {
  getOldestPendingAge,
  getOverallDegradationLevel,
} from "../assumptions/degradation";

/**
 * TRD: "All calculations must be reproducible, explainable, traceable"
 * PRD: Safe-to-spend = Income - (Income * Savings Rate)
 */
export interface SafeToSpendResult {
  total_income: Decimal;
  estimated_savings: Decimal;
  safe_to_spend: Decimal;
  confirmed_safe_to_spend: Decimal;
  pending_count: number;
  oldest_pending_age_days: number;
  degradation_level: string;
  assumptions: AssumptionSummary[];
}

export interface AssumptionSummary {
  income_event_id: string;
  amount: Decimal;
  savings_rate: Decimal;
  state: AssumptionState;
  age_days: number;
}

/**
 * Calculate safe-to-spend using decimal.js for precision.
 * TRD: "Deterministic calculations with no hidden automation"
 */
export function calculateSafeToSpend(
  incomeEvents: IncomeEvent[],
  assumptions: Assumption[]
): SafeToSpendResult {
  const now = new Date();
  let totalIncome = new Decimal(0);
  let estimatedSavings = new Decimal(0);
  let safeToSpend = new Decimal(0);
  let confirmedSafeToSpend = new Decimal(0);
  let pendingCount = 0;
  const assumptionSummaries: AssumptionSummary[] = [];

  // Create a map of income_event_id -> latest active assumption
  const assumptionMap = new Map<string, Assumption>();
  assumptions
    .filter((a) => a.state !== AssumptionState.INVALIDATED)
    .forEach((a) => {
      const existing = assumptionMap.get(a.income_event_id);
      if (!existing || a.created_at > existing.created_at) {
        assumptionMap.set(a.income_event_id, a);
      }
    });

  incomeEvents.forEach((event) => {
    const amount = new Decimal(event.amount);
    const savingsRate = new Decimal(event.savings_rate);
    const savings = amount.times(savingsRate);
    const eventSafeSpend = amount.minus(savings);

    totalIncome = totalIncome.plus(amount);
    estimatedSavings = estimatedSavings.plus(savings);
    safeToSpend = safeToSpend.plus(eventSafeSpend);

    const assumption = assumptionMap.get(event.id);
    const state = assumption?.state ?? AssumptionState.PENDING;

    if (state === AssumptionState.CONFIRMED) {
      confirmedSafeToSpend = confirmedSafeToSpend.plus(eventSafeSpend);
    }

    if (state === AssumptionState.PENDING) {
      pendingCount++;
    }

    const ageDays = Math.floor(
      (now.getTime() - event.created_at.getTime()) / (1000 * 60 * 60 * 24)
    );

    assumptionSummaries.push({
      income_event_id: event.id,
      amount,
      savings_rate: savingsRate,
      state,
      age_days: ageDays,
    });
  });

  // Calculate degradation metadata
  const oldestPendingAgeDays = getOldestPendingAge(assumptions);
  const degradationLevel = getOverallDegradationLevel(assumptions);

  return {
    total_income: totalIncome,
    estimated_savings: estimatedSavings,
    safe_to_spend: safeToSpend,
    confirmed_safe_to_spend: confirmedSafeToSpend,
    pending_count: pendingCount,
    oldest_pending_age_days: oldestPendingAgeDays,
    degradation_level: degradationLevel,
    assumptions: assumptionSummaries,
  };
}
