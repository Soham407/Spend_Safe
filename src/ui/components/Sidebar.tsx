"use client";

import { LayoutDashboard, Library, ShieldAlert, UserCircle, History } from "lucide-react";

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  counts: { pending: number; confirmed: number };
  userName: string;
}

export function Sidebar({ activeTab, setActiveTab, counts, userName }: SidebarProps) {
  const navItems = [
    { id: "dashboard", label: "Overview", icon: LayoutDashboard, count: null },
    { id: "income", label: "Ledger", icon: Library, count: null },
    { id: "panic", label: "Panic", icon: ShieldAlert, count: null, accent: "rose" },
    { id: "history", label: "History", icon: History, count: null },
  ];

  return (
    <aside className="hidden md:flex flex-col w-[280px] h-full py-8 px-6 space-y-8">
      {/* Logo / Brand */}
      <div className="space-y-1">
        <h1 className="text-2xl font-black text-slate-800 tracking-tight">SpendSafe</h1>
        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
          Assumption-First Finance
        </p>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-2">
        {navItems.map((item) => {
          const isActive = activeTab === item.id;
          const Icon = item.icon;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center space-x-4 px-5 py-4 rounded-2xl transition-all group ${
                isActive
                  ? "active-item"
                  : "hover:bg-white/50"
              }`}
            >
              <div
                className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${
                  isActive
                    ? item.accent === "rose"
                      ? "bg-rose-100 text-rose-600"
                      : "bg-indigo-100 text-indigo-600"
                    : "bg-slate-100 text-slate-400 group-hover:bg-slate-200"
                }`}
              >
                <Icon size={18} strokeWidth={isActive ? 2.5 : 2} />
              </div>
              <span
                className={`text-[11px] font-black uppercase tracking-widest ${
                  isActive ? "text-slate-800" : "text-slate-500"
                }`}
              >
                {item.label}
              </span>
              {item.count !== null && (
                <span className="ml-auto text-[10px] font-black text-indigo-500 bg-indigo-50 px-2 py-0.5 rounded-full">
                  {item.count}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Pending Counter */}
      {counts.pending > 0 && (
        <div className="neo-inset rounded-3xl p-6 space-y-3">
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
            Awaiting Action
          </p>
          <p className="text-4xl font-black text-amber-600 tracking-tighter">
            {counts.pending}
          </p>
          <p className="text-[10px] text-slate-500 font-bold">
            unconfirmed allocations
          </p>
        </div>
      )}

      {/* Profile Quick Access */}
      <button
        onClick={() => setActiveTab("profile")}
        className={`flex items-center space-x-4 px-5 py-4 rounded-2xl transition-all ${
          activeTab === "profile" ? "active-item" : "hover:bg-white/50"
        }`}
      >
        <div className="w-10 h-10 rounded-xl bg-slate-800 flex items-center justify-center">
          <UserCircle className="text-white" size={18} />
        </div>
        <div className="text-left">
          <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">
            Profile
          </p>
          <p className="text-sm font-black text-slate-800 tracking-tight">
            {userName}
          </p>
        </div>
      </button>
    </aside>
  );
}
