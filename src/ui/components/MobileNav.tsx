"use client";

import {
  LayoutDashboard,
  Library,
  ShieldAlert,
  UserCircle,
} from "lucide-react";

interface MobileNavProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export function MobileNav({ activeTab, setActiveTab }: MobileNavProps) {
  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 h-[72px] bg-white/90 backdrop-blur-2xl border-t border-slate-200/50 px-8 flex items-center justify-between z-40 shadow-[0_-10px_40px_rgba(0,0,0,0.05)]">
      <button
        onClick={() => setActiveTab("dashboard")}
        className={`relative flex flex-col items-center justify-center space-y-1 transition-all ${
          activeTab === "dashboard"
            ? "text-indigo-600"
            : "text-slate-400 hover:text-slate-600"
        }`}
      >
        {activeTab === "dashboard" && (
          <span className="absolute -top-3 w-1.5 h-1.5 rounded-full bg-indigo-600" />
        )}
        <LayoutDashboard
          size={22}
          strokeWidth={activeTab === "dashboard" ? 3 : 2}
        />
        <span className="text-[9px] font-black uppercase tracking-tighter">
          Overview
        </span>
      </button>
      <button
        onClick={() => setActiveTab("income")}
        className={`relative flex flex-col items-center justify-center space-y-1 transition-all ${
          activeTab === "income" ? "text-indigo-600" : "text-slate-400"
        }`}
      >
        {activeTab === "income" && (
          <span className="absolute -top-3 w-1.5 h-1.5 rounded-full bg-indigo-600" />
        )}
        <Library size={22} strokeWidth={activeTab === "income" ? 3 : 2} />
        <span className="text-[9px] font-black uppercase tracking-tighter">
          Ledger
        </span>
      </button>
      <button
        onClick={() => setActiveTab("panic")}
        className={`relative flex flex-col items-center justify-center space-y-1 transition-all ${
          activeTab === "panic" ? "text-rose-600" : "text-slate-400"
        }`}
      >
        {activeTab === "panic" && (
          <span className="absolute -top-3 w-1.5 h-1.5 rounded-full bg-rose-600" />
        )}
        <ShieldAlert size={22} strokeWidth={activeTab === "panic" ? 3 : 2} />
        <span className="text-[9px] font-black uppercase tracking-tighter">
          Panic
        </span>
      </button>
      <button
        onClick={() => setActiveTab("profile")}
        className={`relative flex flex-col items-center justify-center space-y-1 transition-all ${
          activeTab === "profile" ? "text-indigo-600" : "text-slate-400"
        }`}
      >
        {activeTab === "profile" && (
          <span className="absolute -top-3 w-1.5 h-1.5 rounded-full bg-indigo-600" />
        )}
        <UserCircle size={22} strokeWidth={activeTab === "profile" ? 3 : 2} />
        <span className="text-[9px] font-black uppercase tracking-tighter">
          Profile
        </span>
      </button>
    </nav>
  );
}
