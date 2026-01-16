// TRD Section 2 & 4: Assumption States
// PRD Section 3.2: "I Did It" (confirmed) or "I Can't Right Now" (deferred)

export enum AssumptionState {
  PENDING = "pending",
  CONFIRMED = "confirmed",
  DEFERRED = "deferred",
  INVALIDATED = "invalidated",
}

export interface Assumption {
  id: string;
  income_event_id: string;
  state: AssumptionState;
  state_changed_at: Date;
  created_at: Date;
  updated_at: Date;
}

// TRD Section 11: Reality Check
export enum RealityCheckOutcome {
  ACCEPTED = "accepted",
  IGNORED = "ignored",
  DEFERRED = "deferred",
}

export interface RealityCheck {
  id: string;
  user_id: string;
  outcome: RealityCheckOutcome;
  acknowledged_at: Date;
  created_at: Date;
}
