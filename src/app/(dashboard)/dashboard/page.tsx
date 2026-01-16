"use client";

import { useState, useEffect } from "react";
import { Sidebar } from "@/components/Sidebar";
import { IconRail } from "@/components/IconRail";
import { IncomeModal } from "@/features/income/components/IncomeModal";
import { RealityCheckModal } from "@/features/assumptions/components/RealityCheckModal";
import { MobileNav } from "@/components/MobileNav";
import { DashboardView } from "@/features/dashboard/DashboardView";
import { LedgerView } from "@/features/income/LedgerView";
import { PanicView } from "@/features/panic/PanicView";
import { ProfileView } from "@/features/profile/ProfileView";
import { HistoryView } from "@/features/history/HistoryView";
import { useSpendSafeData } from "@/hooks/useSpendSafeData";
import { useRouter } from "next/navigation";

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showRealityCheck, setShowRealityCheck] = useState(false);
  const router = useRouter();

  // Hook usage
  const {
    snapshot,
    incomeEvents,
    isPassiveMode,
    lastRealityCheck,
    isLoading,
    refreshTrigger,
    triggerRefresh,
    updatePassiveMode,
    addIncome,
    acknowledgeRealityCheck,
    shouldShowRealityCheck,
  } = useSpendSafeData();

  // Effects
  useEffect(() => {
    if (shouldShowRealityCheck) {
      setShowRealityCheck(true);
    }
  }, [shouldShowRealityCheck]);

  useEffect(() => {
    const handleOpenModal = () => setIsModalOpen(true);
    window.addEventListener("open-income-modal", handleOpenModal);
    return () =>
      window.removeEventListener("open-income-modal", handleOpenModal);
  }, []);

  const handleAddIncome = async (data: any) => {
    await addIncome(data);
    setIsModalOpen(false);
  };

  const handleAcknowledgeRealityCheck = async () => {
    await acknowledgeRealityCheck();
    setShowRealityCheck(false);
  };

  // Fetch user data
  const [userEmail, setUserEmail] = useState("User");

  useEffect(() => {
    const fetchUser = async () => {
      const { createClient } = await import("@/lib/supabase/client");
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (user?.email) {
        setUserEmail(user.email);
      } else {
        // Double check auth state - middleware matches, but client check is safe
        // router.push("/login");
      }
    };
    fetchUser();
  }, []);

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden font-sans selection:bg-indigo-100 selection:text-indigo-900">
      {/* Sidebar */}
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        counts={{ pending: snapshot?.pending_count || 0, confirmed: 0 }}
        userName={userEmail}
      />
      <IconRail />

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto relative no-scrollbar pb-20 md:pb-0 transition-all duration-500 ease-out">
        {/* Render Views based on activeTab */}
        {activeTab === "dashboard" && (
          <DashboardView
            snapshot={snapshot}
            isLoading={isLoading}
            refreshTrigger={refreshTrigger}
            onUpdate={triggerRefresh}
            isPassiveMode={isPassiveMode}
            incomeEvents={incomeEvents}
          />
        )}
        {activeTab === "income" && (
          <LedgerView incomeEvents={incomeEvents} onUpdate={triggerRefresh} />
        )}
        {activeTab === "panic" && <PanicView refreshTrigger={refreshTrigger} />}
        {activeTab === "profile" && (
          <ProfileView
            isPassiveMode={isPassiveMode}
            onTogglePassiveMode={updatePassiveMode}
            lastRealityCheck={lastRealityCheck}
          />
        )}
        {activeTab === "history" && <HistoryView />}
      </main>

      {/* Income Modal */}
      <IncomeModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleAddIncome}
        initialRate={0.3}
      />

      {/* Reality Check Modal */}
      <RealityCheckModal
        isOpen={showRealityCheck && !!snapshot}
        onAcknowledge={handleAcknowledgeRealityCheck}
        pendingCount={snapshot?.pending_count || 0}
        oldestPendingAge={snapshot?.oldest_pending_age_days || 0}
        degradationLevel={(snapshot?.degradation_level as any) || "low"}
      />

      {/* Mobile Nav */}
      <MobileNav activeTab={activeTab} setActiveTab={setActiveTab} />
    </div>
  );
}
