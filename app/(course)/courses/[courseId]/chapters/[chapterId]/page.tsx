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
    <div>
      {isCompleted && (
        <Banner variant="success" label="You already completed this chapter." />
      )}
      {isLocked && (
        <Banner
          variant="warning"
          label="You need to purchase this course to watch this chapter!"
        />
      )}
      <div className="flex flex-col max-w-4xl mx-auto pb-20">
        <div className="p-4">
          <VideoPlayer
            chapterId={chapterId}
            title={chapter.title}
            courseId={courseId}
            nextChapterId={nextChapter?._id!}
            playbackId={muxData!}
            isLocked={isLocked}
            completeOnEnd={completeOnEnd}
          />

          <ProgressOverview
            currentChapterTitle={chapter.title}
            currentChapter={2}
            totalChapters={course.chapters?.length || 0}
            nextChapterTitle={nextChapter?._id}
          />
        </div>

        <div>
          <div className="p-4 flex flex-col md:flex-row items-center justify-between">
            <h2 className="text-2xl font-semibold mb-2">{chapter.title}</h2>
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
          <Separator />
          <div>
            {/* <LearningObjectivesCard
              objectives={chapter.learningObjectives || []}
            /> */}
            <Preview value={chapter.description} />
          </div>
          {!!attachments?.length && (
            <ResourcesCard attachments={attachments} />

          )}
        </div>
      </div>
    </div>
  );
}
