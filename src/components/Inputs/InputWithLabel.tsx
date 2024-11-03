import { Label } from "@/components/ui/label"
import { Input } from "../ui/input"
import { ChangeEventHandler } from "react"

interface InputWithLabelProps {
  label: string
  placeholder: string
  value: string
  onChange: ChangeEventHandler<HTMLInputElement>
}

const InputWithLabel = ({
  label,
  onChange,
  placeholder,
  value,
}: InputWithLabelProps) => {
  return (
    <div className="flex flex-col gap-2">
      <Label>{label}</Label>
      <Input placeholder={placeholder} value={value} onChange={onChange} />
    </div>
  )
}

export default InputWithLabel
