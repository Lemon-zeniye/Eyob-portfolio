import { useNavigate } from "react-router-dom";
import { useAuth } from "@/Context/AuthContext";
import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { IoIosArrowDown } from "react-icons/io";
import { useRole } from "@/Context/RoleContext";

const UserDropdown = () => {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const { user } = useRole();
  const handleLogout = () => {
    logout();
    navigate("/login");
  };
  const [profileImage] = useState<string>("");

  return (
    <div className="relative group inline-block">
      {/* Trigger */}

      <div className="flex gap-2 items-center">
        <Avatar className="w-8 h-8 border border-primary2 rounded-full cursor-pointer">
          <AvatarImage
            src={profileImage || "/placeholder.svg"}
            alt="Profile"
            className="object-cover"
          />
          <AvatarFallback className="bg-gradient-to-br from-primary2 to-primary2/70 text-white text-sm">
            {user?.username
              ?.split(" ")
              .slice(0, 2)
              .map((word) => word[0])
              .join("")
              .toUpperCase() || "U"}
          </AvatarFallback>
        </Avatar>
        <IoIosArrowDown size={11} />
      </div>

      {/* Dropdown on Hover */}
      <div className="absolute right-0 w-48 bg-white border border-gray-100 rounded-xl shadow-xl opacity-0 scale-95 group-hover:opacity-100 group-hover:scale-100 pointer-events-none group-hover:pointer-events-auto transition-all duration-200 origin-top-right z-50 backdrop-blur-sm">
        <div className="flex flex-col p-2 space-y-1">
          {/* <Link
            to="/profile"
            className="px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 rounded-lg transition-all duration-150 flex items-center gap-2 hover:translate-x-1"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
              />
            </svg>
            View Profile
          </Link> */}

          {/* <div className="border-t border-gray-100 my-1"></div>
          <Link
            to="/settings"
            className="px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 rounded-lg transition-all duration-150 flex items-center gap-2 hover:translate-x-1"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M11.983 13.917a2.002 2.002 0 110-3.834 2.002 2.002 0 010 3.834zM19.428 15.341a8.03 8.03 0 001.096-2.341 1.001 1.001 0 00-.285-1.01l-1.518-1.31a6.07 6.07 0 00.007-1.358l1.511-1.31a1 1 0 00.28-1.011 8.002 8.002 0 00-1.095-2.34 1 1 0 00-1.004-.484l-1.893.271a6.061 6.061 0 00-1.175-.681l-.285-1.907a1 1 0 00-.992-.83h-2.9a1 1 0 00-.993.83l-.285 1.907a6.058 6.058 0 00-1.175.681l-1.893-.271a1 1 0 00-1.004.484 8.008 8.008 0 00-1.095 2.34 1 1 0 00.28 1.011l1.511 1.31a6.07 6.07 0 00.007 1.358l-1.518 1.31a1 1 0 00-.285 1.01 8.03 8.03 0 001.096 2.341 1 1 0 001.004.484l1.893-.271c.365.266.76.489 1.175.681l.285 1.907a1 1 0 00.993.83h2.9a1 1 0 00.992-.83l.285-1.907a6.061 6.061 0 001.175-.681l1.893.271a1 1 0 001.004-.484z"
              />
            </svg>
            Settings
          </Link> */}

          {/* <div className="border-t border-gray-100 my-1"></div> */}

          <button
            onClick={() => handleLogout()}
            className="px-3 py-2 text-sm font-medium text-red-500 hover:bg-red-50 rounded-lg transition-all duration-150 flex items-center gap-2 group"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4 group-hover:animate-pulse"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
              />
            </svg>
            Log Out
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserDropdown;
