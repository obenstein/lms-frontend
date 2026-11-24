import Link from "next/link";
import { ArrowLeft, ArrowRight, Lock } from "lucide-react";
import { Progress } from "@/components/ui/progress";

interface NeighbourChapter {
  _id: string;
  title: string;
  isLocked: boolean;
  lockMessage: string;
}

interface ProgressOverviewProps {
  courseId: string;
  position: number;
  totalChapters: number;
  completedChapters: number;
  previousChapter: NeighbourChapter | null;
  nextChapter: NeighbourChapter | null;
}

export const ProgressOverview = ({
  courseId,
  position,
  totalChapters,
  completedChapters,
  previousChapter,
  nextChapter,
}: ProgressOverviewProps) => {
  return (
    <aside className="bg-white rounded-3xl p-5 sm:p-6 shadow-lg border-b-8 border-r-8 border-purple-100 xl:sticky xl:top-24">
      <h2 className="text-lg font-bold text-purple-800 mb-4 flex items-center gap-2">
        <span aria-hidden>🗺️</span> Adventure Map
      </h2>

      <p className="font-bold text-sm text-slate-700">
        Mission {position} of {totalChapters}
      </p>
      <Progress
        value={(completedChapters / totalChapters) * 100}
        variant="success"
        className="h-2.5 mt-2"
        aria-label="Course progress"
      />
      <p className="mt-2 text-xs font-medium text-slate-500">{completedChapters} completed</p>

      <div className="mt-5 space-y-3">
        {nextChapter &&
          (nextChapter.isLocked ? (
            <div className="rounded-2xl border-2 border-slate-200 bg-slate-50 p-4">
              <p className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                <Lock className="h-3 w-3" /> Up next
              </p>
              <p className="mt-1 font-bold text-slate-600 leading-snug">{nextChapter.title}</p>
              <p className="mt-1 text-sm text-slate-500">{nextChapter.lockMessage}</p>
            </div>
          ) : (
            <Link
              href={`/courses/${courseId}/chapters/${nextChapter._id}`}
              prefetch={false}
              className="group block rounded-2xl border-2 border-purple-200 bg-purple-50 p-4 hover:border-purple-300 hover:bg-purple-100 transition-colors"
            >
              <p className="text-xs font-bold uppercase tracking-wider text-purple-700 flex items-center justify-between">
                Up next
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </p>
              <p className="mt-1 font-bold text-slate-800 leading-snug">{nextChapter.title}</p>
            </Link>
          ))}

        {previousChapter && !previousChapter.isLocked && (
          <Link
            href={`/courses/${courseId}/chapters/${previousChapter._id}`}
            prefetch={false}
            className="flex items-center gap-2 rounded-xl px-2 py-1.5 text-sm font-bold text-slate-600 hover:text-purple-700 transition-colors"
          >
            <ArrowLeft className="h-4 w-4 shrink-0" />
            <span className="truncate">{previousChapter.title}</span>
          </Link>
        )}
      </div>
    </aside>
  );
};
