import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/Context/AuthContext";
import { useQuery } from "react-query";
import { getUserPicture } from "@/Api/profile.api";
import { useState } from "react";
import Cookies from "js-cookie";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const UserDropdown = () => {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const handleLogout = () => {
    logout();
    navigate("/login");
  };
  const [profileImage, setprofileImage] = useState<string>("");

  const {} = useQuery({
    queryKey: ["userPicture"],
    queryFn: getUserPicture,
    onSuccess: (res) => {
      if (res && res?.data) {
        const newImageUrl = `https://awema.co/${res?.data.path.replace(
          "public/",
          ""
        )}`;
        Cookies.set("profilePic", newImageUrl);
        setprofileImage(newImageUrl);
      }
    },
  });

  return (
    <div className="relative group inline-block">
      {/* Trigger */}

      <div>
        <Avatar className="w-10 h-10 border border-primary rounded-full cursor-pointer">
          <AvatarImage
            src={profileImage || "/placeholder.svg"}
            alt="Profile"
            className="object-cover"
          />
          <AvatarFallback className="bg-gradient-to-br from-[#05A9A9] to-[#4ecdc4] text-white text-sm">
            {Cookies.get("userName")?.charAt(0) || "U"}
          </AvatarFallback>
        </Avatar>
      </div>

      {/* Dropdown on Hover */}
      <div className="absolute right-0 w-48 bg-white border border-gray-100 rounded-xl shadow-xl opacity-0 scale-95 group-hover:opacity-100 group-hover:scale-100 pointer-events-none group-hover:pointer-events-auto transition-all duration-200 origin-top-right z-50 backdrop-blur-sm bg-white/80">
        <div className="flex flex-col p-2 space-y-1">
          <Link
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
          </Link>

          <div className="border-t border-gray-100 my-1"></div>

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
