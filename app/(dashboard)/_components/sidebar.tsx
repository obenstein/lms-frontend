import { Logo } from "./logo";
import SidebarRoutes from "./sidebar-routes";

export const Sidebar = () => {
    return (
    <div className="h-full shadow-lg border-r-4 border-blue-100 flex flex-col overflow-y-auto bg-white w-64">
            <div className="pt-6 flex items-center justify-center ">
                <Logo />
            </div>
            <div className="flex flex-col w-full p-4 space-y-2">
                <SidebarRoutes />
            </div>
        </div>
    );
}

export default Sidebar;