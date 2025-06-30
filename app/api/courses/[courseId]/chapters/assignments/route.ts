import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import axios from "axios";
import mongoose from "mongoose";

export async function POST(
  req: Request,
  { params }: { params: { courseId: string; chapterId: string } }
) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return new NextResponse("Unauthorized user", { status: 401 });
    }

    const { courseId, chapterId } = await params;
    const values = await req.json();

    const assignmentId = new mongoose.Types.ObjectId(); // generate one shared ID

    // 1. Add to chapter
    const updatedChapter = await axios.post(
      `${process.env.BACK_END_URL}/api/chapters/${courseId}/assignments`,
      {
        _id: assignmentId,
        ...values,
        userId,
      }
    );

    // 2. Add to assignments collection with same ID
    const assignmentRecordRes = await axios.post(
      `${process.env.BACK_END_URL}/api/assignments`,
      {
        _id: assignmentId, // reuse the same ID
        fileUrl: values.fileUrl,
        chapterId:courseId,
        title: values.title,
        description: values.description,
        dueDate: values.dueDate,
        createdBy: userId,
      }
    );

    return NextResponse.json({
      assignment: assignmentRecordRes.data,
      chapterUpdate: updatedChapter.data,
    });
  } catch (error: any) {
    console.error("[ASSIGNMENT_POST]", error?.response?.data || error.message);
    return new NextResponse("Internal error", { status: 500 });
  }
}
