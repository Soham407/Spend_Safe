// API Route: User Settings
// PRD Flow 5: Read-Only / Passive Mode
// TRD: "System remains fully useful without confirmations"

import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { z } from "zod";

/**
 * GET /api/settings
 *
 * Fetch current user settings including passive mode preference
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
      .select("is_passive_mode, last_reality_check")
      .eq("id", user.id)
      .single();

    if (error) {
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      data: {
        isPassiveMode: data?.is_passive_mode ?? false,
        lastRealityCheck: data?.last_reality_check ?? null,
      },
    });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message || "Internal server error" },
      { status: 500 }
    );
  }
}

/**
 * PUT /api/settings
 *
 * Update user settings
 * PRD: "No penalties or shaming" - User can freely toggle passive mode
 */
export async function PUT(request: NextRequest) {
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

    const body = await request.json();
    const settingsSchema = z.object({
      isPassiveMode: z.boolean(),
    });

    const parsed = settingsSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid request",
          details: parsed.error.issues,
        },
        { status: 400 }
      );
    }

    const { isPassiveMode } = parsed.data;

    // Update settings
    const { error: updateError } = await supabase
      .from("users")
      .update({ is_passive_mode: isPassiveMode })
      .eq("id", user.id);

    if (updateError) {
      return NextResponse.json(
        { success: false, error: updateError.message },
        { status: 500 }
      );
    }

    // Fetch and return updated settings
    const { data, error: fetchError } = await supabase
      .from("users")
      .select("is_passive_mode, last_reality_check")
      .eq("id", user.id)
      .single();

    if (fetchError) {
      return NextResponse.json(
        { success: false, error: fetchError.message },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      data: {
        isPassiveMode: data?.is_passive_mode ?? false,
        lastRealityCheck: data?.last_reality_check ?? null,
      },
    });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message || "Internal server error" },
      { status: 500 }
    );
  }
}
