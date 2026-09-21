import { S3Client } from "@aws-sdk/client-s3";

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
