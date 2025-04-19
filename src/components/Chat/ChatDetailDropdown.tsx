import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

import { EllipsisVertical } from "lucide-react"

const ChatDetailDropdown = () => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <EllipsisVertical />
      </DropdownMenuTrigger>
      <DropdownMenuContent className=" w-[10rem]  mt-2">
        <div className="flex flex-col gap-2 w-full">hey</div>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export default ChatDetailDropdown
