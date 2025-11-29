"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import axios from "axios";

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

      // Refresh the page to show updated data
      router.refresh();
    } catch (error) {
      console.error("Failed to revoke access:", error);
    } finally {
      setIsRevoking(false);
    }
  };

  return (
    <Button
      variant="destructive"
      className="mt-2"
      disabled={isRevoking}
      onClick={revokeAccess}
    >
      {isRevoking ? "Revoking..." : "Revoke Access"}
    </Button>
  );
}