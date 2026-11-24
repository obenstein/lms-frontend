import { GetDashboardCourses } from "@/actions/get-dashboard-courses";
import { CoursesList } from "@/components/courses-list";
import { auth } from "@clerk/nextjs/server";
import { CheckCircle, Clock } from "lucide-react";
import { redirect } from "next/navigation";
import { InfoCard } from "./_components/info-card";

export default async function Dashboard() {
  const { userId } = await auth();
  if (!userId) {
    return redirect("/");
  }

  const { completedCourses, courseInProgress } = await GetDashboardCourses(
    userId
  );

  return (
    <div className="min-h-full p-4 sm:p-6 space-y-8 bg-[#F0F9FF] bg-[radial-gradient(#E0F2FE_1px,transparent_1px)] [background-size:16px_16px]">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <InfoCard
          icon={Clock}
          label="In Progress"
          numberOfItems={courseInProgress.length}
        />
        <InfoCard
          icon={CheckCircle}
          label="Completed"
          numberOfItems={completedCourses.length}
          variant="success"
        />
      </div>
      <CoursesList items={[...completedCourses, ...courseInProgress]} />
    </div>
  );
}
