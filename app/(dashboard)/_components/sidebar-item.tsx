"use client";

import { usePathname, useRouter } from "next/navigation";
import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface sidebarItemProps {
  icon: LucideIcon;
  label: string;
  href: string;
}

const SidebarItem = ({ icon: Icon, label, href }: sidebarItemProps) => {
  const pathname = usePathname();
  const router = useRouter();

  const onClick = () => router.push(href);

  const isActive =
    (pathname === "/" && href === "/") ||
    pathname === href ||
    pathname.startsWith(`${href}/`);

  return (
    <button
      onClick={onClick}
      type="button"
      className={cn(
        "group flex items-center gap-x-3 w-full px-4 py-3 my-1 rounded-xl transition-all",
        "hover:bg-sky-100/60 hover:text-sky-700",
        "text-slate-600 font-medium",
        isActive &&
          "bg-sky-200/40 text-sky-800 shadow-sm border border-sky-300/60"
      )}
    >
      {/* Icon Bubble */}
      <div
        className={cn(
          "w-9 h-9 rounded-xl flex items-center justify-center transition-all",
          "bg-slate-200/60 text-slate-600 group-hover:bg-sky-200/60 group-hover:text-sky-700",
          isActive && "bg-sky-300/60 text-sky-800"
        )}
      >
        <Icon size={20} />
      </div>

      {/* Label */}
      <span className="text-base">{label}</span>

      {/* Right Accent Strip */}
      <div
        className={cn(
          "ml-auto w-[4px] h-7 rounded-full bg-sky-600/0 transition-all",
          isActive && "bg-sky-600/80"
        )}
      />
    </button>
  );
};

export default SidebarItem;
