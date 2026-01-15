"use client";

import { Sparkles } from "lucide-react";

export function IconRail() {
  return (
    <div className="hidden md:flex flex-col items-center py-8 px-3 space-y-6">
      <div className="w-12 h-12 rail-bg rounded-2xl flex items-center justify-center shadow-lg">
        <Sparkles className="text-white" size={20} />
      </div>
      <div className="flex-1 w-px bg-gradient-to-b from-slate-300 via-transparent to-transparent" />
    </div>
  );
}
