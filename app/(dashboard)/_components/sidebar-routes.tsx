"use client";

import { Compass, Layout, List, BarChart, BookOpen, Video } from "lucide-react";
import SidebarItem from "./sidebar-item";
import { usePathname } from "next/navigation";

const guestRoutes = [
  {
    icon: BookOpen,
    label: "My Courses",
    href: "/",
  },
  
];

const teacherRoutes = [
  { icon: List, label: "Courses", href: "/teacher/courses" },
  { icon: Video, label: "Live Sessions", href: "/teacher/live" },
  { icon: BarChart, label: "Analytics", href: "/teacher/analytics" },
];

const SidebarRoutes = () => {
  const pathname = usePathname();
  const isTeacher = pathname?.includes("/teacher");
  const routes = isTeacher ? teacherRoutes : guestRoutes;

  return (
    <div className="flex flex-col w-full px-2 py-4 space-y-1">
      {routes.map((route) => (
        <SidebarItem
          key={route.href}
          icon={route.icon}
          label={route.label}
          href={route.href}
        />
      ))}
    </div>
  );
};

export default SidebarRoutes;
