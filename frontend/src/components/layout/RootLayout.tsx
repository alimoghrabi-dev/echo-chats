import React from "react";
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";
import { Outlet } from "react-router";

const RootLayout: React.FC = () => {
  return (
    <div className="bg-foreground w-[100vw] min-h-screen">
      <Navbar />
      <Sidebar />
      <main className="h-[calc(100vh-52px)] lg:h-screen w-full lg:w-[calc(100%-144px)] ml-auto px-2 lg:px-2.5 pb-2 lg:pb-2.5 pt-0 lg:pt-2.5 lg:pl-0">
        <div className="bg-neutral-50 w-full h-full rounded-lg lg:rounded-[28px] p-1 md:p-6">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default RootLayout;
