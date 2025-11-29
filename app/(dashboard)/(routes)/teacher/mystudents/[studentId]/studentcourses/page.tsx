import CourseAccessManager from "../../_components/course-access-manager";
import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import RevokeAccess from "../../_components/revoke-access";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
interface Props {
  params: {
    studentId: string;
  };
}

const fetchStudentAccess = async (studentId: string) => {
  const res = await fetch(`${process.env.BACK_END_URL}/api/access/${studentId}`, {
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error("Failed to fetch course access");
  }

  return res.json();
};

export default async function StudentCoursesPage({ params }: Props) {
  const user = await currentUser();
  if (!user) return redirect("/");
  
  const { studentId } = await params;
  const accessList = await fetchStudentAccess(studentId);
  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="bg-white shadow-sm border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              <Link
                href="/teacher/mystudents"
                className="flex items-center text-sm font-medium text-gray-600 hover:text-gray-900 transition"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to My Students
              </Link>
            </div>
          </div>
        </div>
      <h1 className="text-3xl font-bold mb-4">Student's Course Access</h1>

      <div className="mb-6">
        <CourseAccessManager studentId={studentId} />
      </div>

      <div className="grid grid-cols-1 gap-4">
        {accessList.length === 0 ? (
          <p className="text-muted-foreground">No courses granted yet.</p>
        ) : (
          accessList.map((access: any) => (
            <div
              key={access._id}
              className="border p-4 rounded-md bg-gray-900 text-white"
            >
              <h2 className="font-semibold">{access.title || "Untitled Course"}</h2>
              <p className="text-sm text-muted-foreground">
                Granted At: {new Date(access.grantedAt).toLocaleString()}
              </p>
              <RevokeAccess studentId={access.studentId} courseId={access.courseId} />
            </div>
          ))
        )}
      </div>
    </div>
  );
}