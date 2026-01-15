
export const DEFAULT_SAVINGS_RATE = 0.3; // 30%

export const LANGUAGE = {
  SAFE_TO_SPEND_LABEL: "Assumed Safe-to-Spend",
  DISCLAIMER_PENDING: "Includes estimates from unconfirmed allocations.",
  DISCLAIMER_DEFERRED: "Includes income where savings were explicitly skipped.",
  DISCLAIMER_STALE: "These estimates degrade as assumptions remain unconfirmed.",
  PANIC_HEADER: "Conservative Coverage Snapshot",
  REALITY_CHECK_PROMPT: "It's time to acknowledge your outstanding financial assumptions.",
  NON_ADVICE_DISCLAIMER: "This tool provides estimates based on your manual inputs. It does not provide tax advice or guarantee compliance."
};

export const DEGRADATION_THRESHOLDS = {
  MEDIUM: 3 * 24 * 60 * 60 * 1000, // 3 days
  HIGH: 7 * 24 * 60 * 60 * 1000,   // 7 days
};
