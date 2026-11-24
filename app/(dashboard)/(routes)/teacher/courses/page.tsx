import { DataTable } from "./_components/data-table";
import { columns } from "./_components/columns";
import { requireTeacherPage } from "@/lib/auth-guards";
import { redirect } from "next/navigation";
import axios from "axios";
import { getAllCourses } from "@/lib/queries";



const CoursesPage = async () => {


    const userId = await requireTeacherPage();
    if(!userId){
        return redirect("/")
    }

    const courses = await getAllCourses();

    return ( 
        <div className="p-6">
           <DataTable columns={columns} data={courses} />
        </div>
     );
}
 
export default CoursesPage;