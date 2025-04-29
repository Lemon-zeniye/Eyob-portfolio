import { useEffect, useRef, useState } from "react";

type MultiSelectInputProps = {
  options: string[];
  value: string[];
  onChange: (value: string[]) => void;
  placeholder?: string;
  className?: string;
};

export function MultiSelectInput({
  options,
  value,
  onChange,
  placeholder = "Select...",
  className,
}: MultiSelectInputProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState("");
  const ref = useRef<HTMLDivElement | null>(null);

  const filteredOptions = options.filter((option) =>
    option.toLowerCase().includes(search.toLowerCase())
  );

  const handleSelect = (option: string) => {
    if (value.includes(option)) {
      onChange(value.filter((item) => item !== option));
    } else {
      onChange([...value, option]);
    }
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleRemove = (option: string) => {
    onChange(value.filter((item) => item !== option));
  };

  return (
    <div className={`relative ${className}`} ref={ref}>
      <div
        className="border border-gray-300  rounded-md p-2 cursor-pointer min-h-[44px] flex flex-wrap gap-2 bg-white"
        onClick={() => setIsOpen((prev) => !prev)}
      >
        {value.length === 0 ? (
          <span className="text-[#737373]">{placeholder}</span>
        ) : (
          value.map((item) => (
            <span
              key={item}
              onClick={(e) => {
                e.stopPropagation();
                handleRemove(item);
              }}
              className="flex items-center gap-1 bg-[#e1ffff] border border-[#03A9A9] text-[#03A9A9] text-sm px-3 py-0 rounded-full hover:bg-blue-200 transition-all cursor-pointer"
            >
              {item}
              <span className="text-xs font-bold">&times;</span>
            </span>
          ))
        )}
      </div>

      {isOpen && (
        <div className="absolute mt-1  text-[#737373] w-full border bg-white rounded-md shadow-md max-h-60 overflow-auto z-20 p-2">
          <input
            type="text"
            placeholder="Search..."
            className="w-full mb-2 p-2 border rounded-md focus:outline-none text-[#737373]"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          {filteredOptions.length > 0 ? (
            filteredOptions.map((option) => (
              <div
                key={option}
                className={`p-2 rounded-md cursor-pointer hover:bg-blue-100 ${
                  value.includes(option) ? "bg-blue-50" : ""
                }`}
                onClick={() => handleSelect(option)}
              >
                {option}
              </div>
            ))
          ) : (
            <div className="text-[#737373] text-sm text-center py-4">
              No options found
            </div>
          )}
        </div>
      )}
    </div>
  );
}
