import { connectDB } from "@/lib/db";
import CourseModel from "@/lib/models/course-model";
import CourseAccessModel from "@/lib/models/course-access-model";
import { COURSE_CONFIG } from "@/lib/course-config";
import { getScheduledWeek } from "@/lib/course-progression";

// Teacher analytics, based on the course access the teacher has granted.

export const getAnalytics = async () => {
  try {
    await connectDB();

    const [courses, accessList] = await Promise.all([
      CourseModel.find().select("title").lean(),
      CourseAccessModel.find().lean(),
    ]);

    const courseIds = new Set(courses.map((course) => String(course._id)));
    const grants = accessList.filter((access) => courseIds.has(access.courseId));

    const data = courses.map((course) => ({
      name: course.title,
      total: grants.filter((access) => access.courseId === String(course._id)).length,
    }));

    const awaitingApproval = grants.filter(
      (access) =>
        !access.secondMonthApprovedAt &&
        !!access.grantedAt &&
        getScheduledWeek(access.grantedAt) >= COURSE_CONFIG.FIRST_WEEK_REQUIRING_APPROVAL
    ).length;

    return {
      data,
      totalStudents: new Set(grants.map((access) => access.studentId)).size,
      approved: grants.filter((access) => access.secondMonthApprovedAt).length,
      awaitingApproval,
    };
  } catch (error) {
    console.log("[get analytics]", error);
    return { data: [], totalStudents: 0, approved: 0, awaitingApproval: 0 };
  }
};
