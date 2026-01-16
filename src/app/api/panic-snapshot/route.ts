// API Route: GET /api/panic-snapshot
// TRD Section 11: Panic Button Semantics
// PRD Section 3.4: Panic Button Flow

import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getIncomeEventsWithAssumptions } from "@/features/income/actions";
import { calculatePanicSnapshot } from "@/features/estimates/panicSnapshot";

/**
 * GET /api/panic-snapshot
 *
 * Returns a conservative snapshot of safe-to-spend with clear separation
 * of confirmed vs pending/deferred allocations.
 *
 * TRD: "Panic mode reframes existing data; it does not invent scenarios"
 */
export async function GET() {
  try {
    // Authenticate user
    const supabase = await createClient();
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }
    // Fetch all income events with assumptions
    const allEvents = await getIncomeEventsWithAssumptions();

    if (allEvents.length === 0) {
      return NextResponse.json({
        success: true,
        data: {
          confirmed_safe_to_spend: 0,
          confirmed_income: 0,
          confirmed_savings: 0,
          confirmed_count: 0,

          pending_safe_to_spend: 0,
          pending_income: 0,
          pending_savings: 0,
          pending_count: 0,

          deferred_safe_to_spend: 0,
          deferred_income: 0,
          deferred_savings: 0,
          deferred_count: 0,

          total_income: 0,
          total_estimated_savings: 0,
          total_safe_to_spend: 0,

          oldest_pending_age_days: 0,
          degradation_level: "low",
          income_event_count: 0,
          calculated_at: new Date().toISOString(),

          event_breakdown: [],
        },
      });
    }

    const incomeEvents = allEvents.map((e) => e.income_event);
    const assumptions = allEvents.map((e) => e.assumption);

    // Calculate panic snapshot
    const snapshot = calculatePanicSnapshot(incomeEvents, assumptions);

    return NextResponse.json({
      success: true,
      data: {
        confirmed_safe_to_spend: snapshot.confirmed_safe_to_spend.toNumber(),
        confirmed_income: snapshot.confirmed_income.toNumber(),
        confirmed_savings: snapshot.confirmed_savings.toNumber(),
        confirmed_count: snapshot.confirmed_count,

        pending_safe_to_spend: snapshot.pending_safe_to_spend.toNumber(),
        pending_income: snapshot.pending_income.toNumber(),
        pending_savings: snapshot.pending_savings.toNumber(),
        pending_count: snapshot.pending_count,

        deferred_safe_to_spend: snapshot.deferred_safe_to_spend.toNumber(),
        deferred_income: snapshot.deferred_income.toNumber(),
        deferred_savings: snapshot.deferred_savings.toNumber(),
        deferred_count: snapshot.deferred_count,

        total_income: snapshot.total_income.toNumber(),
        total_estimated_savings: snapshot.total_estimated_savings.toNumber(),
        total_safe_to_spend: snapshot.total_safe_to_spend.toNumber(),

        oldest_pending_age_days: snapshot.oldest_pending_age_days,
        degradation_level: snapshot.degradation_level,
        income_event_count: snapshot.income_event_count,
        calculated_at: snapshot.calculated_at.toISOString(),

        event_breakdown: snapshot.event_breakdown.map((e) => ({
          income_event_id: e.income_event_id,
          event_date: e.event_date.toISOString(),
          amount: e.amount.toNumber(),
          savings_rate: e.savings_rate.toNumber(),
          safe_to_spend: e.safe_to_spend.toNumber(),
          state: e.state,
          age_days: e.age_days,
        })),
      },
    });
  } catch (error) {
    console.error("Error calculating panic snapshot:", error);

    if (error instanceof Error) {
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}
