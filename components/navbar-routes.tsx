"use client";

import { UserButton, useAuth } from "@clerk/nextjs";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";
import Link from "next/link";
import { isTeacher } from "@/lib/teacher";

const NavbarRoutes = () => {
  const pathname = usePathname();
  const { isLoaded, userId } = useAuth()
  const isSearchPage = pathname === "/search";
  const isTeacherPage = pathname?.startsWith("/teacher");
  const isCoursePage = pathname?.includes("/courses");

  // If we are in a course layout, the CourseNavbar handles the title (showing course name).
  // So we might not need to show "Classroom" here if it duplicates.
  // However, NavbarRoutes is used in both.
  // Let's check if we are in the dashboard layout or course layout.
  // Actually, CourseNavbar renders NavbarRoutes.
  // We can pass a prop or just hide the title if we are in a course page, 
  // BUT CourseNavbar puts the title *outside* NavbarRoutes.
  // So we should hide the title in NavbarRoutes if it's a course page.

  let pageTitle = "Mission Control";
  if (isSearchPage) pageTitle = "Explore Courses";
  if (isTeacherPage) pageTitle = "Teacher Mode";

  // If it's a course page, we don't want to show "Classroom" here because CourseNavbar shows the specific course title.
  // So we'll keep pageTitle as is, but conditionally render.

  return (
    <>
      {!isCoursePage && (
        <div className="hidden md:block text-xl font-bold text-slate-700 ml-4">
          {pageTitle}
        </div>
      )}


      <div className="flex items-center gap-x-2 ml-auto">
        {isTeacherPage || isCoursePage ? (
          <Button size="sm" variant="ghost" asChild>
            <Link href="/">
              <LogOut className="h-4 w-4 mr-2" />
              Exit
            </Link>
          </Button>
        ) : isTeacher(userId) ? (
          <Button size="sm" variant="ghost" asChild>
            <Link href="/teacher/courses">Teacher Mode</Link>
          </Button>
        ) : null}
        <UserButton afterSignOutUrl="/" />
        {isLoaded && !userId && (
          <Button size="sm" asChild>
            <Link href="/sign-in">Sign in</Link>
          </Button>
        )}
      </div>
    </>
  );
};

export default NavbarRoutes;
