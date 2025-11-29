import { auth } from "@clerk/nextjs/server";
import axios from "axios";
import { NextResponse } from "next/server";
import { getAllCourses } from "@/actions/get-courses";
export async function POST(req: Request) {
  console.log("[courses] POST");
  try {
    const { userId } = await auth();
    const { title } = await req.json();

    if (!userId) return new NextResponse("Unauthorized", { status: 401 });

    const course = await axios.post(`${process.env.BACK_END_URL}/api/courses`, {
      userId,
      title,
    });

    return NextResponse.json(course.data);
  } catch (error) {
    console.log("[courses]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const userId = searchParams.get("userId") || "";
  const title = searchParams.get("title") || "";
  const categoryId = searchParams.get("categoryId") || "";

  const courses = await getAllCourses({ userId, title, categoryId });

  return NextResponse.json(courses);
}