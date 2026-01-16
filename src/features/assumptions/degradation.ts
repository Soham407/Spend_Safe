// TRD Section 11: Assumption Degradation Model
// PRD Flow 3: Pending & Reality Check Flow

/**
 * Degradation is semantic and visual, not algorithmic.
 * TRD: "Underlying calculations do NOT change"
 * TRD: "Confidence framing weakens over time"
 */

import { Assumption, AssumptionState } from "./types";

export enum DegradationLevel {
  LOW = "low",
  MEDIUM = "medium",
  HIGH = "high",
}

// Time thresholds in milliseconds
export const DEGRADATION_THRESHOLDS = {
  MEDIUM: 3 * 24 * 60 * 60 * 1000, // 3 days
  HIGH: 7 * 24 * 60 * 60 * 1000, // 7 days
};

// Reality check trigger threshold (show modal after 7 days since last check)
export const REALITY_CHECK_THRESHOLD = 7 * 24 * 60 * 60 * 1000; // 7 days

/**
 * Calculate the age of an assumption in days.
 * TRD: "Time-based only, no behavior inference"
 */
export function calculateAssumptionAge(assumption: Assumption): number {
  const now = new Date();
  const referenceDate = assumption.state_changed_at || assumption.created_at;
  const ageMs = now.getTime() - referenceDate.getTime();
  return Math.floor(ageMs / (1000 * 60 * 60 * 24));
}

/**
 * Determine degradation level based on assumption age.
 * TRD: "Degradation must be time-based, visible to user, never silently adjust values"
 */
export function getDegradationLevel(ageDays: number): DegradationLevel {
  if (ageDays >= 7) return DegradationLevel.HIGH;
  if (ageDays >= 3) return DegradationLevel.MEDIUM;
  return DegradationLevel.LOW;
}

/**
 * Find the oldest pending assumption age in days.
 * Returns 0 if no pending assumptions exist.
 */
export function getOldestPendingAge(assumptions: Assumption[]): number {
  const pendingAssumptions = assumptions.filter(
    (a) => a.state === AssumptionState.PENDING
  );

  if (pendingAssumptions.length === 0) return 0;

  const ages = pendingAssumptions.map(calculateAssumptionAge);
  return Math.max(...ages);
}

/**
 * Determine overall degradation level from a collection of assumptions.
 * Uses the oldest pending assumption to determine level.
 */
export function getOverallDegradationLevel(
  assumptions: Assumption[]
): DegradationLevel {
  const oldestAge = getOldestPendingAge(assumptions);
  return getDegradationLevel(oldestAge);
}

/**
 * Determine if a reality check should be triggered.
 * TRD: "No enforcement or blocking"
 * 
 * @param lastRealityCheck - Timestamp of last reality check acknowledgment
 * @param oldestPendingAgeDays - Age of oldest pending assumption in days
 * @returns true if reality check should be shown
 */
export function shouldTriggerRealityCheck(
  lastRealityCheck: Date | null,
  oldestPendingAgeDays: number
): boolean {
  // No pending assumptions = no reality check needed
  if (oldestPendingAgeDays === 0) return false;

  // If never checked before and has old pending items
  if (!lastRealityCheck && oldestPendingAgeDays >= 7) return true;

  // If last check was more than 7 days ago and has pending items
  if (lastRealityCheck) {
    const daysSinceLastCheck = Math.floor(
      (Date.now() - lastRealityCheck.getTime()) / (1000 * 60 * 60 * 24)
    );
    return daysSinceLastCheck >= 7 && oldestPendingAgeDays >= 3;
  }

  return false;
}

/**
 * Get human-readable degradation description.
 * TRD: "Language must avoid regulated-advice signaling"
 */
export function getDegradationDescription(level: DegradationLevel): string {
  switch (level) {
    case DegradationLevel.HIGH:
      return "Critical: Assumptions are stale - estimates may not reflect reality";
    case DegradationLevel.MEDIUM:
      return "Some assumptions are aging - consider reviewing";
    case DegradationLevel.LOW:
    default:
      return "Assumptions are fresh";
  }
}
