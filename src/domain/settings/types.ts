// TRD Section 2: User Settings Domain Types
// PRD Flow 5: Read-Only / Passive Mode

/**
 * User Settings
 *
 * PRD: "User can view estimates without confirming actions"
 * TRD: "Read-only users see pending assumptions and degradation indicators"
 * TRD: "System remains fully useful without confirmations"
 */
export interface UserSettings {
  isPassiveMode: boolean;
  lastRealityCheck: string | null;
}

/**
 * Update User Settings Request
 */
export interface UpdateUserSettingsRequest {
  isPassiveMode?: boolean;
}
