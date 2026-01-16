// UI Component: Passive Mode Toggle
// PRD Flow 5: Read-Only / Passive Mode
// TRD: "System remains fully useful without confirmations"

"use client";

import { useState } from "react";
import { COPY } from "@/copy/en";
import { Check, Eye } from "lucide-react";

interface PassiveModeToggleProps {
  isEnabled: boolean;
  onToggle: (enabled: boolean) => Promise<void>;
}

/**
 * PassiveModeToggle Component
 *
 * PRD: "No penalties or shaming"
 * Allows user to toggle passive mode with clear, non-judgmental messaging
 */
export function PassiveModeToggle({
  isEnabled,
  onToggle,
}: PassiveModeToggleProps) {
  const [isUpdating, setIsUpdating] = useState(false);

  const handleToggle = async () => {
    setIsUpdating(true);
    try {
      await onToggle(!isEnabled);
    } catch (err) {
      console.error("Failed to toggle passive mode:", err);
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Toggle Control */}
      <div className="neo-outset p-8 rounded-[32px] border border-white/60">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <div className="flex items-center space-x-3 mb-2">
              <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center">
                <Eye size={20} className="text-indigo-600" />
              </div>
              <h3 className="text-lg font-black text-slate-800 tracking-tight">
                {COPY.FLOW5.PASSIVE_MODE.TITLE}
              </h3>
            </div>
            <p className="text-sm text-slate-600 leading-relaxed">
              {COPY.FLOW5.PASSIVE_MODE.DESCRIPTION}
            </p>
          </div>

          {/* Toggle Switch */}
          <button
            onClick={handleToggle}
            disabled={isUpdating}
            className={`relative w-14 h-8 rounded-full transition-all duration-300 shadow-inner ${
              isEnabled ? "bg-indigo-500" : "bg-slate-200"
            } ${
              isUpdating ? "opacity-50 cursor-not-allowed" : "cursor-pointer"
            }`}
            aria-label={
              isEnabled ? "Disable passive mode" : "Enable passive mode"
            }
          >
            <div
              className={`absolute top-1 w-6 h-6 bg-white rounded-full shadow-md transition-all duration-300 flex items-center justify-center ${
                isEnabled ? "left-7" : "left-1"
              }`}
            >
              {isEnabled && <Check size={14} className="text-indigo-600" />}
            </div>
          </button>
        </div>

        {/* Status Indicator */}
        <div className="mt-4 pt-4 border-t border-slate-200/50">
          <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">
            {isEnabled
              ? COPY.FLOW5.PASSIVE_MODE.TOGGLE_ON
              : COPY.FLOW5.PASSIVE_MODE.TOGGLE_OFF}
          </p>
        </div>
      </div>

      {/* Explanation Card */}
      <div className="neo-inset p-6 rounded-[32px] bg-slate-50/50 border border-white/20 space-y-4">
        <p className="text-sm text-slate-700 leading-relaxed">
          {COPY.FLOW5.PASSIVE_MODE.EXPLANATION}
        </p>

        {/* Benefits List */}
        <div className="space-y-3 pt-2">
          <p className="text-xs font-black text-slate-400 uppercase tracking-widest">
            {COPY.FLOW5.PASSIVE_MODE.BENEFITS.TITLE}
          </p>
          <ul className="space-y-2">
            <BenefitItem text={COPY.FLOW5.PASSIVE_MODE.BENEFITS.VIEW_ONLY} />
            <BenefitItem text={COPY.FLOW5.PASSIVE_MODE.BENEFITS.NO_PROMPTS} />
            <BenefitItem text={COPY.FLOW5.PASSIVE_MODE.BENEFITS.FULL_ACCESS} />
            <BenefitItem text={COPY.FLOW5.PASSIVE_MODE.BENEFITS.YOUR_PACE} />
          </ul>
        </div>

        {/* No Judgment Message */}
        <div className="pt-4 border-t border-slate-200/50">
          <p className="text-xs text-slate-500 italic text-center">
            {COPY.FLOW5.PASSIVE_MODE.NO_JUDGMENT}
          </p>
        </div>
      </div>
    </div>
  );
}

function BenefitItem({ text }: { text: string }) {
  return (
    <li className="flex items-start space-x-2">
      <div className="w-1.5 h-1.5 rounded-full bg-indigo-400 mt-1.5 shrink-0" />
      <span className="text-sm text-slate-600">{text}</span>
    </li>
  );
}
