import { Navbar } from "@/components/core";
import { Outlet } from "react-router-dom";

export default function NavbarLayout() {
  return (
    <div className="w-full h-full flex flex-col">
      <Navbar />
      <Outlet />
    </div>
  )
}