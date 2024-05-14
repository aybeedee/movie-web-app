import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "@/hooks";

export default function RequireAuth() {
  const { isLoggedIn, loadingAuth } = useAuth();

  console.log("RequireAuth: ", {
    isLoggedIn: isLoggedIn,
    loadingAuth: loadingAuth
  });

  if (!loadingAuth) {
    if (isLoggedIn) return <Outlet />;
    return <Navigate to="/login" replace />;
  }
};