// app/teacher/courses/[courseId]/page.tsx
import { redirect } from "next/navigation";
import { getPublishedChapters } from "@/lib/queries";

const CourseIdPage = async ({ params }: { params: any }) => {
  // Await params before using
  const { courseId } = await params;

  const courseChapters = await getPublishedChapters(courseId);

  if (!courseChapters || !Array.isArray(courseChapters) || courseChapters.length === 0) {
    redirect("/");
  }

    redirect(`/courses/${courseId}/overview`);

};

export default CourseIdPage;