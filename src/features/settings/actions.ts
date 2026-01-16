// TRD Section 2: User Settings Actions
// PRD Flow 5: Read-Only / Passive Mode

import { createClient } from "@/lib/supabase/client";
import { UserSettings, UpdateUserSettingsRequest } from "./types";

/**
 * Get current user settings
 *
 * PRD: "User can view estimates without confirming actions"
 * Returns the user's passive mode preference and last reality check timestamp
 */
export async function getUserSettings(): Promise<UserSettings> {
  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    throw new Error("User not authenticated");
  }

  const { data, error } = await supabase
    .from("users")
    .select("is_passive_mode, last_reality_check")
    .eq("id", user.id)
    .single();

  if (error) {
    throw new Error(`Failed to fetch user settings: ${error.message}`);
  }

  return {
    isPassiveMode: data?.is_passive_mode ?? false,
    lastRealityCheck: data?.last_reality_check ?? null,
  };
}

/**
 * Update user settings
 *
 * PRD: "No penalties or shaming"
 * TRD: "System remains fully useful without confirmations"
 *
 * Allows user to toggle passive mode on/off without judgment
 */
export async function updateUserSettings(
  updates: UpdateUserSettingsRequest
): Promise<UserSettings> {
  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    throw new Error("User not authenticated");
  }

  const updateData: Record<string, any> = {};

  if (updates.isPassiveMode !== undefined) {
    updateData.is_passive_mode = updates.isPassiveMode;
  }

  const { error } = await supabase
    .from("users")
    .update(updateData)
    .eq("id", user.id);

  if (error) {
    throw new Error(`Failed to update user settings: ${error.message}`);
  }

  // Fetch and return updated settings
  return getUserSettings();
}
