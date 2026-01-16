"use client";

import { useState } from "react";
import { Wallet, ChevronRight } from "lucide-react";
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
    amount: string | number;
    event_date: Date;
    savings_rate: string | number;
    created_at: Date;
    updated_at: Date;
  };
}

interface AllocationCardProps {
  allocation: PendingAllocationData;
  onUpdate: () => void;
  isPassiveMode?: boolean;
  isDemoMode?: boolean;
}

export function AllocationCard({
  allocation,
  onUpdate,
  isPassiveMode = false,
  isDemoMode = false,
}: AllocationCardProps) {
  const [isUpdating, setIsUpdating] = useState(false);

  const { assumption, income_event } = allocation;

  const handleAction = async (newState: AssumptionState) => {
    setIsUpdating(true);
    try {
      if (isDemoMode) {
        // Simulate network delay
        await new Promise((resolve) => setTimeout(resolve, 800));
        alert(
          `This is a demo! In the real app, this would mark the income as ${newState}.`
        );
        onUpdate(); // Trigger refresh to verify UI updates if needed (though locally driven)
      } else {
        const response = await fetch(`/api/assumptions/${assumption.id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ state: newState }),
        });
        const data = await response.json();
        if (!response.ok || !data.success) {
          throw new Error(data.error || "Failed to update");
        }
        onUpdate();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsUpdating(false);
    }
  };

  const incomeAmount =
    typeof income_event.amount === "string"
      ? parseFloat(income_event.amount)
      : income_event.amount;
  const savingsRate =
    typeof income_event.savings_rate === "string"
      ? parseFloat(income_event.savings_rate)
      : income_event.savings_rate;
  const safeToSpend = incomeAmount * (1 - savingsRate);

  // Calculate age in days
  const ageDays = Math.floor(
    (Date.now() - new Date(assumption.state_changed_at).getTime()) /
      (1000 * 60 * 60 * 24)
  );

  // Determine age badge color
  const getAgeBadgeColor = () => {
    if (ageDays >= 7) return "bg-rose-100 text-rose-600";
    if (ageDays >= 3) return "bg-amber-100 text-amber-600";
    return "bg-emerald-100 text-emerald-600";
  };

  return (
    <div className="neo-outset p-5 rounded-[32px] group hover:bg-white transition-all border border-white/40">
      <div className="flex justify-between items-start mb-4">
        <div>
          <div className="flex items-center space-x-2 mb-1">
            <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest">
              {new Date(income_event.event_date).toLocaleDateString("en-US")}
            </p>
            {ageDays > 0 && (
              <span
                className={`text-[9px] font-black uppercase tracking-tighter px-2 py-0.5 rounded-md ${getAgeBadgeColor()}`}
              >
                {ageDays}d pending
              </span>
            )}
          </div>
          <p className="text-2xl font-black text-slate-800 tracking-tighter">
            ${incomeAmount.toLocaleString()}
          </p>
        </div>
        <div className="flex flex-col items-end">
          <span className="text-[10px] font-black text-indigo-500 uppercase tracking-widest">
            Est. Safe
          </span>
          <p className="text-sm font-black text-slate-600">
            ${safeToSpend.toLocaleString()}
          </p>
        </div>
      </div>
      {isPassiveMode ? (
        <div className="neo-inset px-4 py-3 rounded-xl bg-slate-50/50 border border-white/20">
          <p className="text-[10px] text-slate-500 font-medium text-center italic">
            {COPY.FLOW5.DASHBOARD.PENDING_VIEW_ONLY}
          </p>
        </div>
      ) : (
        <div className="flex items-center space-x-3">
          <button
            onClick={() => handleAction(AssumptionState.CONFIRMED)}
            disabled={isUpdating}
            className="flex-1 py-2.5 bg-emerald-500 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-emerald-600 shadow-lg shadow-emerald-200 transition-all disabled:opacity-50"
          >
            {isUpdating ? "..." : "Execute"}
          </button>
          <button
            onClick={() => handleAction(AssumptionState.DEFERRED)}
            disabled={isUpdating}
            className="flex-1 py-2.5 neo-outset text-amber-600 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-white border border-amber-100 transition-all disabled:opacity-50"
          >
            {isUpdating ? "..." : "Defer"}
          </button>
        </div>
      )}
    </div>
  );
}

// History item for confirmed/deferred allocations
interface HistoryItemProps {
  event: {
    id: string;
    amount: string | number;
    event_date: Date;
    state: AssumptionState;
  };
}

export function HistoryItem({ event }: HistoryItemProps) {
  return (
    <div className="py-4 flex items-center justify-between group">
      <div className="flex items-center space-x-4">
        <div
          className={`w-10 h-10 rounded-xl flex items-center justify-center ${
            event.state === AssumptionState.CONFIRMED
              ? "bg-emerald-50 text-emerald-500"
              : "bg-slate-50 text-slate-400"
          }`}
        >
          <Wallet size={18} />
        </div>
        <div>
          <p className="text-[13px] font-black text-slate-700 tracking-tight">
            $
            {(typeof event.amount === "string"
              ? parseFloat(event.amount)
              : event.amount
            ).toLocaleString()}
          </p>
          <p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest">
            {new Date(event.event_date).toLocaleDateString("en-US")}
          </p>
        </div>
      </div>
      <div className="flex items-center space-x-3">
        <div
          className={`text-[9px] font-black uppercase tracking-widest px-2 py-1 rounded-md ${
            event.state === AssumptionState.CONFIRMED
              ? "bg-emerald-50 text-emerald-600"
              : "bg-slate-100 text-slate-400"
          }`}
        >
          {event.state}
        </div>
        <ChevronRight
          size={14}
          className="text-slate-300 group-hover:translate-x-1 transition-transform"
        />
      </div>
    </div>
  );
}
