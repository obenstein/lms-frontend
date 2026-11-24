import { requireChapterOwner } from "@/lib/auth-guards";
import { NextResponse } from "next/server";
import mongoose from "mongoose";
import { connectDB } from "@/lib/db";
import ChapterModel from "@/lib/models/chapter-model";
import AssignmentModel from "@/lib/models/assignment-model";

// Ported from two backend calls this route used to make:
//  1. chapter-controller.addChapterAssignment (pushes into chapter.assignments[])
//  2. assignment-controller.createAssignment (creates a standalone Assignment doc)
// Same shared-ID pattern as the original: one ObjectId used for both writes.

export async function POST(
  req: Request,
  { params }: { params: Promise<{ courseId: string; chapterId: string }> }
) {
  try {
    // `courseId` here is used as the chapter's _id, matching the original
    // call to `/api/chapters/:chapterId/assignments`.
    const { courseId } = await params;
    const guard = await requireChapterOwner(courseId);
    if (guard.error) return guard.error;
    const { userId, chapter } = guard;

    const values = await req.json();

    await connectDB();
    const assignmentId = new mongoose.Types.ObjectId();

    // 1. Add to chapter
    chapter.assignments.push({
      _id: assignmentId.toString(),
      title: values.title,
      description: values.description,
      dueDate: values.dueDate,
      points: values.points,
      fileUrl: values.fileUrl,
    });
    await chapter.save();

    // 2. Add to assignments collection with same ID
    const assignmentRecord = await AssignmentModel.create({
      _id: assignmentId,
      fileUrl: values.fileUrl,
      chapterId: courseId,
      title: values.title,
      description: values.description,
      dueDate: values.dueDate,
      createdBy: userId,
    });

    return NextResponse.json({
      assignment: assignmentRecord,
      chapterUpdate: chapter,
    });
  } catch (error: any) {
    console.error("[ASSIGNMENT_POST]", error?.message);
    return new NextResponse("Internal error", { status: 500 });
  }
}
