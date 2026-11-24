import Image from "next/image";
import Link from "next/link";
import { BookOpen, CheckCircle, Play, Rocket } from "lucide-react";

import { CourseProgress } from "@/components/course-progress";

interface courseCardProps {
  _id: string;
  title: string;
  imageUrl: string | null;
  category: string | null;
  progress: number;
  chaptersLength: number;
}

export const CourseCard = ({
  _id,
  title,
  imageUrl,
  category,
  progress,
  chaptersLength,
}: courseCardProps) => {
  const isCompleted = progress === 100;

  return (
    <Link
      href={`/courses/${_id}/overview`}
      className="group flex h-full flex-col bg-white rounded-[2rem] border-4 border-indigo-100 shadow-sm overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:border-indigo-300 hover:shadow-xl hover:shadow-indigo-200/50 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-indigo-300"
    >
      {/* Image */}
      <div className="relative w-full aspect-video overflow-hidden border-b-4 border-indigo-100 group-hover:border-indigo-200 transition-colors bg-gradient-to-br from-indigo-400 via-purple-400 to-blue-400">
        {imageUrl ? (
          <Image
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1280px) 50vw, 33vw"
            className="object-cover transition-transform duration-700 group-hover:scale-105"
            alt=""
            src={imageUrl}
          />
        ) : (
          <div aria-hidden className="flex h-full items-center justify-center text-6xl">
            🤖
          </div>
        )}

        {category && (
          <span className="absolute top-3 left-3 max-w-[80%] truncate rounded-full bg-white/90 px-3 py-1 text-xs font-bold text-indigo-700 shadow-sm">
            {category}
          </span>
        )}

        {/* Play button on hover */}
        <div className="absolute inset-0 flex items-center justify-center bg-slate-900/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <div className="bg-white/20 backdrop-blur-md p-4 rounded-full border-4 border-white/50 shadow-2xl">
            {isCompleted ? (
              <CheckCircle className="h-8 w-8 text-white drop-shadow-md" />
            ) : (
              <Play className="h-8 w-8 text-white fill-white drop-shadow-md ml-1" />
            )}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-5 flex flex-1 flex-col">
        <h3 className="text-lg font-black text-slate-700 group-hover:text-indigo-600 transition-colors line-clamp-2 mb-3 leading-tight">
          {title}
        </h3>

        <div className="flex w-fit items-center gap-1 bg-indigo-50 px-2.5 py-1 rounded-lg border border-indigo-100 text-indigo-600 text-sm font-bold mb-4">
          <BookOpen className="h-4 w-4" />
          {chaptersLength} {chaptersLength === 1 ? "Mission" : "Missions"}
        </div>

        {/* Progress */}
        <div className="mt-auto pt-4 border-t-2 border-slate-100 border-dashed">
          {progress > 0 ? (
            <CourseProgress
              size="sm"
              value={progress}
              variant={isCompleted ? "success" : "default"}
            />
          ) : (
            <div className="flex items-center justify-between">
              <span className="text-indigo-600 text-sm font-bold">Start Adventure</span>
              <div className="bg-indigo-50 p-2 rounded-full group-hover:bg-indigo-500 transition-colors">
                <Rocket className="h-4 w-4 text-indigo-400 group-hover:text-white transition-colors" />
              </div>
            </div>
          )}
        </div>
      </div>
    </Link>
  );
};
