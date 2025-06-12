import React from "react";
import { Outlet } from "react-router-dom";
import Navbar from "./components/Navbar";

function Layout() {
  return (
    <>
      <Navbar />
      <div className="px-4 sm:px-6 lg:px-8">
        <Outlet />
      </div>
    </>
  );
}

export default Layout;
