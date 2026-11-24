import { NextResponse } from "next/server";
import { clerkClient } from "@clerk/nextjs/server";
import { requireTeacher } from "@/lib/auth-guards";
import { isTeacher } from "@/lib/teacher";

export async function GET(req: Request) {
  const guard = await requireTeacher();
  if (guard.error) return guard.error;

  const client = await clerkClient();
  const { data: users } = await client.users.getUserList({ limit: 100 });
  const students = users.filter((u) => !isTeacher(u.id)).map(u => ({
    id: u.id,
    name: `${u.firstName} ${u.lastName}`,
    email: u.emailAddresses[0]?.emailAddress,
    avatar: u.imageUrl,
    createdAt: u.createdAt,
  }));
  return NextResponse.json(students);
}
