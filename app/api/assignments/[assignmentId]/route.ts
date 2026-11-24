import { getAssignmentCourseId, requireCourseAccess } from "@/lib/auth-guards";
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
    const { assignmentId } = await params;

    const courseId = await getAssignmentCourseId(assignmentId);
    if (!courseId) return new NextResponse("Assignment not found", { status: 404 });
    const guard = await requireCourseAccess(courseId);
    if (guard.error) return guard.error;

    await connectDB();
    const assignments = await AssignmentModel.find({ _id: assignmentId });

    return NextResponse.json(assignments);
  } catch (error) {
    console.error("[GET_ASSIGNMENT_DETAIL]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
