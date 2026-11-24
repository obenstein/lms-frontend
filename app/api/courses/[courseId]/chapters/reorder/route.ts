import { requireCourseOwner } from "@/lib/auth-guards";
import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import ChapterModel from "@/lib/models/chapter-model";

// Ported from lms-backend/controllers/chapter-controller.js:reorderChapter
// (called once per chapter in the list, same as the original loop of axios calls)

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ courseId: string }> }
) {
  try {
    const { courseId } = await params;
    const guard = await requireCourseOwner(courseId);
    if (guard.error) return guard.error;
    const chapterLists: { id: string; position: number }[] = await req.json();

    await connectDB();
    for (const chapter of chapterLists) {
      await ChapterModel.findOneAndUpdate(
        { _id: chapter.id, courseId },
        { $set: { position: chapter.position } },
        { new: true }
      );
    }

    return new NextResponse("successfully reorderd", { status: 200 });
  } catch (error) {
    console.log("chapter reorder /api/reorder", error);
    return new NextResponse("Internal error api/reorder", { status: 500 });
  }
}
