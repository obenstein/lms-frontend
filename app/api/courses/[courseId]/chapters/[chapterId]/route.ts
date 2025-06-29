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

    if (values.videoUrl) {
      const exitsingMuxData = await axios.get(
        `${process.env.BACK_END_URL}/api/chapters/${chapterId}/course/${courseId}`
      );

      // if(exitsingMuxData.data.assetId){
      //     await Video.video.assets.delete(exitsingMuxData.data.assetId)
      // }

      const asset = await Video.video.assets.create({
        inputs: [
          {
            url: values.videoUrl,
          },
        ],
        playback_policy: ["public"],
        test: false,
      });
      chapter = await axios.patch(
        `${process.env.BACK_END_URL}/api/chapters/${chapterId}/course/${courseId}`,
        {
          ...values,
          userId,
          assetId: asset.id,
          playbackId: asset.playback_ids?.[0]?.id,
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
