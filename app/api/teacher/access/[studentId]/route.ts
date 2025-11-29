import { NextResponse } from "next/server";
import axios from "axios";



export async function GET(req: Request, { params }: { params: { studentId: string } }) {
  const { studentId } = params;
  try {
    console.log("[ACCESS_GET]", studentId);

    if (!studentId) {
      return NextResponse.json(
        { message: "Missing studentId" },
        { status: 400 }
      );
    }

    const accessList = await axios.get(
      `${process.env.BACK_END_URL}/api/access/${studentId}`
    );

    return NextResponse.json(accessList.data);
  } catch (error) {
    console.error("[ACCESS_GET_ERROR]", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }

}


