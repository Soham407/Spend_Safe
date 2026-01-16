import { useState, useEffect, useCallback } from "react";
import { IncomeEventData, SnapshotData } from "@/features/common/types";
import { shouldTriggerRealityCheck } from "@/domain/assumptions/degradation";

export function useSpendSafeData() {
  const [snapshot, setSnapshot] = useState<SnapshotData | null>(null);
  const [incomeEvents, setIncomeEvents] = useState<IncomeEventData[]>([]);
  const [isPassiveMode, setIsPassiveMode] = useState(false);
  const [lastRealityCheck, setLastRealityCheck] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const fetchData = useCallback(async () => {
    try {
      setIsLoading(true);
      const [snapshotRes, eventsRes, checkRes, settingsRes] = await Promise.all(
        [
          fetch("/api/estimates/safe-to-spend"),
          fetch("/api/income-events"),
          fetch("/api/reality-check"),
          fetch("/api/settings"),
        ]
      );

      const snapshotData = await snapshotRes.json();
      if (snapshotData.success) {
        setSnapshot(snapshotData.data);
      }

      const eventsData = await eventsRes.json();
      if (eventsData.success) {
        // Parse strings to numbers for UI
        setIncomeEvents(
          (eventsData.data || []).map((e: any) => ({
            ...e,
            amount: parseFloat(e.amount),
            savings_rate: parseFloat(e.savings_rate),
          }))
        );
      }

      const checkData = await checkRes.json();
      if (checkData.success && checkData.data.last_reality_check) {
        setLastRealityCheck(
          new Date(checkData.data.last_reality_check).getTime()
        );
      } else if (checkData.success && !checkData.data.last_reality_check) {
        // Clear stale data when the field is missing
        setLastRealityCheck(null);
      }

      const settingsData = await settingsRes.json();
      if (settingsData.success) {
        setIsPassiveMode(settingsData.data.isPassiveMode || false);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [refreshTrigger, fetchData]);

  const triggerRefresh = () => {
    setRefreshTrigger((prev) => prev + 1);
  };

  const updatePassiveMode = async (enabled: boolean) => {
    try {
      const response = await fetch("/api/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isPassiveMode: enabled }),
      });
      const result = await response.json();
      if (result.success) {
        setIsPassiveMode(result.data.isPassiveMode);
      }
    } catch (err) {
      console.error("Failed to update passive mode:", err);
    }
  };

  const addIncome = async (data: any) => {
    try {
      const response = await fetch("/api/income-events", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error("Failed to add income event");
      }

      await fetchData(); // Refresh data immediately
      return { success: true };
    } catch (err) {
      console.error("Failed to add income:", err);
      return { success: false, error: err };
    }
  };

  const acknowledgeRealityCheck = async () => {
    try {
      const response = await fetch("/api/reality-check", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ outcome: "ACKNOWLEDGED" }), // Assuming enum value
      });

      if (!response.ok) {
        throw new Error("Failed to acknowledge reality check");
      }

      await fetchData();
      return { success: true };
    } catch (err) {
      console.error("Failed to acknowledge:", err);
      return { success: false, error: err };
    }
  };

  const shouldShowRealityCheck = () => {
    if (!snapshot) return false;
    const lastCheckDate = lastRealityCheck ? new Date(lastRealityCheck) : null;
    return shouldTriggerRealityCheck(
      lastCheckDate,
      snapshot.oldest_pending_age_days || 0
    );
  };

  return {
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
    shouldShowRealityCheck: shouldShowRealityCheck(),
  };
}
