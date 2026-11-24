"use client"

import { Button } from "@/components/ui/button"
import { useConfettiStore } from "@/hooks/use-confetti-store"
import axios from "axios"
import { CheckCircle, Loader2, RotateCcw } from "lucide-react"
import { useRouter } from "next/navigation"
import { useState } from "react"
import toast from "react-hot-toast"

interface courseProgressButtonProps{
    chapterId: string,
    courseId: string,
    isCompleted?: boolean,
    nextChapterId?: string,
    isNextLocked?: boolean
}

export const CourseProgressButton = ({ chapterId,courseId,isCompleted,nextChapterId,isNextLocked}: courseProgressButtonProps) => {
    const router = useRouter()
    const confetti = useConfettiStore()
    const [isLoading,setIsLoading] = useState(false)

    const onClick = async () => {
        try {
            setIsLoading(true)
            await axios.post(`/api/courses/${courseId}/chapters/${chapterId}/progress`, {
                isCompleted: !isCompleted
            })

            if(!isCompleted && !nextChapterId){
                confetti.onOpen()
            }

            if(!isCompleted && nextChapterId && !isNextLocked){
                router.push(`/courses/${courseId}/chapters/${nextChapterId}`)
            }

            toast.success(isCompleted ? "Marked as not complete" : "Mission complete!")
            router.refresh()

        } catch (error) {
            toast.error("We couldn't save your progress. Please try again.")
        }finally{
            setIsLoading(false)
        }
    }

    const Icon = isLoading ? Loader2 : isCompleted ? RotateCcw : CheckCircle

    return(
        <Button
            onClick={onClick}
            disabled={isLoading}
            type="button"
            variant={isCompleted ? "outline" : "success"}
            className={
                isCompleted
                    ? "w-full sm:w-auto rounded-xl font-bold border-2 text-slate-600"
                    : "w-full sm:w-auto rounded-xl font-bold border-b-4 border-emerald-800 active:border-b-0 active:translate-y-1"
            }
        >
            <Icon className={isLoading ? "h-4 w-4 mr-2 animate-spin" : "h-4 w-4 mr-2"} />
            {isCompleted ? "Mark as not complete" : "Mark as complete"}
        </Button>
    )
}
