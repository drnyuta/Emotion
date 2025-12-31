import { useState } from "react";
import { AuthContext } from "./AuthContext";
import { ReactNode } from "react";

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(() => {
    return !!localStorage.getItem("token");
  });
  const [email, setEmail] = useState<string | null>(() => {
    return localStorage.getItem("email");
  });

  const loginContext = (token: string, email: string) => {
    localStorage.setItem("token", token);
    localStorage.setItem("email", email);

    setIsLoggedIn(true);
    setEmail(email);
  };

  const logoutContext = () => {
    setIsLoggedIn(false);
    localStorage.removeItem("token");
    localStorage.removeItem("email");
  };


  return (
    <AuthContext.Provider
      value={{
        isLoggedIn,
        loginContext,
        logoutContext,
        email,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
