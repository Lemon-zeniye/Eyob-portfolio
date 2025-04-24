import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "./AuthContext";
import Sidebar from "@/Pages/Main/Sidebar";

const ProtectedRoute = () => {
  const { isAuthenticated } = useAuth();

  console.log("is Authentication", isAuthenticated);
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <Sidebar />;
};

export default ProtectedRoute;
