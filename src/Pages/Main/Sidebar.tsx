// import { useNavigate } from "react-router-dom";
// import Navbar from "@/components/Navbar/Navbar";
// import SidebarSm from "@/components/Sidebar/SidebarSm";

// import { LuBriefcaseBusiness } from "react-icons/lu";

// import { LuMessageCircleMore } from "react-icons/lu";

// import { MdOutlineExplore } from "react-icons/md";
import { IconType } from "react-icons/lib";
// import { HiOutlineHome } from "react-icons/hi2";

export interface Route {
  id: number;
  icon: IconType;
  name: string;
  path: string;
}

// const routes: Route[] = [
//   { id: 1, icon: HiOutlineHome, name: "Feed", path: "/" },
//   { id: 2, icon: LuBriefcaseBusiness, name: "Jobs", path: "/jobs" },
//   { id: 3, icon: LuMessageCircleMore, name: "Chat", path: "/chat" },
//   { id: 4, icon: MdOutlineExplore, name: "Explore", path: "/explore" },
// ];

const Sidebar = ({ children }: { children: React.ReactNode }) => {
  // const navigate = useNavigate();

  // const handleSelected = (path: string) => {
  //   navigate(path);
  // };

  return (
    <div className="w-full flex flex-col justify-between md:flex-row bg-[#f5f5f5] min-h-screen scroll-smooth">
      {/* <div className="bg-white hidden h-screen fixed w-20 border-r md:flex flex-col justify-between py-5 items-center">
        <div className="flex flex-col gap-10">
          <img src={logo} className="w-8 h-auto" alt="Logo" />
          <div className="flex flex-col items-center justify-between h-[30vh]">
            {routes.slice(0, 4).map((route) => {
              const isHome = route.path === "/";
              const isActive = isHome
                ? location.pathname === "/"
                : location.pathname.startsWith(route.path);

              return (
                <Link
                  key={route.id}
                  to={route.path}
                  onClick={() => handleSelected(route.path)}
                  className={`${
                    isActive
                      ? mode === "formal"
                        ? "bg-primary text-white"
                        : "bg-[#FFA500] text-white"
                      : "text-[#00000099] hover:bg-slate-100"
                  } p-3 rounded-md`}
                >
                  <route.icon size={22} />
                </Link>
              );
            })}
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
      </div> */}

      <div className="flex flex-col gap-3 px-1 w-full">
        {/* <Navbar /> */}
        {children}
      </div>

      {/* <div className="w-full fixed bottom-0 z-50 md:hidden">
        <SidebarSm routes={routes} handleSelected={handleSelected} />
      </div> */}
    </div>
  );
};

export default Sidebar;
