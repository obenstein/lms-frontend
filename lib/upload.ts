import axios from "axios";

export const uploadFile = async (file: File): Promise<string> => {
  const formData = new FormData();
  formData.append("file", file);

  const backendUrl = process.env.NEXT_PUBLIC_BACK_END_URL || "http://localhost:4000";

  try {
    const response = await axios.post(`${backendUrl}/api/upload`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    if (response.data && response.data.fileUrl) {
      return response.data.fileUrl;
    }
    throw new Error("Invalid response from server");
  } catch (error: any) {
    console.error("Upload Error:", error);
    throw new Error(error.response?.data?.error || "Failed to upload file");
  }
};
