"use client";

import { Progress } from "@/components/ui/progress";

interface ProgressOverviewProps {
    currentChapterTitle: string;
  currentChapter: number;
  totalChapters: number;
  nextChapterTitle?: string;
}

export const ProgressOverview = ({
  currentChapter,
  totalChapters,
  nextChapterTitle,
}: ProgressOverviewProps) => {
  const percent = (currentChapter / totalChapters) * 100;

  return (
    <div className="mb-4 p-4 bg-yellow-100 rounded-xl shadow">
      <p className="font-semibold text-sm mb-2">
        📚 Chapter {currentChapter} of {totalChapters}
      </p>
      <Progress value={percent} className="h-2 bg-yellow-300" />
      {nextChapterTitle && (
        <p className="mt-2 text-sm text-gray-600">
          ⏭️ Up next: <strong>{nextChapterTitle}</strong>
        </p>
      )}
    </div>
  );
};

