import { Categories } from "../(root)/_components/categories";
import { SearchInput } from "@/components/search-input";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { getCourses } from "@/actions/get-courses";
import { CoursesList } from "@/components/courses-list";
import { getCategories } from "@/lib/queries";

export default async function SearchPage({
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
    <div className="min-h-full p-4 sm:p-6 space-y-6 bg-[#F0F9FF] bg-[radial-gradient(#E0F2FE_1px,transparent_1px)] [background-size:16px_16px]">
      <SearchInput />
      <Categories items={categories} />
      <CoursesList items={courses} />
    </div>
  );
}
