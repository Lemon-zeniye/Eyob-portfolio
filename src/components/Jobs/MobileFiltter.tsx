import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
} from "@/components/ui/sheet";
import { Button } from "../ui/button";

type FilterOption = {
  id: number;
  name: string;
  value: string;
};

type FilterCategory = {
  category: { label: string; value: string };
  options: FilterOption[];
};

type SelectedFilters = {
  [key: string]: string[];
};

type MobileFilterProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  filters: FilterCategory[];
  selectedFilters: SelectedFilters;
  onChangeFilter: (category: string, value: string) => void;
  onClear: () => void;
  onApply: () => void;
};

import { Checkbox } from "@/components/ui/checkbox"; // or use your Checkbox component

function MobileFilter({
  open,
  onOpenChange,
  filters,
  selectedFilters,
  onChangeFilter,
  onApply,
  onClear,
}: MobileFilterProps) {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="bottom"
        className="h-[60vh] p-4 flex flex-col overflow-y-scroll rounded-none"
      >
        <SheetHeader>
          <SheetDescription className="text-xl font-bold text-center text-gray-900">
            Filter Jobs
          </SheetDescription>
        </SheetHeader>

        <div className="flex flex-col gap-6 mt-4">
          {filters.map((filter) => (
            <div key={filter.category.value} className="flex flex-col gap-2">
              <h3 className="text-base font-semibold text-gray-800">
                {filter.category.label}
              </h3>
              <div className="flex flex-wrap gap-3">
                {filter.options.map((option) => (
                  <label
                    key={option.id}
                    className="flex items-center gap-2 text-sm"
                  >
                    <Checkbox
                      checked={
                        selectedFilters[filter.category.value]?.includes(
                          option.value
                        ) ?? false
                      }
                      onCheckedChange={() =>
                        onChangeFilter(filter.category.value, option.value)
                      }
                    />
                    <span className="text-gray-700">{option.name}</span>
                  </label>
                ))}
              </div>
            </div>
          ))}

          <div className="mt-auto pt-4 border-t flex flex-col gap-3">
            <Button onClick={onApply} className="w-full">
              Apply
            </Button>
            <Button onClick={onClear} variant="destructive" className="w-full">
              Clear
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}

export default MobileFilter;
