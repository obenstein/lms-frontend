import { NextResponse } from "next/server";
import axios from "axios";

export async function POST(req: Request) {
  try {
    const {
      title,
      description,
      startTime,
      invitees: [studentId],
      joinLink,
    } = await req.json();

    console.log("[LIVE_SESSION_POST]");

    if (!studentId) {
      return NextResponse.json(
        { message: "Missing studentId" },
        { status: 400 }
      );
    }
    const liveSessionData = await axios.post(
      `${process.env.BACK_END_URL}/api/live-sessions`,
      {
        title,
        description,
        startTime,
        invitees: [studentId],
        joinLink,
      }
    );

    // Here you would typically create a live session for the student
    // For now, we just return a success message
    return NextResponse.json(liveSessionData.data);
  } catch (error) {
    console.error("[LIVE_SESSION_POST_ERROR]", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
