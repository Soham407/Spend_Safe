import { describe, it, expect } from "vitest";
import { calculateSafeToSpend } from "./calculator";
import { IncomeEvent } from "../income/types";
import { Assumption, AssumptionState } from "../assumptions/types";
import Decimal from "decimal.js";

describe("calculateSafeToSpend", () => {
  const baseDate = new Date("2024-01-01");

  const createEvent = (
    id: string,
    amount: string,
    savingsRate: string,
    dateOffset: number = 0
  ): IncomeEvent => ({
    id,
    user_id: "user-1",
    amount,
    event_date: new Date(baseDate.getTime() + dateOffset * 86400000),
    savings_rate: savingsRate,
    created_at: new Date(baseDate.getTime() + dateOffset * 86400000),
    updated_at: new Date(baseDate.getTime() + dateOffset * 86400000),
  });

  const createAssumption = (
    id: string,
    eventId: string,
    state: AssumptionState
  ): Assumption => ({
    id,
    income_event_id: eventId,
    state,
    state_changed_at: baseDate,
    created_at: baseDate,
    updated_at: baseDate,
  });

  it("should calculate safe-to-spend correctly for a single pending event", () => {
    const event = createEvent("evt-1", "100.00", "0.20"); // 20% savings
    const assumption = createAssumption(
      "asm-1",
      "evt-1",
      AssumptionState.PENDING
    );

    const result = calculateSafeToSpend([event], [assumption]);

    expect(result.total_income.toNumber()).toBe(100);
    expect(result.estimated_savings.toNumber()).toBe(20);
    expect(result.safe_to_spend.toNumber()).toBe(80);
    expect(result.confirmed_safe_to_spend.toNumber()).toBe(0);
    expect(result.pending_count).toBe(1);
  });

  it("should calculate correctly for confirmed events", () => {
    const event = createEvent("evt-1", "200.00", "0.10"); // 10% savings
    const assumption = createAssumption(
      "asm-1",
      "evt-1",
      AssumptionState.CONFIRMED
    );

    const result = calculateSafeToSpend([event], [assumption]);

    expect(result.safe_to_spend.toNumber()).toBe(180);
    expect(result.confirmed_safe_to_spend.toNumber()).toBe(180);
    expect(result.pending_count).toBe(0);
  });

  it("should handle mixed states", () => {
    const events = [
      createEvent("evt-1", "100.00", "0.20"), // Safe: 80 (Confirmed)
      createEvent("evt-2", "100.00", "0.20"), // Safe: 80 (Pending)
      createEvent("evt-3", "100.00", "0.20"), // Safe: 80 (Deferred)
    ];

    const assumptions = [
      createAssumption("asm-1", "evt-1", AssumptionState.CONFIRMED),
      createAssumption("asm-2", "evt-2", AssumptionState.PENDING),
      createAssumption("asm-3", "evt-3", AssumptionState.DEFERRED),
    ];

    const result = calculateSafeToSpend(events, assumptions);

    expect(result.total_income.toNumber()).toBe(300);
    expect(result.safe_to_spend.toNumber()).toBe(240); // 80 + 80 + 80
    expect(result.confirmed_safe_to_spend.toNumber()).toBe(80);
    expect(result.pending_count).toBe(1);
  });

  it("should ignore invalidated assumptions", () => {
    const event = createEvent("evt-1", "100.00", "0.20");
    // Explicitly no active assumption in the list passed to calculator,
    // but looking at logic it defaults to PENDING if not found in map.
    // However, if we pass an INVALIDATED one, it should arguably be ignored or treated as pending/missing.
    // The calculator filters out invalidated assumptions from the map.

    const assumption = createAssumption(
      "asm-1",
      "evt-1",
      AssumptionState.INVALIDATED
    );

    const result = calculateSafeToSpend([event], [assumption]);

    // Should default to PENDING behavior because the mapped assumption is filtered out
    expect(result.pending_count).toBe(1);
    expect(result.safe_to_spend.toNumber()).toBe(80);
  });
});
