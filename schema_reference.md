# SpendSafe Schema Reference

This document explains the specific design decisions in `schema.sql`. It is the "why" behind the strict constraints and types.

## 1. The "Active" Assumption Model

### The Problem

The TRD states that assumptions are not static—they evolve. A user might initially have a "pending" assumption, then "confirm" it, or later "invalidate" it by changing their mind.
However, at any single point in time, an income event can only have **one** operational assumption driving the math.

### The Solution: Partial Indexes

We do not use a simple `UNIQUE (income_event_id)` constraint because that would prevent storing history (e.g., an old invalidated assumption and a new pending one).

Instead, we use a **Partial Unique Index**:

```sql
CREATE UNIQUE INDEX one_active_assumption_per_income_event
    ON assumptions (income_event_id)
    WHERE state IN ('pending', 'confirmed');
```

### Definition of "Active"

An assumption is considered **Active** (and thus collision-prone) if it is:

- **Pending**: The system thinks this is true, awaiting user input.
- **Confirmed**: The user said "I Did It".

An assumption is **Inactive** (archived/ignored) if it is:

- **Deferred**: "I Can't Right Now" (effectively opted out).
- **Invalidated**: Replaced by a newer assumption or manually voided.

This guarantees strictly **one source of truth** per income event while keeping the audit trail of past states.

---

## 2. Why "Safe-to-Spend" is NOT Stored

You will _not_ find a `safe_to_spend` column or table.

### TRD Mandate

> "Safe-to-spend is a calculated view, never a stored fact." (TRD §2)

### Reasoning

1. **Freshness**: Safe-to-spend depends on time. An assumption made 30 days ago degrades in confidence today. If we stored the value, it would become "stale" instantly.
2. **Truth vs. Estimate**: Storing a number implies it is an asset in a ledger. We specifically avoid "Ledger logic". By calculating it on-the-fly, we reinforce that it is a specific _view_ of the data, not the data itself.

It should be computed via SQL View or Application Logic as:
`Sum(Income Amounts) where associated Assumption is 'confirmed' (or 'pending' with degradation factor)`

---

## 3. Lifecycle Enums vs. Booleans

We use Enums strictly to prevent invalid logic states.

### `assumption_state`

- `pending`: Default.
- `confirmed`: Hard commitment.
- `deferred`: Explicit refusal.
- `invalidated`: Logic update (e.g., user changed savings rate).

### `pending_allocation_status`

Used to track "Degradation Age" (TRD §2).

- `active`: Fresh.
- `acknowledged`: User saw it but hasn't acted (resets degradation clock).
- `expired`: Too old to be trusted in estimates.

### `reality_check_outcome`

Ensures Reality Checks are behavioral events, not just logs.

- `accepted`: User engaged.
- `ignored`: User dismissed.
- `deferred`: User proactively postponed.

---

## 4. Key Constraints

| Constraint                     | Purpose                                                                                                                    |
| ------------------------------ | -------------------------------------------------------------------------------------------------------------------------- |
| `amount > 0`                   | Prevents negative income (which would be an expense, out of scope).                                                        |
| `savings_rate BETWEEN 0 AND 1` | Enforces mathematical sanity (0% to 100%).                                                                                 |
| `ON DELETE CASCADE`            | Enforces "User Ownership". If a User is deleted, _everything_ goes. If an Income Event is deleted, its assumptions vanish. |
