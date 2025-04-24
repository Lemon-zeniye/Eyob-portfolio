import * as React from "react";
import * as Select from "@radix-ui/react-select";
import { ChevronDown } from "lucide-react";
import { countries } from "@/lib/constant";
// import { countries, Country } from "./countries"; // You'll need to define this

interface PhoneNumberInputProps {
  value: string;
  onChange: (value: string) => void;
  onCountryChange?: (country: Country) => void;
  defaultCountry?: Country;
}

export interface Country {
  code: string;
  name: string;
  dialCode: string;
}

export const PhoneNumberInput = React.forwardRef<
  HTMLInputElement,
  PhoneNumberInputProps
>(({ value, onChange, onCountryChange, defaultCountry }, ref) => {
  const [selectedCountry, setSelectedCountry] = React.useState<Country>(
    defaultCountry || countries[0]
  );

  const handleCountryChange = (countryCode: string) => {
    const country = countries.find((c) => c.code === countryCode);
    if (country) {
      setSelectedCountry(country);
      onCountryChange?.(country);
    }
  };

  const handlePhoneNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawValue = e.target.value.replace(/\D/g, "");
    // Apply formatting based on country if needed
    onChange(rawValue);
  };

  return (
    <div className="flex items-center rounded-md h-10 px-3 border border-gray-400  bg-white text-gray-500 text-sm focus:outline-none">
      <Select.Root
        value={selectedCountry.code}
        onValueChange={handleCountryChange}
      >
        <Select.Trigger className="flex items-center gap-1 outline-none">
          <Select.Value>
            <div className="flex items-center gap-2">
              <span>{selectedCountry.dialCode}</span>
            </div>
          </Select.Value>
          <Select.Icon>
            <ChevronDown className="h-4 w-4 opacity-50" />
          </Select.Icon>
        </Select.Trigger>

        <Select.Portal>
          <Select.Content className="z-50 max-h-96 min-w-[200px] overflow-hidden rounded-md border bg-popover text-popover-foreground shadow-md">
            <Select.Viewport className="p-1">
              {countries.map((country) => (
                <Select.Item
                  key={country.code}
                  value={country.code}
                  className="relative flex cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50"
                >
                  <Select.ItemText>
                    <div className="flex items-center gap-2">
                      <span className="font-semibold">{country.code}</span>
                      <span>{country.name}</span>
                      <span className="text-muted-foreground">
                        {country.dialCode}
                      </span>
                    </div>
                  </Select.ItemText>
                </Select.Item>
              ))}
            </Select.Viewport>
          </Select.Content>
        </Select.Portal>
      </Select.Root>

      <input
        ref={ref}
        type="tel"
        value={value}
        onChange={handlePhoneNumberChange}
        className="ml-2 flex-1 bg-transparent outline-none"
        placeholder="Phone number"
      />
    </div>
  );
});

PhoneNumberInput.displayName = "PhoneNumberInput";
