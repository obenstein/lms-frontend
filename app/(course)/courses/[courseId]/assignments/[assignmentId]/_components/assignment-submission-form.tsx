"use client";

import { useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { FileUpload } from "@/components/file-upload";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import toast from "react-hot-toast";

interface AssignmentSubmissionFormProps {
  assignmentId: string;
}

export const AssignmentSubmissionForm = ({ assignmentId }: AssignmentSubmissionFormProps) => {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleFileUpload = (url?: string) => {
    if (!url) return;
    setIsSubmitting(true);

    axios.post(`/api/assignments/${assignmentId}/submit`, {
      fileUrl: url,
    })
      .then(() => {
        toast.success("Assignment submitted successfully!");
        router.refresh();
      })
      .catch((err) => {
        console.error(err);
        toast.error("Failed to submit assignment");
      })
      .finally(() => {
        setIsSubmitting(false);
      });
  };

  return (
    <div className="space-y-4">
      {isSubmitting ? (
        <div className="flex items-center justify-center">
          <Loader2 className="animate-spin h-5 w-5 mr-2" />
          <span>Submitting...</span>
        </div>
      ) : (
        <FileUpload
          endpoint="assignmentSubmission"
          onChange={handleFileUpload}
        />
      )}
    </div>
  );
};
