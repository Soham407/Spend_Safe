"use client";

import { useEffect, useState } from "react";
import { Sparkles, RefreshCw, AlertTriangle, CheckCircle2 } from "lucide-react";
import { COPY } from "@/copy/en";

interface SafeToSpendCardProps {
  safeToSpend: number;
  totalIncome: number;
  estimatedSavings: number;
  confirmedSafeToSpend: number;
  pendingCount: number;
  isLoading: boolean;
  degradationLevel: "low" | "medium" | "high";
  refreshTrigger: number;
}

export function SafeToSpendCard({
  safeToSpend,
  totalIncome,
  estimatedSavings,
  confirmedSafeToSpend,
  pendingCount,
  isLoading,
  degradationLevel,
  refreshTrigger,
}: SafeToSpendCardProps) {
  const [animate, setAnimate] = useState(false);

  useEffect(() => {
    setAnimate(true);
    const timer = setTimeout(() => setAnimate(false), 300);
    return () => clearTimeout(timer);
  }, [safeToSpend, refreshTrigger]);

  const getDegradationStyles = () => {
    switch (degradationLevel) {
      case "low":
        return "text-indigo-600";
      case "medium":
        return "text-amber-500";
      case "high":
        return "text-rose-500 opacity-60 blur-[1px]"; // Visual degradation
      default:
        return "text-indigo-600";
    }
  };

  const getCardStyles = () => {
    switch (degradationLevel) {
      case "high":
        return "neo-outset bg-rose-50/10 border-rose-100";
      case "medium":
        return "neo-outset bg-amber-50/10 border-amber-100";
      default:
        return "neo-outset bg-white border-white";
    }
  };

  return (
    <div
      className={`relative p-8 md:p-12 rounded-[48px] overflow-hidden transition-all duration-500 border ${getCardStyles()}`}
    >
      {/* Background Ambience */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-50/50 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-emerald-50/50 rounded-full blur-3xl -ml-20 -mb-20 pointer-events-none" />

      <div className="relative space-y-8">
        <div className="flex justify-between items-start">
          <div className="space-y-1">
            <h2 className="text-[10px] md:text-xs font-black text-slate-400 uppercase tracking-widest flex items-center space-x-2">
              <Sparkles
                size={12}
                className={
                  degradationLevel === "high"
                    ? "text-rose-400"
                    : "text-indigo-400"
                }
              />
              <span>{COPY.SAFE_TO_SPEND_LABEL}</span>
            </h2>
            <div className="flex items-baseline space-x-1">
              <span
                className={`text-5xl md:text-7xl font-black tracking-tighter transition-all duration-300 ${getDegradationStyles()} ${
                  animate ? "scale-[1.02]" : "scale-100"
                }`}
              >
                ${isLoading ? "..." : Math.floor(safeToSpend).toLocaleString()}
              </span>
              <span className="text-xl md:text-2xl font-black text-slate-300">
                .00
              </span>
            </div>
            {degradationLevel !== "low" && (
              <div className="flex items-center space-x-1.5 text-amber-500 bg-amber-50 w-fit px-3 py-1 rounded-full">
                <AlertTriangle size={10} />
                <span className="text-[9px] font-black uppercase tracking-widest">
                  Estimate Degrading ({degradationLevel})
                </span>
              </div>
            )}
          </div>

          <button
            onClick={() =>
              window.dispatchEvent(new CustomEvent("open-income-modal"))
            }
            className="group flex flex-col items-center space-y-2 bg-slate-900 text-white p-4 md:p-5 rounded-[24px] shadow-2xl hover:bg-black transition-all active:scale-95"
          >
            <div className="w-6 h-6 flex items-center justify-center">
              <span className="text-xl leading-none font-thin opacity-80 group-hover:opacity-100">
                +
              </span>
            </div>
            <span className="text-[9px] font-black uppercase tracking-widest opacity-60 group-hover:opacity-100">
              Add
            </span>
          </button>
        </div>

        {/* Progress Bar */}
        <div className="space-y-2">
          <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden flex">
            <div
              className="h-full bg-emerald-400 transition-all duration-500 ease-out"
              style={{
                width: `${(confirmedSafeToSpend / (safeToSpend || 1)) * 100}%`,
              }}
            />
            {/* Pending part could be different color? */}
          </div>
          <div className="flex justify-between items-center text-[10px] font-bold uppercase tracking-widest text-slate-400">
            <span className="flex items-center space-x-1">
              <CheckCircle2 size={10} className="text-emerald-500" />
              <span>
                {isLoading
                  ? "-"
                  : `$${Math.floor(
                      confirmedSafeToSpend
                    ).toLocaleString()} Confirmed`}
              </span>
            </span>
            <span>
              {pendingCount > 0 ? `${pendingCount} Pending` : "All Clear"}
            </span>
          </div>
        </div>

        {/* Breakdown Grid */}
        <div className="grid grid-cols-2 gap-4 pt-8 border-t border-slate-100">
          <div className="space-y-1">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
              Total Income
            </p>
            <p className="text-lg md:text-xl font-black text-slate-700 tracking-tight">
              ${isLoading ? "-" : totalIncome.toLocaleString()}
            </p>
          </div>
          <div className="space-y-1 text-right">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
              Est. Savings
            </p>
            <p className="text-lg md:text-xl font-black text-emerald-600 tracking-tight">
              ${isLoading ? "-" : estimatedSavings.toLocaleString()}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
