import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import ChapterModel from "@/lib/models/chapter-model";

// Ported from lms-backend/controllers/chapter-controller.js:deleteChapterAttachment
// Same param-naming note as the sibling POST route: `courseId` here is
// actually used as the chapter's _id.

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ courseId: string; attachmentIdx: string }> }
) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return new NextResponse("Unauthorized access denied!", { status: 401 });
    }

    const { courseId: chapterId, attachmentIdx } = await params;

    await connectDB();
    const chapter = await ChapterModel.findOne({ _id: chapterId });
    if (!chapter) {
      return NextResponse.json({ msg: "Chapter not found" }, { status: 404 });
    }

    chapter.attachments = chapter.attachments.filter(
      (_attachment, idx) => idx !== parseInt(attachmentIdx, 10)
    );
    await chapter.save();

    return NextResponse.json(chapter);
  } catch (error) {
    console.log("delet attachment url", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
