import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import StudentProgressModel from "@/lib/models/student-progress-model";

// ⚠️ The original route called `${BACK_END_URL}/api/progress/${courseId}/user/${userId}`,
// which was never a real backend route (Express only mounted
// `/api/student-progress/...`). This call was 404'ing in production before
// the backend even went down. Ported here using the actual matching logic
// from lms-backend/controllers/student-progress-controller.js:getCourseProgress,
// which is what this endpoint was clearly meant to call.

export async function GET(
  req: Request,
  { params }: { params: Promise<{ courseId: string }> }
) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const { courseId } = await params;
    const { searchParams } = new URL(req.url);
    const requestedUserId = searchParams.get("userId");

    if (requestedUserId !== userId) {
      return new NextResponse("Forbidden", { status: 403 });
    }

    await connectDB();
    const progressRecords = await StudentProgressModel.find({
      studentId: userId,
      courseId,
    }).populate("chapterId", "title position");

    const completedChapters = progressRecords.filter((p) => p.completed).length;
    const totalChapters = progressRecords.length;
    const progressPercentage =
      totalChapters > 0 ? (completedChapters / totalChapters) * 100 : 0;

    const progressData = {
      userId,
      courseId,
      completedChapters,
      totalChapters,
      progressPercentage,
      chapters: progressRecords.reduce((acc: Record<string, unknown>, record: any) => {
        acc[record.chapterId._id] = {
          isCompleted: record.completed,
          completedAt: record.lastWatchedAt,
          chapterTitle: record.chapterId.title,
          position: record.chapterId.position,
        };
        return acc;
      }, {}),
    };

    return NextResponse.json(progressData);
  } catch (error) {
    console.log("[COURSE_PROGRESS_GET]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
