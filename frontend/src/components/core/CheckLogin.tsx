import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "@/hooks";

export default function CheckLogin() {
  const { auth } = useAuth();

  console.log("CheckLogin: ", auth);

  // if (auth.token) return <Navigate to="/" replace />;
  return <Outlet />;
};