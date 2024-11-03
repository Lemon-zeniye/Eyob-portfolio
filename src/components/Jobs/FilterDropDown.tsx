import {
  DropdownMenu,
  DropdownMenuContent,
  // DropdownMenuItem,
  // DropdownMenuLabel,
  // DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "../ui/button"
import { ListFilter } from "lucide-react"

const FilterDropDown = () => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <Button>
          <div className="flex flex-row gap-2 items-center font-bold">
            <ListFilter />
            <p>Filter</p>
          </div>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <div>Hey</div>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export default FilterDropDown
