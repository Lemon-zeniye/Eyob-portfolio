import React from "react"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

export interface SelectableOption {
  value: string
  label: string
}

interface SelectableProps {
  options: SelectableOption[]
  placeholder?: string
  onChange: (value: string) => void
}

const Selectable: React.FC<SelectableProps> = ({
  options,
  placeholder = "Select an option",
  onChange,
}) => {
  return (
    <Select onValueChange={onChange}>
      <SelectTrigger>
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent>
        {options.map((option) => (
          <SelectItem key={option.value} value={option.value}>
            {option.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}

export default Selectable
