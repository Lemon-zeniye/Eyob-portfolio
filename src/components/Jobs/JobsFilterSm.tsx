import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { ListFilter } from "lucide-react";
import { CheckboxWithLabel } from "./CheckBox";
import { FilterCategory, SelectedValues } from "@/Types/job.type";

// interface FilterOption {
//   id: number;
//   name: string;
//   value: string;
// }

// interface FilterCategory {
//   category: string;
//   options: FilterOption[];
// }

interface JobsFilterSmProps {
  filterValues: FilterCategory[];
  selectedValues: SelectedValues;
  handleCheckboxChange: (category: string, value: string) => void;
}

const JobsFilterSm: React.FC<JobsFilterSmProps> = ({
  filterValues,
  selectedValues,
  handleCheckboxChange,
}) => {
  console.log("ss", selectedValues);
  return (
    <Sheet>
      <SheetTrigger>
        <div className="flex flex-row gap-2 items-center">
          {/* <Button> */}
          <ListFilter />
          {/* </Button> */}
        </div>
      </SheetTrigger>
      <SheetContent side={"bottom"} className="w-full">
        <div className="grid grid-cols-2 gap-10">
          {filterValues.map((filter) => (
            <div key={filter.category.value} className="flex flex-col gap-3">
              <p className="font-medium">{filter.category.label}</p>
              <div className="flex flex-col gap-4">
                {filter.options.map((option) => (
                  <CheckboxWithLabel
                    key={option.id}
                    id={option.value}
                    label={option.name}
                    onChange={() =>
                      handleCheckboxChange(filter.category.value, option.value)
                    }
                    // checked={selectedValues && selectedValues.includes(option.value)}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default JobsFilterSm;
