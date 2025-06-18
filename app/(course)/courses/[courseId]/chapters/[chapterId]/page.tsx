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

interface PageProps {
  params: Promise<{ courseId: string; chapterId: string }>;
}

const ChapterIdPage = async ({ params }: PageProps) => {
  const { userId } = await auth();
  if (!userId) {
    return redirect("/");
  }

  // Await the params object
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
              <CourseEnrollButton
                courseId={courseId}
                price={course.price!}
              />
            )}
          </div>
          <Separator />
          <div>
            <Preview value={chapter.description} />
          </div>
          {!!attachments.length && (
            <>
              <Separator />
              <h2 className="text-xl font-semibold mt-2 py-1 px-4">
                Course Attachments
              </h2>
              <div className="p-4">
                {attachments.map((attachment, idx) => (
                  <a 
                    href={attachment} 
                    key={idx} 
                    target="_blank"
                    className="flex items-center p-3 w-full bg-sky-200 border text-sky-700 rounded-md hover:underline"
                  >
                    <File />
                    <p className="line-clamp-1">
                      {attachment}
                    </p>
                  </a>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ChapterIdPage;