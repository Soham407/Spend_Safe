import { z } from "zod";

// TRD: "Explicit assumption-based language on all calculated values"
// Must enforce domain constraints via validation

export const incomeEventSchema = z.object({
  amount: z
    .string()
    .regex(
      /^\d+(\.\d{1,2})?$/,
      "Amount must be a positive number with up to 2 decimal places"
    )
    .refine((val) => parseFloat(val) > 0, "Amount must be positive"),
  event_date: z.date(),
  savings_rate: z
    .string()
    .regex(/^\d+(\.\d+)?$/, "Savings rate must be a number")
    .refine((val) => {
      const num = parseFloat(val);
      return num >= 0 && num <= 1;
    }, "Savings rate must be between 0 and 1"),
});

export type IncomeEventInput = z.infer<typeof incomeEventSchema>;
