import { connectDB } from "@/lib/db";
import CourseModel from "@/lib/models/course-model";

// Ported from lms-backend/controllers/course-controller.js:getAllCourses
// (this action just consumed that endpoint's full course list).

export const getAnalytics = async (userId: string) => {
  try {
    await connectDB();

    const courses = await CourseModel.find();
    const grouped: { [courseTitle: string]: number } = {};

    courses.forEach((course) => {
      grouped[course.title] = (course.purchased?.size ?? 0) * course.price;
    });

    const data = Object.entries(grouped).map(([courseTitle, total]) => ({
      name: courseTitle,
      total,
    }));

    const totalRevenue = data.reduce((pre, cur) => pre + cur.total, 0);
    const totalSales = courses.reduce(
      (pre, cur) => pre + (cur.purchased?.size ?? 0),
      0
    );

    return { data, totalRevenue, totalSales };
  } catch (error: any) {
    return { data: [], totalRevenue: 0, totalSales: 0 };
  }
};
