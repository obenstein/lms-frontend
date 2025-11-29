import { NextResponse } from "next/server";
import { clerkClient, auth } from "@clerk/nextjs/server";

export async function GET(req: Request) {
  const { userId } = await auth();
  if (!userId) return new NextResponse("Unauthorized", { status: 401 });

  const client = await clerkClient();
  const { data: users } = await client.users.getUserList({ limit: 100 });
  const students = users.map(u => ({
    id: u.id,
    name: `${u.firstName} ${u.lastName}`,
    email: u.emailAddresses[0]?.emailAddress,
    avatar: u.imageUrl,
    createdAt: u.createdAt,
  }));
  return NextResponse.json(students);
}
