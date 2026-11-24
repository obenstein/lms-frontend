import { Categories } from "./_components/categories";
import { CoursesList } from "@/components/courses-list";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { getCourses } from "@/actions/get-courses";
import { WelcomeBanner } from "./_components/welcome-banner";
import { getCategories } from "@/lib/queries";

export default async function HomePage({
  searchParams,
}: {
  searchParams: Promise<{ title?: string; categoryId?: string }>;
}) {
  const { userId } = await auth();
  if (!userId) return redirect("/sign-in");

  const { title, categoryId } = await searchParams;
  const [categories, courses] = await Promise.all([
    getCategories(),
    getCourses({ userId, title, categoryId }),
  ]);

  return (
    <div className="min-h-full p-4 sm:p-6 space-y-8 bg-[#F0F9FF] bg-[radial-gradient(#E0F2FE_1px,transparent_1px)] [background-size:16px_16px]">
      <WelcomeBanner />
      <Categories items={categories} />
      <CoursesList items={courses} />
    </div>
  );
}
