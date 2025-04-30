import {
  Briefcase,
  Home,
  LucideIcon,
  MessageCircle,
  Settings,
} from "lucide-react";
import logo from "../../assets/Bevy.png";
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import Navbar from "@/components/Navbar/Navbar";
import SidebarSm from "@/components/Sidebar/SidebarSm";

export interface Route {
  id: number;
  icon: LucideIcon;
  name: string;
  path: string;
}

const routes: Route[] = [
  { id: 1, icon: Home, name: "Feed", path: "/" },
  { id: 2, icon: MessageCircle, name: "Chat", path: "/chat" },
  { id: 3, icon: Briefcase, name: "Jobs", path: "/jobs" },
  { id: 4, icon: Settings, name: "Settings", path: "/settings" },
];

const Sidebar = ({ children }: { children: React.ReactNode }) => {
  const location = useLocation();
  const navigate = useNavigate();

  const activeRoute = routes.find((route) => route.path === location.pathname);
  const [selectedName, setSelectedName] = useState(activeRoute?.name || "");

  useEffect(() => {
    setSelectedName(activeRoute?.name || "");
  }, [activeRoute]);

  const handleSelected = (path: string) => {
    navigate(path);
  };

  return (
    <div className="w-full flex sm-phone:flex-col sm-phone:justify-between md:flex-row bg-[#f5f5f5] min-h-screen scroll-smooth">
      <div className="bg-white sm-phone:hidden h-screen fixed w-20 border-r md:flex flex-col justify-between py-5 items-center">
        <div className="flex flex-col gap-10">
          <img src={logo} className="h-auto" alt="Logo" />
          <div className="flex flex-col items-center justify-between h-[30vh]">
            {routes.slice(0, 3).map((route) => (
              <Link
                key={route.id}
                to={route.path}
                onClick={() => handleSelected(route.path)}
                className={`${
                  location.pathname === route.path
                    ? "bg-primary text-white"
                    : "text-[#00000099] hover:bg-slate-100"
                } p-3 rounded-md`}
              >
                <route.icon size={22} />
              </Link>
            ))}
          </div>
        </div>
        <div className="flex flex-col">
          <Link
            to="/settings"
            onClick={() => handleSelected("/settings")}
            className={`${
              location.pathname === "/settings"
                ? "bg-primary text-white"
                : "text-[#00000099] hover:bg-slate-100"
            } p-3 rounded-md`}
          >
            <Settings size={22} />
          </Link>
        </div>
      </div>

      <div className="flex flex-col gap-3 md:pl-24 sm-phone:pl-3 w-full">
        <Navbar name={selectedName} />
        {children}
      </div>

      <div className="w-full fixed bottom-0 md:hidden">
        <SidebarSm routes={routes} handleSelected={handleSelected} />
      </div>
    </div>
  );
};

export default Sidebar;
