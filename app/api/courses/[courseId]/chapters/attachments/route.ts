import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import ChapterModel from "@/lib/models/chapter-model";

// Ported from lms-backend/controllers/chapter-controller.js:addChapterAttachment
// NB: the original backend endpoint was actually `/api/chapters/:chapterId/attachments`
// (keyed by chapterId, not courseId) and matched on `{ _id: chapterId, userId }`.
// This Next route was calling it with `courseId` in the URL slot, which only
// happened to work because of how the caller passed values — verify the
// caller (attachments-form / chapter-video-form) sends the right id.

export async function POST(
  req: Request,
  { params }: { params: Promise<{ courseId: string }> }
) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return new NextResponse("Unauthorized access denied", { status: 401 });
    }

    const { courseId: chapterId } = await params; // see note above
    const { url } = await req.json();

    await connectDB();
    const chapter = await ChapterModel.findOne({ _id: chapterId, userId });
    if (!chapter) {
      return NextResponse.json({ msg: "Chapter not found" }, { status: 404 });
    }

    chapter.attachments.push(url);
    await chapter.save();

    return NextResponse.json(chapter);
  } catch (error) {
    console.log("course attachments api post", error);
    return new NextResponse("internal error course attachments", { status: 500 });
  }
}
