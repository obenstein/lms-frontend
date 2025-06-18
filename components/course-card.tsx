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
    <Link href={`/courses/${_id}`}>
      <div className="group hover:shadow-sm transition overflow-hidden border rounded-lg p-3 h-full">
        <div className="relative w-full aspect-video rounded-md overflow-hidden">
          <Image fill className="object-cover" alt={title} src={imageUrl} />
        </div>
        <div className="flex flex-col pt-2">
          <div className="text-lg md:text-base font-medium group-hover:text-sky-700 transition line-clamp-2">
            {title}
          </div>
          <div className="text-xs text-muted-foreground">
            <p>{category}</p>
            <div className="my-3 flex items-center gap-x-2 text-sm md:text-xs">
              <div className="flex items-center gap-x-1 text-slate-500">
                <IconBadge icon={BookOpen} size="sm" />
                <span>
                  {chaptersLength}
                  {chaptersLength === 1 ? " Chapter" : " Chapters"}
                </span>
              </div>
            </div>
            {progress !== null ? (
              <CourseProgress
                size="sm"
                value={progress}
                variant={progress === 100 ? "success" : "default"}
              />
            ) : (
              <p className="text-md md:text-sm text-end font-medium">
                {formatPrice(price)}
              </p>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
};
