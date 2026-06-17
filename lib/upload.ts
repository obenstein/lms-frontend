import axios from "axios";

export const uploadFile = async (file: File): Promise<string> => {
  const formData = new FormData();
  formData.append("file", file);

  try {
    const response = await axios.post(`/api/upload`, formData, {
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
