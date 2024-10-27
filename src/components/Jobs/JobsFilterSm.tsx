import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Button } from "../ui/button"
import { ListFilter } from "lucide-react"
import { CheckboxWithLabel } from "./CheckBox"

interface FilterOption {
  id: number
  name: string
  value: string
}

interface FilterCategory {
  category: string
  options: FilterOption[]
}

interface JobsFilterSmProps {
  filterValues: FilterCategory[]
  selectedValues: string[]
  handleCheckboxChange: (value: string, checked: boolean) => void
}

const JobsFilterSm: React.FC<JobsFilterSmProps> = ({
  filterValues,
  selectedValues,
  handleCheckboxChange,
}) => {
  return (
    <Sheet>
      <SheetTrigger>
        <Button>
          <div className="flex flex-row gap-2 items-center">
            <ListFilter />
          </div>
        </Button>
      </SheetTrigger>
      <SheetContent side={"bottom"} className="w-full">
        <div className="grid grid-cols-2 gap-10">
          {filterValues.map((filter) => (
            <div key={filter.category} className="flex flex-col gap-3">
              <p className="font-medium">{filter.category}</p>
              <div className="flex flex-col gap-4">
                {filter.options.map((option) => (
                  <CheckboxWithLabel
                    key={option.id}
                    id={option.value}
                    label={option.name}
                    onChange={(checked) =>
                      handleCheckboxChange(option.value, checked)
                    }
                    checked={selectedValues.includes(option.value)}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      </SheetContent>
    </Sheet>
  )
}

export default JobsFilterSm
