import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { getS3Client } from "@/lib/r2";
import crypto from "crypto";

// Ported 1:1 from lms-backend/routes/upload-route.js.
// Old version: fetched `${BACK_END_URL}/api/upload` (dead AWS-hosted backend -> 522).
// New version: uploads straight to R2 from within this route handler.

export async function POST(req: Request) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const formData = await req.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());

    // Same unique-filename convention as the old backend.
    const uniqueSuffix = Date.now() + "-" + crypto.randomBytes(6).toString("hex");
    const originalName = file.name;
    const extension = originalName.substring(originalName.lastIndexOf("."));
    const fileName = `${uniqueSuffix}${extension}`;

    await getS3Client().send(
      new PutObjectCommand({
        Bucket: process.env.R2_BUCKET_NAME,
        Key: fileName,
        Body: buffer,
        ContentType: file.type,
      })
    );

    const fileUrl = `https://${process.env.CDN_PUBLIC_DOMAIN}/${fileName}`;

    return NextResponse.json(
      { message: "File uploaded successfully", fileUrl },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error uploading to R2:", error);
    return NextResponse.json(
      { error: "Failed to upload file to R2" },
      { status: 500 }
    );
  }
}
