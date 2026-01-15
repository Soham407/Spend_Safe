"use client";

// Flow 1: Safe-to-Spend Display Component
// TRD Section 3: Assumption Transparency

import { useEffect, useState } from "react";
import { COPY } from "@/copy/en";

interface SafeToSpendData {
  safe_to_spend: number;
  total_income: number;
  estimated_savings: number;
  confirmed_safe_to_spend: number;
  pending_count: number;
  income_event_count: number;
  calculated_at?: string;
}

interface SafeToSpendDisplayProps {
  refreshTrigger?: number;
}

export function SafeToSpendDisplay({
  refreshTrigger,
}: SafeToSpendDisplayProps) {
  const [data, setData] = useState<SafeToSpendData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    try {
      setIsLoading(true);
      const response = await fetch("/api/estimates/safe-to-spend");
      const result = await response.json();

      if (!result.success) {
        throw new Error(result.error || "Failed to fetch estimate");
      }

      setData(result.data);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [refreshTrigger]);

  if (isLoading) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-6 bg-gray-200 rounded w-1/3"></div>
          <div className="h-16 bg-gray-200 rounded"></div>
          <div className="h-4 bg-gray-200 rounded w-2/3"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-red-200 p-6">
        <p className="text-red-700">{error}</p>
      </div>
    );
  }

  if (!data || data.income_event_count === 0) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-2">
          {COPY.FLOW1.SAFE_TO_SPEND.TITLE}
        </h2>
        <p className="text-gray-500 text-lg mb-1">
          {COPY.FLOW1.SAFE_TO_SPEND.EMPTY_STATE}
        </p>
        <p className="text-sm text-gray-400">
          {COPY.FLOW1.SAFE_TO_SPEND.EMPTY_STATE_HINT}
        </p>
      </div>
    );
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 2,
    }).format(amount);
  };

  const getRelativeTime = (isoString?: string) => {
    if (!isoString) return "just now";
    const date = new Date(isoString);
    const seconds = Math.floor((Date.now() - date.getTime()) / 1000);

    if (seconds < 60) return "just now";
    if (seconds < 3600) return `${Math.floor(seconds / 60)} min ago`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)} hours ago`;
    return `${Math.floor(seconds / 86400)} days ago`;
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <h2 className="text-xl font-semibold text-gray-900 mb-1">
        {COPY.FLOW1.SAFE_TO_SPEND.TITLE}
      </h2>
      <p className="text-xs text-gray-500 mb-4">
        {COPY.SAFE_TO_SPEND_DISCLAIMER}
      </p>

      {/* Main Safe-to-Spend Amount */}
      <div className="mb-6">
        <div className="text-5xl font-bold text-gray-900 mb-2">
          {formatCurrency(data.safe_to_spend)}
        </div>
        <p className="text-sm text-gray-600">
          {COPY.FLOW1.SAFE_TO_SPEND.BASED_ON_SUMMARY.replace(
            "{count, plural, =1 {1 income event} other {# income events}}",
            data.income_event_count === 1
              ? "1 income event"
              : `${data.income_event_count} income events`
          )}
        </p>
      </div>

      {/* Pending Warning */}
      {data.pending_count > 0 && (
        <div className="mb-4 p-3 bg-amber-50 border border-amber-200 rounded-md">
          <p className="text-sm text-amber-800 font-medium">
            {COPY.FLOW1.SAFE_TO_SPEND.PENDING_WARNING.replace(
              "{count, plural, =1 {1 allocation} other {# allocations}}",
              data.pending_count === 1
                ? "1 allocation"
                : `${data.pending_count} allocations`
            )}
          </p>
        </div>
      )}

      {/* Breakdown */}
      <div className="space-y-3 mb-4">
        <div className="flex justify-between items-center py-2 border-t border-gray-100">
          <span className="text-sm text-gray-600">
            {COPY.FLOW1.SAFE_TO_SPEND.TOTAL_INCOME_LABEL}
          </span>
          <span className="text-sm font-medium text-gray-900">
            {formatCurrency(data.total_income)}
          </span>
        </div>
        <div className="flex justify-between items-center py-2 border-t border-gray-100">
          <span className="text-sm text-gray-600">
            {COPY.FLOW1.SAFE_TO_SPEND.ALLOCATED_SAVINGS_LABEL}
          </span>
          <span className="text-sm font-medium text-gray-900">
            {formatCurrency(data.estimated_savings)}
          </span>
        </div>
      </div>

      {/* Assumption Reminder */}
      <div className="pt-4 border-t border-gray-200">
        <p className="text-xs text-gray-500 italic mb-2">
          {COPY.FLOW1.SAFE_TO_SPEND.ASSUMPTION_REMINDER}
        </p>
        <p className="text-xs text-gray-400">
          {COPY.FLOW1.SAFE_TO_SPEND.CALCULATION_TIME.replace(
            "{time}",
            getRelativeTime(data.calculated_at)
          )}
        </p>
      </div>
    </div>
  );
}
