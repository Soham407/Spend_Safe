"use client";

import { AlertTriangle } from "lucide-react";
import { COPY } from "@/copy/en";

interface RealityCheckModalProps {
  isOpen: boolean;
  onAcknowledge: () => void;
  pendingCount: number;
  oldestPendingAge: number;
  degradationLevel: "low" | "medium" | "high";
}

export function RealityCheckModal({
  isOpen,
  onAcknowledge,
  pendingCount,
  oldestPendingAge,
  degradationLevel,
}: RealityCheckModalProps) {
  if (!isOpen) return null;

  // Determine title and message based on degradation level
  const isHighDegradation = degradationLevel === "high";
  const title = isHighDegradation
    ? COPY.FLOW3.REALITY_CHECK.TITLE_HIGH
    : COPY.FLOW3.REALITY_CHECK.TITLE_MEDIUM;

  // Simple string replacement for pluralization
  const getMessage = () => {
    const template = isHighDegradation
      ? COPY.FLOW3.REALITY_CHECK.MESSAGE_HIGH
      : COPY.FLOW3.REALITY_CHECK.MESSAGE_MEDIUM;

    return template
      .replace("{count}", String(pendingCount))
      .replace(
        "{count, plural, =1 {allocation} other {allocations}}",
        pendingCount === 1 ? "allocation" : "allocations"
      )
      .replace(
        "{count, plural, =1 {allocation has} other {allocations have}}",
        pendingCount === 1 ? "allocation has" : "allocations have"
      )
      .replace("{days}", String(oldestPendingAge))
      .replace(
        "{days, plural, =1 {day} other {days}}",
        oldestPendingAge === 1 ? "day" : "days"
      );
  };

  return (
    <div className="absolute inset-0 z-50 flex items-center justify-center bg-slate-900/10 backdrop-blur-md p-6">
      <div className="neo-outset p-10 rounded-[40px] max-w-md text-center space-y-6 border border-white">
        <div
          className={`w-16 h-16 rounded-3xl flex items-center justify-center mx-auto shadow-inner ${
            isHighDegradation
              ? "bg-rose-100 text-rose-600"
              : "bg-amber-100 text-amber-600"
          }`}
        >
          <AlertTriangle size={32} />
        </div>
        <div className="space-y-2">
          <h3 className="text-xl font-black text-slate-800 tracking-tight">
            {title}
          </h3>
          <p className="text-[13px] text-slate-500 font-medium leading-relaxed">
            {getMessage()}
          </p>
        </div>
        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-4 text-center">
            <div className="neo-inset p-4 rounded-2xl">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">
                Pending
              </p>
              <p className="text-2xl font-black text-slate-800">
                {pendingCount}
              </p>
            </div>
            <div className="neo-inset p-4 rounded-2xl">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">
                Oldest
              </p>
              <p className="text-2xl font-black text-slate-800">
                {oldestPendingAge}d
              </p>
            </div>
          </div>
          <button
            onClick={onAcknowledge}
            className="w-full py-4 bg-slate-900 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-black transition-all active:scale-95 shadow-xl"
          >
            {COPY.FLOW3.REALITY_CHECK.ACTION}
          </button>
        </div>
      </div>
    </div>
  );
}
