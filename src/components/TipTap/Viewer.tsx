import { FC, useEffect } from "react";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Image from "@tiptap/extension-image";
import TaskItem from "@tiptap/extension-task-item";
import TaskList from "@tiptap/extension-task-list";
import Placeholder from "@tiptap/extension-placeholder";
import Toolbar from "./Toolbar";

interface JournalViewerProps {
  content: string;
  onChange: (content: string) => void;
}

const JournalViewer: FC<JournalViewerProps> = ({ content, onChange }) => {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Image,
      TaskList,
      TaskItem.configure({ nested: true }),
      Placeholder.configure({ placeholder: "Write your thoughts here . . . " }),
    ],
    content,
    onUpdate: ({ editor }) => {
      const updatedContent = editor.getHTML();
      onChange(updatedContent);
    },
  });

  useEffect(() => {
    if (editor) {
      const currentContent = editor.getHTML();
      if (currentContent !== content) {
        editor.commands.setContent(content);
      }
    }
  }, [editor, content]);

  return (
    <div className="flex flex-col h-[75vh] overflow-hidden">
      <Toolbar editor={editor} />
      <div className="flex-1 overflow-y-auto">
        <EditorContent className="custom-editor p-4 bg-white" editor={editor} />
      </div>
    </div>
  );
};

export default JournalViewer;
