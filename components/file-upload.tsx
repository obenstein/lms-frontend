"use client";

import toast from "react-hot-toast";
import { useDropzone } from "react-dropzone";
import { useState } from "react";
import { uploadFile } from "@/lib/lib-upload";
import { UploadCloud, Loader2 } from "lucide-react";
import { ourFileRouter } from "@/app/api/uploadthing/core";

interface FileUploadProps {
  onChange: (url?: string) => void;
  endpoint: keyof typeof ourFileRouter;
}

export const FileUpload = ({ onChange, endpoint }: FileUploadProps) => {
  const [isUploading, setIsUploading] = useState(false);

  const onDrop = async (acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (!file) return;

    try {
      setIsUploading(true);
      const url = await uploadFile(file);
      toast.success("File uploaded successfully");
      onChange(url);
    } catch (error: any) {
      toast.error(error.message || "Something went wrong during upload");
    } finally {
      setIsUploading(false);
    }
  };

  const getAcceptType = () => {
    if (endpoint === "courseImage") return { "image/*": [] };
    if (endpoint === "chapterVideo") return { "video/*": [] };
    return undefined; // accept all
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    multiple: false,
    accept: getAcceptType(),
    disabled: isUploading,
  });

  return (
    <div
      {...getRootProps()}
      className={`border-2 border-dashed rounded-md p-10 flex flex-col items-center justify-center cursor-pointer transition ${
        isDragActive ? "border-sky-500 bg-sky-50" : "border-slate-300 hover:border-sky-400"
      } ${isUploading ? "opacity-50 cursor-not-allowed" : ""}`}
    >
      <input {...getInputProps()} />
      {isUploading ? (
        <>
          <Loader2 className="h-10 w-10 text-sky-500 animate-spin mb-2" />
          <p className="text-sm text-slate-500">Uploading...</p>
        </>
      ) : (
        <>
          <UploadCloud className="h-10 w-10 text-slate-400 mb-2" />
          <p className="text-sm text-slate-600 font-semibold">
            {isDragActive ? "Drop the file here..." : "Choose files or drag and drop"}
          </p>
          <p className="text-xs text-slate-400 mt-2">
            {endpoint === "courseImage" && "Image (max 4MB)"}
            {endpoint === "chapterVideo" && "Video (max 2GB)"}
            {endpoint !== "courseImage" && endpoint !== "chapterVideo" && "PDF, Image, Video, or Audio"}
          </p>
        </>
      )}
    </div>
  );
};
