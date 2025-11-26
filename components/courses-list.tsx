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
  category: string;
};

interface coursesListProps {
  items: courseWithProgress[];
}

export const CoursesList = ({ items }: coursesListProps) => {
  return (
    <>
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
              category={item.category}
              chaptersLength={item.chaptersLength}
            />
          </motion.div>
        ))}
      </div>

      {/* Empty State */}
      {items.length === 0 && (
        <div className="flex flex-col items-center justify-center mt-20 opacity-80">
          <div className="p-6 rounded-full bg-white shadow-inner border w-fit mb-4">
            <GraduationCap size={48} className="text-muted-foreground" />
          </div>
          <h3 className="text-lg font-semibold text-gray-700">No Courses Found</h3>
          <p className="text-sm text-muted-foreground mt-1 max-w-sm text-center">
            It looks a little empty here. Once courses are available, they’ll appear in this list.
          </p>
        </div>
      )}
    </>
  );
};
