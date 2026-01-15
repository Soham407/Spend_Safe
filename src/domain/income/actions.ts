// TRD Section 2: Domain-level business logic for income events
// PRD Section 3.1: Manual Income Capture

import { createClient } from "@/lib/supabase/server";
import { incomeEventSchema, type IncomeEventInput } from "./validation";
import { IncomeEvent } from "./types";
import { Assumption, AssumptionState } from "../assumptions/types";

export interface IncomeEventWithAssumption {
  income_event: IncomeEvent;
  assumption: Assumption;
}

/**
 * Create an income event with an associated pending assumption.
 * TRD: "Deterministic calculations with no hidden automation"
 * PRD: User records income (amount + date) and assigns savings rate
 */
export async function createIncomeEvent(
  input: IncomeEventInput
): Promise<IncomeEventWithAssumption> {
  // Validate input
  const validated = incomeEventSchema.parse(input);

  const supabase = await createClient();

  // Get authenticated user
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    throw new Error("Unauthorized");
  }

  // Insert income event
  const { data: incomeEvent, error: incomeError } = await supabase
    .from("income_events")
    .insert({
      user_id: user.id,
      amount: validated.amount,
      event_date: validated.event_date.toISOString().split("T")[0], // YYYY-MM-DD
      savings_rate: validated.savings_rate,
    })
    .select()
    .single();

  if (incomeError || !incomeEvent) {
    throw new Error(`Failed to create income event: ${incomeError?.message}`);
  }

  // Auto-create pending assumption
  // TRD Section 2: "Assumption - Bound to a specific income event"
  const { data: assumption, error: assumptionError } = await supabase
    .from("assumptions")
    .insert({
      income_event_id: incomeEvent.id,
      state: AssumptionState.PENDING,
    })
    .select()
    .single();

  if (assumptionError || !assumption) {
    throw new Error(
      `Failed to create assumption: ${assumptionError?.message}`
    );
  }

  return {
    income_event: {
      ...incomeEvent,
      event_date: new Date(incomeEvent.event_date),
      created_at: new Date(incomeEvent.created_at),
      updated_at: new Date(incomeEvent.updated_at),
    },
    assumption: {
      ...assumption,
      state: assumption.state as AssumptionState,
      state_changed_at: new Date(assumption.state_changed_at),
      created_at: new Date(assumption.created_at),
      updated_at: new Date(assumption.updated_at),
    },
  };
}

/**
 * Fetch all income events for the authenticated user with their assumptions.
 * TRD: "Users own all data and assumptions"
 */
export async function getIncomeEventsWithAssumptions(): Promise<
  IncomeEventWithAssumption[]
> {
  const supabase = await createClient();

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    throw new Error("Unauthorized");
  }

  // Fetch income events
  const { data: incomeEvents, error: incomeError } = await supabase
    .from("income_events")
    .select("*")
    .eq("user_id", user.id)
    .order("event_date", { ascending: false });

  if (incomeError) {
    throw new Error(`Failed to fetch income events: ${incomeError.message}`);
  }

  if (!incomeEvents || incomeEvents.length === 0) {
    return [];
  }

  // Fetch all assumptions for these events
  const incomeEventIds = incomeEvents.map((e) => e.id);
  const { data: assumptions, error: assumptionError } = await supabase
    .from("assumptions")
    .select("*")
    .in("income_event_id", incomeEventIds)
    .neq("state", AssumptionState.INVALIDATED);

  if (assumptionError) {
    throw new Error(`Failed to fetch assumptions: ${assumptionError.message}`);
  }

  // Build assumption map (latest per event)
  const assumptionMap = new Map<string, Assumption>();
  (assumptions || []).forEach((a) => {
    const existing = assumptionMap.get(a.income_event_id);
    if (!existing || new Date(a.created_at) > new Date(existing.created_at)) {
      assumptionMap.set(a.income_event_id, {
        ...a,
        state: a.state as AssumptionState,
        state_changed_at: new Date(a.state_changed_at),
        created_at: new Date(a.created_at),
        updated_at: new Date(a.updated_at),
      });
    }
  });

  // Join and return
  return incomeEvents.map((event) => {
    const assumption = assumptionMap.get(event.id);
    if (!assumption) {
      throw new Error(`Missing assumption for income event ${event.id}`);
    }

    return {
      income_event: {
        ...event,
        event_date: new Date(event.event_date),
        created_at: new Date(event.created_at),
        updated_at: new Date(event.updated_at),
      },
      assumption,
    };
  });
}
