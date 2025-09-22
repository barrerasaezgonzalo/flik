"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { addComment } from "@/lib/comments";
import { formatDate } from "@/lib/utils";
import { Comment } from "@/types";
import React from "react";

export default function Comments({
  postId,
  initialComments,
}: {
  postId: string;
  initialComments: Comment[];
}) {
  const router = useRouter();
  const formRef = useRef<HTMLFormElement>(null);

  const [errorEmail, setErrorEmail] = useState<string | null>(null);
  const [errorContent, setErrorContent] = useState<string | null>(null);

  const handleSubmit = async (formData: FormData): Promise<boolean> => {
    const email = (formData.get("email") as string)?.trim();
    const content = (formData.get("content") as string)?.trim();

    let hasError = false;

    if (!email) {
      setErrorEmail("El correo electrónico es obligatorio.");
      hasError = true;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setErrorEmail("Ingresa un correo válido.");
      hasError = true;
    } else {
      setErrorEmail(null);
    }

    if (!content) {
      setErrorContent("El comentario no puede estar vacío.");
      hasError = true;
    } else if (content.length < 5) {
      setErrorContent("El comentario debe tener al menos 5 caracteres.");
      hasError = true;
    } else {
      setErrorContent(null);
    }

    if (hasError) return false;

    try {
      await addComment({ postId, email, content });
      return true;
    } catch (err) {
      console.error("Failed to add comment:", err);
      // Podrías setear un error genérico acá si querés
      return false;
    }
  };

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form);

    const ok = await handleSubmit(formData);
    if (ok) {
      form.reset(); // 🔒 solo resetea cuando todo fue válido
      router.refresh(); // 🔄 recarga comentarios desde el servidor
    }
  };

  return (
    <section className="border-t pt-8 mt-12" aria-labelledby="formTitle">
      <h2 className="text-2xl font-bold mb-4 sr-only" id="formTitle">
        Comentarios ({initialComments.length})
      </h2>

      <div className="bg-white p-6 rounded-lg shadow-sm mb-8">
        <form
          ref={formRef}
          onSubmit={onSubmit}
          noValidate
          className="space-y-4"
        >
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Correo electrónico
            </label>
            <input
              autoComplete="email"
              type="text"
              id="email"
              name="email"
              aria-describedby="emailError"
              aria-invalid={!!errorEmail}
              className="text-black w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
            />
            {errorEmail && (
              <p id="emailError" className="text-red-600 text-sm mt-1">
                {errorEmail}
              </p>
            )}
          </div>
          <div>
            <label
              htmlFor="content"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Comentario
            </label>
            <textarea
              autoComplete="off"
              id="content"
              name="content"
              rows={4}
              aria-describedby="contentError"
              aria-invalid={!!errorContent}
              className="text-black w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
            />
            {errorContent && (
              <p id="contentError" className="text-red-600 text-sm mt-1">
                {errorContent}
              </p>
            )}
          </div>
          <button
            aria-label="Enviar comentario"
            type="submit"
            className="px-4 py-2 bg-black text-white rounded-md hover:bg-black/80 focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2 transition-colors"
          >
            Enviar Comentario
          </button>
        </form>
      </div>

      <div className="space-y-6">
        {initialComments.map((comment) => (
          <div key={comment.id} className="bg-white p-4 rounded-lg shadow-sm">
            <div className="flex items-center mb-2">
              <p className="font-semibold text-gray-800 mr-2">
                {comment.email}
              </p>
              <p className="text-xs text-gray-500">
                {formatDate(comment.date)}
              </p>
            </div>
            <p className="text-gray-700">{comment.content}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
