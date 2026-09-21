import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import CourseAccessModel from "@/lib/models/course-access-model";

// Ported from lms-backend/controllers/course-access-controller.js:getAccessListByStudent
// NB: original called `.populate("courseId")`, but courseId is stored as a
// plain String (not a Course ref) in the schema, so populate was a silent
// no-op there too — preserved as-is.

export async function GET(
  req: Request,
  { params }: { params: Promise<{ studentId: string }> }
) {
  try {
    const { studentId } = await params;

    if (!studentId) {
      return NextResponse.json({ message: "Missing studentId" }, { status: 400 });
    }

    await connectDB();
    const accessList = await CourseAccessModel.find({ studentId });

    return NextResponse.json(accessList);
  } catch (error) {
    console.error("[ACCESS_GET_ERROR]", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}
