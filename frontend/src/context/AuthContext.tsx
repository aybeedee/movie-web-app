import { getUser } from "@/api/auth";
import { AuthContextType, AuthInfo } from "@/lib/types";
import { createContext, useState } from "react";

const AuthContext = createContext<AuthContextType>(null!);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [auth, setAuth] = useState<AuthInfo>({
    user: JSON.parse(localStorage.getItem("user") || "null"),
    token: localStorage.getItem("jwtToken")
      ? localStorage.getItem("jwtToken")
      : null,
  });

  console.log("AuthProvider: ", auth);

  // verify jwt server side to determine auth status
  const isVerified = async () => {
    try {
      const res = await getUser();
      console.log(res);
      localStorage.setItem("user", JSON.stringify(res.data));
      return true;
    } catch (error) {
      console.error(error);
      localStorage.removeItem("user");
      localStorage.removeItem("jwtToken");
      // setAuth(prevState => ({
      //   ...prevState,
      //   user: null,
      //   token: null
      // }));
      return false;
    }
  }

  const saveUser = (authInfo: AuthInfo) => {
    localStorage.setItem("user", JSON.stringify(authInfo.user));
    localStorage.setItem("jwtToken", JSON.stringify(authInfo.token));
    // if don't update state, then local storage does not get set before handle signup navigates to "/"
    setAuth(prevState => ({
      ...prevState,
      user: authInfo.user,
      token: authInfo.token
    }));
  };

  const removeSession = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("jwtToken");
    // setAuth back null too ?
  }

  return (
    <AuthContext.Provider value={{ auth, setAuth, isVerified, saveUser, removeSession }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
