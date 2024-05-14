import { getUser } from "@/api/auth";
import { AuthContextType, AuthInfo } from "@/lib/types";
import { createContext, useEffect, useState } from "react";

const AuthContext = createContext<AuthContextType>(null!);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [authInfo, setAuthInfo] = useState<AuthInfo>({
    user: JSON.parse(localStorage.getItem("user") || "null"),
    token: localStorage.getItem("jwtToken")
      ? localStorage.getItem("jwtToken")
      : null,
  });
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [loadingAuth, setLoadingAuth] = useState<boolean>(true);

  console.log("AuthProvider: ", {
    authInfo: authInfo,
    isLoggedIn: isLoggedIn,
    loadingAuth: loadingAuth
  });

  useEffect(() => {
    verifyUser();
  }, []);

  // verify jwt server side to determine auth status
  const verifyUser = async () => {
    try {
      const res = await getUser();
      console.log(res);
      localStorage.setItem("user", JSON.stringify(res.data));
      setAuthInfo(prevState => ({
        ...prevState,
        user: res.data
      }));
      setIsLoggedIn(true);
    } catch (error) {
      console.error(error);
      removeSession();
      setIsLoggedIn(false);
    } finally {
      setLoadingAuth(false);
    }
  }

  const saveUser = (authInfo: AuthInfo) => {
    localStorage.setItem("user", JSON.stringify(authInfo.user));
    localStorage.setItem("jwtToken", JSON.stringify(authInfo.token));
    // if don't update state, then local storage does not get set before handle signup navigates to "/" ?
    setAuthInfo(prevState => ({
      ...prevState,
      user: authInfo.user,
      token: authInfo.token
    }));
    setIsLoggedIn(true);
  };

  const removeSession = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("jwtToken");
    setAuthInfo(prevState => ({
      ...prevState,
      user: null,
      token: null
    }));
    setIsLoggedIn(false);
  }

  return (
    <AuthContext.Provider value={{ authInfo, isLoggedIn, loadingAuth, saveUser, removeSession }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
