import { createBrowserClient } from "@supabase/ssr";
import type { SupabaseClient } from "@supabase/supabase-js";

let client: SupabaseClient | null = null;

/**
 * Client-side Supabase client.
 * This should only be used in Client Components.
 *
 * Uses singleton pattern to prevent multiple client instances.
 */
export function createClient() {
  // Get environment variables
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error(
      "Missing Supabase environment variables. " +
        "Please ensure NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY are set in your .env file. " +
        "See .env.example for reference."
    );
  }

  // Return existing client if already created
  if (client) {
    return client;
  }

  // Create new client
  client = createBrowserClient(supabaseUrl, supabaseAnonKey);

  return client;
}
