// TRD Section 11: Panic Button Semantics
// PRD Section 3.4: Panic Button Flow
// "Panic mode reframes existing data; it does not invent scenarios"

import Decimal from "decimal.js";
import { IncomeEvent } from "../income/types";
import { Assumption, AssumptionState } from "../assumptions/types";
import {
  getOldestPendingAge,
  getOverallDegradationLevel,
} from "../assumptions/degradation";

/**
 * TRD: "The Panic Button uses the same data and assumptions with a strictly conservative framing"
 * 
 * Explicitly excluded:
 * - New assumptions
 * - Worst-case simulations
 * - Stress testing
 * - Inferred pessimism
 */
export interface PanicSnapshotResult {
  // Confirmed allocations only - 100% reliable
  confirmed_safe_to_spend: Decimal;
  confirmed_income: Decimal;
  confirmed_savings: Decimal;
  confirmed_count: number;

  // Pending/deferred allocations - uncertain
  pending_safe_to_spend: Decimal;
  pending_income: Decimal;
  pending_savings: Decimal;
  pending_count: number;

  // Deferred allocations - explicitly not acted upon
  deferred_safe_to_spend: Decimal;
  deferred_income: Decimal;
  deferred_savings: Decimal;
  deferred_count: number;

  // Overall totals
  total_income: Decimal;
  total_estimated_savings: Decimal;
  total_safe_to_spend: Decimal;

  // Metadata for UI
  oldest_pending_age_days: number;
  degradation_level: string;
  income_event_count: number;
  calculated_at: Date;

  // Breakdown by income event for detailed view
  event_breakdown: EventBreakdown[];
}

export interface EventBreakdown {
  income_event_id: string;
  event_date: Date;
  amount: Decimal;
  savings_rate: Decimal;
  safe_to_spend: Decimal;
  state: AssumptionState;
  age_days: number;
}

/**
 * Calculate panic snapshot with conservative framing.
 * TRD: "Recomputes using confirmed assumptions and clearly labeled pending assumptions"
 */
export function calculatePanicSnapshot(
  incomeEvents: IncomeEvent[],
  assumptions: Assumption[]
): PanicSnapshotResult {
  const now = new Date();

  // Initialize confirmed totals
  let confirmedSafeToSpend = new Decimal(0);
  let confirmedIncome = new Decimal(0);
  let confirmedSavings = new Decimal(0);
  let confirmedCount = 0;

  // Initialize pending totals
  let pendingSafeToSpend = new Decimal(0);
  let pendingIncome = new Decimal(0);
  let pendingSavings = new Decimal(0);
  let pendingCount = 0;

  // Initialize deferred totals
  let deferredSafeToSpend = new Decimal(0);
  let deferredIncome = new Decimal(0);
  let deferredSavings = new Decimal(0);
  let deferredCount = 0;

  // Overall totals
  let totalIncome = new Decimal(0);
  let totalEstimatedSavings = new Decimal(0);
  let totalSafeToSpend = new Decimal(0);

  const eventBreakdown: EventBreakdown[] = [];

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

  // Process each income event
  incomeEvents.forEach((event) => {
    const amount = new Decimal(event.amount);
    const savingsRate = new Decimal(event.savings_rate);
    const savings = amount.times(savingsRate);
    const eventSafeSpend = amount.minus(savings);

    // Add to overall totals
    totalIncome = totalIncome.plus(amount);
    totalEstimatedSavings = totalEstimatedSavings.plus(savings);
    totalSafeToSpend = totalSafeToSpend.plus(eventSafeSpend);

    const assumption = assumptionMap.get(event.id);
    const state = assumption?.state ?? AssumptionState.PENDING;

    // Calculate age
    const ageDays = Math.floor(
      (now.getTime() - event.created_at.getTime()) / (1000 * 60 * 60 * 24)
    );

    // Categorize by state
    if (state === AssumptionState.CONFIRMED) {
      confirmedSafeToSpend = confirmedSafeToSpend.plus(eventSafeSpend);
      confirmedIncome = confirmedIncome.plus(amount);
      confirmedSavings = confirmedSavings.plus(savings);
      confirmedCount++;
    } else if (state === AssumptionState.DEFERRED) {
      deferredSafeToSpend = deferredSafeToSpend.plus(eventSafeSpend);
      deferredIncome = deferredIncome.plus(amount);
      deferredSavings = deferredSavings.plus(savings);
      deferredCount++;
    } else {
      // PENDING
      pendingSafeToSpend = pendingSafeToSpend.plus(eventSafeSpend);
      pendingIncome = pendingIncome.plus(amount);
      pendingSavings = pendingSavings.plus(savings);
      pendingCount++;
    }

    // Add to breakdown
    eventBreakdown.push({
      income_event_id: event.id,
      event_date: event.event_date,
      amount,
      savings_rate: savingsRate,
      safe_to_spend: eventSafeSpend,
      state,
      age_days: ageDays,
    });
  });

  // Calculate degradation metadata
  const oldestPendingAgeDays = getOldestPendingAge(assumptions);
  const degradationLevel = getOverallDegradationLevel(assumptions);

  // Sort breakdown by event date (newest first)
  eventBreakdown.sort((a, b) => b.event_date.getTime() - a.event_date.getTime());

  return {
    confirmed_safe_to_spend: confirmedSafeToSpend,
    confirmed_income: confirmedIncome,
    confirmed_savings: confirmedSavings,
    confirmed_count: confirmedCount,

    pending_safe_to_spend: pendingSafeToSpend,
    pending_income: pendingIncome,
    pending_savings: pendingSavings,
    pending_count: pendingCount,

    deferred_safe_to_spend: deferredSafeToSpend,
    deferred_income: deferredIncome,
    deferred_savings: deferredSavings,
    deferred_count: deferredCount,

    total_income: totalIncome,
    total_estimated_savings: totalEstimatedSavings,
    total_safe_to_spend: totalSafeToSpend,

    oldest_pending_age_days: oldestPendingAgeDays,
    degradation_level: degradationLevel,
    income_event_count: incomeEvents.length,
    calculated_at: now,

    event_breakdown: eventBreakdown,
  };
}
