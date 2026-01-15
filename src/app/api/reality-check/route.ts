import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

/**
 * POST /api/reality-check
 * Record reality check acknowledgment
 * TRD: "User-triggered only, no enforcement or blocking"
 */
export async function POST() {
  try {
    const supabase = await createClient();

    // Get authenticated user
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    // Update last_reality_check timestamp
    const { data, error } = await supabase
      .from("users")
      .update({ last_reality_check: new Date().toISOString() })
      .eq("id", user.id)
      .select("last_reality_check")
      .single();

    if (error) {
      throw new Error(`Failed to update reality check: ${error.message}`);
    }

    return NextResponse.json({
      success: true,
      data: {
        last_reality_check: data.last_reality_check,
      },
    });
  } catch (error) {
    console.error("Error recording reality check:", error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Internal server error",
      },
      { status: 500 }
    );
  }
}

/**
 * GET /api/reality-check
 * Get last reality check timestamp
 */
export async function GET() {
  try {
    const supabase = await createClient();

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { data, error } = await supabase
      .from("users")
      .select("last_reality_check")
      .eq("id", user.id)
      .single();

    if (error) {
      throw new Error(`Failed to fetch reality check: ${error.message}`);
    }

    return NextResponse.json({
      success: true,
      data: {
        last_reality_check: data.last_reality_check,
      },
    });
  } catch (error) {
    console.error("Error fetching reality check:", error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Internal server error",
      },
      { status: 500 }
    );
  }
}
