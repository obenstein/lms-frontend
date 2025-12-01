"use client";

import { CourseCard } from "@/components/course-card";
import { motion } from "framer-motion";
import { GraduationCap } from "lucide-react";

type courseWithProgress = {
  _id: string;
  userId: string;
  categoryId: string;
  imageUrl: string;
  title: string;
  description: string;
  price: number;
  progress: number | null;
  chaptersLength: number;

};

interface coursesListProps {
  items: courseWithProgress[];
}

export const CoursesList = ({ items }: coursesListProps) => {
  return (
    <div className="mt-8">
      {/* Header Section */}
      <div className="mb-8">
        <div className="flex items-center gap-x-3 mb-3">
          <div className="p-2.5 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 shadow-lg">
            <GraduationCap className="h-6 w-6 text-white" />
          </div>
          <div>
            <h2 className="text-3xl font-black text-slate-800 tracking-tight">
              Your Learning Journey
            </h2>
            <p className="text-slate-500 text-sm font-medium mt-0.5">
              {items.length > 0 
                ? `${items.length} ${items.length === 1 ? 'course' : 'courses'} available` 
                : 'Start your adventure'}
            </p>
          </div>
        </div>
      </div>

      {/* Courses Grid Container */}
      {items.length > 0 ? (
        <div className="bg-white/40 backdrop-blur-sm rounded-3xl p-6 md:p-8 border-2 border-blue-100/50 shadow-sm">
          <div className="grid sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {items.map((item) => (
              <motion.div
                key={item._id}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.98 }}
                transition={{ type: "spring", stiffness: 300 }}
                className="rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 bg-white/60 backdrop-blur-sm border border-gray-200"
              >
                <CourseCard
                  _id={item._id}
                  title={item.title}
                  imageUrl={item.imageUrl}
                  price={item.price}
                  progress={item.progress}

                  chaptersLength={item.chaptersLength}
                />
              </motion.div>
            ))}
          </div>
        </div>
      ) : (
        /* Empty State */
        <div className="bg-white/40 backdrop-blur-sm rounded-3xl p-12 border-2 border-blue-100/50">
          <div className="flex flex-col items-center justify-center opacity-80">
            <div className="p-6 rounded-full bg-gradient-to-br from-blue-50 to-indigo-50 shadow-inner border-2 border-blue-100 w-fit mb-4">
              <GraduationCap size={48} className="text-blue-500" />
            </div>
            <h3 className="text-xl font-bold text-slate-700">No Courses Found</h3>
            <p className="text-sm text-slate-500 mt-2 max-w-sm text-center">
              It looks a little empty here. Once courses are available, they&apos;ll appear in this list.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
