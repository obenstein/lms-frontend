import { MobileMenu } from "@/components/mobile-menu";
import Sidebar from "./sidebar";

export const MobileSidebar = () => {
  return (
    <MobileMenu title="Menu">
      <Sidebar />
    </MobileMenu>
  );
};

export default MobileSidebar;
