import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import AssignmentModel from "@/lib/models/assignment-model";

// Ported from lms-backend/controllers/assignment-controller.js:getAssignmentsByChapter
// (despite the name, it looks up by the assignment's own _id — preserved as-is)

export async function GET(
  req: Request,
  { params }: { params: Promise<{ assignmentId: string }> }
) {
  try {
    const { userId } = await auth();
    if (!userId) return new NextResponse("Unauthorized", { status: 401 });

    const { assignmentId } = await params;

    await connectDB();
    const assignments = await AssignmentModel.find({ _id: assignmentId });

    return NextResponse.json(assignments);
  } catch (error) {
    console.error("[GET_ASSIGNMENT_DETAIL]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
