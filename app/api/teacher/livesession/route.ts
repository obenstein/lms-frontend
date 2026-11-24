import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import LiveSessionModel from "@/lib/models/live-session-model";
import { requireTeacher } from "@/lib/auth-guards";

// Ported from lms-backend/controllers/live-session-controller.js:createSession

export async function POST(req: Request) {
  try {
    const guard = await requireTeacher();
    if (guard.error) return guard.error;

    const {
      title,
      description,
      startTime,
      invitees: [studentId],
      joinLink,
    } = await req.json();

    if (!studentId) {
      return NextResponse.json({ message: "Missing studentId" }, { status: 400 });
    }

    await connectDB();
    const session = await LiveSessionModel.create({
      title,
      description,
      startTime,
      invitees: [studentId],
      joinLink,
    });

    return NextResponse.json(session);
  } catch (error) {
    console.error("[LIVE_SESSION_POST_ERROR]", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}
