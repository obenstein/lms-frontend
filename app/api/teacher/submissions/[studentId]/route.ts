import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import SubmissionModel from "@/lib/models/submission-model";
import { requireTeacher } from "@/lib/auth-guards";

// Ported from lms-backend/controllers/submission-controller.js:getSubmissionsByStudent

export async function GET(
  req: Request,
  { params }: { params: Promise<{ studentId: string }> }
) {
  const { studentId } = await params;

  try {
    const guard = await requireTeacher();
    if (guard.error) return guard.error;

    if (!studentId) {
      return NextResponse.json({ message: "Missing studentId" }, { status: 400 });
    }

    await connectDB();
    const submissions = await SubmissionModel.find({ studentId });

    return NextResponse.json(submissions);
  } catch (error) {
    console.error("[LIVE_SESSION_GET_ERROR]", error); // label kept from original
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}
