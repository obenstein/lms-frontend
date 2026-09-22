import { connectDB } from "@/lib/db";
import CategoryModel from "@/lib/models/category-model";
import CourseModel from "@/lib/models/course-model";
import ChapterModel from "@/lib/models/chapter-model";
import { getProgress } from "@/actions/get-progress";
import { toPlain } from "@/lib/serialize";

type DashboardCourses = {
  completedCourses: any[];
  courseInProgress: any[];
};

// Ported from lms-backend controllers: category-controller.getAllCategorys,
// course-controller.getPurchasedCourses, chapter-controller.getPublishedChapterOfOneCourse.

export const GetDashboardCourses = async (userId: string): Promise<DashboardCourses> => {
  try {
    await connectDB();

    const categories = await CategoryModel.find().sort({ name: 1 });

    const purchasedCourses = await CourseModel.find({
      [`purchased.${userId}`]: true,
    });

    const refinedCourses = await Promise.all(
      purchasedCourses.map(async (course) => {
        const publishedChapters = await ChapterModel.find({
          courseId: String(course._id),
          isPublished: true,
        });
        const category = categories.find(
          (cate) => String(cate._id) === course.categoryId
        )?.name;

        return {
          ...course.toObject(),
          chaptersLength: publishedChapters.length,
          category,
        };
      })
    );

    for (const course of refinedCourses) {
      const [, progress] = await getProgress(userId, course._id);
      course["progress"] = progress;
    }

    const completedCourses = refinedCourses.filter((course) => course.progress === 100);
    const courseInProgress = refinedCourses.filter(
      (course) => (course.progress ?? 0) < 100
    );

    return toPlain({ completedCourses, courseInProgress });
  } catch (error: any) {
    console.log("get dashboard courses", error.message);
    return { completedCourses: [], courseInProgress: [] };
  }
};
