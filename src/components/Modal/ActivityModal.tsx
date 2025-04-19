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
// import RichTextEditor from "../TipTap/TipTap"
// import { Card } from "../ui/card"
// import { Plus } from "lucide-react"
import { Textarea } from "../ui/textarea"

interface ActivityModalProps {
  open: boolean
  onClose: () => void
  title: string
  isEditMode?: boolean
  initialData?: {
    postTitle: string
    postContent: string
  }
  onSubmit: (data: { postTitle: string; postContent: string }) => void
}

const formSchema = z.object({
  postTitle: z.string().nonempty("Title is required"),
  postContent: z.string().nonempty("Description is required"),
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
      postTitle: initialData?.postTitle || "",
      postContent: initialData?.postContent || "",
    },
  })
  // const [postDetail, setPostDetail] = useState<string>(initialData?.desc ?? "")
  // const [images, setImages] = useState<string[]>([])
  // const fileInputRef = useRef<HTMLInputElement | null>(null)

  useEffect(() => {
    if (open && !isEditMode) {
      form.reset({ postTitle: "", postContent: "" })
    }
    if (open && isEditMode && initialData) {
      form.reset(initialData)
    }
  }, [open, isEditMode, initialData, form])

  const handleSubmit = (values: z.infer<typeof formSchema>) => {
    console.log(values)

    onSubmit({ ...values })
    onClose()
  }

  // const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
  //   const file = event.target.files?.[0]
  //   if (file && file.type.startsWith("image/")) {
  //     const newImageUrl = URL.createObjectURL(file)
  //     setImages((prevImages) => [...prevImages, newImageUrl])
  //   } else {
  //     alert("Please select an image file")
  //   }
  // }

  // const handleImageClick = () => {
  //   if (fileInputRef.current) {
  //     fileInputRef.current.click()
  //   }
  // }

  // console.log("Post Detail", postDetail)

  return (
    <Modal title={title} open={open} onClose={onClose}>
      <FormProvider {...form}>
        <form
          onSubmit={form.handleSubmit(handleSubmit)}
          className="space-y-8 w-full"
        >
          <FormField
            control={form.control}
            name="postTitle"
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
            name="postContent"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Details</FormLabel>
                <FormControl>
                  <Textarea placeholder="Enter title" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          {/* <RichTextEditor
            content={postDetail}
            onChange={(content) => setPostDetail(content)}
          /> */}
          {/* <div className="flex flex-row gap-2 flex-wrap">
            <div className="flex flex-row gap-2 flex-wrap">
              {images.map((item, index) => (
                <img
                  key={index}
                  className="w-28 h-28 rounded-md"
                  src={item}
                  alt=""
                />
              ))}
            </div> */}
          {/* <Card
              onClick={handleImageClick}
              className="w-28 h-28 flex flex-row items-center justify-center cursor-pointer"
            >
              <Plus size={20} /> <p className="text-sm">Add Image</p>
            </Card>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              ref={fileInputRef}
              style={{ display: "none" }}
            /> */}
          {/* </div>1 */}
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
