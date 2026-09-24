import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import crypto from "crypto";

// Ported from lms-backend/utils/s3-client.js — same endpoint shape, same
// credential handling (.trim() guards against trailing-newline env vars).
let s3ClientInstance: S3Client | null = null;

export const getS3Client = (): S3Client => {
  if (!s3ClientInstance) {
    s3ClientInstance = new S3Client({
      region: "auto",
      endpoint: process.env.R2_ENDPOINT,
      credentials: {
        accessKeyId: process.env.R2_ACCESS_KEY_ID?.trim() || "",
        secretAccessKey: process.env.R2_SECRET_ACCESS_KEY?.trim() || "",
      },
    });
  }
  return s3ClientInstance;
};

/**
 * Generates a short-lived presigned URL the browser can PUT the file
 * to directly. This is what avoids the 413 — the video's bytes go
 * browser -> R2 directly, never through Next.js or any proxy in front
 * of it, so no request-body-size limit anywhere in your own stack applies.
 */
export async function getPresignedUploadUrl(originalName: string, contentType: string) {
  const uniqueSuffix = Date.now() + "-" + crypto.randomBytes(6).toString("hex");
  const extension = originalName.substring(originalName.lastIndexOf("."));
  const key = `${uniqueSuffix}${extension}`;

  const command = new PutObjectCommand({
    Bucket: process.env.R2_BUCKET_NAME,
    Key: key,
    ContentType: contentType,
  });

  // 10 minutes — generous for a large video upload over a slow connection.
  const uploadUrl = await getSignedUrl(getS3Client(), command, { expiresIn: 600 });
  const fileUrl = `https://${process.env.CDN_PUBLIC_DOMAIN}/${key}`;

  return { uploadUrl, fileUrl, key };
}