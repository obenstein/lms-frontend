"use client";

import Image from "next/image";
import Link from "next/link";

import { IconBadge } from "@/components/icon-bage";
import { BookOpen, Play, CheckCircle, Star, Lock } from "lucide-react";
import { formatPrice } from "@/lib/format";
import { CourseProgress } from "@/components/course-progress";
import { Badge } from "@/components/ui/badge";

interface courseCardProps {
  _id: string;
  title: string;
  imageUrl: string;
  price: number;
  progress: number | null;
  category: string;
  chaptersLength: number;
}

export const CourseCard = ({
  _id,
  title,
  imageUrl,
  price,
  progress,
  category,
  chaptersLength,
}: courseCardProps) => {
  const isCompleted = progress === 100;

  return (
    <Link href={`/courses/${_id}/overview`}>
      <div className="group h-full transition-all duration-300 hover:-translate-y-2">
        <div className="h-full bg-white rounded-[2rem] border-4 border-slate-100 shadow-sm overflow-hidden group-hover:border-blue-200 group-hover:shadow-xl group-hover:shadow-blue-100/50 relative">
            
            {/* Image Container */}
            <div className="relative w-full aspect-video overflow-hidden border-b-4 border-slate-100 group-hover:border-blue-100 transition-colors">
                <Image
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                    alt={title}
                    src={imageUrl}
                />
                
                {/* Overlay Gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-60 group-hover:opacity-40 transition-opacity" />

                {/* Category Badge */}
                <div className="absolute top-3 right-3">
                    <Badge className="bg-white/90 text-slate-700 hover:bg-white border-2 border-slate-200 backdrop-blur-sm shadow-sm px-3 py-1 rounded-xl font-bold text-xs uppercase tracking-wider">
                        {category}
                    </Badge>
                </div>

                {/* Play Button Overlay */}
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 scale-50 group-hover:scale-100">
                    <div className="bg-white/20 backdrop-blur-md p-4 rounded-full border-4 border-white/50 shadow-2xl">
                         {isCompleted ? (
                            <CheckCircle className="h-8 w-8 text-white drop-shadow-md" />
                         ) : (
                            <Play className="h-8 w-8 text-white fill-white drop-shadow-md ml-1" />
                         )}
                    </div>
                </div>
            </div>

            {/* Content Container */}
            <div className="p-5 flex flex-col h-full">
                <h3 className="text-lg font-black text-slate-700 group-hover:text-blue-600 transition-colors line-clamp-2 mb-3 leading-tight">
                    {title}
                </h3>

                <div className="flex items-center gap-x-2 text-slate-500 text-sm font-medium mb-4">
                    <div className="flex items-center gap-1 bg-slate-50 px-2.5 py-1 rounded-lg border border-slate-100">
                        <BookOpen className="h-4 w-4 text-blue-400" />
                        <span>
                            {chaptersLength} {chaptersLength === 1 ? "Mission" : "Missions"}
                        </span>
                    </div>
                </div>

                {/* Footer / Progress */}
                <div className="mt-auto pt-4 border-t-2 border-slate-50 border-dashed">
                    {progress !== null ? (
                        <div className="space-y-2">
                             <div className="flex items-center justify-between text-xs font-bold mb-1">
                                <span className={progress === 100 ? "text-green-600" : "text-blue-600"}>
                                    {progress === 100 ? "Mission Complete!" : "Mission Progress"}
                                </span>
                                <span className="text-slate-400">{Math.round(progress)}%</span>
                             </div>
                            <CourseProgress
                                size="sm"
                                value={progress}
                                variant={progress === 100 ? "success" : "default"}
                            />
                        </div>
                    ) : (
                         <div className="flex items-center justify-between">
                            <span className="text-slate-400 text-xs font-bold uppercase tracking-wider">
                                Start Adventure
                            </span>
                             <div className="bg-blue-50 p-2 rounded-full group-hover:bg-blue-500 transition-colors">
                                <Lock className="h-4 w-4 text-blue-300 group-hover:text-white transition-colors" />
                             </div>
                         </div>
                    )}
                </div>
            </div>
        </div>
      </div>
    </Link>
  );
};