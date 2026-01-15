// TRD Section 10: Copy as a Security Boundary
// PRD: "Assumption Transparency" and "Non-Authoritative Tone"

/**
 * All user-facing language must be treated as a security boundary.
 * Any change to this file requires review equivalent to logic changes.
 *
 * TRD: "Language must avoid regulated-advice signaling"
 */

export const COPY = {
  // Safe-to-Spend Language
  SAFE_TO_SPEND_LABEL: "Estimated Safe to Spend",
  SAFE_TO_SPEND_DISCLAIMER:
    "Based on your assumptions. Not financial advice or guaranteed tax coverage.",

  // Assumption States
  STATE_PENDING: "Awaiting Your Confirmation",
  STATE_CONFIRMED: "You Confirmed This",
  STATE_DEFERRED: "You Deferred This",

  // Action Buttons
  ACTION_CONFIRM: "I Did It",
  ACTION_DEFER: "I Can't Right Now",

  // Reality Check
  REALITY_CHECK_TITLE: "Assumption Drift",
  REALITY_CHECK_MESSAGE:
    "Your safe-to-spend estimates are aging. Acknowledge pending transactions to maintain clarity.",
  REALITY_CHECK_ACTION: "Acknowledge Freshness",

  // Panic Button
  PANIC_BUTTON_LABEL: "Hard Confirmation View",
  PANIC_SUBTITLE: "Excluding all unconfirmed assumptions.",

  // Degradation Warnings
  DEGRADATION_MEDIUM:
    "Some assumptions are over 30 days old. Consider reviewing.",
  DEGRADATION_HIGH:
    "Critical: Assumptions are over 60 days old. Estimates may not reflect reality.",

  // General Disclaimers
  NO_GUARANTEE: "This tool does not guarantee tax sufficiency or compliance.",
  USER_RESPONSIBILITY:
    "You define all rates and timing. This system explains, not decides.",

  // Flow 1: Manual Income Capture
  FLOW1: {
    INCOME_CAPTURE: {
      TITLE: "Record Income",
      AMOUNT_LABEL: "Amount Received",
      AMOUNT_PLACEHOLDER: "0.00",
      DATE_LABEL: "Date Received",
      SAVINGS_RATE_LABEL: "Your Savings Choice",
      SAVINGS_RATE_HINT: "Suggested starting point: {rate}%",
      SAVINGS_RATE_EXPLANATION:
        "You choose what portion to set aside. This is your decision.",
      SUBMIT_BUTTON: "Record Income",
      SUBMITTING: "Recording...",
    },
    SAFE_TO_SPEND: {
      TITLE: "Estimated Safe to Spend",
      EMPTY_STATE: "No income recorded yet",
      EMPTY_STATE_HINT: "Record your first income event to see an estimate",
      BASED_ON_SUMMARY:
        "Based on {count, plural, =1 {1 income event} other {# income events}} and your savings choices",
      PENDING_WARNING:
        "{count, plural, =1 {1 allocation} other {# allocations}} awaiting confirmation",
      TOTAL_INCOME_LABEL: "Total Income",
      ALLOCATED_SAVINGS_LABEL: "Allocated to Savings",
      ASSUMPTION_REMINDER:
        "This estimate assumes you've set aside savings as you planned",
      CALCULATION_TIME: "Calculated {time}",
    },
  },
  
  // Flow 2: Assumed Allocation Confirmation
  FLOW2: {
    ALLOCATION_PROMPT: {
      TITLE: "Pending Allocation",
      PROMPT_MESSAGE:
        "You planned to set aside {amount} from your {date} income",
      CONFIRM_BUTTON: "I Did It",
      DEFER_BUTTON: "I Can't Right Now",
      CONFIRM_TOOLTIP: "Confirm that you have moved this amount to savings",
      DEFER_TOOLTIP: "Defer this without penalty - you can confirm later",
      SUCCESS_CONFIRMED: "Allocation confirmed",
      SUCCESS_DEFERRED: "Allocation deferred - no penalty applied",
    },
    ALLOCATION_LIST: {
      TITLE: "Your Pending Allocations",
      EMPTY_STATE: "No pending allocations",
      EMPTY_STATE_HINT: "All your allocations have been confirmed or deferred",
    },
  },

  // Flow 3: Pending & Reality Check Flow
  FLOW3: {
    DEGRADATION: {
      LOW: "Assumptions are fresh",
      MEDIUM: "Some assumptions are aging - consider reviewing",
      HIGH: "Critical: Assumptions are stale - estimates may not reflect reality",
    },
    PENDING_AGE: {
      DAYS: "{count} {count, plural, =1 {day} other {days}} pending",
      WARNING: "Pending for {days} days",
    },
    REALITY_CHECK: {
      TITLE_MEDIUM: "Assumption Freshness Check",
      TITLE_HIGH: "Critical Assumption Review",
      MESSAGE_MEDIUM:
        "You have {count} pending {count, plural, =1 {allocation} other {allocations}}, with the oldest pending for {days} {days, plural, =1 {day} other {days}}. Acknowledge to maintain clarity.",
      MESSAGE_HIGH:
        "Your assumptions are significantly aged. {count} {count, plural, =1 {allocation has} other {allocations have}} been pending for over a week. Review your pending actions.",
      ACTION: "Acknowledge Freshness",
    },
  },

  // Flow 4: Panic Button Flow
  // TRD Section 11: "Panic mode reframes existing data; it does not invent scenarios"
  // PRD: "Language emphasizes uncertainty and user-defined inputs"
  FLOW4: {
    HEADER: {
      TITLE: "Conservative View",
      SUBTITLE: "Based only on your confirmed actions",
      DESCRIPTION:
        "This view shows what you've explicitly confirmed versus what remains uncertain.",
    },
    CONFIRMED_SECTION: {
      TITLE: "Confirmed Safety",
      LABEL: "Reliably Safe to Spend",
      RELIABILITY_BADGE: "100% Confirmed",
      DESCRIPTION:
        "This amount is based only on allocations you've confirmed with 'I Did It'.",
      EMPTY_STATE: "No confirmed allocations yet",
      EMPTY_HINT: "Confirm pending allocations to increase this amount",
    },
    PENDING_SECTION: {
      TITLE: "Pending Gap",
      LABEL: "Awaiting Your Confirmation",
      RELIABILITY_BADGE: "Unconfirmed",
      DESCRIPTION:
        "This amount depends on pending allocations you haven't confirmed yet.",
      COUNT_LABEL: "{count} {count, plural, =1 {allocation} other {allocations}} pending",
    },
    DEFERRED_SECTION: {
      TITLE: "Deferred Allocations",
      LABEL: "You Chose 'I Can't Right Now'",
      RELIABILITY_BADGE: "Explicitly Deferred",
      DESCRIPTION:
        "These allocations were deferred. The estimates assume you'll complete them.",
      COUNT_LABEL: "{count} {count, plural, =1 {allocation} other {allocations}} deferred",
    },
    BREAKDOWN: {
      TITLE: "Allocation Breakdown",
      TABLE_HEADERS: {
        DATE: "Date",
        AMOUNT: "Income",
        RATE: "Rate",
        SAFE_SPEND: "Safe to Spend",
        STATUS: "Status",
        AGE: "Age",
      },
      STATUS_LABELS: {
        CONFIRMED: "Confirmed",
        PENDING: "Pending",
        DEFERRED: "Deferred",
      },
      EMPTY_STATE: "No income events recorded",
    },
    DISCLAIMERS: {
      PRIMARY:
        "This conservative view shows only confirmed allocations as reliable. All other amounts depend on your pending or deferred actions.",
      UNCERTAINTY:
        "These are estimates based on your inputs, not guarantees of tax coverage or financial sufficiency.",
      USER_CONTROL:
        "You defined all rates and timing. This system explains your choices, it does not decide for you.",
      NO_ADVICE:
        "This is not financial advice. Consult a tax professional for compliance guidance.",
    },
    SUPPORTIVE_MESSAGES: {
      STRESS_ACKNOWLEDGMENT:
        "Financial uncertainty is stressful. This view helps you see what's confirmed versus what's still pending.",
      CLARITY_FOCUS:
        "Focus on the confirmed amount if you need certainty. The rest depends on completing your pending allocations.",
      NO_JUDGMENT:
        "There's no penalty for pending or deferred allocations. This tool simply shows you where things stand.",
    },
  },
} as const;

