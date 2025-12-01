import Mux from "@mux/mux-node";
import { auth } from "@clerk/nextjs/server";
import axios from "axios";
import { NextResponse } from "next/server";

const Video = new Mux({
  tokenId: process.env.MUX_TOKEN_ID!,
  tokenSecret: process.env.MUX_TOKEN_SECRET!,
});

export async function DELETE(
  req: Request,
  { params }: { params: { courseId: string; chapterId: string } }
) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return new NextResponse("Unauthorized access denied", { status: 401 });
    }

    // Await params before using
    const { courseId, chapterId } = await params;

    const exitsingMuxData = await axios.get(
      `${process.env.BACK_END_URL}/api/chapters/${chapterId}/course/${courseId}`
    );

    if (exitsingMuxData.data.assetId) {
      await Video.video.assets.delete(exitsingMuxData.data.assetId);
    }

    await axios.delete(
      `${process.env.BACK_END_URL}/api/chapters/${chapterId}/course/${courseId}`
    );

    return new NextResponse("chapter deleted!!");
  } catch (error) {
    console.log("chapter Id delete api", error);
    return new NextResponse("chapter Id delete", { status: 500 });
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: { courseId: string; chapterId: string } }
) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return new NextResponse("Unauthorized access denied", { status: 401 });
    }

    // Await params before using
    const { courseId, chapterId } = await params;
    const values = await req.json();

    let chapter;

    if (values.videoUrl) 
    {
      const exitsingMuxData = await axios.get(
        `${process.env.BACK_END_URL}/api/chapters/${chapterId}/course/${courseId}`
      );

      if (exitsingMuxData.data.assetId) {
        try {
          await Video.video.assets.delete(exitsingMuxData.data.assetId);
        } catch (error) {
          console.log("[MUX_ASSET_DELETE_ERROR]", error);
          // Continue even if delete fails (asset might not exist)
        }
      }

      let asset;
      try {
        asset = await Video.video.assets.create({
          inputs: [{ url: values.videoUrl }],
          playback_policy: ["public"],
          test: false,
        });
      } catch (error: any) {
        console.log("[MUX_CREATE_ERROR]", error);
        // Check for limit error (Mux returns 400 for limits)
        if (error?.message?.includes("Free plan is limited to 10 assets") || error?.status === 400) {
           console.log("[MUX_AUTO_CLEANUP] Limit reached. Attempting to delete oldest asset...");
           const assets = await Video.video.assets.list({ limit: 100 });
           if (assets.data.length > 0) {
             // Sort by created_at ascending (oldest first) - Mux list might be default desc
             const oldestAsset = assets.data.sort((a, b) => Number(a.created_at) - Number(b.created_at))[0];
             if (oldestAsset) {
               await Video.video.assets.delete(oldestAsset.id);
               console.log(`[MUX_AUTO_CLEANUP] Deleted oldest asset: ${oldestAsset.id}`);
               
               // Retry creation
               asset = await Video.video.assets.create({
                inputs: [{ url: values.videoUrl }],
                playback_policy: ["public"],
                test: false,
              });
             }
           }
        } else {
          throw error;
        }
      }
      chapter = await axios.patch(
        `${process.env.BACK_END_URL}/api/chapters/${chapterId}/course/${courseId}`,
        {
          ...values,
          userId,
          assetId: asset?.id,
          playbackId: asset?.playback_ids?.[0]?.id,
        }
      );
    } else {
      chapter = await axios.patch(
        `${process.env.BACK_END_URL}/api/chapters/${chapterId}/course/${courseId}`,
        {
          ...values,
          userId,
        }
      );
    }

    return NextResponse.json(chapter.data);
  } catch (error) {
    console.log("api courses courseId chapters chapterId", error);
    return new NextResponse("Internal Error chapter Id", { status: 500 });
  }
}
