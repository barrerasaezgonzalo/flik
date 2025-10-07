// File: components/MiniEditor.tsx
"use client";

import dynamic from "next/dynamic";
import React, { useRef } from "react";

// Import dinámico para evitar SSR
const TinyMCEEditor = dynamic(
  () => import("@tinymce/tinymce-react").then((mod) => mod.Editor),
  { ssr: false },
);

interface MiniEditorProps {
  value: string;
  onChange: (html: string) => void;
}

export default function MiniEditor({ value, onChange }: MiniEditorProps) {
  const editorRef = useRef<any>(null);

  return (
    <div className="border rounded p-1 bg-white text-black">
      <TinyMCEEditor
        apiKey="02l1d70mmojof3cugn1ifs6v7nj4c2wcy6k0x9s2ieh99b8m"
        onInit={(evt, editor) => (editorRef.current = editor)}
        value={value}
        onEditorChange={(content) => onChange(content)}
        init={{
          height: 600,
          menubar: true,
          plugins: "link image lists code codesample",
          toolbar:
            "bold | h2 | bullist numlist | link image | code | codesample",
          content_style: `
          body { 
            background-color: #1a1a1a;  /* fondo oscuro */
            color: #ffffff;             /* texto blanco */
            font-family: Arial, sans-serif;
            font-size: 14px;
          }
          a { color: #4ea1f3; }        /* enlaces en azul claro */
          h2 { color: #ffffff; }       /* H2 también en blanco */
        `,
          forced_root_block: "",
          setup: (editor) => {
            // Limpia <pre>&nbsp;</pre> vacíos
            editor.on("blur", () => {
              let content = editor.getContent();

              // 1️⃣ Elimina <pre>&nbsp;</pre> vacíos
              content = content.replace(/<pre>(&nbsp;|\s)*<\/pre>/g, "");

              // 2️⃣ Elimina <br> consecutivos duplicados
              content = content.replace(/(<br\s*\/?>\s*){2,}/g, "<br>");

              // 3️⃣ Elimina <br> al final del contenido
              content = content.replace(/(<br\s*\/?>\s*)+$/g, "");

              editor.setContent(content);
            });
          },
          force_br_newlines: false,
          force_p_newlines: false,
          branding: false,
          toolbar_sticky: true,
        }}
      />
    </div>
  );
}
