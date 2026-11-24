"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Check, Lock, Map, Play } from "lucide-react";
import { cn } from "@/lib/utils";

interface courseSidebarItemProps {
  href: string;
  label: string;
  isCompleted: boolean;
  isLocked: boolean;
}

export const CourseSidebarItem = ({
  href,
  label,
  isCompleted,
  isLocked,
}: courseSidebarItemProps) => {
  const isActive = usePathname() === href;
  const Icon = isLocked ? Lock : isCompleted ? Check : Play;
  const showCompleted = isCompleted && !isLocked;

  return (
    <Link
      href={href}
      prefetch={false}
      aria-current={isActive ? "page" : undefined}
      className={cn(
        "group flex items-center gap-x-3 w-full px-3 py-2.5 text-sm font-bold rounded-2xl transition-colors border-2 border-transparent text-slate-600 hover:bg-slate-50",
        showCompleted && "text-emerald-800 hover:bg-emerald-50",
        isLocked && "font-medium text-slate-500",
        isActive && "bg-blue-50 text-blue-800 border-blue-200 shadow-sm hover:bg-blue-50",
        isActive && showCompleted && "bg-emerald-50 text-emerald-800 border-emerald-200 hover:bg-emerald-50"
      )}
    >
      <span
        className={cn(
          "flex shrink-0 items-center justify-center rounded-full w-8 h-8 bg-slate-100 text-slate-500",
          !isLocked && !isCompleted && "bg-blue-100 text-blue-600",
          showCompleted && "bg-emerald-500 text-white"
        )}
      >
        <Icon size={16} />
      </span>
      <span className="line-clamp-2 min-w-0 text-left">{label}</span>
      {isLocked && <span className="sr-only">(locked)</span>}
      {showCompleted && <span className="sr-only">(completed)</span>}
    </Link>
  );
};

export const CourseSidebarOverviewLink = ({ courseId }: { courseId: string }) => {
  const href = `/courses/${courseId}/overview`;
  const isActive = usePathname() === href;

  return (
    <Link
      href={href}
      aria-current={isActive ? "page" : undefined}
      className={cn(
        "flex items-center gap-x-3 w-full px-3 py-2.5 text-sm font-bold rounded-2xl transition-colors border-2 border-transparent text-slate-600 hover:bg-slate-50",
        isActive && "bg-blue-50 text-blue-800 border-blue-200 shadow-sm"
      )}
    >
      <span className="flex shrink-0 items-center justify-center rounded-full w-8 h-8 bg-yellow-100 text-yellow-700">
        <Map size={16} />
      </span>
      Journey Map
    </Link>
  );
};
