import { auth } from "@clerk/nextjs/server"
import axios from "axios"
import { NextResponse } from "next/server"

export async function DELETE(req: Request, { params } : { params : { courseId : string, attachmentIdx : number}}){
    try {
        const {userId} = await auth()
        if(!userId){
            return new NextResponse("Unauthorized access denied!", {status : 401})
        }

        const {courseId, attachmentIdx} = await params
        const course = await axios.delete(`${process.env.BACK_END_URL}/api/chapters/${courseId}/attachments/${attachmentIdx}`)

        return new NextResponse(course.data)

    } catch (error) {
        console.log("delet attachment url", error)
        return new NextResponse("Internal Error", {status : 500} )
    }
}