import { connectDB } from "@/lib/db";
import CourseModel from "@/lib/models/course-model";
import ChapterModel from "@/lib/models/chapter-model";
import SubmissionModel from "@/lib/models/submission-model";
import { getCourseEntitlement } from "@/lib/auth-guards";
import {
  describeLock,
  getChapterStatus,
  sortPublishedChapters,
} from "@/lib/course-progression";

interface GetChaptersProps {
  userId: string;
  chapterId: string;
  courseId: string;
}

/**
 * Everything the chapter page shows, or null when the user has no access to
 * the course or the chapter doesn't exist. Locked chapters come back without
 * their video, files and assignments, so those never reach the browser.
 */
export const getChapters = async ({ userId, chapterId, courseId }: GetChaptersProps) => {
  try {
    // Access is granted manually by the teacher, per student and per course
    // (CourseAccess records). The teacher always has access.
    const entitlement = await getCourseEntitlement(userId, courseId);
    if (!entitlement) return null;

    await connectDB();
    const [course, publishedChapters] = await Promise.all([
      CourseModel.findById(courseId),
      ChapterModel.find({ courseId, isPublished: true }),
    ]);

    const chapters = sortPublishedChapters(publishedChapters);
    const index = chapters.findIndex((c) => String(c._id) === chapterId);
    if (!course || index === -1) return null;

    // Weeks open on a schedule, and the second month also needs the teacher's
    // approval (see lib/course-progression.ts).
    const now = new Date();
    const getStatus = (id: string) => getChapterStatus(id, chapters, entitlement, now)!;

    const chapter = chapters[index];
    const status = getStatus(chapterId);
    const isLocked = !status.isUnlocked;

    const describeNeighbour = (neighbour?: (typeof chapters)[number]) => {
      if (!neighbour) return null;
      const id = String(neighbour._id);
      const neighbourStatus = getStatus(id);
      return {
        _id: id,
        title: neighbour.title ?? "Untitled mission",
        isLocked: !neighbourStatus.isUnlocked,
        lockMessage: describeLock(neighbourStatus, now),
      };
    };

    const assignments = isLocked ? [] : chapter.assignments;
    const submissions = assignments.length
      ? await SubmissionModel.find({
          studentId: userId,
          assignmentId: { $in: assignments.map((assignment) => assignment._id) },
        })
          .select("assignmentId")
          .lean()
      : [];
    const submittedIds = new Set(submissions.map((s) => String(s.assignmentId)));

    return {
      title: chapter.title ?? "Untitled mission",
      description: chapter.description ?? "",
      weekNumber: status.weekNumber,
      isCompleted: !!chapter.isCompleted?.get(userId),
      isLocked,
      lockMessage: describeLock(status, now),
      playbackId: isLocked ? null : chapter.playbackId ?? null,
      attachments: isLocked ? [] : [...chapter.attachments],
      assignments: assignments.map((assignment) => ({
        _id: String(assignment._id),
        title: assignment.title,
        points: assignment.points,
        isSubmitted: submittedIds.has(String(assignment._id)),
      })),
      position: index + 1,
      totalChapters: chapters.length,
      completedChapters: chapters.filter((c) => c.isCompleted?.get(userId)).length,
      previousChapter: describeNeighbour(chapters[index - 1]),
      nextChapter: describeNeighbour(chapters[index + 1]),
    };
  } catch (error) {
    console.log("[Get chapters]", error);
    return null;
  }
};
