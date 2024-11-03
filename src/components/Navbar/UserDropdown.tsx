import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import user from "../../assets/user.jpg"
import { Button } from "../ui/button"
import { Link } from "react-router-dom"
import { useAuth } from "@/Context/AuthContext"

const UserDropdown = () => {
  const { logout } = useAuth()

  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <img className="w-10 h-10 rounded-full" src={user} alt="User Profile" />
      </DropdownMenuTrigger>
      <DropdownMenuContent className=" w-[10rem]  mt-2">
        <div className="flex flex-col gap-2 w-full">
          <Link
            className="w-full flex items-center justify-center py-1 border rounded-md"
            to={"/profile"}
          >
            View Profile
          </Link>
          <Button onClick={logout} variant={"link"} className="text-red-500">
            Log Out
          </Button>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export default UserDropdown
