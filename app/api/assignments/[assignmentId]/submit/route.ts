import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import SubmissionModel from "@/lib/models/submission-model";

// The file-upload path here already goes through /api/uploadthing (not the
// Express backend) — untouched. Only the final `axios.post(.../submissions)`
// call is ported, from lms-backend/controllers/submission-controller.js:submitAssignment.

export async function POST(req: Request, context: { params: Promise<{ assignmentId: string }> }) {
  try {
    const { userId } = await auth();
    if (!userId) return new NextResponse("Unauthorized", { status: 401 });

    const { assignmentId } = await context.params;

    let fileUrl = "";

    if (req.headers.get("content-type")?.includes("application/json")) {
      const body = await req.json();
      fileUrl = body.fileUrl;
    } else {
      const formData = await req.formData();
      const file = formData.get("submission") as File;

      if (!file) return new NextResponse("No file provided", { status: 400 });

      const uploadRes = await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/uploadthing`, {
        method: "POST",
        headers: { slug: "assignmentSubmission" },
        body: formData,
      });

      if (!uploadRes.ok) {
        console.error("Uploadthing failed", await uploadRes.text());
        return new NextResponse("File upload failed", { status: 500 });
      }

      const uploadData = await uploadRes.json();
      fileUrl = uploadData?.[0]?.url;
    }

    if (!fileUrl) return new NextResponse("File upload failed", { status: 500 });

    await connectDB();
    const submission = await SubmissionModel.create({
      studentId: userId,
      assignmentId,
      fileUrl,
      submittedAt: new Date().toISOString(),
      status: "submitted",
    });

    return NextResponse.json({ message: "Submission successful", data: submission });
  } catch (error) {
    console.error("[ASSIGNMENT_SUBMIT]", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
