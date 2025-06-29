import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { ArrowLeft, Clock, Play, Lock } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CourseProgress } from "@/components/course-progress";

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

// Helper function to organize chapters by weeks
const organizeChaptersByWeeks = (chapters: Chapter[], chaptersPerWeek: number = 2) => {
  const weeks = [];
  const sortedChapters = chapters 
    .filter(chapter => chapter.isPublished)
    .sort((a, b) => a.position - b.position);
  
  for (let i = 0; i < sortedChapters.length; i += chaptersPerWeek) {
    weeks.push({
      weekNumber: Math.floor(i / chaptersPerWeek) + 1,
      chapters: sortedChapters.slice(i, i + chaptersPerWeek)
    });
  }
  
  return weeks;
};

// Helper function to check if a week is unlocked
const isWeekUnlocked = (weekNumber: number, completedChapters: number, chaptersPerWeek: number) => {
  const requiredCompletedChapters = (weekNumber - 1) * chaptersPerWeek;
  return completedChapters >= requiredCompletedChapters;
};

export default async function CourseOverviewPage({
  params,
}: {
  params: { courseId: string };
}) {
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
      console.error(`Course fetch failed: ${courseRes.status} ${courseRes.statusText}`);
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
      console.warn(`Chapters fetch failed: ${chaptersRes.status} ${chaptersRes.statusText}`);
    }

    // Combine course data with chapters
    const course: Course = {
      ...courseData,
      chapters
    };
    // console.log("Course data:", course);

    // Fetch user progress
   const courseChapters = course.chapters.filter(chapter => chapter.isPublished);
     const completedChapters = courseChapters.filter(
    chapter => chapter.isCompleted?.[userId]===true
    ).length;
    console.log("chapters:", completedChapters);

    const progressPercentage = courseChapters.length > 0 
      ? (completedChapters / courseChapters.length) * 100 
      : 0;

    const chaptersPerWeek = 2;
    const weeks = organizeChaptersByWeeks(courseChapters, chaptersPerWeek);


    return (
      <div className="min-h-screen bg-gray-50">

        <div className="bg-white shadow-sm border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              <Link
                href="/search"
                className="flex items-center text-sm font-medium text-gray-600 hover:text-gray-900 transition"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Courses
              </Link>
            </div>
          </div>
        </div>

        {/* Course Info */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
            <div className="flex flex-col lg:flex-row gap-6">
              <div className="flex-1">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">{course.title}</h1>
                <p className="text-gray-600 mb-4">{course.description}</p>
                
                <div className="flex items-center gap-4 mb-4">
                  <Badge variant="secondary">
                    {courseChapters.length} Chapters
                  </Badge>
                  <Badge variant="secondary">
                    {weeks.length} Weeks
                  </Badge>
                </div>

                {progressPercentage > 0 && (
                  <div className="mb-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-gray-700">
                        Course Progress
                      </span>
                      <span className="text-sm text-gray-500">
                        {completedChapters}/{courseChapters.length} completed
                      </span>
                    </div>
                    <CourseProgress
                      value={progressPercentage}
                      variant={progressPercentage === 100 ? "success" : "default"}
                    />
                  </div>
                )}
                {/* <CourseProgress 
                value={100}
                variant="success"
                /> */}
              </div>
            </div>
          </div>

          {/* Weekly Content */}
          <div className="space-y-6">
            {weeks.length === 0 ? (
              <Card>
                <CardContent className="text-center py-8">
                  <p className="text-gray-500">No chapters available for this course.</p>
                </CardContent>
              </Card>
            ) : (
              weeks.map((week) => {
                const isUnlocked = isWeekUnlocked(week.weekNumber, completedChapters, chaptersPerWeek);
                
                return (
                  <Card key={week.weekNumber} className={`${!isUnlocked ? 'opacity-60' : ''}`}>
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <CardTitle className="text-xl">
                            Week {week.weekNumber}
                          </CardTitle>
                          {!isUnlocked && (
                            <Lock className="h-5 w-5 text-gray-400" />
                          )}
                        </div>
                        <Badge variant={isUnlocked ? "default" : "secondary"}>
                          {isUnlocked ? "Available" : "Locked"}
                        </Badge>
                      </div>
                      <CardDescription>
                        {week.chapters.length} chapter{week.chapters.length > 1 ? 's' : ''} this week
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {week.chapters.map((chapter) => {
                          const isCompleted = chapter.isCompleted?.userId;
                          const canAccess = isUnlocked && (chapter.isFree || true); // Add purchase logic
                          
                          return (
                            <div
                              key={chapter._id}
                              className={`flex items-center justify-between p-4 rounded-lg border ${
                                isCompleted 
                                  ? 'bg-green-50 border-green-200' 
                                  : canAccess 
                                    ? 'bg-white border-gray-200 hover:bg-gray-50' 
                                    : 'bg-gray-50 border-gray-200'
                              } transition-colors`}
                            >
                              <div className="flex items-center gap-4 flex-1">
                                <div className={`flex items-center justify-center w-8 h-8 rounded-full ${
                                  isCompleted 
                                    ? 'bg-green-500 text-white' 
                                    : canAccess 
                                      ? 'bg-blue-500 text-white' 
                                      : 'bg-gray-300 text-gray-600'
                                }`}>
                                  {isCompleted ? (
                                    <Play className="h-4 w-4" />
                                  ) : canAccess ? (
                                    <Play className="h-4 w-4" />
                                  ) : (
                                    <Lock className="h-4 w-4" />
                                  )}
                                </div>
                                
                                <div className="flex-1">
                                  <h4 className="font-medium text-gray-900">
                                    {chapter.title}
                                  </h4>
                                  {chapter.description && (
                                    <p className="text-sm text-gray-500 mt-1 line-clamp-2">
                                      {chapter.description}
                                    </p>
                                  )}
                                </div>
                              </div>

                              <div className="flex items-center gap-2">
                                {chapter.isFree && (
                                  <Badge variant="secondary" className="text-xs">
                                    Free
                                  </Badge>
                                )}
                                {canAccess ? (
                                  <Link href={`/courses/${courseId}/chapters/${chapter._id}`}>
                                    <Button size="sm" variant={isCompleted ? "outline" : "default"}>
                                      {isCompleted ? "Review" : "Start"}
                                    </Button>
                                  </Link>
                                ) : (
                                  <Button size="sm" variant="outline" disabled>
                                    <Lock className="h-4 w-4 mr-2" />
                                    Locked
                                  </Button>
                                )}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </CardContent>
                  </Card>
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