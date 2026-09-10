import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return new NextResponse("Unauthorized", {
        status: 401,
      });
    }

    const backendUrl =
      process.env.BACK_END_URL || "http://localhost:4000";

    const response = await fetch(`${backendUrl}/api/upload`, {
      method: "POST",
      headers: {
        "content-type": req.headers.get("content-type") || "",
        "content-length": req.headers.get("content-length") || "",
      },
      body: req.body,
      // Important for streaming request bodies
      duplex: "half",
    });

    const contentType = response.headers.get("content-type");

    if (!response.ok) {
      const text = await response.text();

      console.error("Backend upload error:", text);

      return new NextResponse(text || "Upload failed", {
        status: response.status,
      });
    }

    if (contentType?.includes("application/json")) {
      return NextResponse.json(await response.json());
    }

    return new NextResponse(await response.text(), {
      status: response.status,
    });

  } catch (error) {
    console.error("Upload proxy error:", error);

    return new NextResponse("Internal server error", {
      status: 500,
    });
  }
}
