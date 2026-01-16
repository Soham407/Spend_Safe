"use client";

import { useState, useEffect } from "react";
import { ShieldAlert, RefreshCw, Sparkles } from "lucide-react";
import { COPY } from "@/copy/en";
import { AssumptionState } from "@/domain/assumptions/types";
import { PanicSnapshotData } from "../common/types";

export function PanicView({ refreshTrigger }: { refreshTrigger: number }) {
  const [panicData, setPanicData] = useState<PanicSnapshotData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPanicSnapshot = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const response = await fetch("/api/panic-snapshot");

        if (!response.ok) {
          setError(`Failed to load panic snapshot: ${response.statusText}`);
          setPanicData(null);
          return;
        }

        const result = await response.json();
        if (result.success) {
          setPanicData(result.data);
        } else {
          setError("Failed to load panic snapshot. Please try again.");
          setPanicData(null);
        }
      } catch (err) {
        console.error("Failed to fetch panic snapshot:", err);
        setError("Network error. Please check your connection and try again.");
        setPanicData(null);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPanicSnapshot();
  }, [refreshTrigger]);

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto py-8 md:py-16 text-center">
        <RefreshCw className="animate-spin mx-auto text-slate-300" size={48} />
        <p className="text-slate-400 mt-4 font-bold text-sm">
          Loading conservative view...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto py-8 md:py-16 text-center space-y-6">
        <div className="w-16 h-16 bg-rose-100 rounded-full flex items-center justify-center mx-auto">
          <ShieldAlert size={32} className="text-rose-500" />
        </div>
        <h2 className="text-2xl font-black text-slate-800">
          Unable to Load Panic View
        </h2>
        <p className="text-slate-600 max-w-md mx-auto">{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="px-6 py-3 bg-slate-900 text-white rounded-xl font-black text-xs uppercase tracking-widest hover:bg-black transition-all active:scale-[0.98] shadow-lg"
        >
          <RefreshCw size={14} className="inline mr-2" />
          Retry
        </button>
      </div>
    );
  }

  if (!panicData) {
    return (
      <div className="max-w-4xl mx-auto py-8 md:py-16 text-center">
        <p className="text-slate-400 font-bold text-sm">No data available</p>
      </div>
    );
  }

  const getStateColor = (state: AssumptionState) => {
    switch (state) {
      case AssumptionState.CONFIRMED:
        return "text-emerald-600 bg-emerald-50";
      case AssumptionState.DEFERRED:
        return "text-amber-600 bg-amber-50";
      default:
        return "text-slate-600 bg-slate-50";
    }
  };

  const getStateLabel = (state: AssumptionState) => {
    switch (state) {
      case AssumptionState.CONFIRMED:
        return COPY.FLOW4.BREAKDOWN.STATUS_LABELS.CONFIRMED;
      case AssumptionState.DEFERRED:
        return COPY.FLOW4.BREAKDOWN.STATUS_LABELS.DEFERRED;
      default:
        return COPY.FLOW4.BREAKDOWN.STATUS_LABELS.PENDING;
    }
  };

  return (
    <div className="max-w-4xl mx-auto py-8 md:py-16 space-y-12">
      {/* Header */}
      <div className="text-center space-y-6">
        <div className="inline-flex p-10 md:p-14 rounded-[40px] neo-outset text-indigo-500 bg-indigo-50/30 border border-white">
          <ShieldAlert size={56} strokeWidth={1.5} />
        </div>
        <div className="space-y-2">
          <h2 className="text-3xl md:text-5xl font-black text-slate-800 tracking-tighter leading-tight">
            {COPY.FLOW4.HEADER.TITLE}
          </h2>
          <p className="text-slate-400 text-[11px] md:text-[14px] leading-relaxed font-bold max-w-md mx-auto uppercase tracking-widest">
            {COPY.FLOW4.HEADER.SUBTITLE}
          </p>
          <p className="text-slate-500 text-sm max-w-lg mx-auto">
            {COPY.FLOW4.HEADER.DESCRIPTION}
          </p>
        </div>
      </div>

      {/* Supportive Message */}
      <div className="neo-inset p-6 md:p-8 rounded-[32px] bg-slate-50/50 border border-white/20">
        <p className="text-slate-600 text-sm md:text-base leading-relaxed text-center italic">
          {COPY.FLOW4.SUPPORTIVE_MESSAGES.STRESS_ACKNOWLEDGMENT}
        </p>
      </div>

      {/* Main Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Confirmed */}
        <div className="neo-outset p-8 rounded-[40px] space-y-3 border border-white/60">
          <p className="text-[11px] font-black text-slate-400 uppercase tracking-widest">
            {COPY.FLOW4.CONFIRMED_SECTION.TITLE}
          </p>
          <p className="text-4xl md:text-5xl font-black text-emerald-600 tracking-tighter">
            ${Math.floor(panicData.confirmed_safe_to_spend).toLocaleString()}
          </p>
          <p className="text-[10px] text-emerald-600 font-bold uppercase">
            {COPY.FLOW4.CONFIRMED_SECTION.RELIABILITY_BADGE}
          </p>
          <p className="text-xs text-slate-500 pt-2">
            {COPY.FLOW4.CONFIRMED_SECTION.DESCRIPTION}
          </p>
        </div>

        {/* Pending */}
        <div className="neo-inset p-8 rounded-[40px] space-y-3 border border-white/20 bg-slate-50/50">
          <p className="text-[11px] font-black text-slate-400 uppercase tracking-widest">
            {COPY.FLOW4.PENDING_SECTION.TITLE}
          </p>
          <p className="text-4xl md:text-5xl font-black text-slate-400 tracking-tighter">
            ${Math.floor(panicData.pending_safe_to_spend).toLocaleString()}
          </p>
          <p className="text-[10px] text-slate-500 font-bold uppercase italic">
            {COPY.FLOW4.PENDING_SECTION.RELIABILITY_BADGE}
          </p>
          <p className="text-xs text-slate-500 pt-2">
            {COPY.FLOW4.PENDING_SECTION.DESCRIPTION}
          </p>
        </div>

        {/* Deferred */}
        <div className="neo-inset p-8 rounded-[40px] space-y-3 border border-white/20 bg-amber-50/30">
          <p className="text-[11px] font-black text-slate-400 uppercase tracking-widest">
            {COPY.FLOW4.DEFERRED_SECTION.TITLE}
          </p>
          <p className="text-4xl md:text-5xl font-black text-amber-400 tracking-tighter">
            ${Math.floor(panicData.deferred_safe_to_spend).toLocaleString()}
          </p>
          <p className="text-[10px] text-amber-600 font-bold uppercase italic">
            {COPY.FLOW4.DEFERRED_SECTION.RELIABILITY_BADGE}
          </p>
          <p className="text-xs text-slate-500 pt-2">
            {COPY.FLOW4.DEFERRED_SECTION.DESCRIPTION}
          </p>
        </div>
      </div>

      {/* Breakdown Table */}
      <div className="space-y-4">
        <h3 className="text-2xl font-black text-slate-800 tracking-tight">
          {COPY.FLOW4.BREAKDOWN.TITLE}
        </h3>
        <div className="neo-inset rounded-[32px] overflow-hidden border border-white/20">
          <table className="hidden md:table w-full text-left">
            <thead className="bg-slate-50/50 border-b border-slate-200">
              <tr>
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                  {COPY.FLOW4.BREAKDOWN.TABLE_HEADERS.DATE}
                </th>
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                  {COPY.FLOW4.BREAKDOWN.TABLE_HEADERS.AMOUNT}
                </th>
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">
                  {COPY.FLOW4.BREAKDOWN.TABLE_HEADERS.RATE}
                </th>
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                  {COPY.FLOW4.BREAKDOWN.TABLE_HEADERS.SAFE_SPEND}
                </th>
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">
                  {COPY.FLOW4.BREAKDOWN.TABLE_HEADERS.STATUS}
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {panicData.event_breakdown.length === 0 ? (
                <tr>
                  <td
                    colSpan={5}
                    className="py-20 text-center text-slate-400 font-bold italic"
                  >
                    {COPY.FLOW4.BREAKDOWN.EMPTY_STATE}
                  </td>
                </tr>
              ) : (
                panicData.event_breakdown.map((event) => (
                  <tr
                    key={event.income_event_id}
                    className="hover:bg-white/80 transition-colors"
                  >
                    <td className="px-8 py-5 text-[12px] font-bold text-slate-600">
                      {new Date(event.event_date).toLocaleDateString()}
                    </td>
                    <td className="px-8 py-5 text-sm font-black text-slate-800 tracking-tight">
                      ${event.amount.toLocaleString()}
                    </td>
                    <td className="px-8 py-5 text-xs text-slate-400 font-black text-center">
                      {(event.savings_rate * 100).toFixed(0)}%
                    </td>
                    <td className="px-8 py-5 text-sm text-indigo-600 font-black tracking-tight">
                      ${event.safe_to_spend.toLocaleString()}
                    </td>
                    <td className="px-8 py-5 text-center">
                      <span
                        className={`inline-block px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-tighter ${getStateColor(
                          event.state
                        )}`}
                      >
                        {getStateLabel(event.state)}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>

          {/* Mobile Cards */}
          <div className="md:hidden divide-y divide-slate-200">
            {panicData.event_breakdown.length === 0 ? (
              <div className="py-20 text-center text-slate-400 font-bold italic">
                {COPY.FLOW4.BREAKDOWN.EMPTY_STATE}
              </div>
            ) : (
              panicData.event_breakdown.map((event) => (
                <div
                  key={event.income_event_id}
                  className="p-6 bg-white/40 space-y-3"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                        {new Date(event.event_date).toLocaleDateString()}
                      </p>
                      <p className="text-xl font-black text-slate-800 mt-1">
                        ${event.amount.toLocaleString()}
                      </p>
                    </div>
                    <span
                      className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-tighter ${getStateColor(
                        event.state
                      )}`}
                    >
                      {getStateLabel(event.state)}
                    </span>
                  </div>
                  <p className="text-[10px] text-indigo-500 font-bold uppercase">
                    Safe: ${event.safe_to_spend.toLocaleString()}
                  </p>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Disclaimers */}
      <div className="space-y-4">
        <div className="ai-border p-8 md:p-10 shadow-2xl space-y-6">
          <div className="flex items-center space-x-3 text-indigo-500">
            <Sparkles size={20} />
            <span className="text-[12px] font-black uppercase tracking-widest">
              Important Disclaimers
            </span>
          </div>
          <div className="space-y-4 text-slate-700">
            <p className="text-sm leading-relaxed border-l-4 border-indigo-200 pl-6 py-2">
              {COPY.FLOW4.DISCLAIMERS.PRIMARY}
            </p>
            <p className="text-sm leading-relaxed border-l-4 border-amber-200 pl-6 py-2">
              {COPY.FLOW4.DISCLAIMERS.UNCERTAINTY}
            </p>
            <p className="text-sm leading-relaxed border-l-4 border-slate-200 pl-6 py-2">
              {COPY.FLOW4.DISCLAIMERS.USER_CONTROL}
            </p>
            <p className="text-xs leading-relaxed text-slate-500 italic text-center pt-4">
              {COPY.FLOW4.DISCLAIMERS.NO_ADVICE}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
