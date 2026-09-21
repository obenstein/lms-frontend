import { connectDB } from "@/lib/db";
import CategoryModel from "@/lib/models/category-model";
import CourseModel from "@/lib/models/course-model";
import ChapterModel from "@/lib/models/chapter-model";
import CourseAccessModel from "@/lib/models/course-access-model";
import LiveSessionModel from "@/lib/models/live-session-model";
import AssignmentModel from "@/lib/models/assignment-model";
import SubmissionModel from "@/lib/models/submission-model";

// Thin read helpers for Server Components that used to `fetch`/`axios` the
// Express backend directly (course layout/overview pages, dashboard, teacher
// pages). Each one is a 1:1 port of the backend controller it replaces.

export async function getCategories() {
  await connectDB();
  return CategoryModel.find().sort({ name: 1 });
}

export async function getAllCourses() {
  await connectDB();
  return CourseModel.find();
}

export async function getCourseById(courseId: string) {
  await connectDB();
  return CourseModel.findById(courseId);
}

// chapter-controller.getAllChapters
export async function getAllChapters(courseId: string) {
  await connectDB();
  return ChapterModel.find({ courseId }).sort({ position: 1 });
}

// chapter-controller.getPublishedChapterOfOneCourse
export async function getPublishedChapters(courseId: string) {
  await connectDB();
  return ChapterModel.find({ courseId, isPublished: true });
}

// chapter-controller.getOneChapter
export async function getOneChapter(chapterId: string, courseId: string) {
  await connectDB();
  return ChapterModel.findOne({ _id: chapterId, courseId });
}

// course-access-controller.getAccessListByStudent
export async function getAccessListByStudent(studentId: string) {
  await connectDB();
  return CourseAccessModel.find({ studentId });
}

// live-session-controller.getSessionsByStudent
export async function getLiveSessionsByStudent(studentId: string) {
  await connectDB();
  return LiveSessionModel.find({ invitees: studentId }).sort({ startTime: -1 });
}

// assignment-controller.getAssignmentsByChapter (looks up by assignment _id)
export async function getAssignmentById(assignmentId: string) {
  await connectDB();
  return AssignmentModel.find({ _id: assignmentId });
}

// submission-controller.getSubmissionsByStudent
export async function getSubmissionsByStudent(studentId: string) {
  await connectDB();
  return SubmissionModel.find({ studentId });
}
