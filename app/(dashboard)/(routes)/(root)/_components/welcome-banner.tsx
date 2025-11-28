"use client";

import Image from "next/image";
import { useUser } from "@clerk/nextjs";

export const WelcomeBanner = () => {
  const { user } = useUser();
  const studentName = user?.firstName || "Student";

  return (
    <div className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 rounded-3xl p-8 md:p-10 flex items-center justify-between shadow-xl relative overflow-hidden group">

      {/* Decorative Background Elements */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-16 -mt-16 blur-2xl group-hover:bg-white/20 transition-all duration-700"></div>
      <div className="absolute bottom-0 left-0 w-48 h-48 bg-purple-500/20 rounded-full -ml-10 -mb-10 blur-xl"></div>

      {/* Left Content */}
      <div className="max-w-2xl z-10 relative">
        <div className="inline-block px-4 py-1.5 rounded-full bg-white/20 text-white font-bold text-sm mb-4 border border-white/30 backdrop-blur-sm">
          🚀 Mission Control
        </div>
        <h1 className="text-3xl md:text-5xl font-black text-white mb-4 tracking-tight">
          Welcome back, {studentName}! 👋
        </h1>

        <p className="text-blue-100 text-lg md:text-xl leading-relaxed font-medium max-w-lg">
          Ready for your next adventure? Your robots are waiting to be built! Let's code something amazing today.
        </p>
      </div>

      {/* Right Content / Icon */}
      <div className="hidden md:block relative z-10 transform transition-transform group-hover:scale-110 duration-500">
        <div className="text-[8rem] leading-none filter drop-shadow-2xl animate-bounce-slow">
          🤖
        </div>
      </div>
    </div>
  );
};
