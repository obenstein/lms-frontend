import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import LiveSessionModel from "@/lib/models/live-session-model";

// Ported from lms-backend/controllers/live-session-controller.js.
// NB: the dynamic segment is named [studentId] for all three handlers, but
// it's only actually a student id in GET (getSessionsByStudent, filters by
// `invitees`). In DELETE/PATCH it was forwarded as the backend's `:id` param
// (deleteSession/updateSession — i.e. the *session's* _id, not a student).
// Preserved as-is; consider renaming the folder to [sessionId] and splitting
// this into two routes if that confusion causes real bugs later.

export async function GET(
  req: Request,
  { params }: { params: Promise<{ studentId: string }> }
) {
  const { studentId } = await params;
  try {
    if (!studentId) {
      return NextResponse.json({ message: "Missing studentId" }, { status: 400 });
    }

    await connectDB();
    const sessions = await LiveSessionModel.find({ invitees: studentId }).sort({
      startTime: -1,
    });

    return NextResponse.json(sessions);
  } catch (error) {
    console.error("[LIVE_SESSION_GET_ERROR]", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ studentId: string }> }
) {
  // `studentId` here is actually the session's _id — see note above.
  const { studentId: sessionId } = await params;
  try {
    if (!sessionId) {
      return NextResponse.json({ message: "Missing studentId" }, { status: 400 });
    }

    await connectDB();
    const session = await LiveSessionModel.findByIdAndDelete(sessionId);
    if (!session) {
      return NextResponse.json({ message: "Session not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Live session deleted successfully" });
  } catch (error) {
    console.error("[LIVE_SESSION_DELETE_ERROR]", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ studentId: string }> }
) {
  // `studentId` here is actually the session's _id — see note above.
  const { studentId: sessionId } = await params;
  try {
    if (!sessionId) {
      return NextResponse.json({ message: "Missing studentId" }, { status: 400 });
    }

    const updatedSession = await req.json();

    await connectDB();
    const session = await LiveSessionModel.findByIdAndUpdate(sessionId, updatedSession, {
      new: true,
    });
    if (!session) {
      return NextResponse.json({ message: "Session not found" }, { status: 404 });
    }

    return NextResponse.json(session);
  } catch (error) {
    console.error("[LIVE_SESSION_PATCH_ERROR]", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}
