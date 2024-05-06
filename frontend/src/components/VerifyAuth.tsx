import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "@/hooks";

export default function VerifyAuth() {
  const { auth, setAuth } = useAuth();

  if (!auth.token) return <Navigate to="/login" />;
  return <Outlet />;
};