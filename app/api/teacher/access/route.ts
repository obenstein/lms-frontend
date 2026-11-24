import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import CourseAccessModel from "@/lib/models/course-access-model";
import { requireCourseOwner, requireTeacher } from "@/lib/auth-guards";

// Ported from lms-backend/controllers/course-access-controller.js (grantAccess, revokeAccess)

export async function POST(req: Request) {
  try {
    const guard = await requireTeacher();
    if (guard.error) return guard.error;

    const { studentId, courseId, title } = await req.json();

    if (!studentId || !courseId) {
      return NextResponse.json(
        { message: "Missing studentId or courseId" },
        { status: 400 }
      );
    }

    // Only grant access to a course the teacher actually owns.
    const owner = await requireCourseOwner(courseId);
    if (owner.error) return owner.error;

    await connectDB();
    const existing = await CourseAccessModel.findOne({ studentId, courseId });
    if (existing) return NextResponse.json(existing);

    const access = await CourseAccessModel.create({ studentId, courseId, title });

    return NextResponse.json(access);
  } catch (error) {
    console.error("[ACCESS_POST_ERROR]", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}

/**
 * Approve (or withdraw approval for) a student's second month, once the
 * teacher has verified their fees. Body: { studentId, courseId, approved }.
 */
export async function PATCH(req: Request) {
  try {
    const guard = await requireTeacher();
    if (guard.error) return guard.error;

    const { studentId, courseId, approved } = await req.json();

    if (
      typeof studentId !== "string" ||
      typeof courseId !== "string" ||
      !studentId ||
      !courseId ||
      typeof approved !== "boolean"
    ) {
      return NextResponse.json(
        { message: "studentId, courseId and approved (true/false) are required" },
        { status: 400 }
      );
    }

    const owner = await requireCourseOwner(courseId);
    if (owner.error) return owner.error;

    await connectDB();
    const access = await CourseAccessModel.findOneAndUpdate(
      { studentId, courseId },
      {
        $set: {
          secondMonthApprovedAt: approved ? new Date() : null,
          secondMonthApprovedBy: approved ? guard.userId : null,
        },
      },
      { new: true }
    );
    if (!access) {
      return NextResponse.json({ message: "Access not found" }, { status: 404 });
    }

    return NextResponse.json(access);
  } catch (error) {
    console.error("[ACCESS_PATCH_ERROR]", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const guard = await requireTeacher();
    if (guard.error) return guard.error;

    const { studentId, courseId } = await req.json();
    if (!studentId || !courseId) {
      return NextResponse.json(
        { message: "Missing studentId or courseId" },
        { status: 400 }
      );
    }

    await connectDB();
    const result = await CourseAccessModel.findOneAndDelete({ studentId, courseId });
    if (!result) {
      return NextResponse.json({ message: "Access not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Access revoked" }, { status: 200 });
  } catch (error) {
    console.error("[ACCESS_DELETE_ERROR]", error);
    return new NextResponse("Failed to revoke access", { status: 500 });
  }
}
