// lib/course-progression.ts
//
// The single source of truth for which weeks a student may open. Pure
// functions only (no database access), so they can be used anywhere.
// Server-side enforcement lives in lib/auth-guards.ts.
//
// A week is open when:
//   1. enough time has passed since the student was granted access
//      (week 1 immediately, week 2 after 7 days, week 3 after 14 days, ...), and
//   2. for the second month (week 5 onwards), the teacher has also approved
//      the student after verifying their fees.
//
// Watching or completing videos has no effect on unlocking.

import { COURSE_CONFIG } from "@/lib/course-config";

const HOUR_MS = 60 * 60 * 1000;
const DAY_MS = 24 * HOUR_MS;
const WEEK_MS = COURSE_CONFIG.WEEK_INTERVAL_DAYS * DAY_MS;

/** What a user is entitled to in one course. */
export interface CourseEntitlement {
  /** The teacher sees everything, regardless of schedule or approval. */
  isTeacher: boolean;
  grantedAt: Date;
  secondMonthApproved: boolean;
}

export type LockReason = "schedule" | "approval";

export interface WeekStatus {
  weekNumber: number;
  isUnlocked: boolean;
  /** Why the week is locked, or null when it is open. */
  lockReason: LockReason | null;
  /** When the schedule opens this week (approval may still be needed). */
  unlocksAt: Date;
}

interface OrderableChapter {
  _id: unknown;
  position?: number;
  isPublished: boolean;
}

/** Published chapters in course order. Ties fall back to creation order. */
export function sortPublishedChapters<T extends OrderableChapter>(chapters: T[]): T[] {
  return chapters
    .filter((chapter) => chapter.isPublished)
    .sort((a, b) => {
      const positionA = a.position ?? Number.MAX_SAFE_INTEGER;
      const positionB = b.position ?? Number.MAX_SAFE_INTEGER;
      if (positionA !== positionB) return positionA - positionB;
      return String(a._id) < String(b._id) ? -1 : 1;
    });
}

export function requiresApproval(weekNumber: number): boolean {
  return weekNumber >= COURSE_CONFIG.FIRST_WEEK_REQUIRING_APPROVAL;
}

export function getWeekStatus(
  weekNumber: number,
  entitlement: CourseEntitlement,
  now: Date = new Date()
): WeekStatus {
  const unlocksAt = new Date(
    entitlement.grantedAt.getTime() + (weekNumber - 1) * WEEK_MS
  );

  let lockReason: LockReason | null = null;
  if (!entitlement.isTeacher) {
    if (requiresApproval(weekNumber) && !entitlement.secondMonthApproved) {
      lockReason = "approval";
    } else if (weekNumber > 1 && now < unlocksAt) {
      lockReason = "schedule";
    }
  }

  return { weekNumber, isUnlocked: lockReason === null, lockReason, unlocksAt };
}

/** Groups published chapters into weeks, each with its lock status. */
export function organizeChaptersByWeeks<T extends OrderableChapter>(
  chapters: T[],
  entitlement: CourseEntitlement,
  now: Date = new Date()
): (WeekStatus & { chapters: T[] })[] {
  const perWeek = COURSE_CONFIG.CHAPTERS_PER_WEEK;
  const sorted = sortPublishedChapters(chapters);
  const weeks: (WeekStatus & { chapters: T[] })[] = [];

  for (let i = 0; i < sorted.length; i += perWeek) {
    weeks.push({
      ...getWeekStatus(i / perWeek + 1, entitlement, now),
      chapters: sorted.slice(i, i + perWeek),
    });
  }

  return weeks;
}

/** Lock status of one chapter, or null if it isn't a published chapter. */
export function getChapterStatus(
  chapterId: string,
  chapters: OrderableChapter[],
  entitlement: CourseEntitlement,
  now: Date = new Date()
): WeekStatus | null {
  const week = organizeChaptersByWeeks(chapters, entitlement, now).find((w) =>
    w.chapters.some((chapter) => String(chapter._id) === chapterId)
  );
  return week ?? null;
}

/** The week the schedule has reached, ignoring approval (1 to TOTAL_WEEKS). */
export function getScheduledWeek(grantedAt: Date, now: Date = new Date()): number {
  const elapsedWeeks = Math.floor((now.getTime() - grantedAt.getTime()) / WEEK_MS);
  return Math.min(Math.max(elapsedWeeks + 1, 1), COURSE_CONFIG.TOTAL_WEEKS);
}

/** Student-facing explanation of a lock. */
export function describeLock(
  status: Pick<WeekStatus, "lockReason" | "unlocksAt">,
  now: Date = new Date()
): string {
  if (status.lockReason === "approval") {
    return "Opens once your second month fees are verified";
  }
  if (status.lockReason === "schedule") {
    // Relative, so it reads the same in every time zone.
    const ms = status.unlocksAt.getTime() - now.getTime();
    const [count, unit] =
      ms > DAY_MS
        ? [Math.ceil(ms / DAY_MS), "day"]
        : [Math.max(1, Math.ceil(ms / HOUR_MS)), "hour"];
    return `Opens in ${count} ${unit}${count === 1 ? "" : "s"}`;
  }
  return "";
}
