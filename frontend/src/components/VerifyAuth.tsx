import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "@/hooks";

export default function VerifyAuth() {
  const { auth } = useAuth();

  console.log("VerifyAuth: ", auth);

  if (!auth.token) return <Navigate to="/login" replace />;
  return <Outlet />;
};