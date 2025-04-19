import { Editor } from "@tiptap/react"
import {
  Bold,
  Italic,
  List,
  // ListOrdered,
  Image,
  Pilcrow,
  CheckCircle,
  LetterText,
  ChevronDown,
} from "lucide-react"
import React from "react"
import { Button } from "../ui/button"
import ToolbarDropdown from "./ToolbarDropdown"

interface ToolbarProps {
  editor: Editor | null
  url?: string
}

interface Tool {
  id: number
  icon?: React.ReactNode
  function?: () => void
  disabled?: boolean
  dropdown?: DropdownItem[]
}

interface DropdownItem {
  id: number
  name: string
  function?: () => void
  disabled?: boolean
}

const Toolbar = ({ editor, url }: ToolbarProps) => {
  // const isActive = (type: string) => editor?.isActive(type) ?? false;

  const tools: Tool[] = [
    {
      id: 1,
      icon: <Bold size={20} />,
      function: () => editor?.chain().focus().toggleBold().run(),
      disabled: !editor?.can().chain().focus().toggleBold().run(),
    },
    {
      id: 2,
      icon: <Italic size={20} />,
      function: () => editor?.chain().focus().toggleItalic().run(),
      disabled: !editor?.can().chain().focus().toggleItalic().run(),
    },
    // {
    //   id: 9,
    //   icon: <Image size={20} />,
    //   function: () => addImage(),
    //   // disabled: !editor?.can().chain().focus().toggleItalic().run(),
    // },
    {
      id: 3,
      icon: <Pilcrow size={20} />,
      function: () => editor?.chain().focus().setParagraph().run(),
      disabled: !editor?.can().chain().focus().setParagraph().run(),
    },
    {
      id: 5,
      dropdown: [
        {
          id: 1,
          name: "Heading 1",
          function: () =>
            editor?.chain().focus().toggleHeading({ level: 1 }).run(),
          disabled: !editor
            ?.can()
            .chain()
            .focus()
            .toggleHeading({ level: 1 })
            .run(),
        },
        {
          id: 2,
          name: "Heading 2",
          function: () =>
            editor?.chain().focus().toggleHeading({ level: 2 }).run(),
          disabled: !editor
            ?.can()
            .chain()
            .focus()
            .toggleHeading({ level: 2 })
            .run(),
        },
      ],
      disabled: !editor
        ?.can()
        .chain()
        .focus()
        .toggleHeading({ level: 1 })
        .run(),
    },
    {
      id: 6,
      icon: <List size={20} />,
      function: () => editor?.chain().focus().toggleBulletList().run(),
      disabled: !editor?.can().chain().focus().toggleBulletList().run(),
    },
    {
      id: 7,
      icon: <CheckCircle size={20} />,
      function: () => editor?.chain().focus().toggleTaskList().run(),
      disabled: !editor?.can().chain().focus().toggleTaskList().run(),
    },
  ]

  const Buttons = tools.map((tool) =>
    tool.dropdown ? (
      <ToolbarDropdown
        classname="flex flex-col gap-2"
        button={
          <div className="flex flex-row justify-between gap-2 items-center">
            <p className="">Text Type</p>
            <ChevronDown size={20} />
          </div>
        }
      >
        {tool.dropdown.map((item) => (
          <Button
            disabled={item.disabled}
            onClick={() => item.function && item.function()}
            key={item.id}
            variant={"ghost"}
          >
            {item.name}
          </Button>
        ))}
      </ToolbarDropdown>
    ) : (
      <div className="flex flex-row gap-6">
        <Button
          key={tool.id}
          className="px-1 bg-inherit hover:bg-[#ffffff80]"
          variant={"secondary"}
          onClick={() => tool.function && tool.function()}
          disabled={tool.disabled}
        >
          {tool.icon}
        </Button>
      </div>
    )
  )

  return (
    <div className="sticky top-0 z-10 border-b py-3 px-2">
      <div className="md:flex flex-row gap-6 sm-phone:hidden">{Buttons}</div>
      <div className="sm-phone:flex md:hidden">
        <ToolbarDropdown
          classname="flex flex-row gap-6"
          button={<LetterText className="text-primary" />}
        >
          {Buttons}
        </ToolbarDropdown>
      </div>
    </div>
  )
}

export default Toolbar
