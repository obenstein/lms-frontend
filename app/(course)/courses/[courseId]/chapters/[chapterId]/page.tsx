import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

import { getChapters } from "@/actions/get-chapters";
import { Preview } from "@/components/preview";
import { SideQuest } from "../../_components/side-quest";
import { VideoPlayer } from "./_components/video-player";
import { CourseProgressButton } from "./_components/course-progress-button";
import { ResourcesCard } from "./_components/resource-card";
import { ProgressOverview } from "./_components/progress-overview";

export default async function ChapterIdPage({
  params,
}: {
  params: Promise<{ courseId: string; chapterId: string }>;
}) {
  const { userId } = await auth();
  if (!userId) return redirect("/");

  const { courseId, chapterId } = await params;
  const chapter = await getChapters({ userId, courseId, chapterId });
  if (!chapter) return redirect("/");

  const { isLocked, isCompleted, nextChapter } = chapter;

  return (
    <div className="min-h-full bg-[#F0F9FF] bg-[radial-gradient(#E0F2FE_1px,transparent_1px)] [background-size:16px_16px] pb-16">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 sm:pt-8">
        <Link
          href={`/courses/${courseId}/overview`}
          className="inline-flex items-center mb-6 px-4 py-2 rounded-full bg-white text-sm text-blue-600 font-bold hover:bg-blue-50 transition-colors shadow-sm border-2 border-blue-100 hover:border-blue-200"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Journey Map
        </Link>

        {isCompleted && !isLocked && (
          <div className="mb-6 rounded-2xl bg-green-100 border-2 border-green-200 px-4 py-3 flex items-center gap-3 text-green-800 font-bold">
            <span aria-hidden>🎉</span>
            Mission Accomplished! You&apos;ve completed this mission.
          </div>
        )}

        {/* Video "Cinema" */}
        <div className="bg-slate-900 rounded-3xl sm:rounded-[2rem] p-2 sm:p-3 shadow-2xl border-b-8 border-slate-800 mb-8">
          <div className="flex items-center justify-between px-3 sm:px-4 py-2 mb-1 sm:mb-2">
            <div aria-hidden className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-red-500"></div>
              <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
              <div className="w-3 h-3 rounded-full bg-green-500"></div>
            </div>
            <div className="text-slate-400 text-xs font-mono uppercase tracking-widest">
              {isLocked ? "Locked" : "Now Playing"}
            </div>
          </div>
          <div className="rounded-2xl sm:rounded-3xl overflow-hidden bg-black border-4 border-slate-800 relative aspect-video">
            <VideoPlayer
              key={chapterId}
              chapterId={chapterId}
              title={chapter.title}
              courseId={courseId}
              nextChapterId={nextChapter?._id}
              playbackId={chapter.playbackId}
              isLocked={isLocked}
              lockMessage={chapter.lockMessage}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 lg:gap-8 items-start">
          {/* Main column */}
          <div className="xl:col-span-2 space-y-6 lg:space-y-8 min-w-0">
            <div className="bg-white rounded-3xl p-5 sm:p-6 shadow-lg border-b-8 border-r-8 border-indigo-100">
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                <div className="min-w-0">
                  <span className="inline-block bg-indigo-100 text-indigo-700 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide mb-2">
                    Level {chapter.weekNumber} · Mission {chapter.position}
                  </span>
                  <h1 className="text-2xl sm:text-3xl font-black text-slate-800 leading-tight">
                    {chapter.title}
                  </h1>
                </div>

                {!isLocked && (
                  <div className="shrink-0">
                    <CourseProgressButton
                      chapterId={chapterId}
                      courseId={courseId}
                      nextChapterId={nextChapter?._id}
                      isCompleted={isCompleted}
                      isNextLocked={nextChapter?.isLocked}
                    />
                  </div>
                )}
              </div>

              {chapter.description && (
                <div className="mt-6 bg-yellow-50 rounded-2xl p-5 sm:p-6 border-2 border-yellow-100">
                  <h2 className="text-lg font-bold text-yellow-800 mb-3 flex items-center gap-2">
                    <span aria-hidden>📜</span> Mission Briefing
                  </h2>
                  <div className="text-slate-700">
                    <Preview value={chapter.description} />
                  </div>
                </div>
              )}
            </div>

            {chapter.assignments.length > 0 && (
              <div className="bg-white rounded-3xl p-5 sm:p-6 shadow-lg border-b-8 border-r-8 border-amber-100">
                <h2 className="text-xl font-black text-amber-800 mb-4 flex items-center gap-2">
                  <span aria-hidden>⭐</span> Side Quests
                </h2>
                <div className="space-y-3">
                  {chapter.assignments.map((assignment) => (
                    <SideQuest
                      key={assignment._id}
                      href={`/courses/${courseId}/assignments/${assignment._id}`}
                      title={assignment.title}
                      points={assignment.points}
                      isSubmitted={assignment.isSubmitted}
                    />
                  ))}
                </div>
              </div>
            )}

            {chapter.attachments.length > 0 && (
              <div className="bg-white rounded-3xl p-5 sm:p-6 shadow-lg border-b-8 border-r-8 border-blue-100">
                <h2 className="text-xl font-black text-blue-800 mb-4 flex items-center gap-2">
                  <span aria-hidden>🎒</span> Your Backpack
                </h2>
                <ResourcesCard attachments={chapter.attachments} />
              </div>
            )}
          </div>

          {/* Side column */}
          <ProgressOverview
            courseId={courseId}
            position={chapter.position}
            totalChapters={chapter.totalChapters}
            completedChapters={chapter.completedChapters}
            previousChapter={chapter.previousChapter}
            nextChapter={nextChapter}
          />
        </div>
      </div>
    </div>
  );
}
