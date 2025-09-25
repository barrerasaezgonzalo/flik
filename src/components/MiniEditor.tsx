"use client";

import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Link from "@tiptap/extension-link";
import Code from "@tiptap/extension-code";
import React, { useState } from "react";

export default function MiniEditor({
  value,
  onChange,
}: {
  value: string;
  onChange: (html: string) => void;
}) {
  const [expanded, setExpanded] = useState(false);

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
    content: value || "",
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
      <div className="flex flex-wrap gap-2 items-center">
        <Button onClick={() => editor.chain().focus().toggleBold().run()}>
          <b>B</b>
        </Button>
        <Button
          onClick={() => {
            const url = prompt("Ingresa la URL");
            if (url) {
              editor
                .chain()
                .focus()
                .extendMarkRange("link")
                .setLink({ href: url })
                .run();
            }
          }}
        >
          🔗
        </Button>

        <Button onClick={() => editor.chain().focus().unsetLink().run()}>
          ❌🔗
        </Button>
        <Button onClick={() => editor.chain().focus().toggleCodeBlock().run()}>
          {"</>"}
        </Button>
        <Button onClick={() => setExpanded(true)}>Expandir</Button>
      </div>

      {!expanded && (
        <EditorContent
          editor={editor}
          className="prose prose-sm max-w-none text-white"
        />
      )}

      {expanded && (
        <div className="fixed inset-0 z-50 bg-black flex flex-col">
          {/* Barra de herramientas */}
          <div className="p-2 border-b bg-black flex justify-between items-center shadow">
            <div className="flex gap-2">
              <Button onClick={() => editor.chain().focus().toggleBold().run()}>
                <b>B</b>
              </Button>
              <Button
                onClick={() => {
                  const url = prompt("Ingresa la URL");
                  if (url) {
                    editor
                      .chain()
                      .focus()
                      .extendMarkRange("link")
                      .setLink({ href: url })
                      .run();
                  }
                }}
              >
                🔗
              </Button>

              <Button onClick={() => editor.chain().focus().unsetLink().run()}>
                ❌🔗
              </Button>
              <Button
                onClick={() => editor.chain().focus().toggleCodeBlock().run()}
              >
                {"</>"}
              </Button>
            </div>
            <Button onClick={() => setExpanded(false)}>Cerrar</Button>
          </div>

          {/* Área del editor */}
          <div className="flex-1 overflow-auto p-4 bg-black">
            <EditorContent
              editor={editor}
              className="prose prose-sm max-w-none text-white"
            />
          </div>
        </div>
      )}
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
      className="px-2 py-1 rounded border text-sm bg-gray-100 hover:bg-gray-200 text-gray-800"
    >
      {children}
    </button>
  );
}
