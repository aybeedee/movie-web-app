import Navbar from "@/components/core/Navbar";
import { Outlet } from "react-router-dom";

export default function NavbarLayout() {
  return (
    <div className="w-screen h-screen flex flex-col">
      <Navbar />
      <Outlet />
    </div>
  )
}