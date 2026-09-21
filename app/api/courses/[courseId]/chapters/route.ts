import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { connectDB } from "@/lib/db";
import ChapterModel from "@/lib/models/chapter-model";

// Ported from lms-backend/controllers/chapter-controller.js:addChapter

export async function POST(
  req: Request,
  context: { params: Promise<{ courseId: string }> }
) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return new NextResponse("Unauthorized access denied", { status: 401 });
    }

    const { courseId } = await context.params;
    const values = await req.json();

    await connectDB();
    const chapter = await ChapterModel.create({ ...values, courseId, userId });

    return new NextResponse(JSON.stringify(chapter), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.log("/api/courses/chapters", error);
    return new NextResponse("Internal server error api/courses/courseId/chapters", {
      status: 500,
    });
  }
}
