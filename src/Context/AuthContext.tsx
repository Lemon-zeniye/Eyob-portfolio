import React, { createContext, useContext, useEffect, useState } from "react";
import Cookies from "js-cookie";
import { getUserFromToken } from "@/lib/utils";
import { useRole } from "./RoleContext";

type AuthContextType = {
  isAuthenticated: boolean;
  accessToken: string | null;
  login: (accessToken: string, refreshToken: string) => void;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const { setRole } = useRole();

  useEffect(() => {
    const token = Cookies.get("accessToken");

    if (token) {
      setAccessToken(token);
      const userInfo = getUserFromToken(token);
      if (userInfo?.role) {
        setRole(userInfo.role);
      }
    }
  }, []);

  const login = (accessToken: string, refreshToken: string) => {
    Cookies.set("accessToken", accessToken);
    Cookies.set("refreshToken", refreshToken);
    setAccessToken(accessToken);
    setIsAuthenticated(true);
  };

  const logout = () => {
    Cookies.remove("accessToken");
    Cookies.remove("refreshToken");
    setAccessToken(null);
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider
      value={{ isAuthenticated, accessToken, login, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within an AuthProvider");
  return context;
};
