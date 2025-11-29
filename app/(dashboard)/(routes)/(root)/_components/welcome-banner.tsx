"use client";

import { useUser } from "@clerk/nextjs";
import { useEffect, useState } from "react";

const messages = [
  "Ready to build your next robot? 🤖",
  "The future of automation awaits! 🚀",
  "Let's code something amazing today! 💻",
  "Your engineering journey continues! ⚙️",
  "Time to level up your skills! ⚡",
  "Mission Control is ready for you! 🎮"
];

export const WelcomeBanner = () => {
  const { user } = useUser();
  const studentName = user?.firstName || "Student";
  const [message, setMessage] = useState(messages[0]);

  useEffect(() => {
    // Pick a random message on mount to keep it fresh
    const randomMessage = messages[Math.floor(Math.random() * messages.length)];
    setMessage(randomMessage);
  }, []);

  return (
    <div className="w-full bg-gradient-to-br from-indigo-600 via-purple-600 to-blue-600 rounded-[2rem] p-8 md:p-12 flex items-center justify-between shadow-2xl relative overflow-hidden group border-4 border-white/20">
      
      {/* Animated Background Elements */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full -mr-20 -mt-20 blur-3xl group-hover:bg-white/15 transition-all duration-1000 animate-pulse-slow"></div>
      <div className="absolute bottom-0 left-0 w-72 h-72 bg-blue-400/20 rounded-full -ml-16 -mb-16 blur-2xl animate-blob"></div>
      
      {/* Floating Stars/Dots */}
      <div className="absolute top-10 left-1/2 w-2 h-2 bg-white rounded-full opacity-60 animate-twinkle"></div>
      <div className="absolute bottom-20 right-1/3 w-3 h-3 bg-yellow-200 rounded-full opacity-80 animate-twinkle delay-700"></div>
      <div className="absolute top-1/3 right-10 w-1.5 h-1.5 bg-white rounded-full opacity-50 animate-twinkle delay-300"></div>

      {/* Left Content */}
      <div className="max-w-2xl z-10 relative">
        <div className="inline-flex items-center gap-x-2 px-4 py-2 rounded-full bg-white/10 text-white font-bold text-sm mb-6 border border-white/20 backdrop-blur-md shadow-lg transform hover:scale-105 transition-transform cursor-default">
          <span className="animate-bounce">👋</span> 
          <span>Hi, {studentName}!</span>
        </div>
        
        <h1 className="text-4xl md:text-6xl font-black text-white mb-6 tracking-tight drop-shadow-md">
          Welcome to Roboautomators LMS
        </h1>

        <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/10 max-w-lg transform transition-all hover:bg-white/15">
          <p className="text-blue-50 text-xl md:text-2xl font-bold leading-relaxed">
            {message}
          </p>
        </div>
      </div>

      {/* Right Content / 3D-like Icon */}
      <div className="hidden lg:block relative z-10 transform transition-transform group-hover:scale-110 duration-700 rotate-3 group-hover:rotate-6">
        <div className="text-[10rem] leading-none filter drop-shadow-[0_10px_20px_rgba(0,0,0,0.3)] animate-float">
          🚀
        </div>
      </div>
    </div>
  );
};
