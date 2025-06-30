import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import axios from "axios";

export async function GET(
  req: Request,
  { params }: { params: { assignmentId: string } }
) {
  try {
    const { userId } = await auth();
    if (!userId) return new NextResponse("Unauthorized", { status: 401 });

    const res = await axios.get(
      `${process.env.BACK_END_URL}/api/assignments/${params.assignmentId}?userId=${userId}`
    );

return NextResponse.json(res.data);
  } catch (error) {
    console.error("[GET_ASSIGNMENT_DETAIL]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
