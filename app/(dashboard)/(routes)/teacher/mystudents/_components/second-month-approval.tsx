"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import toast from "react-hot-toast";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

interface SecondMonthApprovalProps {
  studentId: string;
  courseId: string;
  approvedAt: string | null;
}

export default function SecondMonthApproval({
  studentId,
  courseId,
  approvedAt,
}: SecondMonthApprovalProps) {
  const [isSaving, setIsSaving] = useState(false);
  const router = useRouter();
  const isApproved = !!approvedAt;

  const save = async () => {
    setIsSaving(true);
    try {
      await axios.patch(`/api/teacher/access`, {
        studentId,
        courseId,
        approved: !isApproved,
      });
      toast.success(isApproved ? "Second month locked" : "Second month approved");
      router.refresh();
    } catch (error) {
      console.error("Failed to update second month approval:", error);
      toast.error("Failed to update second month approval");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="flex flex-col items-start gap-2">
      <Badge
        variant="outline"
        className={
          isApproved
            ? "border-green-300 bg-green-50 text-green-700"
            : "border-amber-300 bg-amber-50 text-amber-700"
        }
      >
        {isApproved
          ? `Approved ${new Date(approvedAt).toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
              year: "numeric",
              timeZone: "UTC", // same text on server and client
            })}`
          : "Fees not verified"}
      </Badge>
      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button
            size="sm"
            variant="outline"
            disabled={isSaving}
            className={isApproved ? "" : "border-blue-600 bg-blue-600 text-white hover:bg-blue-700"}
          >
            {isSaving ? "Saving..." : isApproved ? "Remove approval" : "Approve"}
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent className="bg-white text-slate-900 shadow-xl">
          <AlertDialogHeader>
            <AlertDialogTitle>
              {isApproved ? "Remove second month approval" : "Approve second month"}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {isApproved
                ? "Weeks 5 to 8 will be locked for this student straight away. Weeks 1 to 4 are not affected."
                : "Confirm that you have verified this student's fees for the second month. Weeks 5 to 8 will open for them on their weekly schedule; any of those weeks already reached open straight away."}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={save}
              className={
                isApproved
                  ? "bg-red-600 text-white hover:bg-red-700"
                  : "bg-blue-600 text-white hover:bg-blue-700"
              }
            >
              {isApproved ? "Remove approval" : "Fees verified, approve"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
