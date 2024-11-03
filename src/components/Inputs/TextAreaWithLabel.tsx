import { ChangeEventHandler } from "react"
import { Label } from "../ui/label"
import { Textarea } from "../ui/textarea"

interface TextAreaWithLabelProps {
  label: string
  placeholder: string
  value: string
  onChange: ChangeEventHandler<HTMLTextAreaElement>
}

const TextAreaWithLabel = ({
  label,
  onChange,
  placeholder,
  value,
}: TextAreaWithLabelProps) => {
  return (
    <div className="flex flex-col gap-2">
      <Label>{label}</Label>
      <Textarea placeholder={placeholder} value={value} onChange={onChange} />
    </div>
  )
}

export default TextAreaWithLabel
