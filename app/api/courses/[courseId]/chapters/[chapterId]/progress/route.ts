import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import ChapterModel from "@/lib/models/chapter-model";

interface RouteParams {
  params: Promise<{ courseId: string; chapterId: string }>;
}

// Ported from lms-backend/controllers/chapter-controller.js:updateChapetrProgress

export async function POST(req: Request, { params }: RouteParams) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return new NextResponse("Unauthorized access denied", { status: 401 });
    }
    const { courseId, chapterId } = await params;
    const { isCompleted } = await req.json();

    await connectDB();
    const chapter = await ChapterModel.findOne({ _id: chapterId, courseId });
    if (!chapter) {
      return new NextResponse("Chapter not found", { status: 404 });
    }

    chapter.isCompleted.set(userId, isCompleted);
    await chapter.save();

    return NextResponse.json(chapter);
  } catch (error) {
    console.log("coursesid chapterid progress", error);
    return new NextResponse("internal error api chapterId progress", { status: 500 });
  }
}
