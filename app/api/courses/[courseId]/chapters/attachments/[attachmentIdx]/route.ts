import { requireChapterOwner } from "@/lib/auth-guards";
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
    const { courseId: chapterId, attachmentIdx } = await params;
    const guard = await requireChapterOwner(chapterId);
    if (guard.error) return guard.error;
    const { chapter } = guard;

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
