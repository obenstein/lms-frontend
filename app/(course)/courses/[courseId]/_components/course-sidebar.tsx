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
    <div className="h-full border-r-4 border-blue-100 bg-white flex flex-col overflow-y-auto shadow-lg">
      {/* Header */}
      <div className="p-6 bg-blue-50/50 border-b-4 border-blue-100">
        <h1 className="font-black text-xl text-slate-800 leading-tight">
          {course.title}
        </h1>

        {purchased && (
          <div className="mt-6 bg-white p-4 rounded-2xl border-2 border-blue-100 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-blue-700 uppercase tracking-wider">Your Progress</span>
              <span className="text-xs font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-md">{Math.round(progressCount)}%</span>
            </div>
            <CourseProgress
              variant="success"
              value={progressCount}
              size="sm"
            />
          </div>
        )}
      </div>

      {/* Chapters */}
      <div className="flex flex-col w-full p-4 space-y-2" >
        {chapters.map((chapter, index) => (
          <CourseSidebarItem
            key={chapter._id}
            _id={chapter._id}
            courseId={chapter.courseId}
            label={chapter.title}
            isCompleted={!!chapter.isCompleted?.[userId]}
            isLocked={!chapter.isFree && !purchased}
          />
        ))}
      </div>
    </div>
  );
};
