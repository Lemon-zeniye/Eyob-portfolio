// import { useLocation, useNavigate, Link } from "react-router-dom";
import UserDropdown from "./UserDropdown";

// import { useRole } from "@/Context/RoleContext";

// import { HiOutlineHome } from "react-icons/hi";

// import { LuBriefcaseBusiness } from "react-icons/lu";

// import { LuMessageCircleMore } from "react-icons/lu";

// import { MdOutlineExplore } from "react-icons/md";
import { IconType } from "react-icons/lib";

export interface Route {
  id: number;
  icon: IconType;
  name: string;
  path: string;
}

const Navbar = () => {
  // const location = useLocation();
  // const navigate = useNavigate();

  // const currentMeta = routeMeta.find((route) =>
  //   matchPath({ path: route.path, end: true }, location.pathname)
  // );

  // const { mode } = useRole();

  // const handleSelected = (path: string) => {
  //   navigate(path);
  // };

  // const displayName = currentMeta?.headerName || "";
  // const backRoute = currentMeta?.backRoute || "/";
  // const isChildRoute = currentMeta?.isChildRoute || false;

  // const routes: Route[] = [
  //   { id: 1, icon: HiOutlineHome, name: "Feed", path: "/" },
  //   { id: 2, icon: LuBriefcaseBusiness, name: "Jobs", path: "/jobs" },
  //   { id: 3, icon: LuMessageCircleMore, name: "Chat", path: "/chat" },
  //   { id: 4, icon: MdOutlineExplore, name: "Explore", path: "/explore" },
  //   // { id: 5, icon: Settings, name: "Settings", path: "/settings" },
  // ];

  return (
    <div className="flex flex-row sticky top-0 z-[20] bg-[#F5F5F5] justify-between items-center pr-1 md:pr-5 py-2">
      <div></div>
      {/* <div className="hidden md:flex  items-center justify-between ">
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
                    ? "text-gray-699"
                    : " text-gray-600"
                  : "text-[#00000099] hover:bg-slate-100"
              } p-1 flex items-center justify-center flex-col rounded-sm  mx-4`}
            >
              <route.icon size={22} />
              <span
                className={`${
                  isActive
                    ? mode === "formal"
                      ? "underline decoration-primary decoration-2 underline-offset-4 text-gray-699"
                      : "underline decoration-[#FFA500] decoration-2 underline-offset-4 text-gray-600"
                    : "text-[#00000099]"
                } rounded-md text-xs`}
              >
                {route.name}
              </span>
            </Link>
          );
        })}
      </div> */}

      <div className="flex flex-row gap-4 items-center">
        <UserDropdown />
      </div>
    </div>
  );
};

export default Navbar;

{
  /* <div
        className={`text-xl flex items-center gap-2 cursor-pointer font-bold hover:text-gray-400 `}
        onClick={() => navigate(backRoute)}
      >
        {isChildRoute ? <IoMdArrowBack /> : null} {displayName}
      </div> */
}
