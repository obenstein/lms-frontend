import { auth } from "@clerk/nextjs/server";
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
    const { userId } = await auth();
    if (!userId) {
      return new NextResponse("Unauthorized user", { status: 401 });
    }

    const { courseId } = await params;
    const values = await req.json();

    await connectDB();
    const assignmentId = new mongoose.Types.ObjectId();

    // 1. Add to chapter (courseId here is used as the chapter's _id, matching
    //    the original call to `/api/chapters/:chapterId/assignments`)
    const chapter = await ChapterModel.findOne({ _id: courseId });
    if (!chapter) {
      return NextResponse.json({ msg: "Chapter not found" }, { status: 404 });
    }
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
