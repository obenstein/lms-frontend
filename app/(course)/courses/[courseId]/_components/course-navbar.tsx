// "use client";

import NavbarRoutes from "@/components/navbar-routes";
import { CourseMobileSidebar } from "./course-mobile-sidebar";

interface courseNavbarProps {
  course: {
    title: string,
    purchased: { [key: string]: boolean }

  };
  chapters: { _id: string, courseId: string, title: string, isCompleted: { [key: string]: boolean }, isFree: boolean, purchased: { [key: string]: boolean } }[]
}

export const CourseNavbar = ({ course, chapters }: courseNavbarProps) => {
  return (
    <div className="p-4 border-b-4 border-blue-100 h-full flex items-center bg-white shadow-sm">
      <CourseMobileSidebar
        course={course}
        chapters={chapters}
      // progressCount={progressCount}
      />
      <div className="hidden md:block ml-4 font-bold text-xl text-slate-700 truncate max-w-[300px]">
        {course.title}
      </div>
      <NavbarRoutes />
    </div>
  );
};
