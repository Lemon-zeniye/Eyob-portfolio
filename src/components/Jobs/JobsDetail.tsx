import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
} from "@/components/ui/sheet"

interface JobsDetailProps {
  open: boolean
  onChange: (open: boolean) => void
}

const JobsDetail = ({ open, onChange }: JobsDetailProps) => {
  return (
    <Sheet open={open} onOpenChange={onChange}>
      <SheetContent className="">
        <SheetHeader>
          <SheetDescription>Job Detail Will Be Here</SheetDescription>
        </SheetHeader>
      </SheetContent>
    </Sheet>
  )
}

export default JobsDetail
