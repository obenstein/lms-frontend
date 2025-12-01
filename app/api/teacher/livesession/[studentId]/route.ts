import { NextResponse } from "next/server";
import axios from "axios";
export async function GET(req: Request, { params }: { params: { studentId: string } }) {
  const { studentId } = await params;
  try {
    
    if (!studentId) {
      return NextResponse.json(
        { message: "Missing studentId" },
        { status: 400 }
      );
    }

    const liveSessions = await axios.get(
      `${process.env.BACK_END_URL}/api/live-sessions/student/${studentId}`
    );

    return NextResponse.json(liveSessions.data);
  } catch (error) {
    console.error("[LIVE_SESSION_GET_ERROR]", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}   
export async function DELETE(req: Request, { params }: { params: { studentId: string } }) {


    //studentID contains the Id
  const { studentId } = await params;
  try {
    if (!studentId) {
      return NextResponse.json(
        { message: "Missing studentId" },
        { status: 400 }
      );
    }

    const deleteResponse = await axios.delete(
      `${process.env.BACK_END_URL}/api/live-sessions/${studentId}`
    );



    return NextResponse.json({ message: "Live session deleted successfully" });
  } catch (error) {
    console.error("[LIVE_SESSION_DELETE_ERROR]", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function PATCH(req: Request, { params }: { params: { studentId: string } }) {
  const { studentId } = await params;
  console.log("[LIVE_SESSION_PATCH] studentId:", studentId);
  try {
    if (!studentId) {
      return NextResponse.json(
        { message: "Missing studentId" },
        { status: 400 }
      );
    }
    const updatedSession = await req.json();
    console.log("[LIVE_SESSION_PATCH]",updatedSession);
    const updateResponse = await axios.put(
      `${process.env.BACK_END_URL}/api/live-sessions/${studentId}`,
      updatedSession
    );

    return NextResponse.json(updateResponse.data);
  } catch (error) {
    console.error("[LIVE_SESSION_PATCH_ERROR]", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}