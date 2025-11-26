import { NextResponse } from "next/server";
import axios from "axios";
// import { auth } from "@clerk/nextjs";
import { auth } from "@clerk/nextjs/server";
export async function POST(
  req: Request,
  context: { params: Promise<{ courseId: string }> } // <-- params is a Promise
) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return new NextResponse("Unauthorized access denied", { status: 401 });
    }

    const { courseId } = await context.params; // <-- MUST await this
    const values = await req.json();

    const chapter = await axios.post(
      `${process.env.BACK_END_URL}/api/chapters`,
      {
        ...values,
        courseId,
        userId,
      }
    );

    return new NextResponse(JSON.stringify(chapter.data), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });

  } catch (error) {
    console.log("/api/courses/chapters", error);
    return new NextResponse(
      "Internal server error api/courses/courseId/chapters",
      { status: 500 }
    );
  }
}
