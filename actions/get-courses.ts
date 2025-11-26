import axios from "axios";
import { getProgress } from "@/actions/get-progress";

type course = {
  _id: string;
  purchased: { [key: string]: boolean };
  categoryId: string;
};

type GetCourses = {
  userId: string;
  title?: string;
  categoryId?: string;
};

export const getCourses = async ({ userId, title, categoryId }: GetCourses) => {
  try {
    const categories = (await axios.get(`${process.env.BACK_END_URL}/api/category`))
      .data;

    let courses = (
      await axios.get(
        `${process.env.BACK_END_URL}/api/courses` +
          `?${categoryId ? `categoryId=${categoryId}` : ""}` +
          `&${title ? `title=${title}` : ""}`
      )
    ).data;

    // only show published
    courses = courses.filter((course: { isPublished: boolean }) => course.isPublished);

    const courseWithProgress = await Promise.all(
      courses.map(async (course: course) => {
        // ---- FIXED: SAFE CATEGORY ----
        const matchedCategory = categories.find(
          (cate: { _id: string; name: string }) =>
            cate._id === course.categoryId
        );

        const categoryName = matchedCategory?.name ?? "Unknown";

        // ---- COURSE NOT PURCHASED ----
        if (!course.purchased?.[userId]) {
          const chaptersLength = (
            await axios.get(
              `${process.env.BACK_END_URL}/api/chapters/${course._id}/published`
            )
          ).data.length;

          return {
            ...course,
            progress: null,
            chaptersLength,
            category: categoryName,
          };
        }

        // ---- PURCHASED COURSE ----
        const [chaptersLength, progressPercentage] = await getProgress(
          userId,
          course._id
        );

        return {
          ...course,
          progress: progressPercentage,
          chaptersLength,
          category: categoryName,
        };
      })
    );

    return courseWithProgress;
  } catch (error) {
    console.log("Get course", error);
    return [];
  }
};
