import Sidebar from "./Main/Sidebar";
import { Outlet } from "react-router-dom";

function AppLayout() {
  return (
    <Sidebar>
      <Outlet />
    </Sidebar>
  );
}

export default AppLayout;
