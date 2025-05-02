import { useEffect, useState } from "react";
import Sidebar from "./Main/Sidebar";
import { Outlet, useNavigate } from "react-router-dom";
import Cookies from "js-cookie";

function AppLayout() {
  const [accessToken] = useState(Cookies.get("accessToken"));
  const navigate = useNavigate();
  useEffect(() => {
    if (!accessToken) {
      navigate("/login");
    }
  }, [accessToken, navigate]);
  return (
    <Sidebar>
      <Outlet />
    </Sidebar>
  );
}

export default AppLayout;
