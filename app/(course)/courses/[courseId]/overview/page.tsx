import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { ArrowLeft, Calendar, Check, Clock, Lock, Play, Radio, Video } from "lucide-react";
import Link from "next/link";
import {
  getAllChapters,
  getCourseById,
  getLiveSessionsByStudent,
  getSubmissionsByStudent,
} from "@/lib/queries";
import { getCourseEntitlement } from "@/lib/auth-guards";
import { describeLock, organizeChaptersByWeeks } from "@/lib/course-progression";
import { toPlainText } from "@/lib/format";
import { cn } from "@/lib/utils";

import { Button } from "@/components/ui/button";
import { SideQuest } from "../_components/side-quest";

interface Assignment {
  _id: string;
  title?: string;
  points?: number;
}

interface Chapter {
  _id: string;
  title?: string;
  description?: string;
  position?: number;
  isPublished: boolean;
  isCompleted?: { [userId: string]: boolean };
  assignments?: Assignment[];
}

interface LiveSession {
  _id: string;
  title: string;
  startTime: string;
  joinLink: string;
}

// Generous on purpose: start times carry no time zone, so a session is only
// called "ended" once its start is a full day behind.
const SESSION_ENDED_AFTER_MS = 24 * 60 * 60 * 1000;

const LEVEL_THEMES = [
  { bg: "bg-blue-50", border: "border-blue-200", title: "text-blue-700" },
  { bg: "bg-purple-50", border: "border-purple-200", title: "text-purple-700" },
  { bg: "bg-orange-50", border: "border-orange-200", title: "text-orange-700" },
];

const toJoinUrl = (link: string) => (/^https?:\/\//i.test(link) ? link : `https://${link}`);

export default async function CourseOverviewPage({
  params,
}: {
  params: Promise<{ courseId: string }>;
}) {
  const { courseId } = await params;
  const { userId } = await auth();
  if (!userId) return redirect("/");

  const entitlement = await getCourseEntitlement(userId, courseId);
  if (!entitlement) return redirect("/");

  const [course, allChapters, allSessions, submissions] = await Promise.all([
    getCourseById(courseId),
    getAllChapters(courseId),
    getLiveSessionsByStudent(userId),
    getSubmissionsByStudent(userId),
  ]);
  if (!course) return redirect("/");

  // toPlain() has already turned Maps into objects and ids into strings.
  const chapters = allChapters as unknown as Chapter[];
  const sessions = allSessions as unknown as LiveSession[];
  const submittedIds = new Set(submissions.map((s) => String(s.assignmentId)));

  const now = new Date();
  const weeks = organizeChaptersByWeeks(chapters, entitlement, now);
  const published = weeks.flatMap((week) => week.chapters);
  const isDone = (chapter: Chapter) => !!chapter.isCompleted?.[userId];

  const completedCount = published.filter(isDone).length;
  const progress = published.length > 0 ? (completedCount / published.length) * 100 : 0;

  const nextChapter = weeks
    .filter((week) => week.isUnlocked)
    .flatMap((week) => week.chapters)
    .find((chapter) => !isDone(chapter));
  const nextLockedWeek = weeks.find((week) => !week.isUnlocked);

  // Upcoming sessions first (soonest at the top), then past ones (latest first).
  const isEnded = (session: LiveSession) =>
    now.getTime() - new Date(session.startTime).getTime() > SESSION_ENDED_AFTER_MS;
  const time = (session: LiveSession) => new Date(session.startTime).getTime();
  const liveSessions = [
    ...sessions.filter((s) => !isEnded(s)).sort((a, b) => time(a) - time(b)),
    ...sessions.filter(isEnded).sort((a, b) => time(b) - time(a)),
  ];

  return (
    <div className="min-h-full bg-[#F0F9FF] bg-[radial-gradient(#E0F2FE_1px,transparent_1px)] [background-size:16px_16px]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-10">
        <div>
          <Link
            href="/"
            className="inline-flex items-center mb-6 text-sm font-bold text-blue-600 hover:bg-blue-50 transition-colors bg-white px-4 py-2 rounded-full border-2 border-blue-100 hover:border-blue-200 shadow-sm"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to My Courses
          </Link>

          {/* Course hero */}
          <div className="bg-white rounded-3xl shadow-xl border-b-8 border-r-8 border-blue-200 p-5 sm:p-8">
            <div className="inline-block px-4 py-1.5 rounded-full bg-yellow-100 text-yellow-800 font-bold text-sm mb-4 border-2 border-yellow-200">
              🚀 Let&apos;s Learn!
            </div>
            <h1 className="text-3xl md:text-5xl font-extrabold text-slate-800 mb-4 tracking-tight">
              {course.title}
            </h1>
            {course.description && (
              <p className="text-base sm:text-lg text-slate-600 mb-6 leading-relaxed font-medium max-w-3xl">
                {toPlainText(course.description)}
              </p>
            )}

            <div className="flex flex-wrap items-center gap-3 mb-6">
              <div className="flex items-center gap-2 bg-indigo-50 px-4 py-2 rounded-2xl border-2 border-indigo-100 text-indigo-700 font-bold">
                <span aria-hidden>📚</span>
                {published.length} Mission{published.length !== 1 && "s"}
              </div>
              <div className="flex items-center gap-2 bg-purple-50 px-4 py-2 rounded-2xl border-2 border-purple-100 text-purple-700 font-bold">
                <span aria-hidden>🗺️</span>
                {weeks.length} Level{weeks.length !== 1 && "s"}
              </div>
            </div>

            {published.length > 0 && (
              <div className="bg-green-50 rounded-2xl p-4 sm:p-6 border-2 border-green-100">
                <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
                  <span className="font-bold text-green-800 flex items-center gap-2">
                    <span aria-hidden>🏆</span> Your Adventure Progress
                  </span>
                  <span className="text-sm font-bold text-green-700 bg-white px-3 py-1 rounded-full border border-green-200">
                    {completedCount}/{published.length} completed
                  </span>
                </div>
                <div
                  role="progressbar"
                  aria-label="Course progress"
                  aria-valuenow={Math.round(progress)}
                  aria-valuemin={0}
                  aria-valuemax={100}
                  className="h-4 bg-white rounded-full overflow-hidden border-2 border-green-200"
                >
                  <div
                    className="h-full bg-gradient-to-r from-green-400 to-emerald-500 rounded-full"
                    style={{ width: `${progress}%` }}
                  />
                </div>

                <div className="mt-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <p className="text-green-800 font-medium text-sm">
                    {progress === 100
                      ? "🎉 Amazing! You've completed everything!"
                      : nextChapter
                        ? completedCount === 0
                          ? "Your first mission is ready. Let's go! 🌟"
                          : "Keep going! You're doing great! 🌟"
                        : nextLockedWeek
                          ? `You're all caught up! 🌟 Level ${nextLockedWeek.weekNumber}: ${describeLock(nextLockedWeek, now)}.`
                          : "You're all caught up! 🌟"}
                  </p>
                  {nextChapter && (
                    <Button
                      asChild
                      className="rounded-xl font-bold bg-emerald-600 hover:bg-emerald-700 text-white border-b-4 border-emerald-800 active:border-b-0 active:translate-y-1 max-w-full"
                    >
                      <Link href={`/courses/${courseId}/chapters/${nextChapter._id}`}>
                        <Play className="h-4 w-4 mr-2 shrink-0 fill-current" />
                        <span className="truncate">
                          {completedCount === 0 ? "Start" : "Continue"}: {nextChapter.title}
                        </span>
                      </Link>
                    </Button>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Live sessions */}
        {liveSessions.length > 0 && (
          <section>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-800 pl-3 border-l-8 border-red-400 mb-6 flex items-center gap-3">
              <Radio className="h-7 w-7 text-red-500 shrink-0" />
              Incoming Transmissions
            </h2>

            <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
              {liveSessions.map((session) => {
                const date = new Date(session.startTime);
                const ended = isEnded(session);

                return (
                  <div
                    key={session._id}
                    className={cn(
                      "flex flex-col rounded-3xl p-6 border-b-8 border-r-8",
                      ended
                        ? "bg-white/60 border-slate-200"
                        : "bg-white border-red-100 shadow-lg"
                    )}
                  >
                    <div className="flex items-center gap-3 mb-4">
                      <div
                        className={cn(
                          "p-3 rounded-2xl",
                          ended ? "bg-slate-100 text-slate-400" : "bg-red-100 text-red-500"
                        )}
                      >
                        <Video className="h-6 w-6" />
                      </div>
                      <div className="min-w-0">
                        <h3 className="font-bold text-slate-800 text-lg leading-tight">
                          {session.title}
                        </h3>
                        <span
                          className={cn(
                            "text-xs font-bold uppercase tracking-wider",
                            ended ? "text-slate-500" : "text-red-500"
                          )}
                        >
                          {ended ? "Ended" : "Live Session"}
                        </span>
                      </div>
                    </div>

                    <div className="space-y-2 text-sm text-slate-600 font-medium">
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 shrink-0 text-slate-400" />
                        {date.toLocaleDateString("en-US", {
                          weekday: "short",
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        })}
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 shrink-0 text-slate-400" />
                        {date.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" })}
                      </div>
                    </div>

                    {!ended && (
                      <Button
                        asChild
                        className="mt-5 w-full rounded-xl font-bold bg-red-600 hover:bg-red-700 text-white border-b-4 border-red-800 active:border-b-0 active:translate-y-1"
                      >
                        <a href={toJoinUrl(session.joinLink)} target="_blank" rel="noopener noreferrer">
                          Join Session
                        </a>
                      </Button>
                    )}
                  </div>
                );
              })}
            </div>
          </section>
        )}

        {/* Weekly levels */}
        <section className="space-y-6">
          <h2 className="text-2xl sm:text-3xl font-black text-slate-800 pl-3 border-l-8 border-yellow-400">
            Your Journey Map
          </h2>

          {weeks.length === 0 && (
            <div className="bg-white rounded-3xl p-8 sm:p-12 text-center border-4 border-dashed border-gray-200">
              <div className="text-6xl mb-4">📭</div>
              <p className="text-xl text-gray-500 font-medium">
                No adventures available yet. Check back soon!
              </p>
            </div>
          )}

          {weeks.map((week, index) => {
            const theme = LEVEL_THEMES[index % LEVEL_THEMES.length];
            const done = week.chapters.filter(isDone).length;
            const isWeekDone = done === week.chapters.length;

            if (!week.isUnlocked) {
              return (
                <div
                  key={week.weekNumber}
                  className="rounded-3xl bg-slate-50 border-4 border-slate-200 p-4 sm:p-6"
                >
                  <div className="flex items-center gap-4">
                    <div className="shrink-0 w-12 h-12 rounded-2xl flex items-center justify-center bg-slate-200 text-slate-500">
                      <Lock className="h-6 w-6" />
                    </div>
                    <div className="min-w-0">
                      <h3 className="text-xl sm:text-2xl font-black text-slate-600">
                        Level {week.weekNumber}
                      </h3>
                      <p className="text-sm sm:text-base font-bold text-slate-600">
                        {describeLock(week, now)}
                      </p>
                    </div>
                  </div>
                  <ul className="mt-4 grid gap-2 sm:grid-cols-2">
                    {week.chapters.map((chapter) => (
                      <li
                        key={chapter._id}
                        className="rounded-xl border-2 border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-500"
                      >
                        {chapter.title}
                      </li>
                    ))}
                  </ul>
                </div>
              );
            }

            return (
              <div
                key={week.weekNumber}
                className={cn(
                  "rounded-3xl overflow-hidden bg-white border-b-8 border-r-8 shadow-lg",
                  theme.border
                )}
              >
                <div className={cn("p-4 sm:p-6 border-b-2", theme.border, theme.bg)}>
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-4">
                      <div className="shrink-0 w-12 h-12 rounded-2xl flex items-center justify-center text-2xl font-black shadow-sm bg-white text-slate-700">
                        {week.weekNumber}
                      </div>
                      <div>
                        <h3 className={cn("text-xl sm:text-2xl font-black", theme.title)}>
                          Level {week.weekNumber}
                        </h3>
                        <p className="text-sm sm:text-base font-medium text-slate-600">
                          {done}/{week.chapters.length} mission
                          {week.chapters.length !== 1 && "s"} done
                        </p>
                      </div>
                    </div>
                    <span
                      className={cn(
                        "shrink-0 px-3 sm:px-4 py-1.5 text-xs sm:text-sm rounded-xl font-bold border-2",
                        isWeekDone
                          ? "bg-green-100 text-green-800 border-green-200"
                          : "bg-white text-slate-700 border-slate-200"
                      )}
                    >
                      {isWeekDone ? "🏆 Complete" : "🔓 Unlocked"}
                    </span>
                  </div>
                </div>

                <div className="p-4 sm:p-6 space-y-4">
                  {week.chapters.map((chapter) => {
                    const completed = isDone(chapter);
                    const summary = toPlainText(chapter.description);
                    const assignments = chapter.assignments ?? [];

                    return (
                      <div key={chapter._id}>
                        <div
                          className={cn(
                            "flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-2xl border-2 transition-colors",
                            completed
                              ? "bg-green-50 border-green-200"
                              : "bg-white border-slate-100 hover:border-blue-300"
                          )}
                        >
                          <div className="flex items-center gap-4 min-w-0">
                            <div
                              className={cn(
                                "shrink-0 flex items-center justify-center w-12 h-12 rounded-2xl shadow-sm text-white",
                                completed ? "bg-green-500 rotate-[-3deg]" : "bg-blue-500 rotate-[3deg]"
                              )}
                            >
                              {completed ? (
                                <Check className="h-6 w-6" strokeWidth={3} />
                              ) : (
                                <Play className="h-6 w-6 fill-current" />
                              )}
                            </div>

                            <div className="min-w-0">
                              <h4
                                className={cn(
                                  "text-base sm:text-lg font-bold leading-snug",
                                  completed ? "text-green-800" : "text-slate-800"
                                )}
                              >
                                {chapter.title}
                              </h4>
                              {summary && (
                                <p className="text-sm text-slate-500 mt-1 line-clamp-2 sm:line-clamp-1 font-medium">
                                  {summary}
                                </p>
                              )}
                            </div>
                          </div>

                          <Button
                            asChild
                            size="sm"
                            className={cn(
                              "shrink-0 rounded-xl font-bold px-6 border-b-4 active:border-b-0 active:translate-y-1",
                              completed
                                ? "bg-green-100 text-green-800 hover:bg-green-200 border-green-300"
                                : "bg-blue-600 hover:bg-blue-700 text-white border-blue-800"
                            )}
                          >
                            <Link
                              href={`/courses/${courseId}/chapters/${chapter._id}`}
                              prefetch={false}
                              aria-label={`${completed ? "Replay" : "Start"} ${chapter.title ?? "mission"}`}
                            >
                              {completed ? "Replay" : "Start!"}
                            </Link>
                          </Button>
                        </div>

                        {assignments.length > 0 && (
                          <div className="ml-3 sm:ml-8 mt-3 pl-3 sm:pl-6 border-l-4 border-dashed border-slate-200 space-y-3">
                            {assignments.map((assignment) => (
                              <SideQuest
                                key={assignment._id}
                                href={`/courses/${courseId}/assignments/${assignment._id}`}
                                title={assignment.title}
                                points={assignment.points}
                                isSubmitted={submittedIds.has(String(assignment._id))}
                              />
                            ))}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </section>
      </div>
    </div>
  );
}
