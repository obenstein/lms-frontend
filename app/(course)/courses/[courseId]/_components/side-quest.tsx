import Link from "next/link";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface SideQuestProps {
  href: string;
  title?: string;
  points?: number;
  isSubmitted: boolean;
}

/** One assignment, as a row with a link to its page. */
export const SideQuest = ({ href, title, points, isSubmitted }: SideQuestProps) => {
  return (
    <div
      className={cn(
        "flex flex-wrap items-center justify-between gap-3 border-2 p-4 rounded-xl",
        isSubmitted ? "bg-green-50 border-green-100" : "bg-amber-50 border-amber-100"
      )}
    >
      <div className="flex items-center gap-3 min-w-0">
        <div
          aria-hidden
          className={cn(
            "shrink-0 w-8 h-8 rounded-lg flex items-center justify-center text-lg shadow-sm",
            isSubmitted ? "bg-green-200" : "bg-amber-200"
          )}
        >
          {isSubmitted ? "✅" : "⭐"}
        </div>
        <div className="min-w-0">
          <h5 className={cn("text-sm font-bold", isSubmitted ? "text-green-900" : "text-amber-900")}>
            Side Quest: {title || "Assignment"}
          </h5>
          <p className={cn("text-xs font-medium mt-0.5", isSubmitted ? "text-green-700" : "text-amber-700")}>
            {isSubmitted ? "Submitted" : points ? `Reward: ${points} XP` : "Not submitted yet"}
          </p>
        </div>
      </div>
      <Button
        asChild
        size="sm"
        className={cn(
          "border-b-4 rounded-lg font-bold active:border-b-0 active:translate-y-1",
          isSubmitted
            ? "bg-green-100 hover:bg-green-200 text-green-800 border-green-300"
            : "bg-amber-400 hover:bg-amber-500 text-amber-950 border-amber-600"
        )}
      >
        <Link href={href} prefetch={false}>
          {isSubmitted ? "View" : "Accept"}
        </Link>
      </Button>
    </div>
  );
};
