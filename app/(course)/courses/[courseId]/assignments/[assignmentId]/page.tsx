import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, FileText, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { Banner } from "@/components/banner";
import { AssignmentSubmissionForm } from "./_components/assignment-submission-form";

export default async function AssignmentDetailPage({
  params,
}: {
  params: { courseId: string; assignmentId: string };
}) {
  const { userId } = await auth();
  if (!userId) return redirect("/");

  const { courseId, assignmentId } = await params;

  // Fetch assignment
  const assignmentRes = await fetch(
    `${process.env.BACK_END_URL}/api/assignments/chapter/${assignmentId}?userId=${userId}`,
    { cache: "no-store" }
  );
  if (!assignmentRes.ok) return redirect(`/courses/${courseId}/overview`);

  const assignmentData = await assignmentRes.json();
  const assignment = Array.isArray(assignmentData) ? assignmentData[0] : assignmentData;
  if (!assignment) return redirect(`/courses/${courseId}/overview`);

  // Fetch user's submissions
  const submissionsRes = await fetch(
    `${process.env.BACK_END_URL}/api/submissions/${userId}`,
    { cache: "no-store" }
  );
  const allSubmissions = submissionsRes.ok ? await submissionsRes.json() : [];

  // Find if user has submitted this assignment
  const existingSubmission = allSubmissions.find(
    (s: any) => s.assignmentId === assignmentId
  );

  const dueDate = new Date(assignment.dueDate);
  const now = new Date();
  const isLate = now > dueDate;

  return (
    <div>
      {existingSubmission && (
        <Banner
          variant="success"
          label={`Assignment submitted on ${new Date(
            existingSubmission.submittedAt
          ).toLocaleString()}`}
        />
      )}
      {isLate && !existingSubmission && (
        <Banner variant="warning" label="The submission deadline has passed." />
      )}

      <div className="flex flex-col max-w-4xl mx-auto pb-20">
        <div className="p-4">
          <Link
            href={`/courses/${courseId}/overview`}
            className="flex items-center text-sm font-medium text-gray-600 hover:text-gray-900 transition mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Course Overview
          </Link>

          <Card>
            <CardHeader>
              <CardTitle className="text-xl flex items-center gap-2">
                <FileText className="h-5 w-5 text-muted-foreground" />
                {assignment.title}
              </CardTitle>
            </CardHeader>

            <CardContent className="space-y-4">
              <p className="text-gray-700">{assignment.description}</p>

              <div className="flex items-center text-sm text-gray-500 gap-2">
                <Calendar className="h-4 w-4" />
                <span>
                  Due on: <strong>{dueDate.toLocaleDateString()}</strong>
                </span>
              </div>

              {/* File Preview */}
              {assignment.fileUrl && (
                <a
                  href={assignment.fileUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline text-sm block"
                >
                  View Attached File
                </a>
              )}

              {/* Show previously submitted file */}
              {existingSubmission && (
                <div className="text-sm text-green-700">
                  <p className="font-medium">Submitted File:</p>
                  <a
                    href={existingSubmission.fileUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline"
                  >
                    View Submission
                  </a>
                </div>
              )}

              {/* Submission Form */}
              {!existingSubmission && !isLate && (
                <AssignmentSubmissionForm assignmentId={assignmentId} />
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

