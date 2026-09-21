import Mux from "@mux/mux-node";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import CourseModel from "@/lib/models/course-model";
import ChapterModel from "@/lib/models/chapter-model";

const Video = new Mux({
  tokenId: process.env.MUX_TOKEN_ID!,
  tokenSecret: process.env.MUX_TOKEN_SECRET!,
});

// Ported from the ORIGINAL app/api/courses/[courseId]/route.ts.
//
// ⚠️ Both handlers below reproduce pre-existing bugs from the original file,
// preserved intentionally for lift-and-shift parity:
//  - DELETE never actually deletes the course. It only fetched the course's
//    chapters and stopped ("// Rest of your logic..." in the original) —
//    course-controller.js's real `deleteCourse` was never wired to this route.
//  - PATCH looks up "existing mux data" via a path that never matched any
//    real backend route (`/chapters/:chapterId/course/:courseId` shaped
//    wrong), and its result was never used or checked — so it silently did
//    nothing useful even when it didn't throw.
// If course deletion / proper Mux-asset replacement is actually needed here,
// flag it — it can be fixed for real in a follow-up, but this port keeps
// behavior byte-for-byte identical to what was shipping.

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ courseId: string; chapterId: string }> }
) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return new NextResponse("Unauthorized access denied!", { status: 401 });
    }

    const { courseId } = await params;

    await connectDB();
    const courseChapters = await ChapterModel.find({ courseId });
    void courseChapters; // fetched but unused, same as the original

    // Rest of your logic... (unchanged: original never implemented this)
    return new NextResponse(null, { status: 200 });
  } catch (error) {
    console.log("courseId delete", error);
    return new NextResponse("Internal server error courseId delete", { status: 500 });
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ courseId: string; chapterId: string }> }
) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return new NextResponse("Unauthorized user", { status: 401 });
    }

    const { courseId } = await params;
    const values = await req.json();

    await connectDB();
    const course = await CourseModel.findByIdAndUpdate(
      courseId,
      { ...values, userId },
      { new: true }
    );

    if (values.videoUrl) {
      // Unused result, same as original — kept for byte-for-byte parity.
      await Video.video.assets.create({
        inputs: values.videoUrl,
        playback_policies: ["public"],
        test: false,
      });
    }

    return NextResponse.json(course);
  } catch (error) {
    console.log("error at api course courseId", error);
    return new NextResponse("Internal error at course Id", { status: 500 });
  }
}
