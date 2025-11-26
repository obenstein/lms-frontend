"use client";

import Image from "next/image";
import { useUser } from "@clerk/nextjs";

export const WelcomeBanner = () => {
  const { user } = useUser();
  const studentName = user?.firstName || "Student";

  return (
    <div className="w-full bg-[#F4F7FF] rounded-2xl p-6 md:p-8 flex items-center justify-between shadow-sm border border-blue-100 relative overflow-hidden">
      
      {/* Left Content */}
      <div className="max-w-xl z-10">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
          Welcome, {studentName}! 👋
        </h1>

        <p className="mt-3 text-gray-700 text-lg leading-relaxed">
          Ready to build your first robot? You're about to start your journey into coding, robotics, and automation with 
          <span className="font-semibold text-blue-600"> RoboAutomators</span>.
        </p>

        {/* <button className="mt-5 px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-lg shadow-md transition">
          Start Learning →
        </button> */}
      </div>

      {/* Robot Image */}
      {/* <div className=" hidden  w-48 h-48 relative">
        <Image
          src="/robo.jpg"
          alt="Robot mascot"
          fill
          className="object-contain drop-shadow-lg"
        />
      </div> */}
    </div>
  );
};
