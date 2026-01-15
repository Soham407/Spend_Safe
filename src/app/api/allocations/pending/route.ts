
import { NextResponse } from "next/server";
import { getPendingAllocations } from "@/domain/assumptions/actions";

export async function GET() {
  try {
    const pendingAllocations = await getPendingAllocations();
    return NextResponse.json({ success: true, data: pendingAllocations });
  } catch (error) {
    console.error("Error fetching pending allocations:", error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Internal server error",
      },
      { status: 500 }
    );
  }
}
