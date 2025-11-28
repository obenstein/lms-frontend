"use client"

import { cn } from "@/lib/utils"
import { Check, Lock, Play } from "lucide-react"
import { usePathname, useRouter } from "next/navigation"

interface courseSidebarItemProps {
  _id: string
  label: string
  isCompleted: boolean
  isLocked: boolean
  courseId: string
}

export const CourseSidebarItem = ({
  _id,
  label,
  isCompleted,
  isLocked,
  courseId,
}: courseSidebarItemProps) => {

  const pathname = usePathname();
  const router = useRouter();

  const Icon = isLocked ? Lock : isCompleted ? Check : Play;
  const isActive = pathname?.includes(_id);

  const onClick = () => {
    router.push(`/courses/${courseId}/chapters/${_id}`);
  }

  return (
    <button
      onClick={onClick}
      type="button"
      className={cn(
        "group flex items-center gap-x-3 w-full px-4 py-3 text-sm font-bold rounded-2xl transition-all duration-200 border-2",
        isActive
          ? "bg-blue-50 text-blue-700 border-blue-200 shadow-sm"
          : "bg-transparent text-slate-600 border-transparent hover:bg-slate-50 hover:text-slate-700 hover:border-slate-100",
        isCompleted && "text-emerald-700 bg-emerald-50/50 border-emerald-100/50",
        isCompleted && isActive && "bg-emerald-50 border-emerald-200",
        isLocked && "opacity-60 cursor-not-allowed hover:bg-transparent hover:border-transparent"
      )}
    >
      <div className={cn(
        "flex items-center justify-center rounded-full w-8 h-8 transition-all",
        isActive && "bg-blue-100 text-blue-600",
        !isActive && isCompleted && "bg-emerald-100 text-emerald-600",
        !isActive && !isCompleted && "bg-slate-100 text-slate-500 group-hover:bg-slate-200"
      )}>
        <Icon size={16} />
      </div>
      <span className={cn(
        "line-clamp-2 text-left",
        isActive && "text-blue-800",
        isCompleted && "text-emerald-800"
      )}>
        {label}
      </span>
      {isCompleted && (
        <div className="ml-auto border-2 border-emerald-200 rounded-full p-0.5 bg-emerald-100">
          <Check className="h-3 w-3 text-emerald-600" />
        </div>
      )}
    </button>
  )
}
