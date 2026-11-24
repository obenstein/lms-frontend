"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { Menu } from "lucide-react";

import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "@/components/ui/sheet";

interface MobileMenuProps {
  title: string;
  children: React.ReactNode;
}

/** Slide-in menu for small screens. Closes itself after navigating. */
export const MobileMenu = ({ title, children }: MobileMenuProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger
        aria-label="Open menu"
        className="md:hidden mr-2 p-2 -ml-2 rounded-xl text-slate-700 hover:bg-blue-50 transition"
      >
        <Menu />
      </SheetTrigger>
      <SheetContent side="left" className="p-0 bg-white w-72" aria-describedby={undefined}>
        <SheetTitle className="sr-only">{title}</SheetTitle>
        {children}
      </SheetContent>
    </Sheet>
  );
};
