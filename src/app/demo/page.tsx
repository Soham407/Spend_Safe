"use client";

import { useState } from "react";
import { Sidebar } from "@/ui/components/Sidebar";
import { IconRail } from "@/ui/components/IconRail";
import { MobileNav } from "@/ui/components/MobileNav";
import { DashboardView } from "@/features/dashboard/DashboardView";
import { AssumptionState } from "@/domain/assumptions/types";
import { IncomeEventData, SnapshotData } from "@/features/common/types";
import { PendingAllocationData } from "@/ui/allocations/AllocationList";
import { AlertTriangle, Info } from "lucide-react";
import Link from "next/link";

// --- Mock Data ---

const MOCK_SNAPSHOT: SnapshotData = {
  safe_to_spend: 4250.0,
  total_income: 8500.0,
  estimated_savings: 1250.0,
  confirmed_safe_to_spend: 1800.0,
  pending_count: 2,
  degradation_level: "low",
  oldest_pending_age_days: 12,
  income_event_count: 4,
};

const MOCK_INCOME_EVENTS: IncomeEventData[] = [
  {
    id: "evt_1",
    amount: 2500,
    event_date: new Date().toISOString(), // Today
    savings_rate: 0.2,
    state: AssumptionState.CONFIRMED,
    created_at: new Date().toISOString(),
  },
  {
    id: "evt_3",
    amount: 1800,
    event_date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(), // 5 days ago
    savings_rate: 0.3,
    state: AssumptionState.CONFIRMED,
    created_at: new Date().toISOString(),
  },
  {
    id: "evt_2",
    amount: 3000,
    event_date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), // 2 days ago
    savings_rate: 0.3,
    state: AssumptionState.PENDING,
    created_at: new Date().toISOString(),
  },
  {
    id: "evt_4",
    amount: 1200,
    event_date: new Date(Date.now() - 12 * 24 * 60 * 60 * 1000).toISOString(), // 12 days ago
    savings_rate: 0.1,
    state: AssumptionState.PENDING,
    created_at: new Date().toISOString(),
  },
];

const MOCK_PENDING_ALLOCATIONS: PendingAllocationData[] = [
  {
    assumption: {
      id: "asm_1",
      income_event_id: "evt_2",
      state: AssumptionState.PENDING,
      state_changed_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
      created_at: new Date(),
      updated_at: new Date(),
    },
    income_event: {
      id: "evt_2",
      user_id: "demo-user",
      amount: 3000,
      event_date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
      savings_rate: 0.3,
      created_at: new Date(),
      updated_at: new Date(),
    },
  },
  {
    assumption: {
      id: "asm_2",
      income_event_id: "evt_4",
      state: AssumptionState.PENDING,
      state_changed_at: new Date(Date.now() - 12 * 24 * 60 * 60 * 1000),
      created_at: new Date(),
      updated_at: new Date(),
    },
    income_event: {
      id: "evt_4",
      user_id: "demo-user",
      amount: 1200,
      event_date: new Date(Date.now() - 12 * 24 * 60 * 60 * 1000),
      savings_rate: 0.1,
      created_at: new Date(),
      updated_at: new Date(),
    },
  },
];

// --- Demo Page Component ---

export default function DemoPage() {
  const [activeTab, setActiveTab] = useState("dashboard");

  // Dummy handlers
  const handleRefresh = () => {
    // console.log("Demo refresh triggered");
  };

  const handleUpdatePassiveMode = (mode: boolean) => {
    // console.log("Demo passive mode toggle:", mode);
    alert(
      "This is a demo! In the real app, this would toggle Passive Mode, hiding warnings."
    );
  };

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden font-sans selection:bg-indigo-100 selection:text-indigo-900 relative">
      {/* Demo Banner */}
      <div className="absolute top-0 left-0 right-0 h-10 bg-indigo-600 text-white z-[60] flex items-center justify-center px-4 shadow-md">
        <Info size={16} className="mr-2" />
        <span className="text-[10px] md:text-xs font-bold uppercase tracking-widest">
          You are viewing a Live Demo.
        </span>
        <Link
          href="/signup"
          className="ml-4 px-3 py-1 bg-white text-indigo-600 rounded-full text-[9px] font-black uppercase tracking-widest hover:bg-indigo-50 transition-colors"
        >
          Create Account
        </Link>
      </div>

      {/* Adjust Sidebar/Content top padding for banner */}
      <div className="pt-10 flex w-full h-full">
        {/* Sidebar */}
        <Sidebar
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          counts={{ pending: MOCK_SNAPSHOT.pending_count, confirmed: 0 }}
          userName={"demo@spendsafe.app"}
        />
        <IconRail />

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto relative no-scrollbar pb-20 md:pb-0 transition-all duration-500 ease-out">
          {activeTab === "dashboard" ? (
            <DashboardView
              snapshot={MOCK_SNAPSHOT}
              isLoading={false}
              refreshTrigger={0}
              onUpdate={handleRefresh}
              isPassiveMode={false}
              incomeEvents={MOCK_INCOME_EVENTS}
              demoPendingAllocations={MOCK_PENDING_ALLOCATIONS}
              isDemoMode={true}
            />
          ) : (
            <div className="flex flex-col items-center justify-center h-full p-8 text-center space-y-6">
              <div className="w-16 h-16 bg-slate-100 rounded-2xl flex items-center justify-center text-slate-400 mb-4">
                <AlertTriangle size={32} />
              </div>
              <h2 className="text-2xl font-black text-slate-800 tracking-tight">
                Explore the Full App
              </h2>
              <p className="text-slate-500 max-w-md mx-auto">
                This demo focuses on the Dashboard Overview. Create a free
                account to unlock the Ledger, Panic Mode, and history tracking.
              </p>
              <Link
                href="/signup"
                className="px-8 py-4 bg-slate-900 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-black transition-all active:scale-[0.98] shadow-xl"
              >
                Get Started Free
              </Link>
              <button
                onClick={() => setActiveTab("dashboard")}
                className="text-xs font-bold text-slate-400 hover:text-slate-600"
              >
                Back to Dashboard
              </button>
            </div>
          )}
        </main>

        {/* Mobile Nav */}
        <MobileNav activeTab={activeTab} setActiveTab={setActiveTab} />
      </div>
    </div>
  );
}
