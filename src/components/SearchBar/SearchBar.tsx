import { Input, InputProps } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { Search, X } from "lucide-react";
import { useState } from "react";
import { useDebouncedCallback } from "use-debounce";
import { Button } from "../ui/button";

interface Props extends InputProps {
  search: string;
  setSearch: (value: string) => void;
}

export const SearchBar = ({
  search,
  setSearch,
  className,
  ...props
}: Props) => {
  const [value, setValue] = useState(search);
  const debounced = useDebouncedCallback((value) => {
    setSearch(value);
  }, 300);

  return (
    <div className="relative flex">
      <Input
        autoFocus
        placeholder="Search here"
        className={cn("flex-grow pr-12", className)}
        value={value}
        onChange={(e) => {
          setValue(e.target.value);
          debounced(e.target.value);
        }}
        {...props}
      />
      {search === "" ? (
        <Search className="h-5 w-5 text-muted-foreground absolute right-4 top-1/2 transform -translate-y-1/2 -scale-x-100" />
      ) : (
        <Button
          onClick={() => setSearch("")}
          variant="ghost"
          size="icon"
          className="absolute right-0 top-1/2 transform -translate-y-1/2 active:-translate-y-1/2"
        >
          <X className="h-4 w-4" />
        </Button>
      )}
    </div>
  );
};
