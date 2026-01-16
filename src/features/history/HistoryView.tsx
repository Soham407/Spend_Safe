"use client";

import { History } from "lucide-react";
import { COPY } from "@/copy/en";

export function HistoryView() {
  return (
    <div className="max-w-4xl mx-auto space-y-10 py-4 md:py-6">
      <div className="space-y-1">
        <h1 className="text-3xl md:text-4xl font-black text-slate-800 tracking-tight">
          Assumption History
        </h1>
        <p className="text-slate-400 font-bold text-[10px] md:text-xs uppercase tracking-widest">
          Audit Trail of Financial States
        </p>
      </div>
      <div className="neo-inset p-16 md:p-32 rounded-[60px] text-center border border-dashed border-slate-300/60 bg-slate-50/30">
        <History
          size={64}
          className="mx-auto text-slate-200 mb-6"
          strokeWidth={1}
        />
        <p className="text-slate-400 font-bold italic text-sm md:text-lg">
          This module tracks rate changes over time.
        </p>
        <p className="text-slate-300 text-[11px] font-black uppercase tracking-widest mt-4">
          Coming Soon
        </p>
      </div>
    </div>
  );
}
