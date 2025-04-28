import React, {
  createContext,
  useState,
  useContext,
  ReactNode,
  Dispatch,
  SetStateAction,
} from "react";
import Cookies from "js-cookie";
import { Role } from "@/Types/auth.type";

interface RoleContextType {
  role: Role | null;
  setRole: Dispatch<SetStateAction<Role | null>>;
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
  const [role, setRole] = useState<Role | null>(currentRole);
  return (
    <RoleContext.Provider
      value={{
        role,
        setRole,
      }}
    >
      {children}
    </RoleContext.Provider>
  );
};

export default RoleContext;
