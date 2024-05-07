import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "@/hooks";

export default function VerifyAuth() {
  const { auth } = useAuth();

  if (auth.token) return <Navigate to="/" replace />;
  return <Outlet />;
};