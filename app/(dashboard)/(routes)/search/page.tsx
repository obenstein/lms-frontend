import axios from "axios";
import { Categories } from "./_components/categories";
import { SearchInput } from "@/components/search-input";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { getCourses } from "@/actions/get-courses";
import { CoursesList } from "@/components/courses-list";
import { getCategories } from "@/lib/queries";
interface searchPageProps{
  searchParams: { 
    title?: string,
    categoryId: string
  }
}

const SearchPage = async ({ ...searchParams } : searchPageProps) => {


  const { userId } = await auth()
  if(!userId){
    return redirect("/")
  }

  const categories = await getCategories();
  
  // console.log("searchParams", searchParams)
  const courses = await getCourses({userId, ...searchParams})
  // console.log("courses", courses)
  return (
    <>
      <div className="px-6 pt-6 md:hidden md:mb-0 block">
        <SearchInput /> 
      </div>
      <div className="p-6">
        <Categories items={categories} />
        <CoursesList items={courses} />
      </div>
    </>
  );
};

export default SearchPage;
