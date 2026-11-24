"use client";

import { useEffect, useState } from "react";
import { Navbar } from "./_components/navbar";
import Sidebar from "./_components/sidebar";
import { Loader } from "@/components/loader";

const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
  const [domLoaded, setDomLoaded] = useState(false);

  useEffect(() => {
    setDomLoaded(true);
  }, []);

  return (
    <div className="h-full">
      <div className="h-[80px] md:pl-64 fixed top-0 w-full z-50">
        <Navbar />
      </div>
      <div className="show-on-md flex-col h-full w-64 fixed inset-y-0 z-50">
        <Sidebar />
      </div>
      <main className="h-full pt-[80px] md:pl-64">{domLoaded ? children : <Loader />}</main>
    </div>
  );
};

export default DashboardLayout;
