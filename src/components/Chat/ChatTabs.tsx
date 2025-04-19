import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
import { ChatType } from "../Types"

interface Props {
  type: ChatType
  setType: (type: ChatType) => void
}

export const ChatTab = ({ type, setType }: Props) => {
  return (
    <div className="flex gap-4">
      <ToggleGroup
        type="single"
        value={type}
        onValueChange={(value) => {
          if (value) setType(value as ChatType)
        }}
        size="sm"
      >
        <ToggleGroupItem
          className={
            type === "all"
              ? "bg-primary text-white hover:bg-primary-100/90 hover:text-white"
              : ""
          }
          value="all"
        >
          All
        </ToggleGroupItem>
        <ToggleGroupItem
          className={
            type === "personal"
              ? "bg-primary text-white hover:bg-yellow-500/90 hover:text-white"
              : ""
          }
          value="personal"
        >
          Personal
        </ToggleGroupItem>
        <ToggleGroupItem
          className={
            type === "group"
              ? "bg-primary text-white hover:bg-yellow-500/90 hover:text-white"
              : ""
          }
          value="group"
        >
          Group
        </ToggleGroupItem>
      </ToggleGroup>
    </div>
  )
}
