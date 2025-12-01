import { clerkClient } from "@clerk/nextjs/server";

export const getAllStudents = async () => {
  const client = await clerkClient();
  const users = await client.users.getUserList({ limit: 100 });
  
  return users;
};
