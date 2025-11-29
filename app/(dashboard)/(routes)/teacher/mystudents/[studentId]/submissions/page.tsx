"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "next/navigation";
import { Download, Loader2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
interface Submission {
  _id: string;
  assignmentId: string;
  submittedAt: string;
  status: string;
  fileUrl: string;
}

export default function StudentSubmissionsPage() {
  const { studentId } = useParams();
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSubmissions = async () => {
      try {
        const res = await axios.get(`/api/teacher/submissions/${studentId}`);
        setSubmissions(res.data);
      } catch (err) {
        console.error("Failed to fetch submissions", err);
      } finally {
        setLoading(false);
      }
    };

    if (studentId) {
      fetchSubmissions();
    }
  }, [studentId]);

  if (loading) {
    return (
      <div className="flex justify-center py-10">
        <Loader2 className="h-6 w-6 animate-spin" />
      </div>
    );
  }

  return (
    <div className="p-6">
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
      <h1 className="text-2xl font-semibold mb-6">Submitted Assignments</h1>
      {submissions.length === 0 ? (
        <p className="text-gray-500">No submissions found for this student.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {submissions.map((submission) => (
            <Card key={submission._id} className="relative">
              <CardContent className="p-4 space-y-2">
                <p>
                  <span className="font-medium">Assignment ID:</span> {submission.assignmentId}
                </p>
                <p>
                  <span className="font-medium">Submitted At:</span>{" "}
                  {new Date(submission.submittedAt).toLocaleString()}
                </p>
                <p>
                  <span className="font-medium">Status:</span> {submission.status}
                </p>
                <Button variant="outline" asChild className="mt-2 w-full">
                  <a href={submission.fileUrl} target="_blank" rel="noopener noreferrer">
                    <Download className="mr-2 h-4 w-4" /> View Submission
                  </a>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}