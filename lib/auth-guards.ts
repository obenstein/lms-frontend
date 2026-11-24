import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { redirect } from "next/navigation";
import mongoose from "mongoose";
import { connectDB } from "@/lib/db";
import CourseModel, { type ICourse } from "@/lib/models/course-model";
import ChapterModel, { type IChapter } from "@/lib/models/chapter-model";
import CourseAccessModel from "@/lib/models/course-access-model";
import AssignmentModel from "@/lib/models/assignment-model";
import { isTeacher } from "@/lib/teacher";

// Shared authorization helpers for API routes and Server Components.
//
// API helpers return either `{ userId, ... }` or `{ error }`, where `error` is
// a ready-to-return NextResponse:
//
//   const guard = await requireTeacher();
//   if (guard.error) return guard.error;
//   const { userId } = guard;

type Fail = { error: NextResponse };

const unauthorized = (): Fail => ({
  error: new NextResponse("Unauthorized", { status: 401 }),
});
const forbidden = (): Fail => ({
  error: new NextResponse("Forbidden", { status: 403 }),
});
const notFound = (what: string): Fail => ({
  error: new NextResponse(`${what} not found`, { status: 404 }),
});

/** Signed-in user who is the teacher. */
export async function requireTeacher(): Promise<{ userId: string; error?: never } | Fail> {
  const { userId } = await auth();
  if (!userId) return unauthorized();
  if (!isTeacher(userId)) return forbidden();
  return { userId };
}

/** Teacher who owns the given course. */
export async function requireCourseOwner(
  courseId: string
): Promise<{ userId: string; course: ICourse; error?: never } | Fail> {
  const guard = await requireTeacher();
  if (guard.error) return guard;

  if (!mongoose.isValidObjectId(courseId)) return notFound("Course");

  await connectDB();
  const course = await CourseModel.findById(courseId);
  if (!course) return notFound("Course");
  if (course.userId !== guard.userId) return forbidden();

  return { userId: guard.userId, course };
}

/**
 * Teacher who owns the course a chapter belongs to. Pass `courseId` when the
 * URL has one, so a chapter can't be edited through another course's URL.
 */
export async function requireChapterOwner(
  chapterId: string,
  courseId?: string
): Promise<{ userId: string; chapter: IChapter; error?: never } | Fail> {
  const guard = await requireTeacher();
  if (guard.error) return guard;

  if (!mongoose.isValidObjectId(chapterId)) return notFound("Chapter");

  await connectDB();
  const chapter = await ChapterModel.findById(chapterId);
  if (!chapter) return notFound("Chapter");
  if (courseId && chapter.courseId !== courseId) return notFound("Chapter");

  const owner = await requireCourseOwner(chapter.courseId);
  if (owner.error) return owner;

  return { userId: guard.userId, chapter };
}

/**
 * True when the user may view a course's content: the teacher, or a student
 * the teacher granted access to this course (CourseAccess record).
 */
export async function hasCourseAccess(
  userId: string | null | undefined,
  courseId: string
): Promise<boolean> {
  if (!userId) return false;
  if (isTeacher(userId)) return true;

  await connectDB();
  const grant = await CourseAccessModel.exists({ studentId: userId, courseId });
  return !!grant;
}

/** Signed-in user with access to the course (teacher or granted student). */
export async function requireCourseAccess(
  courseId: string
): Promise<{ userId: string; error?: never } | Fail> {
  const { userId } = await auth();
  if (!userId) return unauthorized();
  if (!(await hasCourseAccess(userId, courseId))) return forbidden();
  return { userId };
}

/** The course an assignment belongs to (via its chapter), or null. */
export async function getAssignmentCourseId(assignmentId: string): Promise<string | null> {
  if (!mongoose.isValidObjectId(assignmentId)) return null;

  await connectDB();
  const assignment = await AssignmentModel.findById(assignmentId).select("chapterId");
  if (!assignment) return null;

  const chapter = await ChapterModel.findById(assignment.chapterId).select("courseId");
  return chapter?.courseId ?? null;
}

/** For teacher pages and layouts: send anyone else to the home page. */
export async function requireTeacherPage(): Promise<string> {
  const { userId } = await auth();
  if (!userId) redirect("/sign-in");
  if (!isTeacher(userId)) redirect("/");
  return userId;
}
