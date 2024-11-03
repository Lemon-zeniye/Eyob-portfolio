import { useEffect } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm, FormProvider } from "react-hook-form"
import { z } from "zod"
import Modal from "./Modal"
import { Button } from "../ui/button"
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "../ui/form"
import { Input } from "../ui/input"
import { Textarea } from "../ui/textarea"

interface ActivityModalProps {
  open: boolean
  onClose: () => void
  title: string
  isEditMode?: boolean
  initialData?: {
    title: string
    desc: string
  }
  onSubmit: (data: { title: string; desc: string }) => void
}

const formSchema = z.object({
  title: z.string().nonempty("Title is required"),
  desc: z.string().nonempty("Description is required"),
})

const ActivityModal = ({
  open,
  onClose,
  title,
  isEditMode = false,
  initialData,
  onSubmit,
}: ActivityModalProps) => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: initialData?.title || "",
      desc: initialData?.desc || "",
    },
  })

  useEffect(() => {
    if (open && !isEditMode) {
      form.reset({ title: "", desc: "" })
    }
    if (open && isEditMode && initialData) {
      form.reset(initialData)
    }
  }, [open, isEditMode, initialData, form])

  const handleSubmit = (values: z.infer<typeof formSchema>) => {
    onSubmit(values)
    onClose()
  }

  return (
    <Modal title={title} open={open} onClose={onClose}>
      <FormProvider {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-8">
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Title</FormLabel>
                <FormControl>
                  <Input placeholder="Enter title" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="desc"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Description</FormLabel>
                <FormControl>
                  <Textarea placeholder="Enter content" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="w-full flex justify-end">
            <Button type="submit">
              {isEditMode ? "Save Changes" : "Post"}
            </Button>
          </div>
        </form>
      </FormProvider>
    </Modal>
  )
}

export default ActivityModal
