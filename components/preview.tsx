"use client"

import { useEditor, EditorContent } from "@tiptap/react"
import StarterKit from "@tiptap/starter-kit"
import { useEffect } from "react"

interface PreviewProps {
  value?: string
}

export const Preview = ({ value }: PreviewProps) => {
  const editor = useEditor({
    extensions: [StarterKit],
    editable: false, // ensures it's read-only
    content: value ?? "",
    immediatelyRender: false, // rendered in the browser only
  })

  // Keep content updated if `value` changes from props
  useEffect(() => {
    if (editor && editor.getHTML() !== value) {
      editor.commands.setContent(value ?? "")
    }
  }, [editor, value])

  return (
    <div className="rich-text">
      <EditorContent editor={editor} />
    </div>
  )
}
