import { getChapters } from "@/actions/get-chapters";
import { Banner } from "@/components/banner";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { VideoPlayer } from "./_components/video-player";
import { CourseEnrollButton } from "./_components/course-enroll-button";
import { Separator } from "@/components/ui/separator";
import { Preview } from "@/components/preview";
import { File } from "lucide-react";
import { CourseProgressButton } from "./_components/course-progress-button";
import { LearningObjectivesCard } from "./_components/learning-objectives-card";
import { ResourcesCard } from "./_components/resource-card";
import { ProgressOverview } from "./_components/progress-overview";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
export default async function ChapterIdPage({
  params,
}: any) {
  // Await params before using

  const { userId } = await auth();
  if (!userId) {
    return redirect("/");
  }
  const { courseId, chapterId } = await params;

  const {
    course,
    chapter,
    attachments,
    purchased,
    muxData,
    nextChapter,
    isCompleted,
  } = await getChapters({
    userId: userId,
    courseId: courseId,
    chapterId: chapterId,
  });

  if (!course || !chapter) {
    return redirect("/");
  }

  const isLocked = !chapter.isFree && !purchased;
  const completeOnEnd = !!purchased && isCompleted;

  // console.log("attachments", attachments);
  return (
    <div className="min-h-screen bg-[#F0F9FF] bg-[radial-gradient(#E0F2FE_1px,transparent_1px)] [background-size:16px_16px] pb-20">
      

      {isCompleted && (
        <div className="bg-green-100 border-b-4 border-green-200 p-4 text-center animate-in slide-in-from-top">
          <p className="text-green-800 font-bold flex items-center justify-center gap-2">
            <span>🎉</span> Mission Accomplished! You've completed this chapter!
          </p>
        </div>
      )}
      {isLocked && (
        <div className="bg-yellow-100 border-b-4 border-yellow-200 p-4 text-center">
          <p className="text-yellow-800 font-bold flex items-center justify-center gap-2">
            <span>🔒</span> This adventure is locked! Ask a parent to help unlock it.
          </p>
        </div>
      )}

      <div className="flex flex-col max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        <div className="mb-6">
          <Link
            href={`/courses/${courseId}/overview`}
            className="inline-flex items-center px-4 py-2 rounded-full bg-white text-blue-600 font-bold hover:bg-blue-50 transition-all shadow-sm border-2 border-blue-100 hover:border-blue-200"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Mission Control
          </Link>
        </div>

        {/* Video Player "Cinema" Section */}
        <div className="bg-slate-900 rounded-[2rem] p-3 shadow-2xl border-b-8 border-slate-800 mb-8 transform transition-all hover:scale-[1.01]">
          
          <div className="flex items-center justify-between px-4 py-2 mb-2">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-red-500"></div>
              <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
              <div className="w-3 h-3 rounded-full bg-green-500"></div>
            </div>
            <div className="text-slate-400 text-xs font-mono uppercase tracking-widest">Now Playing</div>
          </div>
          <div className="rounded-3xl overflow-hidden bg-black border-4 border-slate-800 relative aspect-video">
            <VideoPlayer
              chapterId={chapterId}
              title={chapter.title}
              courseId={courseId}
              nextChapterId={nextChapter?._id!}
              playbackId={muxData!}
              isLocked={isLocked}
              completeOnEnd={completeOnEnd}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content Column */}
          <div className="lg:col-span-2 space-y-8">

            {/* Title & Controls Card */}
            <div className="bg-white rounded-3xl p-6 shadow-lg border-b-8 border-r-8 border-indigo-100">
              <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-6">
                <div>
                  <h2 className="text-3xl font-black text-slate-800 mb-2">
                    {chapter.title}
                  </h2>
                  <div className="flex items-center gap-2">
                    <span className="bg-indigo-100 text-indigo-700 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide">
                      Chapter Adventure
                    </span>
                  </div>
                </div>

                <div className="flex-shrink-0">
                  {purchased ? (
                    <CourseProgressButton
                      chapterId={chapterId}
                      courseId={courseId}
                      nextChapterId={nextChapter?._id}
                      isCompleted={isCompleted}
                    />
                  ) : (
                    <CourseEnrollButton courseId={courseId} price={course.price!} />
                  )}
                </div>
              </div>

              <Separator className="bg-slate-100 my-6" />

              {/* Mission Briefing (Description) */}
              <div className="bg-yellow-50 rounded-2xl p-6 border-2 border-yellow-100">
                <h3 className="text-lg font-bold text-yellow-800 mb-3 flex items-center gap-2">
                  <span>📜</span> Mission Briefing
                </h3>
                <div className="prose prose-slate prose-sm max-w-none">
                  <Preview value={chapter.description} />
                </div>
              </div>
            </div>

            {/* Resources / Backpack */}
            {!!attachments?.length && (
              <div className="bg-blue-50 rounded-3xl p-6 shadow-lg border-b-8 border-r-8 border-blue-100">
                <h3 className="text-xl font-black text-blue-800 mb-4 flex items-center gap-2">
                  <span>🎒</span> Your Backpack (Resources)
                </h3>
                <ResourcesCard attachments={attachments} />
              </div>
            )}
          </div>

          {/* Sidebar Column */}
          <div className="space-y-6">
            {/* Progress Overview Widget */}
            <div className="bg-white rounded-3xl p-6 shadow-lg border-b-8 border-r-8 border-purple-100 sticky top-24">
              <h3 className="text-lg font-bold text-purple-800 mb-4 flex items-center gap-2">
                <span>🗺️</span> Adventure Map
              </h3>
              <ProgressOverview
                currentChapterTitle={chapter.title}
                currentChapter={2} // Note: This seems hardcoded in original, might want to fix later if data available
                totalChapters={course.chapters?.length || 0}
                nextChapterTitle={nextChapter?._id}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
