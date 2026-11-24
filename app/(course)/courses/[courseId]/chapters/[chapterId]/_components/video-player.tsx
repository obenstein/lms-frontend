"use client";

import axios from "axios";
import MuxPlayer from "@mux/mux-player-react";
import { Clapperboard, Loader2, Lock, VideoOff } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { useConfettiStore } from "@/hooks/use-confetti-store";
import toast from "react-hot-toast";

interface VideoPlayerProps {
  playbackId: string | null;
  courseId: string;
  chapterId: string;
  nextChapterId?: string;
  isLocked: boolean;
  lockMessage: string;
  title: string;
}

const Notice = ({
  icon: Icon,
  title,
  message,
}: {
  icon: typeof Lock;
  title: string;
  message?: string;
}) => (
  <div className="absolute inset-0 flex items-center justify-center flex-col gap-y-2 sm:gap-y-3 bg-neutral-800 px-6 text-center">
    <Icon className="h-8 w-8 sm:h-12 sm:w-12 text-yellow-300" />
    <p className="text-base sm:text-xl font-bold text-white">{title}</p>
    {message && <p className="text-xs sm:text-base text-neutral-300">{message}</p>}
  </div>
);

export const VideoPlayer = ({
  chapterId,
  courseId,
  isLocked,
  lockMessage,
  nextChapterId,
  playbackId,
  title,
}: VideoPlayerProps) => {
  const [isReady, setIsReady] = useState(false);
  const [hasError, setHasError] = useState(false);
  const router = useRouter();
  const confetti = useConfettiStore();

  const onEnd = async () => {
    try {
      await axios.post(
        `/api/courses/${courseId}/chapters/${chapterId}/progress`,
        {
          isCompleted: true,
        }
      );

      if (nextChapterId) {
        toast.success("Mission complete!");
      } else {
        toast.success("GREAT! You have finished the course successfully.");
        confetti.onOpen();
        router.push(`/courses/${courseId}/overview`);
      }

      router.refresh();
    } catch (error) {
      toast.error("We couldn't save your progress. Please try again.");
    }
  };

  if (isLocked) {
    return <Notice icon={Lock} title="This mission is locked" message={lockMessage} />;
  }

  if (!playbackId) {
    return (
      <Notice icon={Clapperboard} title="Video coming soon" message="Check back a little later." />
    );
  }

  if (hasError) {
    return (
      <Notice
        icon={VideoOff}
        title="The video couldn't be loaded"
        message="Check your connection and reload the page."
      />
    );
  }

  return (
    <>
      {!isReady && (
        <div className="absolute inset-0 flex items-center justify-center bg-neutral-800">
          <Loader2 className="h-8 w-8 animate-spin text-white" aria-label="Loading video" />
        </div>
      )}
      <MuxPlayer
        className={cn("h-full w-full", !isReady && "hidden")}
        onCanPlay={() => setIsReady(true)}
        onLoadedMetadata={() => setIsReady(true)}
        onError={() => {
          // An error before anything loaded; later hiccups are the player's to handle.
          if (!isReady) setHasError(true);
        }}
        playbackId={playbackId}
        autoPlay
        onEnded={onEnd}
        title={title}
      />
    </>
  );
};
