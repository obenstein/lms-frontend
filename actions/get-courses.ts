import { toPlain } from "@/lib/serialize";
import { connectDB } from "@/lib/db";
import CategoryModel from "@/lib/models/category-model";
import CourseAccessModel from "@/lib/models/course-access-model";
import CourseModel from "@/lib/models/course-model";
import ChapterModel from "@/lib/models/chapter-model";
import { getProgress } from "@/actions/get-progress";

type Course = {
  _id: string;
  purchased: { [key: string]: boolean };
  categoryId: string;
};

type GetCourses = {
  userId: string;
  title?: string;
  categoryId?: string;
};

// Ported from lms-backend controllers: category-controller.getAllCategorys,
// course-access-controller.getAccessListByStudent, course-controller.getAllCourses,
// chapter-controller.getPublishedChapterOfOneCourse — same aggregation logic,
// now composed with direct Mongoose calls instead of chained axios requests.

export const getCourses = async ({ userId, title, categoryId }: GetCourses) => {
  try {
    await connectDB();

    // 1. Get categories
    const categories = await CategoryModel.find().sort({ name: 1 });

    // 2. Get course access list for this user
    const accessList = await CourseAccessModel.find({ studentId: userId });
    const accessibleCourseIds: string[] = accessList.map((entry) => entry.courseId);

    // 3. Get all courses (filtered by category/title if provided)
    const query: Record<string, unknown> = {};
    if (title) query.title = { $regex: title, $options: "i" };
    if (categoryId) query.categoryId = categoryId;

    let courses = await CourseModel.find(query);

    // 4. Filter only published courses
    let filtered = courses.filter((course) => course.isPublished);

    // 5. Only return the courses that are in user's access list
    filtered = filtered.filter((course) =>
      accessibleCourseIds.includes(String(course._id))
    );

    // 6. Add progress and category name
    const courseWithProgress = await Promise.all(
      filtered.map(async (course) => {
        const category =
          categories.find((cate) => String(cate._id) === course.categoryId)?.name ??
          "Uncategorized";

        if (!course.purchased?.get(userId)) {
          const chaptersLength = await ChapterModel.countDocuments({
            courseId: String(course._id),
            isPublished: true,
          });

          return {
            ...course.toObject(),
            progress: null,
            chaptersLength,
            category,
          };
        }

        const [chaptersLength, progressPercentage] = await getProgress(
          userId,
          String(course._id)
        );

        return {
          ...course.toObject(),
          progress: progressPercentage,
          chaptersLength,
          category,
        };
      })
    );

    return toPlain(courseWithProgress);
  } catch (error) {
    console.log("Get course error", error);
    return [];
  }
};

export const getAllCourses = async ({ userId, title, categoryId }: GetCourses) => {
  try {
    await connectDB();

    const categories = await CategoryModel.find().sort({ name: 1 });

    const query: Record<string, unknown> = {};
    if (title) query.title = { $regex: title, $options: "i" };
    if (categoryId) query.categoryId = categoryId;

    const courses = await CourseModel.find(query);

    // Filter only published courses (access-list filtering intentionally
    // stays commented out here, matching the original getAllCourses behavior)
    const filtered = courses.filter((course) => course.isPublished);

    const courseWithProgress = await Promise.all(
      filtered.map(async (course) => {
        const category =
          categories.find((cate) => String(cate._id) === course.categoryId)?.name ??
          "Uncategorized";

        if (!course.purchased?.get(userId)) {
          const chaptersLength = await ChapterModel.countDocuments({
            courseId: String(course._id),
            isPublished: true,
          });

          return {
            ...course.toObject(),
            progress: null,
            chaptersLength,
            category,
          };
        }

        const [chaptersLength, progressPercentage] = await getProgress(
          userId,
          String(course._id)
        );

        return {
          ...course.toObject(),
          progress: progressPercentage,
          chaptersLength,
          category,
        };
      })
    );

    return toPlain(courseWithProgress);
  } catch (error) {
    console.log("Get course error", error);
    return [];
  }
};
