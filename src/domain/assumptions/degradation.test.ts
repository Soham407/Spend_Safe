import { describe, it, expect } from "vitest";
import {
  getDegradationLevel,
  shouldTriggerRealityCheck,
  getDegradationDescription,
  DegradationLevel,
  calculateAssumptionAge,
} from "./degradation";
import { Assumption, AssumptionState } from "./types";

describe("Degradation Logic", () => {
  describe("getDegradationLevel", () => {
    it("should be LOW for fresh assumptions (< 3 days)", () => {
      expect(getDegradationLevel(0)).toBe(DegradationLevel.LOW);
      expect(getDegradationLevel(2)).toBe(DegradationLevel.LOW);
    });

    it("should be MEDIUM for aging assumptions (3-6 days)", () => {
      expect(getDegradationLevel(3)).toBe(DegradationLevel.MEDIUM);
      expect(getDegradationLevel(6)).toBe(DegradationLevel.MEDIUM);
    });

    it("should be HIGH for stale assumptions (7+ days)", () => {
      expect(getDegradationLevel(7)).toBe(DegradationLevel.HIGH);
      expect(getDegradationLevel(30)).toBe(DegradationLevel.HIGH);
    });
  });

  describe("calculateAssumptionAge", () => {
    it("should calculate days correctly", () => {
      const now = new Date();
      const fiveDaysAgo = new Date(now.getTime() - 5 * 24 * 60 * 60 * 1000);

      const assumption = {
        state_changed_at: fiveDaysAgo,
        created_at: fiveDaysAgo,
      } as Assumption;

      expect(calculateAssumptionAge(assumption)).toBe(5);
    });
  });

  describe("shouldTriggerRealityCheck", () => {
    it("should NOT trigger if no pending assumptions exist (age 0)", () => {
      expect(shouldTriggerRealityCheck(null, 0)).toBe(false);
    });

    it("should trigger if never checked and assumptions are old (7+ days)", () => {
      expect(shouldTriggerRealityCheck(null, 7)).toBe(true);
    });

    it("should NOT trigger if never checked but assumptions are fresh", () => {
      expect(shouldTriggerRealityCheck(null, 6)).toBe(false);
    });

    it("should trigger if checked > 7 days ago and assumptions are > 3 days old", () => {
      const eightDaysAgo = new Date(Date.now() - 8 * 24 * 60 * 60 * 1000);
      expect(shouldTriggerRealityCheck(eightDaysAgo, 3)).toBe(true);
    });

    it("should NOT trigger if checked > 7 days ago but assumptions are very fresh", () => {
      const eightDaysAgo = new Date(Date.now() - 8 * 24 * 60 * 60 * 1000);
      expect(shouldTriggerRealityCheck(eightDaysAgo, 2)).toBe(false);
    });

    it("should NOT trigger if checked recently", () => {
      const yesterday = new Date(Date.now() - 1 * 24 * 60 * 60 * 1000);
      expect(shouldTriggerRealityCheck(yesterday, 100)).toBe(false);
    });
  });

  describe("getDegradationDescription", () => {
    it("should return correct copy for levels", () => {
      expect(getDegradationDescription(DegradationLevel.LOW)).toContain(
        "fresh"
      );
      expect(getDegradationDescription(DegradationLevel.MEDIUM)).toContain(
        "aging"
      );
      expect(getDegradationDescription(DegradationLevel.HIGH)).toContain(
        "Critical"
      );
    });
  });
});
