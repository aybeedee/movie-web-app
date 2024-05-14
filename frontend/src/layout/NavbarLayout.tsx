import { Navbar } from "@/components/core";
import { Outlet } from "react-router-dom";

export default function NavbarLayout() {
  return (
    <div className="w-screen h-screen flex flex-col">
      <Navbar />
      <Outlet />
    </div>
  )
}