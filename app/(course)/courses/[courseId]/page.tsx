// app/teacher/courses/[courseId]/page.tsx
import { redirect } from "next/navigation";

const CourseIdPage = async ({ params }: { params: { courseId: string } }) => {
  const courseId = await params.courseId; 

  const res = await fetch(
    `${process.env.BACK_END_URL}/api/chapters/${courseId}/published`,
    { cache: "no-store" }
  );

  const courseChapters = await res.json();

  if (!courseChapters || !Array.isArray(courseChapters) || courseChapters.length === 0) {
    redirect("/");
  }

  redirect(`/courses/${courseId}/chapters/${courseChapters[0]._id}`);
};

export default CourseIdPage;
