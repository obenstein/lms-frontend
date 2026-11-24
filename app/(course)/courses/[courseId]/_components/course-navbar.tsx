import NavbarRoutes from "@/components/navbar-routes";
import { MobileMenu } from "@/components/mobile-menu";

interface courseNavbarProps {
  title: string;
  sidebar: React.ReactNode;
}

export const CourseNavbar = ({ title, sidebar }: courseNavbarProps) => {
  return (
    <div className="px-4 border-b-4 border-blue-100 h-full flex items-center bg-white shadow-sm">
      <MobileMenu title="Course missions">{sidebar}</MobileMenu>
      <div className="min-w-0 truncate font-bold text-base md:text-xl text-slate-700 md:ml-2 mr-4">
        {title}
      </div>
      <NavbarRoutes />
    </div>
  );
};
