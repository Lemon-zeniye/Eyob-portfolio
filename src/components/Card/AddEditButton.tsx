import { Pencil, Plus } from "lucide-react"
import { Button } from "../ui/button"

interface AddButtonProps {
  onclick: () => void
  isEdit: boolean
}

const AddEditButton = ({ onclick, isEdit }: AddButtonProps) => {
  return (
    <Button onClick={onclick}>
      {isEdit ? (
        <div className="flex flex-row gap-2 items-center">
          <Pencil size={18} />
          <p className="text-base">Edit</p>
        </div>
      ) : (
        <div className="flex flex-row gap-2 items-center">
          <Plus size={18} />
          <p className="text-base">Add</p>
        </div>
      )}
    </Button>
  )
}

export default AddEditButton
