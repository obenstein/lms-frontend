import { auth } from "@clerk/nextjs/server";
import axios from "axios";
import { NextResponse } from "next/server";

interface RouteParams {
  params: Promise<{ courseId: string; chapterId: string }>;
}
export async function POST(
  req: Request,
  { params }: RouteParams 
) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return new NextResponse("Unauthorized access denied", { status: 401 });
    }
    const { courseId, chapterId } = await params;


    const { isCompleted } = await req.json();

    const chapterProgress = await axios.post(
    `${process.env.BACK_END_URL}/api/chapters/${chapterId}/course/${courseId}/progress`,
    { userId, isCompleted: isCompleted }
  );

    return NextResponse.json(chapterProgress.data)
  } catch (error) {
    console.log("coursesid chapterid progress", error);
    return new NextResponse("internal error api chapterId progress", {
      status: 500,
    });
  }
}
