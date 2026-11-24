import { Progress } from "@/components/ui/progress"
import { cn } from "@/lib/utils"

interface courseProgressProps{
    variant?: "default" | "success",
    value: number,
    size?: "default" | "sm"
}

const colorByVariant = {
     default: "text-sky-700",
     success: "text-emerald-700"
}

const sizeByVariant = {
    default: "text-sm",
    sm: "text-xs"
}

 export const CourseProgress = ({ value, variant, size }: courseProgressProps) => {
    return(
        <div>
            <Progress className="h-2.5" value={value} variant={variant} aria-label="Progress" />
            <p className={cn(
                "font-bold mt-2",
                colorByVariant[variant || "default"],
                sizeByVariant[size || "default"]
            )}>
                {value === 100 ? "Mission Complete! 🏆" : `${Math.round(value)}% complete`}
            </p>
        </div>
    )
 }
