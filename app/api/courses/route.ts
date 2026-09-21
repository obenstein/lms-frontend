import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import CourseModel from "@/lib/models/course-model";
import { getAllCourses } from "@/actions/get-courses";

// Ported from lms-backend/controllers/course-controller.js
// (createCourse, getAllCourses). Same request/response shape as before —
// only the transport changed (direct DB call instead of axios -> Express).

export async function POST(req: Request) {
  try {
    const { userId } = await auth();
    const { title } = await req.json();

    if (!userId) return new NextResponse("Unauthorized", { status: 401 });

    await connectDB();
    const course = await CourseModel.create({ userId, title });

    return NextResponse.json(course);
  } catch (error) {
    console.log("[courses]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

export async function GET(req: Request) {
  // Unchanged: this already reads through actions/get-courses.ts,
  // which we're porting separately (see get-courses.ts below).
  const { searchParams } = new URL(req.url);
  const userId = searchParams.get("userId") || "";
  const title = searchParams.get("title") || "";
  const categoryId = searchParams.get("categoryId") || "";

  const courses = await getAllCourses({ userId, title, categoryId });

  return NextResponse.json(courses);
}
