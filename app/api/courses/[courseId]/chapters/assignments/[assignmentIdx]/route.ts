import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import ChapterModel from "@/lib/models/chapter-model";

// Ported from lms-backend/controllers/chapter-controller.js:deleteChapterAssignment

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ courseId: string; assignmentIdx: string }> }
) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const { courseId: chapterId, assignmentIdx } = await params;

    await connectDB();
    const chapter = await ChapterModel.findOne({ _id: chapterId });
    if (!chapter) {
      return NextResponse.json({ msg: "Chapter not found" }, { status: 404 });
    }

    chapter.assignments = chapter.assignments.filter(
      (_assignment, idx) => idx !== parseInt(assignmentIdx, 10)
    );
    await chapter.save();

    return NextResponse.json(chapter, { status: 200 });
  } catch (error) {
    console.error("[ASSIGNMENT_DELETE]", error);
    return new NextResponse("Failed to delete assignment", { status: 500 });
  }
}
