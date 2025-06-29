import { IconBadge } from "@/components/icon-bage";
import { auth } from "@clerk/nextjs/server";
import axios from "axios";
import { ArrowLeft, Eye, LayoutDashboard, Video, File } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";
import ChapterTitleForm from "./_components/chapter-title-form";
import ChapterDescriptionForm from "./_components/chapter-description-form";
import ChapterAccessForm from "./_components/chapter-access-form";
import ChapterVideoForm from "./_components/chapter-video-form";
import { Banner } from "@/components/banner";
import { ChapterActions } from "./_components/chapter-actions";
import AttachmentsForm from "../../_components/attachments-form";
export default async function ChapterIdPage({
  params,
}: {
  params: { courseId: string; chapterId: string };
}) {
  // Await params before using
  const { courseId, chapterId } = await params;

  const { userId } = await auth();
  if (!userId) {
    return redirect("/");
  }

  const chapter = await (
    await axios.get(
      `${process.env.BACK_END_URL}/api/chapters/${chapterId}/course/${courseId}`
    )
  ).data;

  const requiredFields = [chapter.title, chapter.description, chapter.videoUrl];

  const totalFields = requiredFields.length;
  const completedFields = requiredFields.filter(Boolean).length;
  const completionText = `(${completedFields}/${totalFields})`;
  // const attachments= 
  const isComplete = requiredFields.every(Boolean);
  return (
    <>
      {!chapter.isPublished && (
        <Banner
          label="This chapter is unpublished. It will not be visible in the course."
          variant="warning"
        />
      )}
      {chapter.isPublished && (
        <Banner
          label="This chapter is Published. It is visible in the course."
          variant="success"
        />
      )}
      <div className="p-6">
        <div className="flex items-center justify-between">
          <div className="w-full">
            <Link
              href={`/teacher/courses/${courseId}`}
              className="flex items-center text-sm font-medium hover:opacity-75 transition mb-6"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to course setup
            </Link>
            <div className="flex items-center justify-between w-full">
              <div className="flex flex-col gap-y-1">
                <h1 className="text-2xl font-medium">Chapter Creation</h1>
                <span className="text-sm text-slate-500">
                  completed fields {completionText}
                </span>
              </div>
              <ChapterActions
                disabled={!isComplete}
                courseId={courseId}
                chapterId={chapterId}
                isPublished={chapter.isPublished}
              />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-16">
          <div className="space-y-4">
            <div>
              <div className="flex items-center gap-x-2">
                <IconBadge icon={LayoutDashboard} />
                <h2 className="text-xl font-medium">Customize your chapter</h2>
              </div>
              <ChapterTitleForm
                intialData={chapter}
                courseId={courseId}
                chapterId={chapterId}
              />
              <ChapterDescriptionForm
                intialData={chapter}
                courseId={courseId}
                chapterId={chapterId}
              />
            </div>
            <div>
              <div className="flex items-center gap-x-2">
                <IconBadge icon={File} />
                <h2 className="text-xl font-medium">Resources & Attachments</h2>
              </div>
              
              <AttachmentsForm intialData={chapter} chapterId={chapter._id} />
            </div>
            <div>
              <div className="flex items-center gap-x-2">
                <IconBadge icon={Eye} />
                <h2 className="text-xl font-medium">Access Settings</h2>
              </div>
              <ChapterAccessForm
                intialData={chapter}
                courseId={courseId}
                chapterId={chapterId}
              />
            </div>
          </div>

          <div>
            <div className="flex items-center gap-x-2">
              <IconBadge icon={Video} />
              <h2 className="text-xl font-medium">Add a video</h2>
            </div>
            <ChapterVideoForm
              intialData={chapter}
              courseId={courseId}
              chapterId={chapterId}
            />
          </div>
        </div>
      </div>
    </>
  );
}
