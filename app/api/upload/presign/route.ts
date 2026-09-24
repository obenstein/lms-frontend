import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { getPresignedUploadUrl } from "@/lib/r2";

// Returns a presigned R2 URL for the browser to PUT the file to directly.
// This replaces routing the raw file body through this Next.js server,
// which is what was hitting 413 (Payload Too Large) on big video files.

export async function POST(req: Request) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const { fileName, fileType } = await req.json();
    if (!fileName || !fileType) {
      return NextResponse.json(
        { error: "fileName and fileType are required" },
        { status: 400 }
      );
    }

    const { uploadUrl, fileUrl } = await getPresignedUploadUrl(fileName, fileType);

    return NextResponse.json({ uploadUrl, fileUrl });
  } catch (error) {
    console.error("Error generating presigned URL:", error);
    return NextResponse.json(
      { error: "Failed to generate upload URL" },
      { status: 500 }
    );
  }
}