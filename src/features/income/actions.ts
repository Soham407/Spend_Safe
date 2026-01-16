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

  // Call atomic RPC function
  // TRD: "All calculations must be... traceable to explicit user inputs"
  // Using RPC ensures atomicity of Event + Assumption creation
  const { data: rpcResult, error: rpcError } = await supabase.rpc(
    "create_income_event_with_assumption",
    {
      p_user_id: user.id,
      p_amount: validated.amount,
      p_event_date: validated.event_date.toISOString().split("T")[0],
      p_savings_rate: validated.savings_rate,
    }
  );

  if (rpcError) {
    throw new Error(`Failed to create income event: ${rpcError.message}`);
  }

  // RPC returns an array (table), take the first item
  const resultIds = Array.isArray(rpcResult) ? rpcResult[0] : rpcResult;

  if (!resultIds || !resultIds.income_event_id || !resultIds.assumption_id) {
    throw new Error("Failed to retrieve created IDs from RPC");
  }

  // Fetch the created full objects to return consistent types
  // This is safer than constructing them from input because it includes DB-generated fields (created_at, etc.)
  const { data: incomeEvent, error: incomeFetchError } = await supabase
    .from("income_events")
    .select("*")
    .eq("id", resultIds.income_event_id)
    .single();

  if (incomeFetchError || !incomeEvent) {
    throw new Error(
      `Failed to fetch created income event: ${incomeFetchError?.message}`
    );
  }

  const { data: assumption, error: assumptionFetchError } = await supabase
    .from("assumptions")
    .select("*")
    .eq("id", resultIds.assumption_id)
    .single();

  if (assumptionFetchError || !assumption) {
    throw new Error(
      `Failed to fetch created assumption: ${assumptionFetchError?.message}`
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
