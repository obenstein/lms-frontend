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
    pathname?.startsWith(`${href}/`);

  return (
    <button
      onClick={onClick}
      type="button"
      className={cn(
        "group flex items-center gap-x-3 w-full px-4 py-3.5 rounded-2xl transition-all duration-200 border-2",
        "hover:bg-blue-50 hover:border-blue-200 hover:text-blue-600 hover:shadow-sm",
        isActive
          ? "bg-blue-100/50 text-blue-700 border-blue-200 shadow-sm"
          : "bg-transparent text-slate-500 border-transparent font-medium"
      )}
    >
      <div className={cn(
        "flex items-center justify-center w-10 h-10 rounded-xl transition-all duration-200",
        isActive ? "bg-blue-200 text-blue-700" : "bg-slate-100 text-slate-500 group-hover:bg-blue-100 group-hover:text-blue-600"
      )}>
        <Icon size={22} />
      </div>

      <span className={cn(
        "text-base font-bold",
        isActive && "text-blue-800"
      )}>
        {label}
      </span>

      {isActive && (
        <div className="ml-auto w-2 h-2 rounded-full bg-blue-600 animate-pulse" />
      )}
    </button>
  );
};

export default SidebarItem;
