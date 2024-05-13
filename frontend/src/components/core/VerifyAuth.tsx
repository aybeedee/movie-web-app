import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "@/hooks";
import { useEffect, useState } from "react";

export default function VerifyAuth() {
  const { auth, isVerified, removeSession } = useAuth();
  const [verified, setVerified] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);

  console.log("VerifyAuth: ", auth);

  const verifyUser = async () => {
    const isUserVerified = await isVerified();
    setVerified(isUserVerified);
    setLoading(false);
  }

  useEffect(() => {
    // only verify token if both user and token are available
    if (auth.user && auth.token) {
      verifyUser();
    } else {
      removeSession();
      setLoading(false);
    }
  }, []);

  if (!loading) {
    if (auth.user && auth.token && verified) return <Outlet />;
    return <Navigate to="/login" replace />;
  }
};