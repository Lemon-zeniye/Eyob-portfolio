import { Role } from "@/Types/auth.type";
import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useRole } from "./RoleContext";

interface PrivateRouteProps {
  allowedRoles: Role[];
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({ allowedRoles }) => {
  const { role } = useRole();
  console.log("3333333", role);
  if (!role) {
    return <Navigate to="/login" replace />;
  }

  if (!allowedRoles.includes(role)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return <Outlet />;
};

export default PrivateRoute;
