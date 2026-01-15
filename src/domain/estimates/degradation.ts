// TRD Section 3 & 11: Degradation Logic
// "Assumptions lose reliability over time"

import { differenceInDays } from "date-fns";

export enum DegradationLevel {
  LOW = "low",
  MEDIUM = "medium",
  HIGH = "high",
}

// TRD: "Degradation must be time-based, visible, never silent"
export const DEGRADATION_THRESHOLDS = {
  MEDIUM: 30, // days
  HIGH: 60, // days
} as const;

/**
 * Calculate degradation level based on assumption age.
 * TRD: "Degradation is semantic and visual, not algorithmic"
 */
export function getDegradationLevel(createdAt: Date): DegradationLevel {
  const ageDays = differenceInDays(new Date(), createdAt);

  if (ageDays > DEGRADATION_THRESHOLDS.HIGH) {
    return DegradationLevel.HIGH;
  }
  if (ageDays > DEGRADATION_THRESHOLDS.MEDIUM) {
    return DegradationLevel.MEDIUM;
  }
  return DegradationLevel.LOW;
}

/**
 * Get user-facing copy for degradation level.
 * TRD: "Copy as a Security Boundary"
 */
export function getDegradationLabel(level: DegradationLevel): string {
  const labels: Record<DegradationLevel, string> = {
    [DegradationLevel.LOW]: "Fresh",
    [DegradationLevel.MEDIUM]: "Aging",
    [DegradationLevel.HIGH]: "Stale",
  };
  return labels[level];
}

/**
 * Get warning message for degradation level.
 */
export function getDegradationWarning(level: DegradationLevel): string | null {
  const warnings: Record<DegradationLevel, string | null> = {
    [DegradationLevel.LOW]: null,
    [DegradationLevel.MEDIUM]:
      "Some assumptions are over 30 days old. Consider reviewing pending actions.",
    [DegradationLevel.HIGH]:
      "Critical: Assumptions are over 60 days old. Estimates may no longer reflect reality.",
  };
  return warnings[level];
}
