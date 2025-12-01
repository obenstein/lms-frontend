import CourseAccessManager from "../../_components/course-access-manager";
import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import RevokeAccess from "../../_components/revoke-access";
import { ArrowLeft, BookOpen, Calendar } from "lucide-react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

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
    <div className="min-h-screen bg-gradient-to-b from-muted/20 to-background">
      <div className="bg-white shadow-sm border-b sticky top-0 z-10">
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

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        <CourseAccessManager studentId={studentId} />

        <Card className="border-none shadow-lg">
          <CardHeader>
            <CardTitle className="text-2xl flex items-center gap-2">
              <BookOpen className="h-6 w-6 text-primary" />
              Granted Courses
              <Badge variant="secondary" className="ml-2">
                {accessList.length}
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {accessList.length === 0 ? (
              <div className="border rounded-lg p-8 text-center bg-muted/20">
                <BookOpen className="h-12 w-12 mx-auto text-muted-foreground/50 mb-3" />
                <p className="text-muted-foreground font-medium">No courses granted yet</p>
                <p className="text-sm text-muted-foreground mt-1">Grant access to a course above</p>
              </div>
            ) : (
              <div className="rounded-lg border overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-muted/50 hover:bg-muted/50">
                      <TableHead className="font-semibold">Course Title</TableHead>
                      <TableHead className="font-semibold">Granted At</TableHead>
                      <TableHead className="text-center font-semibold">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {accessList.map((access: any) => (
                      <TableRow key={access._id} className="hover:bg-muted/30">
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                              <BookOpen className="h-5 w-5 text-primary" />
                            </div>
                            <span className="font-medium">{access.title || "Untitled Course"}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                            <Calendar className="h-3.5 w-3.5" />
                            {new Date(access.grantedAt).toLocaleDateString('en-US', { 
                              month: 'short', 
                              day: 'numeric', 
                              year: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </div>
                        </TableCell>
                        <TableCell className="text-center">
                          <RevokeAccess studentId={access.studentId} courseId={access.courseId} />
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}