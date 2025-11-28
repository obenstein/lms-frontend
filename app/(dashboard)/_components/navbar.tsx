import NavbarRoutes from "@/components/navbar-routes"
import MobileSidebar from "./mobile-sidebar"

export const Navbar = () => {
    return (
        <div className="px-4 border-b-4 border-blue-100 flex items-center h-full bg-white shadow-sm">
            <MobileSidebar />
            <NavbarRoutes />
        </div>
    )
}