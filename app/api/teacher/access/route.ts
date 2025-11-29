import { NextResponse } from "next/server";
import axios from "axios";

export async function POST(req: Request) {
  try {
    const { studentId, courseId,title } = await req.json();
    console.log("[ACCESS_POST]", studentId, courseId);

    if (!studentId || !courseId) {
      return NextResponse.json(
        { message: "Missing studentId or courseId" },
        { status: 400 }
      );
    }

    const access = await axios.post(`${process.env.BACK_END_URL}/api/access`, {
      studentId,
      courseId,
      title,
    });

    return NextResponse.json(access.data);
  } catch (error) {
    console.error("[ACCESS_POST_ERROR]", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
export async function DELETE(req: Request) {
  try {
    const { studentId, courseId } = await req.json();

    const res = await axios.delete(`${process.env.BACK_END_URL}/api/access`, {
      data: { studentId, courseId },
    });

    return NextResponse.json({ message: "Access revoked" }, { status: 200 });
  } catch (error) {
    console.error("[ACCESS_DELETE_ERROR]", error);
    return new NextResponse("Failed to revoke access", { status: 500 });
  }
}