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
    // 1. Get categories
    const categories = (
      await axios.get(`${process.env.BACK_END_URL}/api/category`)
    ).data;

    // 2. Get course access list for this user
    const accessRes = await axios.get(`${process.env.BACK_END_URL}/api/access/${userId}`);

    const accessibleCourseIds: string[] = accessRes.data.map(
      (entry: { courseId: string }) => entry.courseId
    );

    // 3. Get all courses (filtered by category/title if provided)
    let courses = (
      await axios.get(
        `${process.env.BACK_END_URL}/api/courses?${
          categoryId ? `categoryId=${categoryId}` : ""
        }&${title ? `title=${title}` : ""}`
      )
    ).data;

    // 4. Filter only published courses
    courses = courses.filter((course: { isPublished: boolean }) => course.isPublished);

    // 5. Only return the courses that are in user's access list
    courses = courses.filter((course: { _id: string }) =>
      accessibleCourseIds.includes(course._id)
    );

    // 6. Add progress and category name
    const courseWithProgress = await Promise.all(
      courses.map(async (course: course) => {
        const category = categories.find(
          (cate: { _id: string; name: string }) => cate._id === course.categoryId
        )?.name ?? "Uncategorized";

        if (!course.purchased[userId]) {
          const chaptersLength = (
            await axios.get(
              `${process.env.BACK_END_URL}/api/chapters/${course._id}/published`
            )
          ).data.length;

          return {
            ...course,
            progress: null,
            chaptersLength,
            category,
          };
        }

        const [chaptersLength, progressPercentage] = await getProgress(userId, course._id);

        return {
          ...course,
          progress: progressPercentage,
          chaptersLength,
          category,
        };
      })
    );

    return courseWithProgress;
  } catch (error) {
    console.log("Get course error", error);
    return [];
  }
};


export const getAllCourses = async ({ userId, title, categoryId }: GetCourses) => {
  try {
    const categories = (
      await axios.get(`${process.env.BACK_END_URL}/api/category`)
    ).data;

    let courses = (
      await axios.get(
        `${process.env.BACK_END_URL}/api/courses?${
          categoryId ? `categoryId=${categoryId}` : ""
        }&${title ? `title=${title}` : ""}`
      )
    ).data;

    // 4. Filter only published courses
    courses = courses.filter((course: { isPublished: boolean }) => course.isPublished);

    // 5. Only return the courses that are in user's access list
    courses = courses.filter((course: { _id: string }) =>
      accessibleCourseIds.includes(course._id)
    );

    // 6. Add progress and category name
    const courseWithProgress = await Promise.all(
      courses.map(async (course: course) => {
        const category = categories.find(
          (cate: { _id: string; name: string }) => cate._id === course.categoryId
        )?.name ?? "Uncategorized";

        if (!course.purchased[userId]) {
          const chaptersLength = (
            await axios.get(
              `${process.env.BACK_END_URL}/api/chapters/${course._id}/published`
            )
          ).data.length;

          return {
            ...course,
            progress: null,
            chaptersLength,
            category,
          };
        }

        const [chaptersLength, progressPercentage] = await getProgress(userId, course._id);

        return {
          ...course,
          progress: progressPercentage,
          chaptersLength,
          category,
        };
      })
    );

    return courseWithProgress;
  } catch (error) {
    console.log("Get course error", error);
    return [];
  }
};


// export const getAllCourses = async ({ userId, title, categoryId }: GetCourses) => {
//   try {
//     const categories = (
//       await axios.get(`${process.env.BACK_END_URL}/api/category`)
//     ).data;

//     let courses = (
//       await axios.get(
//         `${process.env.BACK_END_URL}/api/courses` +
//           `?${categoryId ? `categoryId=${categoryId}` : ""}` +
//           `&${title ? `title=${title}` : ""}`
//       )
//     ).data;

//     courses = courses.filter((course: { isPublished: boolean }) => course.isPublished);

//     const courseWithProgress = await Promise.all(
//       courses.map(async (course: course) => {
//         // ---- FIXED: SAFE CATEGORY ----
//         const matchedCategory = categories.find(
//           (cate: { _id: string; name: string }) =>
//             cate._id === course.categoryId
//         );

//         const categoryName = matchedCategory?.name ?? "Unknown";
//         const category = categories.find(
//           (cate: { _id: string; name: string }) => cate._id === course.categoryId
//         )?.name ?? "Uncategorized";

//         // ---- COURSE NOT PURCHASED ----
//         if (!course.purchased?.[userId]) {
//           const chaptersLength = (
//             await axios.get(
//               `${process.env.BACK_END_URL}/api/chapters/${course._id}/published`
//             )
//           ).data.length;

//           return {
//             ...course,
//             progress: null,
//             chaptersLength,
//             category,
//           };
//         }

//         const [chaptersLength, progressPercentage] = await getProgress(userId, course._id);

//         return {
//           ...course,
//           progress: progressPercentage,
//           chaptersLength,
//           category: categoryName,
//           chaptersLength,
//           category,
//         };
//       })
//     );

//     return courseWithProgress;
//   } catch (error) {
//     console.log("Get ALL courses error", error);
//     return [];
//   }
// };