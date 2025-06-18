import { auth } from "@clerk/nextjs/server";
import axios from "axios";
import { redirect } from "next/navigation";
import { CourseSidebar } from "./_components/course-sidebar";
import { CourseNavbar } from "./_components/course-navbar";


interface LayoutProps {
  params: Promise<{ courseId: string }>;
  children: React.ReactNode;
}
const CourseLayout = async ({
    children,
    params
}: LayoutProps) => {

    const { userId } = await auth()
    if(!userId){
        return redirect("/")
    }
  const { courseId } = await params;
  const course = (await axios.get(`${process.env.BACK_END_URL}/api/courses/${courseId}`)).data;

const chapters = await (await axios.get(`${process.env.BACK_END_URL}/api/chapters/${courseId}/published`)).data



    return ( 
        <div className="h-full">
            <div className="h-[80px] md:pl-80 fixed inset-y-0 w-full z-50">
                <CourseNavbar
                course={course}
                chapters={chapters}
                // progressCount={progressCount}
                />
            </div>

            <div className="hidden md:flex h-full w-80 flex-col fixed inset-y-0 z-50">
                <CourseSidebar 
                userId={userId}
                course={course}
                chapters={chapters}
                // progress={progressCount}
                />
            </div>
            <main className="md:pl-80 h-full pt-[80px]">
            {children}
            </main>
        </div>
     );
}
 
export default CourseLayout;