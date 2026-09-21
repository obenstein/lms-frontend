import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, FileText, ArrowLeft, Rocket, Scroll, CheckCircle, Clock, Download } from "lucide-react";
import Link from "next/link";
import { Banner } from "@/components/banner";
import { AssignmentSubmissionForm } from "./_components/assignment-submission-form";
import { getAssignmentById, getSubmissionsByStudent } from "@/lib/queries";

export default async function AssignmentDetailPage({
  params,
}:any) {
  const { userId } = await auth();
  if (!userId) return redirect("/");

  const { courseId, assignmentId } = await params;

  // Fetch assignment
 const assignmentData = await getAssignmentById(assignmentId);
 if (!assignmentData?.length) return redirect(`/courses/${courseId}/overview`);


  const assignment = Array.isArray(assignmentData) ? assignmentData[0] : assignmentData;
  if (!assignment) return redirect(`/courses/${courseId}/overview`);

  // Fetch user's submissions
   const allSubmissions = await getSubmissionsByStudent(userId);
  // Find if user has submitted this assignment
  const existingSubmission = allSubmissions.find(
    (s: any) => s.assignmentId === assignmentId
  );

  const dueDate = new Date(assignment.dueDate);
  const now = new Date();
  const isLate = now > dueDate;

  return (
    <div className="p-6 min-h-screen bg-[#F0F9FF] bg-[radial-gradient(#E0F2FE_1px,transparent_1px)] [background-size:16px_16px]">
      {existingSubmission && (
        <div className="mb-6 transform hover:scale-105 transition-transform duration-300 max-w-4xl mx-auto">
             <Banner
                variant="success"
                label={`Mission Accomplished! Assignment submitted on ${new Date(existingSubmission.submittedAt).toLocaleString()}`}
            />
        </div>
      )}
      {isLate && !existingSubmission && (
        <div className="mb-6 max-w-4xl mx-auto">
            <Banner variant="warning" label="Mission Expired: The submission deadline has passed." />
        </div>
      )}

      <div className="flex flex-col max-w-4xl mx-auto pb-20">
        <div className="mb-6">
          <Link
            href={`/courses/${courseId}/overview`}
            className="inline-flex items-center px-4 py-2 rounded-full bg-white text-blue-600 font-bold hover:bg-blue-50 transition-all shadow-sm border-2 border-blue-100 hover:border-blue-200"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Mission Control
          </Link>
        </div>

        <Card className="rounded-3xl border-4 border-indigo-100 shadow-xl overflow-hidden bg-white">
            <div className="bg-indigo-50/50 p-6 md:p-8 border-b border-indigo-100">
                <div className="flex items-center gap-x-4">
                    <div className="p-4 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl shadow-lg transform -rotate-3">
                        <Rocket className="h-8 w-8 text-white animate-pulse" />
                    </div>
                    <div>
                        <h1 className="text-2xl md:text-3xl font-black text-slate-800 tracking-tight">
                            {assignment.title}
                        </h1>
                        <p className="text-slate-500 font-bold flex items-center gap-2 mt-1 uppercase tracking-wider text-xs">
                            <Scroll className="h-4 w-4 text-indigo-400" />
                            Mission Briefing
                        </p>
                    </div>
                </div>
            </div>

          <CardContent className="p-6 md:p-8 space-y-8">
            <div className="prose prose-lg max-w-none text-slate-600 leading-relaxed bg-slate-50 p-6 rounded-2xl border-2 border-slate-100 border-dashed">
                {assignment.description}
            </div>

            <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-orange-50 rounded-2xl p-4 border-2 border-orange-100 flex items-center gap-4 hover:shadow-md transition-shadow">
                    <div className="p-3 bg-orange-100 rounded-xl text-orange-600">
                        <Clock className="h-6 w-6" />
                    </div>
                    <div>
                        <p className="text-xs font-bold text-orange-400 uppercase tracking-wider">Mission Deadline</p>
                        <p className="text-lg font-bold text-orange-900">{dueDate.toLocaleDateString()}</p>
                    </div>
                </div>

                {assignment.fileUrl && (
                     <div className="bg-blue-50 rounded-2xl p-4 border-2 border-blue-100 flex items-center gap-4 hover:shadow-md transition-shadow">
                        <div className="p-3 bg-blue-100 rounded-xl text-blue-600">
                            <Download className="h-6 w-6" />
                        </div>
                        <div>
                             <p className="text-xs font-bold text-blue-400 uppercase tracking-wider">Mission Resources</p>
                             <a
                                href={assignment.fileUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-lg font-bold text-blue-700 hover:underline"
                              >
                                Download Attachment
                              </a>
                        </div>
                    </div>
                )}
            </div>

            {/* Show previously submitted file */}
            {existingSubmission && (
               <div className="bg-green-50 rounded-2xl p-6 border-2 border-green-100">
                  <div className="flex items-center gap-3 mb-4">
                      <div className="p-2 bg-green-100 rounded-full">
                        <CheckCircle className="h-6 w-6 text-green-600" />
                      </div>
                      <h3 className="text-lg font-bold text-green-800">Submission Received</h3>
                  </div>
                  <a
                    href={existingSubmission.fileUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center px-6 py-3 bg-green-600 text-white rounded-xl font-bold hover:bg-green-700 transition shadow-md hover:shadow-lg hover:-translate-y-0.5 transform duration-200"
                  >
                    <FileText className="h-5 w-5 mr-2" />
                    View Your Work
                  </a>
                </div>
            )}

            {/* Submission Form */}
            {!existingSubmission && !isLate && (
               <div className="mt-8 pt-8 border-t-2 border-slate-100 border-dashed">
                  <h3 className="text-xl font-black text-slate-800 mb-6 flex items-center gap-2">
                      <Rocket className="h-6 w-6 text-indigo-500" />
                      Submit Your Mission
                  </h3>
                  <div className="bg-white p-1 rounded-2xl">
                      <AssignmentSubmissionForm assignmentId={assignmentId} />
                  </div>
               </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

