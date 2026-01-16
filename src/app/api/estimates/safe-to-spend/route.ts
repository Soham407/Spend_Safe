// API Route: GET /api/estimates/safe-to-spend
// TRD Section 3: Calculate safe-to-spend estimate

import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getIncomeEventsWithAssumptions } from "@/features/income/actions";
import { calculateSafeToSpend } from "@/features/estimates/calculator";

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
          safe_to_spend: 0,
          total_income: 0,
          estimated_savings: 0,
          confirmed_safe_to_spend: 0,
          pending_count: 0,
          oldest_pending_age_days: 0,
          degradation_level: "low",
          income_event_count: 0,
        },
      });
    }

    const incomeEvents = allEvents.map((e) => e.income_event);
    const assumptions = allEvents.map((e) => e.assumption);

    // Calculate safe-to-spend
    const estimate = calculateSafeToSpend(incomeEvents, assumptions);

    return NextResponse.json({
      success: true,
      data: {
        safe_to_spend: estimate.safe_to_spend.toNumber(),
        total_income: estimate.total_income.toNumber(),
        estimated_savings: estimate.estimated_savings.toNumber(),
        confirmed_safe_to_spend: estimate.confirmed_safe_to_spend.toNumber(),
        pending_count: estimate.pending_count,
        oldest_pending_age_days: estimate.oldest_pending_age_days,
        degradation_level: estimate.degradation_level,
        income_event_count: incomeEvents.length,
        calculated_at: new Date().toISOString(),
      },
    });
  } catch (error) {
    console.error("Error calculating safe-to-spend:", error);

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
