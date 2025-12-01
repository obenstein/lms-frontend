import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { ArrowLeft, Clock, Play, Lock, Radio, Video, Calendar } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CourseProgress } from "@/components/course-progress";

interface Assignment {
  _id: string;
  title: string;
  description: string;
  dueDate: string;
  points: number;
  fileUrl?: string;
}
interface Chapter {
  _id: string;
  title: string;
  description: string;
  videoUrl: string;
  position: number;
  isPublished: boolean;
  isFree: boolean;
  isCompleted: {
    [userId: string]: boolean;
  } | null;
  assignments: Assignment[];
}

interface Course {
  _id: string;
  title: string;
  description: string;
  imageUrl: string;
  price: number;
  isPublished: boolean;
  categoryId: string;
  chapters: Chapter[];
}

interface LiveSession {
  title:string;
  _id: string;
  studentId: string;
  date: string;
  startTime: string;
  joinLink: string;
  status: string;
  createdAt: string;
}

// Helper function to organize chapters by weeks
const organizeChaptersByWeeks = (
  chapters: Chapter[],
  chaptersPerWeek: number = 2
) => {
  const weeks = [];
  const sortedChapters = chapters
    .filter((chapter) => chapter.isPublished)
    .sort((a, b) => a.position - b.position);

  for (let i = 0; i < sortedChapters.length; i += chaptersPerWeek) {
    weeks.push({
      weekNumber: Math.floor(i / chaptersPerWeek) + 1,
      chapters: sortedChapters.slice(i, i + chaptersPerWeek),
    });
  }

  return weeks;
};

// Helper function to check if a week is unlocked
const isWeekUnlocked = (
  weekNumber: number,
  completedChapters: number,
  chaptersPerWeek: number
) => {
  const requiredCompletedChapters = (weekNumber - 1) * chaptersPerWeek;
  return completedChapters >= requiredCompletedChapters;
};

export default async function CourseOverviewPage({
  params,
}: any) {
  const { courseId } = await params;
  const { userId } = await auth();

  if (!userId) {
    return redirect("/");
  }

  try {
    // Fetch course data
    const courseRes = await fetch(
      `${process.env.BACK_END_URL}/api/courses/${courseId}`,
      { cache: "no-store" }
    );
    if (!courseRes.ok) {
      console.error(
        `Course fetch failed: ${courseRes.status} ${courseRes.statusText}`
      );
      return redirect("/");
    }

    const courseData = await courseRes.json();

    // Fetch chapters using the chapters route

    const chaptersRes = await fetch(
      `${process.env.BACK_END_URL}/api/chapters/${courseId}?userId=${userId}`,
      { cache: "no-store" }
    );

    let chapters: Chapter[] = [];
    if (chaptersRes.ok) {
      const chaptersData = await chaptersRes.json();
      chapters = Array.isArray(chaptersData) ? chaptersData : [];
    } else {
      console.warn(
        `Chapters fetch failed: ${chaptersRes.status} ${chaptersRes.statusText}`
      );
    }
    
    // Fetch Live Sessions
    let liveSessions: LiveSession[] = [];
    try {
        const sessionsRes = await fetch(
            `${process.env.BACK_END_URL}/api/live-sessions/student/${userId}`,
            { cache: "no-store" }
        );
        if (sessionsRes.ok) {
            liveSessions = await sessionsRes.json();
        }
    } catch (error) {
        console.error("Failed to fetch live sessions", error);
    }

    console.log({liveSessions})

    // Combine course data with chapters
    const course: Course = {
      ...courseData,
      chapters,
    };

    // Fetch user progress
    const courseChapters = course.chapters.filter(
      (chapter) => chapter.isPublished
    );
    const completedChapters = courseChapters.filter(
      (chapter) => chapter.isCompleted?.[userId] === true
    ).length;

    const progressPercentage =
      courseChapters.length > 0
        ? (completedChapters / courseChapters.length) * 100
        : 0;

    const chaptersPerWeek = 2;
    const weeks = organizeChaptersByWeeks(courseChapters, chaptersPerWeek);

    return (
      <div className="min-h-screen bg-[#F0F9FF] bg-[radial-gradient(#E0F2FE_1px,transparent_1px)] [background-size:16px_16px]">
        {/* Fun Header */}
        <div className="bg-white/80 backdrop-blur-md border-b-4 border-blue-200 sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-20">
              <Link
                href="/"
                className="group flex items-center text-base font-bold text-blue-500 hover:text-blue-600 transition-all transform hover:scale-105 bg-blue-50 px-4 py-2 rounded-full border-2 border-blue-100 hover:border-blue-300"
              >
                <ArrowLeft className="h-5 w-5 mr-2 group-hover:-translate-x-1 transition-transform" />
                Back to Adventures
              </Link>
            </div>
          </div>
        </div>

        {/* Course Info Hero */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="bg-white rounded-3xl shadow-xl border-b-8 border-r-8 border-blue-200 p-8 mb-10 transform transition-all hover:-translate-y-1 duration-300">
            <div className="flex flex-col lg:flex-row gap-8">
              <div className="flex-1">
                <div className="inline-block px-4 py-1.5 rounded-full bg-yellow-100 text-yellow-700 font-bold text-sm mb-4 border-2 border-yellow-200">
                  🚀 Let's Learn!
                </div>
                <h1 className="text-4xl md:text-5xl font-extrabold text-slate-800 mb-4 tracking-tight">
                  {course.title}
                </h1>
                <p className="text-lg text-slate-600 mb-6 leading-relaxed font-medium">
                  {course.description}
                </p>

                <div className="flex flex-wrap items-center gap-4 mb-8">
                  <div className="flex items-center gap-2 bg-indigo-50 px-4 py-2 rounded-2xl border-2 border-indigo-100 text-indigo-700 font-bold">
                    <span className="text-xl">📚</span>
                    {courseChapters.length} Chapters
                  </div>
                  <div className="flex items-center gap-2 bg-purple-50 px-4 py-2 rounded-2xl border-2 border-purple-100 text-purple-700 font-bold">
                    <span className="text-xl">🗺️</span>
                    {weeks.length} Levels
                  </div>
                </div>

                {progressPercentage > 0 && (
                  <div className="bg-green-50 rounded-2xl p-6 border-2 border-green-100">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-base font-bold text-green-800 flex items-center gap-2">
                        <span>🏆</span> Your Adventure Progress
                      </span>
                      <span className="text-sm font-bold text-green-600 bg-white px-3 py-1 rounded-full border border-green-200">
                        {completedChapters}/{courseChapters.length} completed
                      </span>
                    </div>
                    <div className="h-4 bg-white rounded-full overflow-hidden border-2 border-green-200">
                      <div
                        className="h-full bg-gradient-to-r from-green-400 to-emerald-500 transition-all duration-1000 ease-out rounded-full relative"
                        style={{ width: `${progressPercentage}%` }}
                      >
                        <div className="absolute inset-0 bg-white/20 animate-[shimmer_2s_infinite]"></div>
                      </div>
                    </div>
                    <p className="text-center mt-3 text-green-700 font-medium text-sm">
                      {progressPercentage === 100
                        ? "🎉 Amazing! You've completed everything!"
                        : "Keep going! You're doing great! 🌟"}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Live Sessions / Incoming Transmissions */}
      {/* Live Sessions / Incoming Transmissions */}
{liveSessions.length > 0 && (
  <div className="mb-10">
    <h2 className="text-3xl font-black text-slate-800 pl-2 border-l-8 border-red-400 mb-6 flex items-center gap-3">
      <Radio className="h-8 w-8 text-red-500 animate-pulse" />
      Incoming Transmissions
    </h2>

    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {liveSessions.map((session) => {
        const date = new Date(session.startTime);
        let joinUrl = session.joinLink;
        if (!joinUrl.startsWith("http://") && !joinUrl.startsWith("https://")) {
            joinUrl = `https://${joinUrl}`;
        }

        return (
          <div
            key={session._id}
            className="bg-white rounded-3xl p-6 border-b-8 border-r-8 border-red-100 shadow-lg hover:scale-[1.02] transition-transform"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 bg-red-100 rounded-2xl text-red-500">
                <Video className="h-6 w-6" />
              </div>
              <div>
                <h3 className="font-bold text-slate-800 text-lg">{session?.title}</h3>
                <span className="text-xs font-bold text-red-400 uppercase tracking-wider">
                  Live Session
                </span>
              </div>
            </div>

            <div className="space-y-3 mb-6">
              <div className="flex items-center gap-2 text-slate-600 font-medium">
                <Calendar className="h-4 w-4 text-slate-400" />
                {date.toLocaleDateString(undefined, {
                  weekday: "long",
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </div>

              <div className="flex items-center gap-2 text-slate-600 font-medium">
                <Clock className="h-4 w-4 text-slate-400" />
                {date.toLocaleTimeString(undefined, {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </div>
            </div>

            <a href={joinUrl} target="_blank" rel="noopener noreferrer" className="block">
              <Button className="w-full rounded-xl font-bold bg-red-500 hover:bg-red-600 text-white border-b-4 border-red-700 active:border-b-0 active:translate-y-1">
                Join Mission Control
              </Button>
            </a>
          </div>
        );
      })}
    </div>
  </div>
)}



          {/* Weekly Content / Levels */}
          <div className="space-y-8">
            <h2 className="text-3xl font-black text-slate-800 pl-2 border-l-8 border-yellow-400">
              Your Journey Map
            </h2>

            {weeks.length === 0 ? (
              <div className="bg-white rounded-3xl p-12 text-center border-4 border-dashed border-gray-200">
                <div className="text-6xl mb-4">📭</div>
                <p className="text-xl text-gray-500 font-medium">
                  No adventures available yet. Check back soon!
                </p>
              </div>
            ) : (
              weeks.map((week, index) => {
                const isUnlocked = isWeekUnlocked(
                  week.weekNumber,
                  completedChapters,
                  chaptersPerWeek
                );

                // Alternating colors for weeks/levels
                const colorSchemes = [
                  { bg: "bg-blue-50", border: "border-blue-200", title: "text-blue-700", icon: "bg-blue-100 text-blue-600" },
                  { bg: "bg-purple-50", border: "border-purple-200", title: "text-purple-700", icon: "bg-purple-100 text-purple-600" },
                  { bg: "bg-orange-50", border: "border-orange-200", title: "text-orange-700", icon: "bg-orange-100 text-orange-600" },
                ];
                const theme = colorSchemes[index % colorSchemes.length];

                return (
                  <div
                    key={week.weekNumber}
                    className={`relative rounded-3xl overflow-hidden transition-all duration-300 ${!isUnlocked
                        ? "bg-gray-100 border-4 border-gray-200 opacity-90 grayscale-[0.5]"
                        : `bg-white border-b-8 border-r-8 ${theme.border} shadow-lg hover:scale-[1.01]`
                      }`}
                  >
                    {!isUnlocked && (
                      <div className="absolute inset-0 bg-gray-100/50 z-10 flex items-center justify-center backdrop-blur-[1px]">
                        <div className="bg-white p-4 rounded-2xl shadow-xl border-4 border-gray-200 flex items-center gap-3 transform rotate-[-2deg]">
                          <Lock className="h-8 w-8 text-gray-400" />
                          <span className="font-bold text-gray-500 text-lg">Level Locked!</span>
                        </div>
                      </div>
                    )}

                    <div className={`p-6 border-b-2 ${!isUnlocked ? "border-gray-200" : theme.border} ${!isUnlocked ? "bg-gray-50" : theme.bg}`}>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-2xl font-black shadow-sm ${!isUnlocked ? "bg-gray-200 text-gray-400" : "bg-white text-slate-700"}`}>
                            {week.weekNumber}
                          </div>
                          <div>
                            <h3 className={`text-2xl font-black ${!isUnlocked ? "text-gray-500" : theme.title}`}>
                              Level {week.weekNumber}
                            </h3>
                            <p className={`font-medium ${!isUnlocked ? "text-gray-400" : "text-slate-500"}`}>
                              {week.chapters.length} Mission{week.chapters.length !== 1 ? "s" : ""}
                            </p>
                          </div>
                        </div>
                        <Badge
                          className={`px-4 py-1.5 text-sm rounded-xl font-bold ${isUnlocked
                              ? "bg-green-500 hover:bg-green-600 border-b-4 border-green-700 text-white"
                              : "bg-gray-300 text-gray-500 border-b-4 border-gray-400"
                            }`}
                        >
                          {isUnlocked ? "🔓 Unlocked" : "🔒 Locked"}
                        </Badge>
                      </div>
                    </div>

                    <div className="p-6 space-y-4">
                      {week.chapters.map((chapter) => {
                        const isCompleted = chapter.isCompleted?.userId;
                        const canAccess = isUnlocked && (chapter.isFree || true);

                        return (
                          <div key={chapter._id} className="group">
                            <div
                              className={`relative flex items-center justify-between p-4 rounded-2xl border-2 transition-all duration-200 ${isCompleted
                                  ? "bg-green-50 border-green-200"
                                  : canAccess
                                    ? "bg-white border-slate-100 hover:border-blue-300 hover:shadow-md hover:-translate-y-0.5"
                                    : "bg-gray-50 border-gray-100"
                                }`}
                            >
                              <div className="flex items-center gap-5 flex-1">
                                <div
                                  className={`flex items-center justify-center w-12 h-12 rounded-2xl shadow-sm transition-transform group-hover:scale-110 ${isCompleted
                                      ? "bg-green-500 text-white rotate-[-3deg]"
                                      : canAccess
                                        ? "bg-blue-500 text-white rotate-[3deg]"
                                        : "bg-gray-200 text-gray-400"
                                    }`}
                                >
                                  {isCompleted ? (
                                    <span className="text-xl">✅</span>
                                  ) : canAccess ? (
                                    <Play className="h-6 w-6 fill-current" />
                                  ) : (
                                    <Lock className="h-5 w-5" />
                                  )}
                                </div>

                                <div className="flex-1">
                                  <h4 className={`text-lg font-bold ${isCompleted ? "text-green-800" : "text-slate-800"}`}>
                                    {chapter.title}
                                  </h4>
                                  {chapter.description && (
                                    <p className="text-sm text-slate-500 mt-1 line-clamp-1 font-medium">
                                      {chapter.description}
                                    </p>
                                  )}
                                </div>
                              </div>

                              <div className="flex items-center gap-2">
                               
                                {canAccess ? (
                                  <Link
                                    href={`/courses/${courseId}/chapters/${chapter._id}`}
                                  >
                                    <Button
                                      size="sm"
                                      className={`rounded-xl font-bold px-6 border-b-4 active:border-b-0 active:translate-y-1 transition-all ${isCompleted
                                          ? "bg-green-100 text-green-700 hover:bg-green-200 border-green-300"
                                          : "bg-blue-500 hover:bg-blue-600 text-white border-blue-700"
                                        }`}
                                    >
                                      {isCompleted ? "Replay" : "Start!"}
                                    </Button>
                                  </Link>
                                ) : (
                                  <Button size="sm" variant="ghost" disabled className="text-gray-400 font-bold">
                                    Locked
                                  </Button>
                                )}
                              </div>
                            </div>

                            {/* Assignments / Side Quests */}
                            {chapter && chapter?.assignments?.length > 0 && (
                              <div className="ml-8 mt-3 pl-6 border-l-4 border-dashed border-slate-200 space-y-3">
                                {chapter?.assignments?.map((assignment) => (
                                  <div
                                    key={assignment._id}
                                    className="flex items-center justify-between bg-amber-50 border-2 border-amber-100 p-4 rounded-xl hover:bg-amber-100 transition-colors group/assignment"
                                  >
                                    <div className="flex items-center gap-3">
                                      <div className="bg-amber-200 w-8 h-8 rounded-lg flex items-center justify-center text-lg shadow-sm group-hover/assignment:scale-110 transition-transform">
                                        ⭐
                                      </div>
                                      <div>
                                        <h5 className="text-sm font-bold text-amber-900">
                                          Side Quest: {assignment.title}
                                        </h5>
                                        <p className="text-xs text-amber-700 font-medium mt-0.5">
                                          Reward: {assignment.points} XP Points
                                        </p>
                                      </div>
                                    </div>
                                    <Link
                                      href={`/courses/${courseId}/assignments/${assignment._id}`}
                                    >
                                      <Button size="sm" className="bg-amber-500 hover:bg-amber-600 text-white border-b-4 border-amber-700 rounded-lg font-bold active:border-b-0 active:translate-y-1">
                                        Accept
                                      </Button>
                                    </Link>
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
    );
  } catch (error) {
    console.error("Course overview page error:", error);
    return redirect("/");
  }
}
