"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import axios from "axios";
import toast from "react-hot-toast";
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

interface RevokeAccessProps {
  studentId: string;
  courseId: string;
}

export default function RevokeAccess({ studentId, courseId }: RevokeAccessProps) {
  const [isRevoking, setIsRevoking] = useState(false);
  const router = useRouter();

  const revokeAccess = async () => {
    setIsRevoking(true);
    try {
      const res = await axios.delete(`/api/teacher/access`, {
        data: {
          courseId,
          studentId,
        },
      });

      if (res.status < 200 || res.status >= 300) {
        throw new Error("Failed to revoke access");
      }

      toast.success("Access revoked successfully");
      router.refresh();
    } catch (error) {
      console.error("Failed to revoke access:", error);
      toast.error("Failed to revoke access");
    } finally {
      setIsRevoking(false);
    }
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button
          variant="destructive"
          className="mt-2"
          disabled={isRevoking}
        >
          {isRevoking ? "Revoking..." : "Revoke Access"}
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Revoke Course Access</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to revoke access to this course? The student will no longer be able to access this course content.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction 
            onClick={revokeAccess}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            Revoke Access
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}