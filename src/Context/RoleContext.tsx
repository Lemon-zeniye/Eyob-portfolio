import React, {
  createContext,
  useState,
  useContext,
  ReactNode,
  Dispatch,
  SetStateAction,
} from "react";
import Cookies from "js-cookie";
import { Mode, Role } from "@/Types/auth.type";

interface RoleContextType {
  role: Role | null;
  setRole: Dispatch<SetStateAction<Role | null>>;
  mode: Mode;
  setMode: Dispatch<SetStateAction<Mode>>;
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
  const currentRole: Role | null = Cookies.get("role") as Role | null;
  const currentMode: Mode = Cookies.get("mode")
    ? (Cookies.get("mode") as Mode)
    : "work";
  const [role, setRole] = useState<Role | null>(currentRole);
  const [mode, setMode] = useState<Mode>(currentMode);

  return (
    <RoleContext.Provider
      value={{
        role,
        setRole,
        mode,
        setMode,
      }}
    >
      {children}
    </RoleContext.Provider>
  );
};

export default RoleContext;
