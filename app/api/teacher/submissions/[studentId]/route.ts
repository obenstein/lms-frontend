import axios from "axios";
import { NextResponse } from "next/server";
export async function GET(req: Request, { params }: { params: { studentId: string } }) {
  const { studentId } = await params;

  try {
    if (!studentId) {
      return NextResponse.json(
        { message: "Missing studentId" },
        { status: 400 }
      );
    }

    const response = await axios.get(
      `${process.env.BACK_END_URL}/api/submissions/${studentId}`
    );

    return NextResponse.json(response.data);
  } catch (error) {
    console.error("[LIVE_SESSION_GET_ERROR]", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}