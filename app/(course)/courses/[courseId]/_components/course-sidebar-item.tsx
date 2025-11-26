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

  const pathname = usePathname()
  const router = useRouter()

//   const Icon = isLocked ? Lock : isCompleted ? Check : Play
const Icon = Play
  const isActive = true
     isCompleted = false
    isLocked= false
  const onClick = () => {
    router.push(`/courses/${courseId}/chapters/${_id}`)
  }
  return (
    <button
      onClick={onClick}
      className={cn(
        "w-full flex items-center gap-x-3 px-5 py-4 text-sm font-medium rounded-lg transition-all",
        "hover:bg-blue-100/40 mb-2 ",
        isActive && "bg-blue-100/60 text-blue-700 shadow-inner",
        isCompleted && "text-emerald-700",
        isLocked && "opacity-60 cursor-not-allowed hover:bg-transparent"
      )}
    >
      {/* Active Indicator */}
      <div
        className={cn(
          "w-1 h-full rounded-r-lg bg-blue-600 opacity-0 transition-all",
          isActive && "opacity-100"
        )}
      />

      {/* Icon Bubble */}
      <div
        className={cn(
          "w-9 h-9 flex items-center justify-center rounded-full transition",
          isLocked
            ? "bg-slate-200 text-slate-500"
            : isCompleted
            ? "bg-emerald-100 text-emerald-700"
            : isActive
            ? "bg-blue-200 text-blue-700"
            : "bg-slate-100 text-slate-600"
        )}
      >
        <Icon size={18} />
      </div>

      {/* Title */}
      <span className="text-slate-700 text-[15px]">{label}</span>
    </button>
  )
}
