"use client";

// Flow 1: Income Capture Form Component
// PRD Section 3.1: Manual Income Capture

import { useState, useEffect } from "react";
import { COPY } from "@/copy/en";

interface IncomeCaptureProps {
  onSuccess?: () => void;
  defaultSavingsRate?: number;
}

const DEFAULT_SAVINGS_RATE = 0.3; // 30%

export function IncomeCapture({
  onSuccess,
  defaultSavingsRate = DEFAULT_SAVINGS_RATE,
}: IncomeCaptureProps) {
  const [amount, setAmount] = useState("");
  const [eventDate, setEventDate] = useState("");

  useEffect(() => {
    setEventDate(new Date().toISOString().split("T")[0]);
  }, []);
  const [savingsRate, setSavingsRate] = useState(
    (defaultSavingsRate * 100).toString()
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      const response = await fetch("/api/income-events", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: parseFloat(amount),
          event_date: eventDate,
          savings_rate: parseFloat(savingsRate) / 100, // Convert percentage to decimal
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.error || "Failed to record income");
      }

      // Reset form
      setAmount("");
      setEventDate(new Date().toISOString().split("T")[0]);
      setSavingsRate((defaultSavingsRate * 100).toString());

      onSuccess?.();
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAmountChange = (value: string) => {
    // Allow only valid currency input
    const sanitized = value.replace(/[^0-9.]/g, "");
    const parts = sanitized.split(".");
    if (parts.length > 2) return; // Prevent multiple decimals
    if (parts[1] && parts[1].length > 2) return; // Max 2 decimal places
    setAmount(sanitized);
  };

  const handleSavingsRateChange = (value: string) => {
    const num = parseFloat(value);
    if (isNaN(num) || num < 0 || num > 100) return;
    setSavingsRate(value);
  };

  const suggestedRate = (defaultSavingsRate * 100).toFixed(0);

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <h2 className="text-xl font-semibold text-gray-900 mb-6">
        {COPY.FLOW1.INCOME_CAPTURE.TITLE}
      </h2>

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Amount Input */}
        <div>
          <label
            htmlFor="amount"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            {COPY.FLOW1.INCOME_CAPTURE.AMOUNT_LABEL}
          </label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
              $
            </span>
            <input
              type="text"
              id="amount"
              value={amount}
              onChange={(e) => handleAmountChange(e.target.value)}
              placeholder={COPY.FLOW1.INCOME_CAPTURE.AMOUNT_PLACEHOLDER}
              className="w-full pl-8 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-amber-500 focus:border-transparent"
              required
              disabled={isSubmitting}
            />
          </div>
        </div>

        {/* Date Input */}
        <div>
          <label
            htmlFor="eventDate"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            {COPY.FLOW1.INCOME_CAPTURE.DATE_LABEL}
          </label>
          <input
            type="date"
            id="eventDate"
            value={eventDate}
            onChange={(e) => setEventDate(e.target.value)}
            max={new Date().toISOString().split("T")[0]}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-amber-500 focus:border-transparent"
            required
            disabled={isSubmitting}
          />
        </div>

        {/* Savings Rate Input */}
        <div>
          <label
            htmlFor="savingsRate"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            {COPY.FLOW1.INCOME_CAPTURE.SAVINGS_RATE_LABEL}
          </label>
          <p className="text-xs text-gray-500 mb-2">
            {COPY.FLOW1.INCOME_CAPTURE.SAVINGS_RATE_HINT.replace(
              "{rate}",
              suggestedRate
            )}
          </p>
          <div className="flex items-center gap-3">
            <input
              type="range"
              id="savingsRate"
              min="0"
              max="100"
              step="1"
              value={savingsRate}
              onChange={(e) => setSavingsRate(e.target.value)}
              className="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-amber-500"
              disabled={isSubmitting}
            />
            <div className="relative w-20">
              <input
                type="number"
                value={savingsRate}
                onChange={(e) => handleSavingsRateChange(e.target.value)}
                min="0"
                max="100"
                step="1"
                className="w-full pr-7 py-1 text-right border border-gray-300 rounded-md focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                disabled={isSubmitting}
              />
              <span className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 text-sm">
                %
              </span>
            </div>
          </div>
          <p className="text-xs text-gray-600 mt-2 italic">
            {COPY.FLOW1.INCOME_CAPTURE.SAVINGS_RATE_EXPLANATION}
          </p>
        </div>

        {/* Error Display */}
        {error && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-md">
            <p className="text-sm text-red-700">{error}</p>
          </div>
        )}

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isSubmitting || !amount || !eventDate}
          className="w-full py-3 px-4 bg-amber-600 hover:bg-amber-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-medium rounded-md transition-colors focus:ring-2 focus:ring-amber-500 focus:ring-offset-2"
        >
          {isSubmitting
            ? COPY.FLOW1.INCOME_CAPTURE.SUBMITTING
            : COPY.FLOW1.INCOME_CAPTURE.SUBMIT_BUTTON}
        </button>
      </form>
    </div>
  );
}
