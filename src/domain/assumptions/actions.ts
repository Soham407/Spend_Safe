import { createClient } from "@/lib/supabase/server";
import { Assumption, AssumptionState } from "./types";
import { canTransitionTo } from "./logic";
import { IncomeEvent } from "../income/types";

export interface PendingAllocation {
  assumption: Assumption;
  income_event: IncomeEvent;
}

/**
 * Update the state of an assumption (e.g., Confirm or Defer).
 * TRD: "State changes must always be user-triggered"
 */
export async function updateAssumptionState(
  assumptionId: string,
  newState: AssumptionState
): Promise<Assumption> {
  const supabase = await createClient();

  // Get authenticated user
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    throw new Error("Unauthorized");
  }

  // Fetch current assumption to validate ownership and transition
  // We join with income_events to verify user ownership via RLS policies broadly,
  // but explicit ownership check is safer.
  const { data: currentAssumption, error: fetchError } = await supabase
    .from("assumptions")
    .select("*, income_events!inner(user_id)")
    .eq("id", assumptionId)
    .single();

  if (fetchError || !currentAssumption) {
    throw new Error("Assumption not found");
  }

  // Validate state transition
  const currentState = currentAssumption.state as AssumptionState;
  if (!canTransitionTo(currentState, newState)) {
    throw new Error(`Invalid state transition: ${currentState} -> ${newState}`);
  }

  // Perform update
  const { data: updatedAssumption, error: updateError } = await supabase
    .from("assumptions")
    .update({
      state: newState,
      state_changed_at: new Date().toISOString(),
    })
    .eq("id", assumptionId)
    .select()
    .single();

  if (updateError || !updatedAssumption) {
    throw new Error(`Failed to update assumption: ${updateError?.message}`);
  }

  return {
    ...updatedAssumption,
    state: updatedAssumption.state as AssumptionState,
    state_changed_at: new Date(updatedAssumption.state_changed_at),
    created_at: new Date(updatedAssumption.created_at),
    updated_at: new Date(updatedAssumption.updated_at),
  };
}

/**
 * Fetch all pending allocations (assumptions in PENDING state)
 * with their associated income event details.
 */
export async function getPendingAllocations(): Promise<PendingAllocation[]> {
  const supabase = await createClient();

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    throw new Error("Unauthorized");
  }

  // Fetch pending assumptions joined with income events
  // RLS policies ensure we only get user's own data
  const { data, error } = await supabase
    .from("assumptions")
    .select(
      `
      *,
      income_events!inner (
        *
      )
    `
    )
    .eq("state", AssumptionState.PENDING)
    .order("created_at", { ascending: false });

  if (error) {
    throw new Error(`Failed to fetch pending allocations: ${error.message}`);
  }

  if (!data) return [];

  // Define local type for the joined query result
  type AssumptionWithIncome = Assumption & {
    income_events: IncomeEvent;
  };

  return (data as unknown as AssumptionWithIncome[]).map((item) => ({
    assumption: {
      id: item.id,
      income_event_id: item.income_event_id,
      state: item.state as AssumptionState,
      state_changed_at: new Date(item.state_changed_at),
      created_at: new Date(item.created_at),
      updated_at: new Date(item.updated_at),
    },
    income_event: {
      id: item.income_events.id,
      user_id: item.income_events.user_id,
      amount: item.income_events.amount,
      event_date: new Date(item.income_events.event_date),
      savings_rate: item.income_events.savings_rate,
      created_at: new Date(item.income_events.created_at),
      updated_at: new Date(item.income_events.updated_at),
    },
  }));
}
