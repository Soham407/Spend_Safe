## Product Requirements Document (PRD)

## Problem Statement

Independent workers and freelancers struggle to know how much money is truly safe to spend after accounting for taxes and irregular obligations. Existing tools either automate too early (creating false confidence), require money movement (triggering trust and regulatory concerns), or present authoritative advice that users neither trust nor fully understand. The result is anxiety, avoidance, and overspending driven by uncertainty.

This product aims to reduce anxiety without creating false certainty by providing a **manual-first, assumption-explicit view of estimated safe-to-spend funds**, while clearly communicating uncertainty and user responsibility.

---

## Target Users

**Primary users**

- Freelancers, contractors, and solo operators with irregular income
- Users who manage taxes manually or semi-manually
- Users who feel anxiety about overspending before obligations are covered

**Secondary users**

- Side-hustlers transitioning to full-time freelance work
- Users burned by over-automation or surprise tax bills

Non-target users

- Users seeking automated tax filing or guaranteed compliance
- Users who want hands-off financial management

---

## Core User Flows

### 1. Manual Income Capture

1. User records an income event (amount + date)
2. User assigns a **self-defined savings rate** (default suggestion is allowed but explicitly framed as user-chosen)
3. System calculates an **estimated safe-to-spend amount** based on assumptions

### 2. Assumed Allocation Confirmation

1. System prompts user to move a portion of income to savings
2. User chooses:
    - “I Did It” (explicitly confirming an assumption)
    - “I Can’t Right Now” (defers without penalty)
3. Safe-to-spend updates with assumption language attached

### 3. Pending & Reality Check Flow

1. Unconfirmed allocations remain in a pending state
2. Periodic **Reality Check** prompts require the user to acknowledge outstanding assumptions
3. System reminds user that estimates degrade as pending time increases

### 4. Panic Button Flow

1. User taps Panic Button during financial stress
2. System shows a conservative snapshot of assumed coverage
3. Language emphasizes uncertainty and user-defined inputs

### 5. Read-Only / Passive Mode

1. User can view estimates without confirming actions
2. No penalties or shaming
3. Product remains useful without behavioral confirmation

---

## Must-Have vs Nice-to-Have

### Must-Have

- Manual-first income and savings capture
- Explicit assumption-based language on all calculated values
- “I Did It” and “I Can’t Right Now” options
- Pending state with time-based visibility
- Panic Button with conservative framing
- Read-only usage option
- Periodic Reality Check that invalidates stale confidence

### Nice-to-Have

- Convenience data import (strictly optional)
- Custom reminder schedules
- Historical assumption review
- User-written notes on income events

---

## UX Principles

- **Assumption Transparency:** Every number must clearly state what it assumes
- **Discomfort Over Deception:** Confirmation actions should feel weighty, not rewarding
- **Non-Authoritative Tone:** No language implying correctness, compliance, or advice
- **Amber Over Red:** Warn without shaming or inducing panic
- **User Control:** Users define rates and timing; the system never asserts “should”

---

## Assumptions

- Users will sometimes delay savings intentionally
- Users can tolerate uncertainty if it is clearly communicated
- Users prefer clarity over automation in early trust-building
- Explicit language can reduce false confidence
- Manual confirmation can build awareness, even if imperfect

---

## Constraints

- No money movement or custody
- No guarantees of tax sufficiency or compliance
- Language must avoid regulated-advice signaling
- System must remain useful without external integrations

---

## Non-Goals

- Providing tax advice or recommendations
- Certifying audit readiness or compliance
- Automating transfers or enforcing behavior
- Replacing accountants or tax professionals

---

## Success Criteria

### Behavioral

- Users regularly acknowledge pending assumptions rather than auto-confirming
- A meaningful percentage of income events are marked “I Can’t Right Now”
- Median pending duration remains within an acceptable range

### Trust & Perception

- Users describe safe-to-spend as “helpful but not guaranteed”
- Users understand numbers are estimates based on their inputs
- Low incidence of users asking for tax certainty or guarantees

### Retention

- Users continue using the product without automation
- Panic Button usage correlates with increased awareness, not blind confidence

---

## Kill Criteria

The product should be paused or pivoted if:

- Users confirm assumptions faster than plausibly possible
- Safe-to-spend is treated as real spendable cash
- Users repeatedly seek assurance of tax coverage
- Pressure emerges to add automatic money movement to maintain trust

---

## Final Note

This product is psychological infrastructure. Its success depends on disciplined language, visible uncertainty, and respect for user agency. Any drift toward confidence theater or implied advice invalidates the premise and increases risk.