// lib/course-config.ts

// Course schedule. The course runs for 8 weeks (2 months) with 2 videos a week.
export const COURSE_CONFIG = {
  CHAPTERS_PER_WEEK: 2,
  TOTAL_WEEKS: 8,

  // A new week opens this many days after the previous one, counted from the
  // date the student was granted access.
  WEEK_INTERVAL_DAYS: 7,

  // From this week on (the second month) the teacher must also approve the
  // student, after verifying their fees.
  FIRST_WEEK_REQUIRING_APPROVAL: 5,
} as const;
