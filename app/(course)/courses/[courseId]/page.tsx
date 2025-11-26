// app/teacher/courses/[courseId]/page.tsx
import { redirect } from "next/navigation";

const CourseIdPage = async ({ params }: { params: any }) => {
  // Await params before using
  const { courseId } = await params;

  const res = await fetch(
    `${process.env.BACK_END_URL}/api/chapters/${courseId}/published`,
    { cache: "no-store" }
  );

  const courseChapters = await res.json();

  if (!courseChapters || !Array.isArray(courseChapters) || courseChapters.length === 0) {
    redirect("/");
  }

    redirect(`/courses/${courseId}/overview`);

};

export default CourseIdPage;