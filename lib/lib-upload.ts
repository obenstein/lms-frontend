export const uploadFile = async (
  file: File,
  onProgress?: (percent: number) => void
): Promise<string> => {
  // 1. Ask our server for a presigned R2 URL (small JSON request, no size issue)
  const presignRes = await fetch("/api/upload/presign", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ fileName: file.name, fileType: file.type }),
  });

  if (!presignRes.ok) {
    const err = await presignRes.json().catch(() => ({}));
    throw new Error(err.error || "Failed to get upload URL");
  }

  const { uploadUrl, fileUrl } = await presignRes.json();

  // 2. Upload the actual file bytes straight to R2 — never touches our
  //    own server, so no proxy/body-size limit anywhere applies (this is
  //    what fixes the 413 on large video files).
  await new Promise<void>((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open("PUT", uploadUrl);
    xhr.setRequestHeader("Content-Type", file.type);

    if (onProgress) {
      xhr.upload.onprogress = (event) => {
        if (event.lengthComputable) {
          onProgress(Math.round((event.loaded / event.total) * 100));
        }
      };
    }

    xhr.onload = () => {
      if (xhr.status >= 200 && xhr.status < 300) resolve();
      else reject(new Error(`Upload failed with status ${xhr.status}`));
    };
    xhr.onerror = () => reject(new Error("Network error during upload"));
    xhr.send(file);
  });

  return fileUrl;
};