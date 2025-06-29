import Mux from "@mux/mux-node"
import { auth } from "@clerk/nextjs/server"
import axios from "axios"
import { NextResponse } from "next/server"


const Video = new Mux({
    tokenId: process.env.MUX_TOKEN_ID!,
    tokenSecret: process.env.MUX_TOKEN_SECRET!
})

export async function DELETE(
    req: Request, 
    { params }: { params: { courseId: string; chapterId: string } }
) {
    try {
        const { userId } = await auth();
        if (!userId) {
            return new NextResponse("Unauthorized access denied!", { status: 401 });
        }

        // Await params before using
        const { courseId, chapterId } = await params;

        const courseChapters: {_id: string, assetId: string}[] = await (
            await axios.get(`${process.env.BACK_END_URL}/api/chapters/${courseId}`)
        ).data;

        // Rest of your logic...
        
    } catch (error) {
        console.log("courseId delete", error);
        return new NextResponse("Internal server error courseId delete", { status: 500 });
    }
}

export async function PATCH(
    req: Request,
    { params }: { params: { courseId: string; chapterId: string } }
) {
    try {
        const { userId } = await auth();
        if (!userId) {
            return new NextResponse("Unauthorized user", { status: 401 });
        }

        // Await params before using
        const { courseId, chapterId } = await params;
        const values = await req.json();
          const course = await axios.patch(`${process.env.BACK_END_URL}/api/courses/${courseId}`,{...values,userId})

        if (values.videoUrl) {
            const exitsingMuxData = await axios.get(
                `${process.env.BACK_END_URL}/api/courses/${chapterId}/course/${courseId}`
            );

            const asset = await Video.video.assets.create({
                inputs: values.videoUrl,
                playback_policies: ['public'],
                test: false
            });
        }
        return new NextResponse(course.data)

            
        //     // Continue with your logic...
        // }

        // Your existing logic here...
        
    } catch (error) {
        console.log("error at api course courseId", error);
        return new NextResponse("Internal error at course Id", { status: 500 });
    }
}