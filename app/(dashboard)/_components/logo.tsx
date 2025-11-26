"use client";

import Image from "next/image";
import { cn } from "@/lib/utils";

export const Logo = () => {
  return (
    <div className="flex flex-col items-center justify-center px-4">
      
      {/* Logo Wrapper */}
      <div className="p-2 rounded-2xl transition-all hover:scale-[1.03]">
        <Image
          height={130}
          width={130}
          alt="Logo"
          src="/logo1.png"
          className="drop-shadow-sm"
        />
      </div>

      {/* Bottom Separator */}
      <div className="w-full h-[1.5px] bg-gradient-to-r from-transparent via-sky-300 to-transparent  rounded-full" />
    </div>
  );
};
