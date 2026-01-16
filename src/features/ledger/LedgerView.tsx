"use client";

import { IncomeCapture } from "@/ui/income/IncomeCapture";
import { COPY } from "@/copy/en";
import { Library } from "lucide-react";
import { IncomeEventData } from "../common/types";

interface LedgerViewProps {
  incomeEvents: IncomeEventData[];
  onUpdate: () => void;
}

export function LedgerView({ incomeEvents, onUpdate }: LedgerViewProps) {
  return (
    <div className="max-w-4xl mx-auto space-y-10 py-4 md:py-6">
      <div className="space-y-1">
        <h1 className="text-3xl md:text-4xl font-black text-slate-800 tracking-tight">
          {COPY.INCOME_HISTORY.TITLE}
        </h1>
        <p className="text-slate-400 font-bold text-[10px] md:text-xs uppercase tracking-widest">
          {COPY.INCOME_HISTORY.SUBTITLE}
        </p>
      </div>

      {/* Income Capture Form */}
      <IncomeCapture onSuccess={onUpdate} />

      {/* Income List */}
      <div className="space-y-6 md:space-y-8">
        <div className="flex items-center space-x-3 text-slate-400 border-b border-slate-200 pb-4">
          <Library size={20} />
          <span className="text-[12px] font-black uppercase tracking-widest">
            Recorded Entries
          </span>
        </div>
        <div className="bg-white/50 backdrop-blur-xl rounded-[40px] p-6 md:p-8 border border-white/60 shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="border-b border-slate-200/60">
                <tr>
                  <th className="px-10 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                    Date
                  </th>
                  <th className="px-10 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                    Amount
                  </th>
                  <th className="px-10 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">
                    Rate
                  </th>
                  <th className="px-10 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                    Safe To Spend
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {incomeEvents.length === 0 ? (
                  <tr>
                    <td
                      colSpan={4}
                      className="py-20 text-center text-slate-400 font-bold italic"
                    >
                      No income events recorded yet.
                    </td>
                  </tr>
                ) : (
                  incomeEvents.map((e) => (
                    <tr
                      key={e.id}
                      className="hover:bg-white/80 transition-colors group"
                    >
                      <td className="px-10 py-6 text-[12px] font-bold text-slate-600">
                        {new Date(e.event_date).toLocaleDateString()}
                      </td>
                      <td className="px-10 py-6 text-sm font-black text-slate-800 tracking-tight">
                        ${e.amount.toLocaleString()}
                      </td>
                      <td className="px-10 py-6 text-xs text-slate-400 font-black text-center">
                        {(e.savings_rate * 100).toFixed(0)}%
                      </td>
                      <td className="px-10 py-6 text-sm text-indigo-600 font-black tracking-tight">
                        ${(e.amount * (1 - e.savings_rate)).toLocaleString()}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>

            {/* Mobile Cards */}
            <div className="md:hidden divide-y divide-slate-200">
              {incomeEvents.map((e) => (
                <div
                  key={e.id}
                  className="p-6 bg-white/40 flex justify-between items-center"
                >
                  <div>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                      {new Date(e.event_date).toLocaleDateString()}
                    </p>
                    <p className="text-xl font-black text-slate-800 mt-1">
                      ${e.amount.toLocaleString()}
                    </p>
                    <p className="text-[10px] text-indigo-500 font-bold mt-1 uppercase">
                      Safe: $
                      {(e.amount * (1 - e.savings_rate)).toLocaleString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
