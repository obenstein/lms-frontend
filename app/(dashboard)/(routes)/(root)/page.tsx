import axios from "axios";
import { Categories } from "./_components/categories";
import { CoursesList } from "@/components/courses-list";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { getCourses } from "@/actions/get-courses";
import { WelcomeBanner } from "./_components/welcome-banner";

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ title?: string; categoryId?: string }>;
}) {
  const { userId } = await auth();
  if (!userId) return redirect("/");

  const resolvedParams = await searchParams;

  const categories = (
    await axios.get(`${process.env.BACK_END_URL}/api/category`)
  ).data;

  const courses = await getCourses({
    userId,
    ...resolvedParams,
  });

  return (
    <div className="p-6 space-y-6 min-h-screen bg-[#F0F9FF] bg-[radial-gradient(#E0F2FE_1px,transparent_1px)] [background-size:16px_16px]">
      <WelcomeBanner />
      <Categories items={categories} />
      <CoursesList items={courses} />
    </div>
  );
}
