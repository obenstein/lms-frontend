// lib/course-config.ts

export const COURSE_CONFIG = {
  // Default chapters per week
  CHAPTERS_PER_WEEK: 2,
  
  // Progression modes
  PROGRESSION_MODE: {
    SEQUENTIAL: 'sequential', // Must complete previous chapters
    WEEKLY: 'weekly', // Weekly unlocks
    OPEN: 'open' // All chapters available
  } as const,
  
  // Default progression mode
  DEFAULT_PROGRESSION_MODE: 'weekly' as const,
  
  // Week unlock strategies
  UNLOCK_STRATEGY: {
    COMPLETE_PREVIOUS_WEEK: 'complete_previous_week', // Must complete all chapters in previous week
    COMPLETE_PERCENTAGE: 'complete_percentage', // Must complete X% of previous week
    TIME_BASED: 'time_based' // Unlock based on time intervals
  } as const,
  
  // Default unlock strategy
  DEFAULT_UNLOCK_STRATEGY: 'complete_previous_week' as const,
  
// Minimum completion percentage for percentage-based unlocking
  MINIMUM_COMPLETION_PERCENTAGE: 80,
  
  // Time intervals for time-based unlocking (in days)
  WEEK_INTERVAL_DAYS: 7,
} as const;

export type ProgressionMode = typeof COURSE_CONFIG.PROGRESSION_MODE[keyof typeof COURSE_CONFIG.PROGRESSION_MODE];
export type UnlockStrategy = typeof COURSE_CONFIG.UNLOCK_STRATEGY[keyof typeof COURSE_CONFIG.UNLOCK_STRATEGY];