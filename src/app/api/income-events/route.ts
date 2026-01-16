// API Route: POST /api/income-events
// PRD Flow 1: Manual Income Capture

import { NextRequest, NextResponse } from "next/server";
import { createIncomeEvent } from "@/domain/income/actions";
import { calculateSafeToSpend } from "@/domain/estimates/calculator";
import { getIncomeEventsWithAssumptions } from "@/domain/income/actions";
import { z } from "zod";

export async function GET() {
  try {
    const allEvents = await getIncomeEventsWithAssumptions();

    const data = allEvents.map((e) => ({
      id: e.income_event.id,
      amount: e.income_event.amount,
      event_date: e.income_event.event_date,
      savings_rate: e.income_event.savings_rate,
      created_at: e.income_event.created_at,
      state: e.assumption.state,
    }));

    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error("Error fetching income events:", error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Internal server error",
      },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const createIncomeSchema = z.object({
      amount: z.number().positive("Amount must be positive"),
      event_date: z.string().refine((date) => !isNaN(Date.parse(date)), {
        message: "Invalid date format",
      }),
      savings_rate: z
        .number()
        .min(0)
        .max(1, "Savings rate must be between 0 and 1"),
    });

    const validated = createIncomeSchema.parse(body);

    const input = {
      amount: validated.amount.toString(),
      event_date: new Date(validated.event_date),
      savings_rate: validated.savings_rate.toString(),
    };

    // Create income event with pending assumption
    const result = await createIncomeEvent(input);

    // Fetch all events to calculate new safe-to-spend
    const allEvents = await getIncomeEventsWithAssumptions();
    const incomeEvents = allEvents.map((e) => e.income_event);
    const assumptions = allEvents.map((e) => e.assumption);

    const estimate = calculateSafeToSpend(incomeEvents, assumptions);

    return NextResponse.json(
      {
        success: true,
        data: {
          income_event: result.income_event,
          assumption: result.assumption,
          estimate: {
            safe_to_spend: estimate.safe_to_spend.toNumber(),
            total_income: estimate.total_income.toNumber(),
            estimated_savings: estimate.estimated_savings.toNumber(),
            confirmed_safe_to_spend:
              estimate.confirmed_safe_to_spend.toNumber(),
            pending_count: estimate.pending_count,
          },
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating income event:", error);

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
