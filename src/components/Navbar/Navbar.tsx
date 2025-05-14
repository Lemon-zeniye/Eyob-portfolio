import { useLocation, matchPath, useNavigate } from "react-router-dom";
import NotificationDropdown from "./NotificationDropdown";
import UserDropdown from "./UserDropdown";
import { routeMeta } from "@/lib/constant";
import { IoMdArrowBack } from "react-icons/io";
import SocialModeToggle from "./SocialModeToggle";

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const currentMeta = routeMeta.find((route) =>
    matchPath({ path: route.path, end: true }, location.pathname)
  );

  const displayName = currentMeta?.headerName || "";
  const backRoute = currentMeta?.backRoute || "/";
  const isChildRoute = currentMeta?.isChildRoute || false;

  return (
    <div className="flex flex-row sticky top-0 z-[20] bg-[#F5F5F5] justify-between items-center pr-5 py-2">
      <div
        className={`text-xl flex items-center gap-2 cursor-pointer font-bold hover:text-gray-400 `}
        onClick={() => navigate(backRoute)}
      >
        {isChildRoute ? <IoMdArrowBack /> : null} {displayName}
      </div>
      <div className="flex flex-row gap-7 items-center">
        <SocialModeToggle />
        <NotificationDropdown />
        <UserDropdown />
      </div>
    </div>
  );
};

export default Navbar;
