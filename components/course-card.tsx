"use client";

import Image from "next/image";
import Link from "next/link";

import { IconBadge } from "@/components/icon-bage";
import { BookOpen } from "lucide-react";
import { formatPrice } from "@/lib/format";
import { CourseProgress } from "@/components/course-progress";

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
  return (
    <Link href={`/courses/${_id}/overview`}>
      <div className="group hover:shadow-xl transition-all duration-300 overflow-hidden border-2 border-slate-100 rounded-3xl p-3 h-full bg-white hover:-translate-y-1 hover:border-blue-200">
        <div className="relative w-full aspect-video rounded-2xl overflow-hidden shadow-sm group-hover:shadow-md transition-shadow">
          <Image fill className="object-cover transition-transform duration-500 group-hover:scale-110" alt={title} src={imageUrl} />
          {/* Overlay gradient on hover */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        </div>
        <div className="flex flex-col pt-4 px-2">
          <div className="text-lg md:text-xl font-bold text-slate-800 group-hover:text-blue-600 transition-colors line-clamp-2 mb-2">
            {title}
          </div>
          <div className="text-xs text-muted-foreground">
            <span className="inline-block px-2 py-1 rounded-md bg-slate-100 text-slate-600 font-semibold text-xs mb-3 group-hover:bg-blue-50 group-hover:text-blue-600 transition-colors">
              {category}
            </span>
            <div className="my-2 flex items-center gap-x-2 text-sm md:text-xs">
              <div className="flex items-center gap-x-1 text-slate-500 font-medium bg-slate-50 px-2 py-1 rounded-full">
                <IconBadge icon={BookOpen} size="sm" />
                <span>
                  {chaptersLength}
                  {chaptersLength === 1 ? " Chapter" : " Chapters"}
                </span>
              </div>
            </div>
            {progress !== null ? (
              <div className="mt-3">
                <CourseProgress
                  size="sm"
                  value={progress}
                  variant={progress === 100 ? "success" : "default"}
                />
                <p className="text-xs text-center mt-1 font-medium text-slate-400">
                  {Math.round(progress)}% Complete
                </p>
              </div>
            ) : (
              <p className="text-md md:text-sm text-end font-medium">
                {/* {formatPrice(price)} */}
              </p>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
};