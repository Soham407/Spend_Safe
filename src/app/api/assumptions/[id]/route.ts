import { NextRequest, NextResponse } from "next/server";
import { updateAssumptionState } from "@/features/assumptions/actions";
import { AssumptionState } from "@/features/assumptions/types";
import { z } from "zod";

const updateSchema = z.object({
  state: z.nativeEnum(AssumptionState),
});

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const validated = updateSchema.parse(body);

    const updatedAssumption = await updateAssumptionState(id, validated.state);

    return NextResponse.json({ success: true, data: updatedAssumption });
  } catch (error) {
    console.error("Error updating assumption:", error);
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, error: "Invalid input", details: error.issues },
        { status: 400 }
      );
    }
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Internal server error",
      },
      { status: 500 }
    );
  }
}
