import { createContext } from "react";

export interface AuthContextType {
  isLoggedIn: boolean;
  email: string | null;
  loginContext: (token: string, email: string) => void;
  logoutContext: () => void;
}

export const AuthContext = createContext<AuthContextType | null>(null);
