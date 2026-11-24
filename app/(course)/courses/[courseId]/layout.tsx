import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { CourseSidebar } from "./_components/course-sidebar";
import { CourseNavbar } from "./_components/course-navbar";
import { getCourseById, getPublishedChapters } from "@/lib/queries";
import { getCourseEntitlement } from "@/lib/auth-guards";
import { organizeChaptersByWeeks } from "@/lib/course-progression";

interface LayoutProps {
  params: Promise<{ courseId: string }>;
  children: React.ReactNode;
}

const CourseLayout = async ({ children, params }: LayoutProps) => {
  const { userId } = await auth();
  if (!userId) return redirect("/");

  const { courseId } = await params;
  const entitlement = await getCourseEntitlement(userId, courseId);
  if (!entitlement) return redirect("/");

  const [course, chapters] = await Promise.all([
    getCourseById(courseId),
    getPublishedChapters(courseId),
  ]);
  if (!course) return redirect("/");

  const weeks = organizeChaptersByWeeks(chapters, entitlement).map((week) => ({
    weekNumber: week.weekNumber,
    isUnlocked: week.isUnlocked,
    chapters: week.chapters.map((chapter) => ({
      _id: String(chapter._id),
      title: chapter.title ?? "Untitled mission",
      // Maps are plain objects here (see lib/serialize.ts)
      isCompleted: !!(chapter.isCompleted as unknown as Record<string, boolean>)?.[userId],
    })),
  }));

  const sidebar = <CourseSidebar courseId={courseId} title={course.title} weeks={weeks} />;

  return (
    <div className="h-full">
      <div className="h-[80px] md:pl-80 fixed inset-x-0 top-0 z-40">
        <CourseNavbar title={course.title} sidebar={sidebar} />
      </div>

      <div className="hidden md:flex h-full w-80 flex-col fixed inset-y-0 z-50">{sidebar}</div>

      <main className="md:pl-80 h-full pt-[80px]">{children}</main>
    </div>
  );
};

export default CourseLayout;
