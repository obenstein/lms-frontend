import { connectDB } from "@/lib/db";
import CategoryModel from "@/lib/models/category-model";
import CourseModel from "@/lib/models/course-model";
import ChapterModel from "@/lib/models/chapter-model";
import CourseAccessModel from "@/lib/models/course-access-model";
import LiveSessionModel from "@/lib/models/live-session-model";
import AssignmentModel from "@/lib/models/assignment-model";
import SubmissionModel from "@/lib/models/submission-model";
import { toPlain } from "@/lib/serialize";

// Thin read helpers for Server Components that used to `fetch`/`axios` the
// Express backend directly (course layout/overview pages, dashboard, teacher
// pages). Each one is a 1:1 port of the backend controller it replaces.
//
// Every function returns `toPlain(...)`-wrapped data so results are safe to
// pass straight into Client Components as props. Map-typed fields (purchased,
// isCompleted, userProgress) come back as plain objects after this — use
// `course.purchased[userId]` instead of `course.purchased.get(userId)`.

export async function getCategories() {
  await connectDB();
  const categories = await CategoryModel.find().sort({ name: 1 });
  return toPlain(categories);
}

export async function getAllCourses() {
  await connectDB();
  const courses = await CourseModel.find();
  return toPlain(courses);
}

export async function getCourseById(courseId: string) {
  await connectDB();
  const course = await CourseModel.findById(courseId);
  return toPlain(course);
}

// chapter-controller.getAllChapters
export async function getAllChapters(courseId: string) {
  await connectDB();
  const chapters = await ChapterModel.find({ courseId }).sort({ position: 1 });
  return toPlain(chapters);
}

// chapter-controller.getPublishedChapterOfOneCourse
export async function getPublishedChapters(courseId: string) {
  await connectDB();
  const chapters = await ChapterModel.find({ courseId, isPublished: true });
  return toPlain(chapters);
}

// chapter-controller.getOneChapter
export async function getOneChapter(chapterId: string, courseId: string) {
  await connectDB();
  const chapter = await ChapterModel.findOne({ _id: chapterId, courseId });
  return toPlain(chapter);
}

// course-access-controller.getAccessListByStudent
export async function getAccessListByStudent(studentId: string) {
  await connectDB();
  const accessList = await CourseAccessModel.find({ studentId });
  return toPlain(accessList);
}

// live-session-controller.getSessionsByStudent
export async function getLiveSessionsByStudent(studentId: string) {
  await connectDB();
  const sessions = await LiveSessionModel.find({ invitees: studentId }).sort({
    startTime: -1,
  });
  return toPlain(sessions);
}

// assignment-controller.getAssignmentsByChapter (looks up by assignment _id)
export async function getAssignmentById(assignmentId: string) {
  await connectDB();
  const assignments = await AssignmentModel.find({ _id: assignmentId });
  return toPlain(assignments);
}

// submission-controller.getSubmissionsByStudent
export async function getSubmissionsByStudent(studentId: string) {
  await connectDB();
  const submissions = await SubmissionModel.find({ studentId });
  return toPlain(submissions);
}