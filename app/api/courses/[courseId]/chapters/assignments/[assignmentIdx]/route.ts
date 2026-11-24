import { requireChapterOwner } from "@/lib/auth-guards";
import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import ChapterModel from "@/lib/models/chapter-model";

// Ported from lms-backend/controllers/chapter-controller.js:deleteChapterAssignment

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ courseId: string; assignmentIdx: string }> }
) {
  try {
    const { courseId: chapterId, assignmentIdx } = await params;
    const guard = await requireChapterOwner(chapterId);
    if (guard.error) return guard.error;
    const { chapter } = guard;

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
