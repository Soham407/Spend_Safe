"use client";

import { useState, useEffect, useMemo } from "react";
import { Sidebar } from "@/ui/components/Sidebar";
import { IconRail } from "@/ui/components/IconRail";
import { IncomeModal } from "@/ui/components/IncomeModal";
import { RealityCheckModal } from "@/ui/components/RealityCheckModal";
import { PendingActionsSection, RecentExecutionSection } from "@/ui/allocations/AllocationList";
import { COPY } from "@/copy/en";
import { AssumptionState } from "@/domain/assumptions/types";
import {
  Plus,
  UserCircle,
  LayoutDashboard,
  Library,
  ShieldAlert,
  History,
  Target,
  Clock,
  Sparkles,
  RefreshCw,
} from "lucide-react";

// Constants
const DEGRADATION_THRESHOLDS = {
  MEDIUM: 3 * 24 * 60 * 60 * 1000, // 3 days
  HIGH: 7 * 24 * 60 * 60 * 1000, // 7 days
};

interface IncomeEventData {
  id: string;
  amount: number;
  event_date: string;
  savings_rate: number;
  created_at: string;
  state?: AssumptionState;
}

interface SnapshotData {
  safe_to_spend: number;
  total_income: number;
  estimated_savings: number;
  confirmed_safe_to_spend: number;
  pending_count: number;
  oldest_pending_age_days: number;
  degradation_level: string;
  income_event_count: number;
}

interface PanicSnapshotData {
  confirmed_safe_to_spend: number;
  confirmed_income: number;
  confirmed_savings: number;
  confirmed_count: number;
  pending_safe_to_spend: number;
  pending_income: number;
  pending_savings: number;
  pending_count: number;
  deferred_safe_to_spend: number;
  deferred_income: number;
  deferred_savings: number;
  deferred_count: number;
  total_income: number;
  total_estimated_savings: number;
  total_safe_to_spend: number;
  oldest_pending_age_days: number;
  degradation_level: string;
  income_event_count: number;
  calculated_at: string;
  event_breakdown: Array<{
    income_event_id: string;
    event_date: string;
    amount: number;
    savings_rate: number;
    safe_to_spend: number;
    state: AssumptionState;
    age_days: number;
  }>;
}

// Panic Button View Component
function PanicButtonView({ refreshTrigger }: { refreshTrigger: number }) {
  const [panicData, setPanicData] = useState<PanicSnapshotData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchPanicSnapshot = async () => {
      try {
        setIsLoading(true);
        const response = await fetch("/api/panic-snapshot");
        const result = await response.json();
        if (result.success) {
          setPanicData(result.data);
        }
      } catch (err) {
        console.error("Failed to fetch panic snapshot:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPanicSnapshot();
  }, [refreshTrigger]);

  if (isLoading || !panicData) {
    return (
      <div className="max-w-4xl mx-auto py-8 md:py-16 text-center">
        <RefreshCw className="animate-spin mx-auto text-slate-300" size={48} />
        <p className="text-slate-400 mt-4 font-bold text-sm">Loading conservative view...</p>
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
            {panicData.event_breakdown.map((event) => (
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
            ))}
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


export default function HomePage() {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [snapshot, setSnapshot] = useState<SnapshotData | null>(null);
  const [incomeEvents, setIncomeEvents] = useState<IncomeEventData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [lastRealityCheck, setLastRealityCheck] = useState<number>(Date.now());
  const [showRealityCheck, setShowRealityCheck] = useState(false);
  const [userName] = useState("Freelancer");

  // Fetch data
  const fetchData = async () => {
    try {
      setIsLoading(true);
      const [snapshotRes, eventsRes, realityCheckRes] = await Promise.all([
        fetch("/api/estimates/safe-to-spend"),
        fetch("/api/income-events"),
        fetch("/api/reality-check"),
      ]);
      
      const snapshotData = await snapshotRes.json();
      if (snapshotData.success) {
        setSnapshot(snapshotData.data);

        // Check if reality check should be triggered
        const realityCheckData = await realityCheckRes.json();
        const lastCheck = realityCheckData.success && realityCheckData.data.last_reality_check
          ? new Date(realityCheckData.data.last_reality_check).getTime()
          : null;

        const oldestAge = snapshotData.data.oldest_pending_age_days || 0;
        
        // Trigger reality check if:
        // 1. Never checked before and has old pending items (>= 7 days)
        // 2. Last check was > 7 days ago and has pending items >= 3 days old
        const shouldShow = lastCheck
          ? (Date.now() - lastCheck) / (1000 * 60 * 60 * 24) >= 7 && oldestAge >= 3
          : oldestAge >= 7;

        if (shouldShow && snapshotData.data.pending_count > 0) {
          setShowRealityCheck(true);
        }
      }

      const eventsData = await eventsRes.json();
      if (eventsData.success) {
        setIncomeEvents(eventsData.data || []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [refreshTrigger]);

  // Get degradation level from API
  const degradationLevel = useMemo(() => {
    if (!snapshot) return "low";
    return snapshot.degradation_level as "low" | "medium" | "high";
  }, [snapshot]);

  // Counts for sidebar
  const counts = useMemo(
    () => ({
      pending: snapshot?.pending_count || 0,
      confirmed: (snapshot?.income_event_count || 0) - (snapshot?.pending_count || 0),
    }),
    [snapshot]
  );

  // Handle income submission
  const handleAddIncome = async (data: {
    amount: number;
    event_date: string;
    savings_rate: number;
    notes?: string;
  }) => {
    const response = await fetch("/api/income-events", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    const result = await response.json();
    if (!result.success) {
      throw new Error(result.error || "Failed to record income");
    }
    setRefreshTrigger((prev) => prev + 1);
  };

  const handleDataUpdate = () => {
    setRefreshTrigger((prev) => prev + 1);
  };

  const performRealityCheck = async () => {
    try {
      // Call API to record acknowledgment
      await fetch("/api/reality-check", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });
      setLastRealityCheck(Date.now());
      setShowRealityCheck(false);
    } catch (err) {
      console.error("Failed to record reality check:", err);
      // Still close modal even if API fails
      setShowRealityCheck(false);
    }
  };

  const confirmedSafeToSpend = snapshot?.confirmed_safe_to_spend || 0;
  const safeToSpend = snapshot?.safe_to_spend || 0;
  const allocatedGap = safeToSpend - confirmedSafeToSpend;

  return (
    <div className="flex flex-col md:flex-row h-screen w-full gap-0 md:gap-4 overflow-hidden relative bg-[#F0F2F5]">
      <IconRail />
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        counts={counts}
        userName={userName}
      />

      <main className="flex-1 flex flex-col overflow-hidden relative md:glass-panel md:rounded-[32px] p-5 md:p-10 mb-[72px] md:mb-0 md:my-6 md:mr-6">
        {/* Reality Check Modal */}
        <RealityCheckModal
          isOpen={showRealityCheck}
          onAcknowledge={performRealityCheck}
          pendingCount={snapshot?.pending_count || 0}
          oldestPendingAge={snapshot?.oldest_pending_age_days || 0}
          degradationLevel={degradationLevel}
        />

        {/* Mobile Header */}
        <div className="md:hidden flex items-center justify-between mb-8">
          <button
            onClick={() => setActiveTab("profile")}
            className="flex items-center space-x-3"
          >
            <div className="w-10 h-10 rounded-xl rail-bg flex items-center justify-center shadow-lg">
              <UserCircle className="text-white" size={20} />
            </div>
            <div>
              <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">
                Profile
              </p>
              <span className="font-black text-slate-800 text-sm tracking-tight">
                {userName}
              </span>
            </div>
          </button>
          <button
            onClick={() => setIsModalOpen(true)}
            className="w-10 h-10 neo-outset rounded-xl flex items-center justify-center"
          >
            <Plus size={20} className="text-slate-600" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto pr-0 md:pr-4 custom-scrollbar">
          {/* Dashboard Tab */}
          {activeTab === "dashboard" && (
            <div className="max-w-4xl mx-auto space-y-12 md:space-y-16 py-2 md:py-6">
              {/* Header */}
              <header className="hidden md:flex justify-between items-end">
                <div className="space-y-1">
                  <h1 className="text-4xl font-black text-slate-800 tracking-tight">
                    Overview
                  </h1>
                  <div className="flex items-center space-x-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    <p className="text-[12px] text-slate-400 font-bold tracking-wide uppercase">
                      Real-time Assumption Engine
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setIsModalOpen(true)}
                  className="group flex items-center space-x-3 px-6 py-3.5 neo-outset rounded-2xl hover:bg-white transition-all active:scale-95 border border-white/50"
                >
                  <Plus
                    size={18}
                    className="text-slate-600 group-hover:rotate-90 transition-transform"
                  />
                  <span className="text-[11px] font-black uppercase tracking-widest text-slate-700">
                    Record Assumption
                  </span>
                </button>
              </header>

              {/* Major Metric View */}
              <div className="relative space-y-6">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-3">
                    <p className="text-[10px] md:text-[12px] font-black text-slate-400 uppercase tracking-widest">
                      {COPY.SAFE_TO_SPEND_LABEL}
                    </p>
                    <div
                      className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-tighter ${
                        degradationLevel === "low"
                          ? "bg-emerald-50 text-emerald-600"
                          : degradationLevel === "medium"
                          ? "bg-amber-50 text-amber-600"
                          : "bg-rose-50 text-rose-600"
                      }`}
                    >
                      {degradationLevel} Freshness
                    </div>
                  </div>
                </div>

                <div className="flex flex-col md:flex-row md:items-baseline md:gap-8">
                  <h2 className="text-[84px] md:text-[140px] leading-[0.9] font-black text-slate-800 tracking-tighter -ml-1 flex items-start">
                    <span className="text-4xl md:text-6xl mt-2 md:mt-4 mr-1 md:mr-2 text-slate-300">
                      $
                    </span>
                    {isLoading ? "---" : Math.floor(safeToSpend).toLocaleString()}
                  </h2>
                  <div className="mt-4 md:mt-0 flex items-center space-x-6">
                    <div className="space-y-1">
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                        Hard Confirmation
                      </p>
                      <p className="text-xl md:text-2xl font-black text-emerald-600 tracking-tight">
                        ${Math.floor(confirmedSafeToSpend).toLocaleString()}
                      </p>
                    </div>
                    <div className="w-px h-10 bg-slate-200" />
                    <div className="space-y-1">
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                        Allocated Gap
                      </p>
                      <p className="text-xl md:text-2xl font-black text-indigo-600 tracking-tight">
                        ${Math.floor(allocatedGap).toLocaleString()}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Freshness Progress Bar */}
                <div className="w-full h-1.5 neo-inset rounded-full overflow-hidden">
                  <div
                    className={`h-full transition-all duration-1000 ${
                      degradationLevel === "low"
                        ? "bg-emerald-500"
                        : degradationLevel === "medium"
                        ? "bg-amber-500"
                        : "bg-rose-500"
                    }`}
                    style={{
                      width: `${Math.max(10, 100 - (counts.pending * 15))}%`,
                    }}
                  />
                </div>
              </div>

              {/* Core Feature Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-6">
                <PendingActionsSection
                  refreshTrigger={refreshTrigger}
                  onUpdate={handleDataUpdate}
                />
                <RecentExecutionSection events={[]} />
              </div>

              {/* Disclaimer */}
              <div className="text-center pt-8">
                <p className="text-[10px] text-slate-400 font-medium">
                  {COPY.SAFE_TO_SPEND_DISCLAIMER}
                </p>
              </div>
            </div>
          )}

          {/* Ledger Tab */}
          {activeTab === "income" && (
            <div className="max-w-4xl mx-auto space-y-10 py-2 md:py-6">
              <header className="flex justify-between items-start">
                <div>
                  <h1 className="text-3xl md:text-4xl font-black text-slate-800 tracking-tight">
                    Ledger
                  </h1>
                  <p className="text-[10px] md:text-xs text-slate-400 mt-1 font-bold tracking-wide uppercase">
                    Historical Assumption Timeline
                  </p>
                </div>
                <button
                  onClick={() => setIsModalOpen(true)}
                  className="flex items-center space-x-2 px-6 py-3 neo-outset rounded-2xl font-black text-[10px] uppercase tracking-widest text-slate-700 hover:bg-white transition-all shadow-sm"
                >
                  <Plus size={16} />
                  <span>Log Income</span>
                </button>
              </header>

              <div className="neo-inset rounded-[40px] overflow-hidden border border-white/20">
                <table className="hidden md:table w-full text-left">
                  <thead className="bg-slate-50/50 border-b border-slate-200">
                    <tr>
                      <th className="px-10 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                        Effective Date
                      </th>
                      <th className="px-10 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                        Gross Captured
                      </th>
                      <th className="px-10 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">
                        Assumed Rate
                      </th>
                      <th className="px-10 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                        Safe Exposure
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
                          No records captured.
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
                          Safe: ${(e.amount * (1 - e.savings_rate)).toLocaleString()}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Panic Button Tab */}
          {activeTab === "panic" && (
            <PanicButtonView refreshTrigger={refreshTrigger} />
          )}

          {/* Profile Tab */}
          {activeTab === "profile" && (
            <div className="max-w-xl mx-auto py-8 md:py-16 space-y-12">
              <header className="text-center space-y-6">
                <div className="w-28 h-28 md:w-36 md:h-36 mx-auto rounded-[48px] neo-outset flex items-center justify-center text-slate-300 bg-white border border-white">
                  <UserCircle size={80} strokeWidth={1} />
                </div>
                <div className="space-y-1">
                  <h1 className="text-3xl md:text-5xl font-black text-slate-800 tracking-tight">
                    Profile & Preferences
                  </h1>
                  <p className="text-slate-400 font-bold text-[10px] md:text-xs uppercase tracking-[0.2em]">
                    Global Assumption Settings
                  </p>
                </div>
              </header>

              <div className="neo-inset p-8 md:p-12 rounded-[50px] space-y-10 border border-white/20">
                <div className="pt-8 border-t border-slate-200/50 space-y-5">
                  <div className="flex justify-between items-center px-2">
                    <div className="flex items-center space-x-2">
                      <Clock size={14} className="text-slate-300" />
                      <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                        Last Check-In
                      </span>
                    </div>
                    <span className="text-[12px] font-bold text-slate-700">
                      {new Date(lastRealityCheck).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="flex justify-between items-center px-2">
                    <div className="flex items-center space-x-2">
                      <Target size={14} className="text-slate-300" />
                      <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                        Data Privacy
                      </span>
                    </div>
                    <span className="text-[11px] font-black text-emerald-600 uppercase tracking-tighter">
                      Server-Side Secured
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => setActiveTab("dashboard")}
                  className="w-full py-5 bg-slate-900 text-white rounded-[32px] font-black text-[12px] uppercase tracking-widest hover:bg-black transition-all shadow-2xl active:scale-[0.98]"
                >
                  Back to Dashboard
                </button>
              </div>
            </div>
          )}

          {/* History Tab */}
          {activeTab === "history" && (
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
          )}
        </div>

        {/* Income Modal */}
        <IncomeModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSubmit={handleAddIncome}
          initialRate={0.3}
        />
      </main>

      {/* Mobile Bottom Navigation */}
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
    </div>
  );
}
