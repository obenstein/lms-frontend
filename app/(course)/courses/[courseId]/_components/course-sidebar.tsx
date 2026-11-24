import { Lock } from "lucide-react";
import { CourseProgress } from "@/components/course-progress";
import { CourseSidebarItem, CourseSidebarOverviewLink } from "./course-sidebar-item";

interface courseSidebarProps {
  courseId: string;
  title: string;
  weeks: {
    weekNumber: number;
    isUnlocked: boolean;
    chapters: { _id: string; title: string; isCompleted: boolean }[];
  }[];
}

export const CourseSidebar = ({ courseId, title, weeks }: courseSidebarProps) => {
  const chapters = weeks.flatMap((week) => week.chapters);
  const completedCount = chapters.filter((chapter) => chapter.isCompleted).length;
  const progress = chapters.length > 0 ? (completedCount / chapters.length) * 100 : 0;

  return (
    <div className="h-full border-r-4 border-blue-100 bg-white flex flex-col overflow-y-auto shadow-lg">
      {/* Header */}
      <div className="p-6 bg-blue-50/50 border-b-4 border-blue-100">
        <h1 className="font-black text-xl text-slate-800 leading-tight pr-6 md:pr-0">{title}</h1>

        <div className="mt-4 bg-white p-4 rounded-2xl border-2 border-blue-100 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-blue-700 uppercase tracking-wider">
              Your Progress
            </span>
            <span className="text-xs font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-md">
              {completedCount}/{chapters.length}
            </span>
          </div>
          <CourseProgress variant="success" value={progress} size="sm" />
        </div>
      </div>

      <nav aria-label="Course missions" className="flex flex-col w-full p-4 gap-5">
        <CourseSidebarOverviewLink courseId={courseId} />

        {weeks.map((week) => (
          <div key={week.weekNumber}>
            <div className="flex items-center gap-1.5 px-4 mb-1.5 text-xs font-black uppercase tracking-wider text-slate-500">
              Level {week.weekNumber}
              {!week.isUnlocked && <Lock className="h-3 w-3" aria-label="locked" />}
            </div>
            <div className="flex flex-col gap-1">
              {week.chapters.map((chapter) => (
                <CourseSidebarItem
                  key={chapter._id}
                  href={`/courses/${courseId}/chapters/${chapter._id}`}
                  label={chapter.title}
                  isCompleted={chapter.isCompleted}
                  isLocked={!week.isUnlocked}
                />
              ))}
            </div>
          </div>
        ))}
      </nav>
    </div>
  );
};
