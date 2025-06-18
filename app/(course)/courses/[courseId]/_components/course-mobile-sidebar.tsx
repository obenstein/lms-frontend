// "use client"

import { Menu } from "lucide-react";

import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { CourseSidebar } from "./course-sidebar";
import { auth } from "@clerk/nextjs/server";

interface courseMobileSidebarProps {
  course: {
    title: string;
    purchased: { [key: string]: boolean };
  };
  chapters: {
    _id: string;
    courseId: string;
    title: string;
    isCompleted: { [key: string]: boolean };
    isFree: boolean;
    purchased: { [key: string]: boolean };
  }[];
}

export const CourseMobileSidebar = async ({
  course,
  chapters,
}: courseMobileSidebarProps) => {
  const { userId } = await auth();
  return (
    <Sheet>
      <SheetTrigger className="md:hidden pr-4 hover:opacity-75 transition">
        <Menu />
      </SheetTrigger>
      <SheetContent className="p-0 bg-white w-72" side="left">
        <CourseSidebar userId={userId!} course={course} chapters={chapters} />
      </SheetContent>
    </Sheet>
  );
};
