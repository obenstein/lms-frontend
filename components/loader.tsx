"use client";

export const Loader = () => {
  return (
    <div className="h-full w-full flex items-center justify-center">
      <div className="flex flex-col items-center gap-y-4">
        {/* Animated Robot/Rocket */}
        <div className="relative">
          <div className="text-8xl animate-bounce">
            🚀
          </div>
          {/* Pulsing rings */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-32 h-32 rounded-full border-4 border-blue-400 animate-ping opacity-20"></div>
          </div>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-24 h-24 rounded-full border-4 border-purple-400 animate-ping opacity-30 animation-delay-150"></div>
          </div>
        </div>

        {/* Loading Text */}
        <div className="text-center">
          <h3 className="text-2xl font-black text-slate-700 mb-2">
            Loading your adventure...
          </h3>
          <div className="flex items-center justify-center gap-x-1">
            <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"></div>
            <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce animation-delay-150"></div>
            <div className="w-2 h-2 bg-indigo-500 rounded-full animate-bounce animation-delay-300"></div>
          </div>
        </div>
      </div>
    </div>
  );
};
