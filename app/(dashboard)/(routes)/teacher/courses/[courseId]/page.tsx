import { IconBadge } from "@/components/icon-bage";
import { auth } from "@clerk/nextjs/server";
import { CircleDollarSign, File, LayoutDashboard, ListChecks } from "lucide-react";
import { redirect } from "next/navigation";

import TitleForm from "./_components/title-form";
import DescriptionForm from "./_components/description-form";
import ImageForm from "./_components/image-form";
import CategoryForm from "./_components/category-form";
import PriceForm from "./_components/price-form";
import AttachmentsForm from "./_components/attachments-form";
import ChapterForm from "./_components/chpater-form";
import { Banner } from "@/components/banner";
import { Actions } from "./_components/actions";
 import { getCourseById, getCategories, getAllChapters } from "@/lib/queries";

interface ChapterType {
  title: string;
  _id: string;
  isPublished: boolean;
  position: number;
  isFree: string;
}

interface CourseType {
  _id: string;
  title: string;
  description: string;
  imageUrl: string;
  price: number;
  categoryId: string;
  userId: string;
  isPublished: boolean;
  attachments: string[];
}

interface CategoryType {
  name: string;
  _id: string;
}

export default async function CourseIdPage({
  params,
}: {
  params: { courseId: string };
}) {
  // Await the params - this is the key fix for Next.js 15+
  const { courseId } = await params;
  
  const { userId } = await auth();
  if (!userId) redirect("/");

  let course: CourseType | null = null;
  let categories: CategoryType[] = [];
  let courseChapters: ChapterType[] = [];

  try {
    // Fetch course data
   const course = await getCourseById(courseId);


    // Fetch categories
   const categories = await getCategories();

    // Fetch course chapters
  const courseChapters = await getAllChapters(courseId);
  }
   catch (error) {
    console.error("Course page error:", error);
  }

  // Validation checks outside try-catch to avoid NEXT_REDIRECT issues
  if (!course) {
    redirect("/");
  }

  if (course.userId !== userId) {
    redirect("/");
  }

  const publishedChapters = courseChapters.some((chapter) => chapter.isPublished);

  const requiredFields = [
    course.title,
    course.description,
    course.imageUrl,
    course.price,
    course.categoryId,
    publishedChapters
  ];

  const totalFields = requiredFields.length;
  const completedFields = requiredFields.filter(Boolean).length;
  const completionText = `${completedFields}/${totalFields}`;

  const isComplete = requiredFields.every(Boolean);

  return (
    <>
      {!course.isPublished && (
        <Banner label="The course is not published. It will not be visible to the students!" />
      )}
      {course.isPublished && (
        <Banner label="The course is Published. It is visible to the students." variant="success" />
      )}
      <div className="p-6">
        <div className="flex items-center justify-between bg-green-200 rounded-lg p-6">
          <div className="flex flex-col gap-y-2">
            <h1 className="text-2xl font-semibold">Course Setup</h1>
            <span className="text-sm text-slate-700">
              Complete all fields {completionText}
            </span>
          </div>
          <Actions 
            disabled={!isComplete}
            courseId={course._id}
            isPublished={course.isPublished}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-16">
          <div>
            <div className="flex items-center gap-x-2">
              <IconBadge icon={LayoutDashboard} />
              <h2 className="text-xl font-medium">Customize your course</h2>
            </div>
            <TitleForm intialData={course} courseId={course._id} />
            <DescriptionForm intialData={course} courseId={course._id} />
            <ImageForm intialData={course} courseId={course._id} />
            <CategoryForm 
              intialData={course} 
              courseId={course._id} 
              options={categories.map((category) => ({
                label: category.name, 
                value: category._id
              }))} 
            />
          </div>

          <div className="space-y-6">
            <div>
              <div className="flex items-center gap-x-2">
                <IconBadge icon={ListChecks} />
                <h2 className="text-xl font-medium">
                  Course Chapters
                </h2>
              </div>
              <ChapterForm courseChapters={courseChapters} courseId={course._id} />
            </div>

            <div>
              <div className="flex items-center gap-x-2">
                <IconBadge icon={CircleDollarSign} />
                <h2 className="text-xl font-medium">Price</h2>
              </div>
              <PriceForm intialData={{ price: String(course.price) }} courseId={course._id} />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}