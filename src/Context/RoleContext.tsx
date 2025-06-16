import React, {
  createContext,
  useState,
  useContext,
  ReactNode,
  Dispatch,
  SetStateAction,
  useEffect,
} from "react";
import Cookies from "js-cookie";
import { Mode, Role, User } from "@/Types/auth.type";

interface RoleContextType {
  role: Role | null;
  setRole: Dispatch<SetStateAction<Role | null>>;
  mode: Mode;
  setMode: Dispatch<SetStateAction<Mode>>;
  user: User | null;
  setUser: Dispatch<SetStateAction<User | null>>;
}

const RoleContext = createContext<RoleContextType | undefined>(undefined);

export const useRole = (): RoleContextType => {
  const context = useContext(RoleContext);

  if (!context) {
    throw new Error("useRole must be used within a RoleProvider");
  }
  return context;
};

export const RoleProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  // For role and mode, we can still use cookies if they're simple strings
  const currentRole: Role | null = Cookies.get("role") as Role | null;
  const currentMode: Mode = Cookies.get("mode")
    ? (Cookies.get("mode") as Mode)
    : "formal";

  // Get user from localStorage instead of cookies
  const getInitialUser = (): User | null => {
    if (typeof window !== "undefined") {
      const userData = localStorage.getItem("user");
      return userData ? JSON.parse(userData) : null;
    }
    return null;
  };

  const [role, setRole] = useState<Role | null>(currentRole);
  const [mode, setMode] = useState<Mode>(currentMode);
  const [user, setUser] = useState<User | null>(getInitialUser());

  // Sync user changes to localStorage
  useEffect(() => {
    if (typeof window !== "undefined") {
      if (user) {
        localStorage.setItem("user", JSON.stringify(user));
      } else {
        localStorage.removeItem("user");
      }
    }
  }, [user]);

  return (
    <RoleContext.Provider
      value={{
        role,
        setRole,
        mode,
        setMode,
        user,
        setUser,
      }}
    >
      {children}
    </RoleContext.Provider>
  );
};

export default RoleContext;
