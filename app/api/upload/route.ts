import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const formData = await req.formData();
    const backendUrl = process.env.BACK_END_URL || "http://localhost:4000";

    const response = await fetch(`${backendUrl}/api/upload`, {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      const text = await response.text();
      console.error("Backend upload error:", text);
      return new NextResponse("Upload failed", { status: response.status });
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error: any) {
    console.error("Upload route error:", error);
    return new NextResponse("Internal server error", { status: 500 });
  }
}
