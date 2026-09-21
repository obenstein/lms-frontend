import { connectDB } from "@/lib/db";
import ChapterModel from "@/lib/models/chapter-model";

// Ported from lms-backend/controllers/chapter-controller.js:getPublishedChapterOfOneCourse
// (this action reused that same endpoint) — now a direct query.

export const getProgress = async (
  userId: string,
  courseId: string
): Promise<number[]> => {
  try {
    await connectDB();

    const publishedChapters = await ChapterModel.find({
      courseId,
      isPublished: true,
    });

    const validCompletedChapters = publishedChapters.filter(
      (chapter) => chapter.isCompleted?.get(userId)
    );

    const progressPercentage =
      (validCompletedChapters.length / publishedChapters.length) * 100;

    return [publishedChapters.length, progressPercentage];
  } catch (error) {
    console.log("[get progress]", error);
    return [0, 0];
  }
};
