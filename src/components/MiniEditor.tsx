"use client";

import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Link from "@tiptap/extension-link";
import Code from "@tiptap/extension-code";
import React from "react";

export default function MiniEditor({
  value,
  onChange,
}: {
  value: string;
  onChange: (html: string) => void;
}) {
  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit.configure({
        bulletList: { keepMarks: true, keepAttributes: false },
      }),
      Code,
      Link.configure({
        openOnClick: false,
        autolink: true,
        linkOnPaste: true,
        HTMLAttributes: { rel: "noopener noreferrer", target: "_blank" },
      }),
    ],
    content: value || "<p>Escribe aquí…</p>",
    editorProps: {
      attributes: {
        class:
          "min-h-[160px] w-full rounded border p-3 focus:outline-none prose prose-sm max-w-none",
      },
    },
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
  });

  if (!editor) return null;

  return (
    <div className="space-y-2">
      <div className="flex flex-wrap gap-2">
        <Button onClick={() => editor.chain().focus().toggleBold().run()}>
          <b>B</b>
        </Button>
        <Button onClick={() => editor.chain().focus().toggleCode().run()}>
          {"</>"}
        </Button>
      </div>

      <EditorContent editor={editor} />
    </div>
  );
}

function Button({
  children,
  onClick,
}: {
  children: React.ReactNode;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="px-2 py-1 rounded border text-sm hover:bg-gray-50"
    >
      {children}
    </button>
  );
}
