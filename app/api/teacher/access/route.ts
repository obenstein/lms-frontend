import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import CourseAccessModel from "@/lib/models/course-access-model";

// Ported from lms-backend/controllers/course-access-controller.js (grantAccess, revokeAccess)

export async function POST(req: Request) {
  try {
    const { studentId, courseId, title } = await req.json();

    if (!studentId || !courseId) {
      return NextResponse.json(
        { message: "Missing studentId or courseId" },
        { status: 400 }
      );
    }

    await connectDB();
    const access = await CourseAccessModel.create({ studentId, courseId, title });

    return NextResponse.json(access);
  } catch (error) {
    console.error("[ACCESS_POST_ERROR]", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const { studentId, courseId } = await req.json();

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
