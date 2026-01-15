import { z } from "zod";

// TRD: "Explicit assumption-based language on all calculated values"
// Must enforce domain constraints via validation

export const incomeEventSchema = z.object({
  amount: z
    .number()
    .positive("Income amount must be positive")
    .finite("Income amount must be a valid number"),
  event_date: z.date(),
  savings_rate: z
    .number()
    .min(0, "Savings rate cannot be negative")
    .max(1, "Savings rate cannot exceed 100%"),
});

export type IncomeEventInput = z.infer<typeof incomeEventSchema>;
