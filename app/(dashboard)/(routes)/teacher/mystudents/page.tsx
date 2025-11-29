// File: app/(dashboard)/(routes)/teacher/mystudents/page.tsx

import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { StudentsTable } from "./_components/students-table";
import { DataTable } from "../courses/_components/data-table";
export default async function MyStudentsPage() {
  const user = await currentUser();
  if (!user) return redirect("/");

  // Assume all non-teachers are students for now
  
    
  return (
    <div className="p-6 max-w-6xl mx-auto">
      {/* <h1 className="text-3xl font-bold mb-4">My Students</h1> */}
      <StudentsTable/>
    
    </div>
  );
}
