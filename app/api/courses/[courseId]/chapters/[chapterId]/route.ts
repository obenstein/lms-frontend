import Mux from "@mux/mux-node";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import ChapterModel from "@/lib/models/chapter-model";

const Video = new Mux({
  tokenId: process.env.MUX_TOKEN_ID!,
  tokenSecret: process.env.MUX_TOKEN_SECRET!,
});

// Ported from lms-backend/controllers/chapter-controller.js
// (getOneChapter, deleteChapter, updateChapterInfo) + the Mux asset logic
// that previously lived in this Next.js route file.

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ courseId: string; chapterId: string }> }
) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return new NextResponse("Unauthorized access denied", { status: 401 });
    }

    const { courseId, chapterId } = await params;
    await connectDB();

    const existingChapter = await ChapterModel.findOne({ _id: chapterId, courseId });

    if (existingChapter?.assetId) {
      await Video.video.assets.delete(existingChapter.assetId);
    }

    await ChapterModel.findOneAndDelete({ _id: chapterId, courseId });

    return new NextResponse("chapter deleted!!");
  } catch (error) {
    console.log("chapter Id delete api", error);
    return new NextResponse("chapter Id delete", { status: 500 });
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ courseId: string; chapterId: string }> }
) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return new NextResponse("Unauthorized access denied", { status: 401 });
    }

    const { courseId, chapterId } = await params;
    const values = await req.json();

    await connectDB();

    let updateValues: Record<string, unknown> = { ...values, userId };

    if (values.videoUrl) {
      const existingChapter = await ChapterModel.findOne({ _id: chapterId, courseId });

      if (existingChapter?.assetId) {
        try {
          await Video.video.assets.delete(existingChapter.assetId);
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
        if (
          error?.message?.includes("Free plan is limited to 10 assets") ||
          error?.status === 400
        ) {
          console.log("[MUX_AUTO_CLEANUP] Limit reached. Attempting to delete oldest asset...");
          const assets = await Video.video.assets.list({ limit: 100 });
          if (assets.data.length > 0) {
            const oldestAsset = assets.data.sort(
              (a, b) => Number(a.created_at) - Number(b.created_at)
            )[0];
            if (oldestAsset) {
              await Video.video.assets.delete(oldestAsset.id);
              console.log(`[MUX_AUTO_CLEANUP] Deleted oldest asset: ${oldestAsset.id}`);
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

      updateValues = {
        ...updateValues,
        assetId: asset?.id,
        playbackId: asset?.playback_ids?.[0]?.id,
      };
    }

    const chapter = await ChapterModel.findOneAndUpdate(
      { _id: chapterId, courseId, userId },
      updateValues,
      { new: true }
    );

    return NextResponse.json(chapter);
  } catch (error) {
    console.log("api courses courseId chapters chapterId", error);
    return new NextResponse("Internal Error chapter Id", { status: 500 });
  }
}
