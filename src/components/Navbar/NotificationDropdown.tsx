import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Bell } from "lucide-react"

const NotificationDropdown = () => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <div className="relative cursor-pointer">
          <Bell size={25} className="text-[#333333] " />
          <div className=" absolute top-0 right-1 h-2 w-2 bg-red-500 rounded-full" />
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-[20rem] mt-2"></DropdownMenuContent>
    </DropdownMenu>
  )
}

export default NotificationDropdown
