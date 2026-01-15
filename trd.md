# Technical Requirements Document (TRD)

## Source of Truth

This TRD is derived **strictly and exclusively** from PRD.md. The PRD is the law. No features, behaviors, or guarantees are added beyond what is explicitly stated or necessarily implied by the PRD. Any ambiguity is called out as a risk or question.

---

## 1. System Overview & Architectural Philosophy

### High-Level Architecture

**Architecture style:**
- Client-heavy, logic-transparent application
- Deterministic calculations with no hidden automation
- Stateless or minimally stateful backend

**Core principle:**
> The system must *explain*, not *decide*.

The product is a **manual-first financial clarity tool**, not a decision engine. All calculations are:
- User-initiated
- Assumption-bound
- Reversible or degradable over time

### Primary Components

1. **Client Application (Web / Mobile)**
   - Primary locus of interaction and interpretation
   - Displays assumptions, pending states, and degradation cues
   - Initiates all confirmations and deferrals

2. **Application Backend**
   - Stores user-entered data and assumption states
   - Performs deterministic calculations exactly as specified by user inputs
   - Tracks time-based degradation of assumptions

3. **Persistence Layer**
   - Simple, auditable data storage
   - No inferred or derived data stored without traceability

**Explicitly excluded:**
- Money movement systems
- Tax authority integrations
- Banking or custodial systems

---

## 2. Core Domain Concepts (Data Model – Conceptual)

> No SQL or schema-level design is defined here. Only domain concepts.

### User
- Owns all data and assumptions
- Defines all rates and timing
- Can operate fully without confirmations (read-only mode)

### Income Event
- Amount
- Date
- User-defined savings / allocation rate
- System-generated assumption summary (derived, not authoritative)

### Assumption
- Explicit statement of what is being assumed (e.g., savings rate applied)
- Bound to a specific income event
- Has a **state**:
  - Pending
  - Confirmed ("I Did It")
  - Deferred ("I Can’t Right Now")

### Pending Allocation
- Represents *unconfirmed intent*, not failure
- Must track:
  - Creation timestamp
  - Last user acknowledgment
  - Degradation age

### Safe-to-Spend Estimate
- A calculated view, never a stored fact
- Always paired with:
  - Assumption language
  - Timestamp / freshness indicator
  - Degradation warnings if applicable

### Reality Check
- A forced acknowledgment event
- Invalidates or weakens confidence in stale assumptions
- Does not change user data automatically

### Panic Snapshot
- A conservative recomputation of safe-to-spend
- Uses existing assumptions only
- No new inputs, no optimistic inference

---

## 3. Calculation & Logic Constraints

### Determinism
- All calculations must be:
  - Reproducible
  - Explainable
  - Traceable to explicit user inputs

### Assumption Transparency
- Every computed number must reference:
  - Which income events were included
  - Which assumptions were applied
  - Which allocations remain pending

### Degradation Logic
- Assumptions **lose reliability over time**
- Degradation must:
  - Be time-based
  - Be visible to the user
  - Never silently adjust values

**Risk:** PRD does not specify exact degradation curves or thresholds.

---

## 4. State Management Expectations

### Confirmation States

| State | Meaning | System Behavior |
|------|--------|----------------|
| Pending | Assumption not yet acted upon | Included with warnings |
| Confirmed | User asserts action taken | Included normally |
| Deferred | User explicitly did not act | Included with explicit uncertainty |

- No state implies correctness or compliance
- State changes must always be user-triggered

### Read-Only Mode
- User may:
  - Enter data
  - View estimates
- User may skip:
  - Confirmations
  - Reality checks

System must remain useful in this mode.

---

## 5. Security & Trust Expectations

### Data Handling
- No financial custody
- No credential harvesting
- No implicit authority or advice signals

### Language as a Security Boundary
- Copy and labeling are part of the security model
- System must not:
  - Say "you should"
  - Say "this is sufficient"
  - Imply regulatory compliance

**Risk:** Copy drift over time could introduce regulated-advice signaling.

---

## 6. Performance Expectations

- Calculations are lightweight and synchronous
- No real-time external dependencies required
- UI must feel instant for all calculation updates

Performance failures primarily affect *trust*, not correctness.

---

## 7. Integration Boundaries

### Explicitly Allowed
- Optional data import (Nice-to-Have only)
- Local notifications or reminders

### Explicitly Disallowed
- Bank transfers
- Automated tax payments
- Enforcement mechanisms
- Required integrations for core functionality

System must degrade gracefully to **zero integrations**.

---

## 8. Scaling & Data Assumptions

### User Scale
- Early-stage, low-to-moderate concurrency
- Individual user datasets are small

### Temporal Scale
- Users may retain multi-year history
- Historical data must not retroactively change

### Scaling Philosophy
- Scale read-heavy workloads
- Avoid complex background jobs

---

## 9. Folder Structure Philosophy (Non-Prescriptive)

- Domain-driven separation (Income, Assumptions, Estimates)
- UI explicitly separated from calculation logic
- Copy / language assets treated as first-class artifacts

**Rationale:** Prevent accidental coupling between math and authority.

---

## 10. Explicit Risks & Open Questions

### Risks

1. **False Confidence Risk**
   - Users may still treat safe-to-spend as spendable cash
   - Mitigation depends heavily on language, not code

2. **Copy Drift / Regulated-Advice Risk**
   - Language changes could unintentionally imply authority or compliance
   - Mitigation requires treating copy as a versioned, reviewed artifact

3. **Behavioral Misinterpretation**
   - "I Did It" may be misread as system approval rather than user assertion

4. **Metric Gaming (Kill-Criterion Risk)**
   - Users may confirm assumptions unrealistically fast
   - The system does not enforce realism; this is monitored at a product level per PRD kill criteria

---

## 11. Resolved Design Clarifications (PRD-Aligned)

### Reality Check Triggers

Reality Checks are **time-based acknowledgment prompts** triggered solely by assumption staleness.

**Trigger conditions:**
- A pending or deferred assumption exceeds a fixed time threshold since last confirmation or explicit acknowledgment
- The user enters the app after the threshold has passed

**Constraints:**
- No behavior-based inference
- No enforcement or blocking
- No automatic data modification

> Reality Checks never imply correctness, compliance, or required action.

---

### Assumption Degradation Model

Degradation is **semantic and visual, not algorithmic**.

- Underlying calculations do **not** change
- Confidence framing weakens over time
- Presentation becomes more conservative

**Allowed effects:**
- Stronger warning language
- Reduced visual emphasis
- Explicit freshness indicators

**Disallowed:**
- Silent value changes
- Hidden penalties
- Auto-adjusted math

---

### Savings Rate Scope

Savings rates are applied **per income event**.

- Each income event stores its own explicit user-defined rate
- A global default may exist **only** as a visible, non-binding UI convenience
- Defaults must always be overrideable and never silently applied

---

### Panic Button Semantics

The Panic Button uses the **same data and assumptions** with a **strictly conservative framing**.

- Recomputes using confirmed assumptions and clearly labeled pending assumptions
- Removes optimistic language
- Emphasizes uncertainty and coverage gaps

**Explicitly excluded:**
- New assumptions
- Worst-case simulations
- Stress testing
- Inferred pessimism

> Panic mode reframes existing data; it does not invent scenarios.

---

### Read-Only Mode Boundary

Read-only users:
- See pending assumptions and degradation indicators
- See Reality Check banners
- Are never blocked, forced, or penalized

The system remains fully useful without confirmations.

---

### Confirmation Speed Handling

- The system does not prevent fast confirmations
- Timestamps and realism cues are surfaced
- Abuse detection exists only at an aggregate, product-evaluation level

Enforcement is explicitly avoided to prevent authority signaling.

---

### Copy as a Security Boundary

All user-facing language is treated as part of the security model.

- Copy is versioned
- Copy changes require review equivalent to logic changes
- This mitigates regulated-advice drift and false authority

---

## Final Note

The system never changes math without user input, never enforces behavior, never implies correctness, and never hides assumptions. It explains, visibly degrades confidence over time, and requires acknowledgment without authority. Any deviation from these constraints constitutes a defect, not an enhancement.
