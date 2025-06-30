import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import axios from "axios";

export async function DELETE(
  req: Request,
  { params }: { params: { courseId: string; assignmentIdx: string } }
) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const { courseId, assignmentIdx } = await params;

    const res = await axios.delete(
      `${process.env.BACK_END_URL}/api/chapters/${courseId}/assignments/${assignmentIdx}`,
      {
        data: { userId },
      }
    );

    return NextResponse.json(res.data, { status: 200 });
  } catch (error) {
    console.error("[ASSIGNMENT_DELETE]", error);
    return new NextResponse("Failed to delete assignment", { status: 500 });
  }
}
