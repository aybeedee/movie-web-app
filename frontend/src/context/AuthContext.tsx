import { AuthContextType, AuthInfo } from "@/lib/types";
import { createContext, useState } from "react";

const AuthContext = createContext<AuthContextType>(null!);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [auth, setAuth] = useState<AuthInfo>({
    user: JSON.parse(localStorage.getItem("user") || "{}"),
    token: localStorage.getItem("jwtToken")
      ? localStorage.getItem("jwtToken")
      : "",
  });

  console.log(auth);

  return (
    <AuthContext.Provider value={{ auth, setAuth }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
