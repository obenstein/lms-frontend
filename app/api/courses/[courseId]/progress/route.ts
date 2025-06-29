// app/api/courses/[courseId]/progress/route.ts
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import axios from "axios";

export async function GET(
  req: Request,
  { params }: { params: { courseId: string } }
) {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const { courseId } = await params;
    const { searchParams } = new URL(req.url);
    const requestedUserId = searchParams.get("userId");

    // Only allow users to access their own progress or if they're the same user
    if (requestedUserId !== userId) {
      return new NextResponse("Forbidden", { status: 403 });
    }

    // Fetch user progress from your backend
    const progressResponse = await axios.get(
      `${process.env.BACK_END_URL}/api/progress/${courseId}/user/${userId}`
    );

    return NextResponse.json(progressResponse.data);
  } catch (error) {
    console.log("[COURSE_PROGRESS_GET]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}