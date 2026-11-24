import { CourseCard } from "@/components/course-card";
import { GraduationCap } from "lucide-react";

type courseWithProgress = {
  _id: string;
  title: string;
  imageUrl: string | null;
  category: string | null;
  progress: number;
  chaptersLength: number;
};

interface coursesListProps {
  items: courseWithProgress[];
}

export const CoursesList = ({ items }: coursesListProps) => {
  return (
    <section>
      <div className="flex items-center gap-x-3 mb-6">
        <div className="p-2.5 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 shadow-lg">
          <GraduationCap className="h-6 w-6 text-white" />
        </div>
        <div>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-800 tracking-tight">
            Your Learning Journey
          </h2>
          <p className="text-slate-500 text-sm font-medium mt-0.5">
            {items.length > 0
              ? `${items.length} ${items.length === 1 ? "course" : "courses"}`
              : "Your adventure starts here"}
          </p>
        </div>
      </div>

      {items.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
          {items.map((item) => (
            <CourseCard key={item._id} {...item} />
          ))}
        </div>
      ) : (
        <div className="bg-white/60 rounded-3xl p-8 sm:p-12 border-4 border-dashed border-blue-100 flex flex-col items-center text-center">
          <div className="p-6 rounded-full bg-gradient-to-br from-blue-50 to-indigo-50 border-2 border-blue-100 mb-4">
            <GraduationCap size={48} className="text-blue-500" />
          </div>
          <h3 className="text-xl font-bold text-slate-700">No courses here yet</h3>
          <p className="text-sm text-slate-500 mt-2 max-w-sm">
            Courses appear here once your teacher gives you access. If you were expecting one, ask
            your teacher, or try another category.
          </p>
        </div>
      )}
    </section>
  );
};
