"use client";

import { useEffect, useState } from "react";
import { AllocationCard, HistoryItem } from "./AllocationCard";
import { Target, History } from "lucide-react";
import { COPY } from "@/copy/en";
import { AssumptionState } from "@/domain/assumptions/types";

interface PendingAllocationData {
  assumption: {
    id: string;
    income_event_id: string;
    state: AssumptionState;
    state_changed_at: Date;
    created_at: Date;
    updated_at: Date;
  };
  income_event: {
    id: string;
    user_id: string;
    amount: number;
    event_date: Date;
    savings_rate: number;
    created_at: Date;
    updated_at: Date;
  };
}

interface AllocationListProps {
  refreshTrigger?: number;
  onUpdate?: () => void;
}

export function PendingActionsSection({
  refreshTrigger,
  onUpdate,
}: AllocationListProps) {
  const [allocations, setAllocations] = useState<PendingAllocationData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [internalRefresh, setInternalRefresh] = useState(0);

  const fetchAllocations = async () => {
    try {
      setIsLoading(true);
      const response = await fetch("/api/allocations/pending");
      const result = await response.json();
      if (result.success) {
        setAllocations(result.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAllocations();
  }, [refreshTrigger, internalRefresh]);

  const handleItemUpdate = () => {
    setInternalRefresh((prev) => prev + 1);
    onUpdate?.();
  };

  const pendingCount = allocations.length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-black text-slate-800 tracking-tight">
          Pending Actions
        </h3>
        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
          {pendingCount} Awaiting
        </span>
      </div>

      <div className="space-y-4">
        {isLoading && allocations.length === 0 ? (
          <div className="neo-inset rounded-[32px] p-8 animate-pulse">
            <div className="h-20 bg-slate-200 rounded-xl" />
          </div>
        ) : allocations.length === 0 ? (
          <div className="p-12 neo-inset rounded-[40px] flex flex-col items-center justify-center text-center space-y-4 border border-white/50">
            <div className="w-12 h-12 bg-emerald-50 text-emerald-500 rounded-2xl flex items-center justify-center">
              <Target size={24} />
            </div>
            <p className="text-[13px] text-slate-500 font-bold italic">
              All current assumptions are verified.
            </p>
          </div>
        ) : (
          allocations.slice(0, 3).map((alloc) => (
            <AllocationCard
              key={alloc.assumption.id}
              allocation={alloc}
              onUpdate={handleItemUpdate}
            />
          ))
        )}
      </div>
    </div>
  );
}

// Recent Execution History component
interface RecentExecutionProps {
  events: Array<{
    id: string;
    amount: number;
    event_date: Date;
    state: AssumptionState;
  }>;
}

export function RecentExecutionSection({ events }: RecentExecutionProps) {
  const historyEvents = events.filter(
    (e) => e.state !== AssumptionState.PENDING
  );

  return (
    <div className="space-y-6">
      <h3 className="text-xl font-black text-slate-800 tracking-tight">
        Recent Execution
      </h3>
      <div className="neo-inset rounded-[40px] p-6 space-y-6 h-full min-h-[300px] border border-white/20">
        {historyEvents.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center text-slate-400 py-20">
            <History size={32} className="opacity-20 mb-4" />
            <p className="text-[12px] font-bold uppercase tracking-widest opacity-50">
              No history available
            </p>
          </div>
        ) : (
          <div className="divide-y divide-slate-200/50">
            {historyEvents.slice(0, 5).map((e) => (
              <HistoryItem key={e.id} event={e} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// Keep the old AllocationList for backwards compatibility
export function AllocationList(props: AllocationListProps) {
  return <PendingActionsSection {...props} />;
}
