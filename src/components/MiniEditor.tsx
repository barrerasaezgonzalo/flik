"use client";
import React, { useState } from "react";
import { EditorContent, useEditor, type Editor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Link from "@tiptap/extension-link";
import Code from "@tiptap/extension-code";
import CodeBlock from "@tiptap/extension-code-block";
import Image from "@tiptap/extension-image";

function Toolbar({ editor }: { editor: Editor }) {
  async function handleImageUpload(file: File) {
    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("/api/optimize-image", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        const error = await res.text();
        alert("Error al subir la imagen: " + error);
        return;
      }

      const { url } = await res.json();
      editor.chain().focus().setImage({ src: url }).run();
    } catch (err) {
      alert("Error inesperado: " + (err as Error).message);
    }
  }

  return (
    <div className="flex gap-2 flex-wrap">
      <button
        type="button"
        className="px-2 py-1 rounded border border-white px-3 mb-2 text-sm"
        onClick={() => editor.chain().focus().toggleBold().run()}
      >
        B
      </button>
      <button
        type="button"
        className="px-2 py-1 rounded border border-white px-3 mb-2"
        onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
      >
        H2
      </button>

      <label className="px-2 py-1 rounded border border-white px-3 mb-2">
        Img
        <input
          aria-label="Img"
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => {
            if (e.target.files?.[0]) {
              handleImageUpload(e.target.files[0]);
            }
          }}
        />
      </label>

      <button
        type="button"
        className="px-2 py-1 rounded border border-white px-3 mb-2"
        onClick={() => {
          const url = prompt("Ingresa la URL");
          if (url) {
            editor
              .chain()
              .focus()
              .setLink({
                href: url,
                target: "_blank",
                rel: "noopener noreferrer",
              })
              .run();
          }
        }}
      >
        Link
      </button>
      <button
        type="button"
        className="px-2 py-1 rounded border border-white px-3 mb-2"
        onClick={() => editor.chain().focus().unsetLink().run()}
      >
        Unlink
      </button>
      <button
        type="button"
        className="px-2 py-1 rounded border border-white px-3 mb-2"
        onClick={() => editor.chain().focus().toggleCode().run()}
      >
        {"</>"}
      </button>
      <button
        type="button"
        className="px-2 py-1 rounded border border-white px-3 mb-2"
        onClick={() => editor.chain().focus().toggleCodeBlock().run()}
      >
        Code Block
      </button>
    </div>
  );
}

export default function MiniEditor({
  value,
  onChange,
}: {
  value: string;
  onChange: (html: string) => void;
}) {
  const [expanded, setExpanded] = useState(false);

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        code: false,
        codeBlock: false,
      }),
      Code,
      CodeBlock,
      Link.configure({
        HTMLAttributes: { target: "_blank", rel: "noopener noreferrer" },
      }),
      Image,
    ],
    content: value,
    immediatelyRender: false,
    onUpdate: ({ editor }) => onChange(editor.getHTML()),
  });

  if (!editor) return null;

  return (
    <>
      {!expanded && (
        <div className="border rounded p-2">
          <div className="flex justify-between items-center px-2 mb-2 border-b border-white">
            <Toolbar editor={editor} />
            <button
              type="button"
              onClick={() => setExpanded(true)}
              className="px-2 py-1 rounded border border-white px-3 mb-2"
            >
              Expandir
            </button>
          </div>
          <EditorContent editor={editor} className="min-h-[200px] px-4" />
        </div>
      )}

      {expanded && (
        <div className="fixed inset-0 bg-black/50 z-40 flex justify-center items-center">
          <div className="bg-black w-full max-w-5xl h-[90vh] flex flex-col rounded shadow-lg">
            <div className="flex justify-between items-center border-b p-2">
              <Toolbar editor={editor} />
              <button
                type="button"
                onClick={() => setExpanded(false)}
                className="ml-auto bg-black px-2 py-1 rounded"
              >
                Cerrar
              </button>
            </div>
            <div className="flex-1 overflow-y-auto">
              <EditorContent editor={editor} className="p-2 min-h-[400px]" />
            </div>
          </div>
        </div>
      )}
    </>
  );
}
