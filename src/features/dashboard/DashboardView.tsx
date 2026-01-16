"use client";

import { SafeToSpendCard } from "@/features/estimates/components/SafeToSpendCard";
import {
  PendingActionsSection,
  RecentExecutionSection,
} from "@/features/assumptions/components/AllocationList";
import { COPY } from "@/copy/en";
import { IncomeEventData, SnapshotData } from "../common/types";
import { AssumptionState } from "@/features/assumptions/types";

import { PendingAllocationData } from "@/features/assumptions/components/AllocationList"; // Ensure this import is available or type is exported

interface DashboardViewProps {
  snapshot: SnapshotData | null;
  isLoading: boolean;
  refreshTrigger: number;
  onUpdate: () => void;
  isPassiveMode: boolean;
  incomeEvents: IncomeEventData[];
  demoPendingAllocations?: any[]; // Using any[] temporarily if import is hard, but better to import type
  isDemoMode?: boolean;
}

export function DashboardView({
  snapshot,
  isLoading,
  refreshTrigger,
  onUpdate,
  isPassiveMode,
  incomeEvents,
  demoPendingAllocations,
  isDemoMode = false,
}: DashboardViewProps) {
  // Calculate stats for SafeToSpendCard
  // We need to map SnapshotData to what SafeToSpendCard expects?
  // SafeToSpendCard props:
  // safeToSpend (number)
  // totalIncome (number)
  // estimatedSavings (number)
  // confirmedSafeToSpend (number)
  // pendingCount (number)
  // degradationLevel (string)

  return (
    <div className="max-w-4xl mx-auto space-y-8 py-4 md:py-6">
      {/* Header */}
      <div className="space-y-1">
        <h1 className="text-3xl md:text-4xl font-black text-slate-800 tracking-tight">
          Overview
        </h1>
        <p
          className="text-slate-400 font-bold text-[10px] md:text-xs uppercase tracking-widest"
          suppressHydrationWarning
        >
          {new Date().toLocaleDateString("en-US", {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </p>
      </div>

      {/* Safe To Spend Card */}
      <SafeToSpendCard
        safeToSpend={snapshot?.safe_to_spend || 0}
        totalIncome={snapshot?.total_income || 0}
        estimatedSavings={snapshot?.estimated_savings || 0}
        confirmedSafeToSpend={snapshot?.confirmed_safe_to_spend || 0}
        pendingCount={snapshot?.pending_count || 0}
        isLoading={isLoading}
        degradationLevel={
          (snapshot?.degradation_level as "low" | "medium" | "high") || "low"
        }
        refreshTrigger={refreshTrigger}
      />

      {/* Action Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
        {/* Left Column: Pending Actions */}
        <PendingActionsSection
          refreshTrigger={refreshTrigger}
          onUpdate={onUpdate}
          isPassiveMode={isPassiveMode}
          allocations={demoPendingAllocations}
          isDemoMode={isDemoMode}
        />

        {/* Right Column: Recent Execution */}
        <RecentExecutionSection
          events={incomeEvents
            .map((e) => ({
              id: e.id,
              amount: e.amount,
              event_date: new Date(e.event_date),
              state: e.state || AssumptionState.PENDING,
            }))
            .slice(0, 5)}
        />
      </div>
    </div>
  );
}
