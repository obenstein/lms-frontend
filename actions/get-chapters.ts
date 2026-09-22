import { connectDB } from "@/lib/db";
import CourseModel from "@/lib/models/course-model";
import ChapterModel from "@/lib/models/chapter-model";
import { toPlain } from "@/lib/serialize";

interface GetChaptersProps {
  userId: string;
  chapterId: string;
  courseId: string;
}

// Ported from lms-backend controllers: course-controller.getOneCourse,
// chapter-controller.getPublishedChapterOfOneCourse.

export const getChapters = async ({ userId, chapterId, courseId }: GetChaptersProps) => {
  try {
    await connectDB();

    const course = await CourseModel.findById(courseId);
    const chapters = await ChapterModel.find({ courseId, isPublished: true });

    const chapter = chapters.find((c) => String(c._id) === chapterId) || null;

    if (!course || !chapter) {
      throw new Error("Course or Chapters is not found!");
    }

    const purchased = true; // TODO: Implement purchase check logic (unchanged from original)
    const isCompleted = chapter.isCompleted?.get(userId);

    let muxData = null;
    let nextChapter: { _id: unknown } | null = null;
    const attachments: string[] = chapter.attachments;

    if (chapter.isFree || purchased) {
      muxData = chapter.playbackId;
      nextChapter = chapters[chapters.indexOf(chapter) + 1] || null;
    }

    return toPlain({
      course,
      chapter,
      muxData,
      attachments,
      nextChapter,
      purchased,
      isCompleted,
    });
  } catch (error) {
    console.log("[Get chapters]", error);
    return {
      chapter: null,
      course: null,
      muxData: null,
      attachments: [],
      nextChapter: null,
      isCompleted: null,
      purchased: null,
    };
  }
};
