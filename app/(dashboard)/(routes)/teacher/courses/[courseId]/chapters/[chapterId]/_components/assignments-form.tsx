"use client";

import * as z from "zod";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";

import { PlusCircle, Loader2, X, File } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { FileUpload } from "@/components/file-upload";

interface AssignmentsFormProps {
  initialData: {
    title: string;
    description: string;
    dueDate?: string;
    points?: number;
    fileUrl?: string;
  }[];
  chapterId: string;
}



const formSchema = z.object({
  title: z.string().min(1),
  description: z.string().min(1),
  dueDate: z.string().optional(),
  points: z.coerce.number().optional(),
  fileUrl: z.string().optional(),
});

const AssignmentsForm = ({ initialData, chapterId }: AssignmentsFormProps) => {
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);
  const [deletingIdx, setDeletingIdx] = useState<number | null>(null);
  

  const [formData, setFormData] = useState<z.infer<typeof formSchema>>({
    title: "",
    description: "",
    dueDate: "",
    points: undefined,
    fileUrl: "",
  });

  const toggleEdit = () => setIsEditing((cur) => !cur);

  const onSubmit = async () => {
    // console.log({chapterId})
    try {
      await axios.post(
        `/api/courses/${chapterId}/chapters/assignments`,
        formData
      );
      toast.success("Assignment added");
      toggleEdit();
      setFormData({
        title: "",
        description: "",
        dueDate: "",
        points: undefined,
        fileUrl: "",
      });
      router.refresh();
    } catch (error) {
      toast.error("Something went wrong");
    }
  };
  console.log("initialData", initialData);
  const onDelete = async (idx: number) => {
    try {
      setDeletingIdx(idx);
      await axios.delete(
        `/api/courses/${chapterId}/chapters/assignments/${idx}`
      );
      toast.success("Assignment deleted");
      router.refresh();
    } catch (error) {
      toast.error("Delete failed");
    } finally {
      setDeletingIdx(null);
    }
  };

  return (
    <div className="mt-6 bg-slate-100 border rounded-md p-4">
      <div className="font-semibold flex items-center justify-between">
        Chapter Assignments
        <Button onClick={toggleEdit} variant="ghost">
          {isEditing ? "Cancel" : (
            <>
              <PlusCircle className="w-4 h-4 mr-2" />
              Add Assignment
            </>
          )}
        </Button>
      </div>
          
      {!isEditing && initialData?.length === 0 && (
        <p className="text-sm text-slate-500 italic">No assignments yet.</p>
      )}

      {!isEditing && initialData?.length > 0 && (
        <div className="space-y-2 mt-4">
          {initialData.map((a, idx) => (
            <div
              key={idx}
              className="p-3 bg-yellow-100 border border-yellow-300 rounded-md relative"
            >
              <p className="font-medium">{a.title}</p>
              <p className="text-sm">{a.description}</p>
              {a.fileUrl && (
                <a
                  href={a.fileUrl}
                  className="text-blue-500 text-xs"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  View attached file
                </a>
              )}
              <div className="text-xs text-muted-foreground mt-1">
                Due: {a.dueDate || "No due date"} | Points: {a.points ?? "-"}
              </div>
              <div className="absolute top-2 right-2">
                {deletingIdx === idx ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <button onClick={() => onDelete(idx)}>
                    <X className="h-4 w-4" />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {isEditing && (
        <div className="mt-4 space-y-4">
          <Input
            placeholder="Title"
            value={formData.title}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, title: e.target.value }))
            }
          />
          <Textarea
            placeholder="Description"
            value={formData.description}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, description: e.target.value }))
            }
          />
          <Input
            type="date"
            value={formData.dueDate}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, dueDate: e.target.value }))
            }
          />
          <Input
            type="number"
            placeholder="Points"
            value={formData.points || ""}
            onChange={(e) =>
              setFormData((prev) => ({
                ...prev,
                points: Number(e.target.value),
              }))
            }
          />

          <FileUpload
            endpoint="assignmentAttachment"
            onChange={(url) => {
              if (url) {
                setFormData((prev) => ({ ...prev, fileUrl: url }));
              }
            }}
          />

          <Button onClick={onSubmit}>Save Assignment</Button>
        </div>
      )}
    </div>
  );
};

export default AssignmentsForm;
