// TRD Section 4: State Management Expectations
// Logic for state transitions (Pending -> Confirmed/Deferred)

import { AssumptionState } from "./types";

/**
 * Determines if a state transition is valid.
 * TRD: "State changes must always be user-triggered"
 */
export function canTransitionTo(
  currentState: AssumptionState,
  newState: AssumptionState
): boolean {
  const transitions: Record<AssumptionState, AssumptionState[]> = {
    [AssumptionState.PENDING]: [
      AssumptionState.CONFIRMED,
      AssumptionState.DEFERRED,
      AssumptionState.INVALIDATED,
    ],
    [AssumptionState.CONFIRMED]: [AssumptionState.INVALIDATED],
    [AssumptionState.DEFERRED]: [
      AssumptionState.CONFIRMED,
      AssumptionState.INVALIDATED,
    ],
    [AssumptionState.INVALIDATED]: [], // Terminal state
  };

  return transitions[currentState]?.includes(newState) ?? false;
}

/**
 * Get human-readable label for assumption state.
 * TRD: "Copy and labeling are part of the security model"
 */
export function getStateLabel(state: AssumptionState): string {
  const labels: Record<AssumptionState, string> = {
    [AssumptionState.PENDING]: "Awaiting Confirmation",
    [AssumptionState.CONFIRMED]: "User Confirmed",
    [AssumptionState.DEFERRED]: "User Deferred",
    [AssumptionState.INVALIDATED]: "Superseded",
  };

  return labels[state];
}
