import { CourseSidebarItem } from "./course-sidebar-item";
import { CourseProgress } from "@/components/course-progress";

interface courseSidebarProps {
  course: { title: string; purchased: { [key: string]: boolean } };
  chapters: {
    _id: string;
    courseId: string;
    title: string;
    isCompleted: { [key: string]: boolean };
    isFree: boolean;
  }[];
  userId: string;
}

export const CourseSidebar = ({
  course,
  chapters,
  userId,
}: courseSidebarProps) => {
  const purchased = !!course.purchased[userId];
  const completedChapters = chapters.filter(
    (chapter) => !!chapter.isCompleted[userId]
  ).length;

  const progressCount = (completedChapters / chapters.length) * 100;

  return (
    <div className="h-full border-r bg-[#F9FBFF] flex flex-col overflow-y-auto shadow-sm">
      {/* Header */}
      <div className="p-6 bg-white border-b shadow-sm">
        <h1 className="font-bold text-xl text-slate-800">
          {course.title}
        </h1>

        {purchased && (
          <div className="mt-6">
            <CourseProgress
              variant="success"
              value={progressCount}
            />
            <p className="text-xs text-slate-500 mt-2">
              {Math.round(progressCount)}% completed
            </p>
          </div>
        )}
      </div>

      {/* Chapters */}
      <div className="flex flex-col w-full mt-2 px-2">
        {chapters.map((chapter) => (
          <CourseSidebarItem
            key={chapter._id}
            _id={chapter._id}
            courseId={chapter.courseId}
            label={chapter.title}
            isCompleted={chapter.isCompleted[userId]}
            isLocked={!chapter.isFree && !purchased}
          />
        ))}
      </div>
    </div>
  );
};
