// lib/course-progression.ts

export interface Chapter {
  _id: string;
  title: string;
  description: string;
  videoUrl: string;
  position: number;
  isPublished: boolean;
  isFree: boolean;
  isCompleted: {
    userId: boolean;
  } | null;
}

export interface WeeklyContent {
  weekNumber: number;
  chapters: Chapter[];
  isUnlocked: boolean;
  completedCount: number;
}

/**
 * Organizes chapters into weekly content blocks
 */
export const organizeChaptersByWeeks = (
  chapters: Chapter[], 
  chaptersPerWeek: number = 2
): WeeklyContent[] => {
  const weeks: WeeklyContent[] = [];
  const sortedChapters = chapters
    .filter(chapter => chapter.isPublished)
    .sort((a, b) => a.position - b.position);
  
  const totalCompletedChapters = sortedChapters.filter(
    chapter => chapter.isCompleted?.userId
  ).length;
  
  for (let i = 0; i < sortedChapters.length; i += chaptersPerWeek) {
    const weekChapters = sortedChapters.slice(i, i + chaptersPerWeek);
    const weekNumber = Math.floor(i / chaptersPerWeek) + 1;
    
    const week: WeeklyContent = {
      weekNumber,
      chapters: weekChapters,
      isUnlocked: isWeekUnlocked(weekNumber, totalCompletedChapters, chaptersPerWeek),
      completedCount: weekChapters.filter(ch => ch.isCompleted?.userId).length
    };
    
    weeks.push(week);
  }
  
  return weeks;
};

/**
 * Determines if a week should be unlocked based on progression
 */
export const isWeekUnlocked = (
  weekNumber: number, 
  completedChapters: number, 
  chaptersPerWeek: number
): boolean => {
  // Week 1 is always unlocked
  if (weekNumber === 1) return true;
  
  // For subsequent weeks, require completion of previous week's chapters
  const requiredCompletedChapters = (weekNumber - 1) * chaptersPerWeek;
  return completedChapters >= requiredCompletedChapters;
};

/**
 * Calculates overall course progress
 */
export const calculateCourseProgress = (chapters: Chapter[]): {
  completedChapters: number;
  totalChapters: number;
  progressPercentage: number;
} => {
  const publishedChapters = chapters.filter(ch => ch.isPublished);
  const completedChapters = publishedChapters.filter(
    ch => ch.isCompleted?.userId
  ).length;
  
  const progressPercentage = publishedChapters.length > 0 
    ? (completedChapters / publishedChapters.length) * 100 
    : 0;
  
  return {
    completedChapters,
    totalChapters: publishedChapters.length,
    progressPercentage: Math.round(progressPercentage)
  };
};

/**
 * Gets the next available chapter for the user
 */
export const getNextChapter = (chapters: Chapter[]): Chapter | null => {
  const sortedChapters = chapters
    .filter(ch => ch.isPublished)
    .sort((a, b) => a.position - b.position);
  
  return sortedChapters.find(ch => !ch.isCompleted?.userId) || null;
};

/**
 * Checks if user can access a specific chapter
 */
export const canAccessChapter = (
  chapter: Chapter,
  allChapters: Chapter[],
  chaptersPerWeek: number = 2
): boolean => {
  const sortedChapters = allChapters
    .filter(ch => ch.isPublished)
    .sort((a, b) => a.position - b.position);
  
  const chapterIndex = sortedChapters.findIndex(ch => ch._id === chapter._id);
  if (chapterIndex === -1) return false;
  
  const weekNumber = Math.floor(chapterIndex / chaptersPerWeek) + 1;
  const completedChapters = sortedChapters.filter(
    ch => ch.isCompleted?.userId
  ).length;
  
  return isWeekUnlocked(weekNumber, completedChapters, chaptersPerWeek);
};