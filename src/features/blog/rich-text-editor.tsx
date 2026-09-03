"use client"

import { mergeAttributes, Node } from "@tiptap/core"
import Image from "@tiptap/extension-image"
import Link from "@tiptap/extension-link"
import Underline from "@tiptap/extension-underline"
import { EditorContent, useEditor } from "@tiptap/react"
import StarterKit from "@tiptap/starter-kit"
import { Button } from "@/components/ui/button"

const SharksHighlight = Node.create({
  name: "sharksHighlight",
  group: "block",
  content: "inline*",
  parseHTML: () => [{ tag: "aside[data-sharks-highlight]" }],
  renderHTML: ({ HTMLAttributes }) => ["aside", mergeAttributes(HTMLAttributes, { "data-sharks-highlight": "" }), 0],
})

const CaptionedImage = Image.extend({
  addAttributes() {
    return { ...this.parent?.(), caption: { default: null }, fullWidth: { default: false } }
  },
})

export function RichTextEditor({ content, onChange }: { content: Record<string, unknown>; onChange: (json: Record<string, unknown>) => void }) {
  const editor = useEditor({
    immediatelyRender: false,
    extensions: [StarterKit, Underline, Link.configure({ openOnClick: false }), CaptionedImage.configure({ allowBase64: false }), SharksHighlight],
    content,
    editorProps: { attributes: { class: "tiptap" } },
    onUpdate: ({ editor: current }) => onChange(current.getJSON()),
  })
  if (!editor) return <div className="h-[430px] animate-pulse bg-[var(--surface-subtle)]" />

  const addLink = () => {
    const href = window.prompt("URL")
    if (href) editor.chain().focus().extendMarkRange("link").setLink({ href }).run()
  }
  const addImage = () => {
    const src = window.prompt("Supabase Storage path or image URL")
    if (!src) return
    const alt = window.prompt("Alt text") || ""
    const caption = window.prompt("Caption (optional)") || null
    editor.chain().focus().setImage({ src, alt, caption } as never).run()
  }

  const tools: [string, () => void, boolean][] = [
    ["P", () => editor.chain().focus().setParagraph().run(), editor.isActive("paragraph")],
    ["H2", () => editor.chain().focus().toggleHeading({ level: 2 }).run(), editor.isActive("heading", { level: 2 })],
    ["H3", () => editor.chain().focus().toggleHeading({ level: 3 }).run(), editor.isActive("heading", { level: 3 })],
    ["B", () => editor.chain().focus().toggleBold().run(), editor.isActive("bold")],
    ["I", () => editor.chain().focus().toggleItalic().run(), editor.isActive("italic")],
    ["U", () => editor.chain().focus().toggleUnderline().run(), editor.isActive("underline")],
    ["• List", () => editor.chain().focus().toggleBulletList().run(), editor.isActive("bulletList")],
    ["1. List", () => editor.chain().focus().toggleOrderedList().run(), editor.isActive("orderedList")],
    ["Quote", () => editor.chain().focus().toggleBlockquote().run(), editor.isActive("blockquote")],
    ["Highlight", () => editor.chain().focus().toggleNode("paragraph", "sharksHighlight").run(), editor.isActive("sharksHighlight")],
  ]

  return (
    <div className="overflow-hidden rounded-[8px] border bg-[var(--surface)]">
      <div className="flex flex-wrap gap-1 border-b bg-[var(--surface-subtle)] p-2">
        {tools.map(([label, action, active]) => <Button key={label} variant={active ? "primary" : "ghost"} size="sm" onClick={action}>{label}</Button>)}
        <Button variant="ghost" size="sm" onClick={addLink}>Link</Button><Button variant="ghost" size="sm" onClick={addImage}>Image</Button>
        <Button variant="ghost" size="sm" onClick={() => editor.chain().focus().setHorizontalRule().run()}>Divider</Button>
        <Button variant="ghost" size="sm" onClick={() => editor.chain().focus().undo().run()}>↶</Button><Button variant="ghost" size="sm" onClick={() => editor.chain().focus().redo().run()}>↷</Button>
      </div>
      <EditorContent editor={editor} />
    </div>
  )
}
