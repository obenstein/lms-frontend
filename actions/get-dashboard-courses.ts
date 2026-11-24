import { getCourses } from "@/actions/get-courses";

/** The student's courses, split by whether every chapter is completed. */
export const GetDashboardCourses = async (userId: string) => {
  const courses = await getCourses({ userId });

  return {
    completedCourses: courses.filter((course) => course.progress === 100),
    courseInProgress: courses.filter((course) => course.progress < 100),
  };
};
