import { toPlain } from "@/lib/serialize";
import { connectDB } from "@/lib/db";
import CategoryModel from "@/lib/models/category-model";
import CourseAccessModel from "@/lib/models/course-access-model";
import CourseModel from "@/lib/models/course-model";
import { getProgress } from "@/actions/get-progress";

type CourseFilter = {
  title?: string;
  categoryId?: string;
};

const findPublishedCourses = ({ title, categoryId }: CourseFilter) => {
  const query: Record<string, unknown> = { isPublished: true };
  if (title) query.title = { $regex: title, $options: "i" };
  if (categoryId) query.categoryId = categoryId;
  return CourseModel.find(query);
};

/** Published courses the student was granted access to, with their progress. */
export const getCourses = async ({
  userId,
  ...filter
}: CourseFilter & { userId: string }) => {
  try {
    await connectDB();

    const [categories, accessList, courses] = await Promise.all([
      CategoryModel.find(),
      CourseAccessModel.find({ studentId: userId }),
      findPublishedCourses(filter),
    ]);

    const accessibleCourseIds = new Set(accessList.map((entry) => entry.courseId));

    const result = await Promise.all(
      courses
        .filter((course) => accessibleCourseIds.has(String(course._id)))
        .map(async (course) => {
          const [chaptersLength, progress] = await getProgress(userId, String(course._id));
          const category = categories.find(
            (cate) => String(cate._id) === course.categoryId
          );

          return {
            _id: String(course._id),
            title: course.title,
            imageUrl: course.imageUrl ?? null,
            category: category?.name ?? null,
            chaptersLength,
            progress,
          };
        })
    );

    return toPlain(result);
  } catch (error) {
    console.log("Get course error", error);
    return [];
  }
};

/** Every published course, for the teacher's course-access manager. */
export const getAllCourses = async (filter: CourseFilter) => {
  try {
    await connectDB();
    const courses = await findPublishedCourses(filter);
    return courses.map((course) => ({ _id: String(course._id), title: course.title }));
  } catch (error) {
    console.log("Get course error", error);
    return [];
  }
};
