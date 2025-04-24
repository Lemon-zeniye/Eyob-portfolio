// import {
//   DropdownMenu,
//   DropdownMenuContent,
//   DropdownMenuTrigger,
// } from "@/components/ui/dropdown-menu";
// import user from "../../assets/user.jpg";
// import { Button } from "../ui/button";
// import { Link } from "react-router-dom";
// import { useAuth } from "@/Context/AuthContext";
// import { useState } from "react";

// const UserDropdown = () => {
//   const { logout } = useAuth();
//   const [open, setOpen] = useState(false);

//   return (
//     <DropdownMenu open={open} onOpenChange={setOpen}>
//       <div
//         onMouseEnter={() => setOpen(true)}
//         onMouseLeave={() => setOpen(false)}
//         className="relative"
//       >
//         <DropdownMenuTrigger asChild>
//           <img
//             className="w-10 h-10 rounded-full cursor-pointer"
//             src={user}
//             alt="User Profile"
//           />
//         </DropdownMenuTrigger>
//         <DropdownMenuContent
//           className="w-[10rem] mt-2"
//           sideOffset={5}
//           onMouseEnter={() => setOpen(true)}
//           onMouseLeave={() => setOpen(false)}
//         >
//           <div className="flex flex-col gap-2 w-full">
//             <Link
//               className="w-full flex items-center justify-center py-1 border rounded-md"
//               to={"/profile"}
//             >
//               View Profile
//             </Link>
//             <Button onClick={logout} variant={"link"} className="text-red-500">
//               Log Out
//             </Button>
//           </div>
//         </DropdownMenuContent>
//       </div>
//     </DropdownMenu>
//   );
// };

// export default UserDropdown;

import user from "../../assets/user.jpg";
import { Button } from "../ui/button";
import { Link } from "react-router-dom";
import { useAuth } from "@/Context/AuthContext";

const UserDropdown = () => {
  const { logout } = useAuth();

  return (
    <div className="relative group inline-block">
      {/* Trigger */}
      <img
        className="w-10 h-10 rounded-full cursor-pointer"
        src={user}
        alt="User Profile"
      />

      {/* Dropdown on Hover */}
      <div className="absolute right-0  w-40 bg-white border rounded-md shadow-lg opacity-0 group-hover:opacity-100 pointer-events-none group-hover:pointer-events-auto transition-all duration-200 z-50">
        <div className="flex flex-col gap-2 p-2">
          <Link
            to="/profile"
            className="w-full text-center py-1 border rounded-md hover:bg-gray-100 transition-colors"
          >
            View Profile
          </Link>
          <Button
            onClick={logout}
            variant="link"
            className="text-red-500 w-full hover:underline"
          >
            Log Out
          </Button>
        </div>
      </div>
    </div>
  );
};

export default UserDropdown;
