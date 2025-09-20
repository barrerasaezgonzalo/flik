"use client";

import { useRef } from "react";
import { useRouter } from "next/navigation";
import { addComment } from "@/lib/comments";
import { formatDate } from "@/lib/utils";
import { Comment } from "@/types";

export default function Comments({
  postId,
  initialComments,
}: {
  postId: string;
  initialComments: Comment[];
}) {
  const router = useRouter();
  const formRef = useRef<HTMLFormElement>(null);

  const handleSubmit = async (formData: FormData) => {
    const email = formData.get("email") as string;
    const content = formData.get("content") as string;

    if (!email || !content) return;

    formRef.current?.reset();

    const newCommentData = { postId, email, content };

    try {
      await addComment(newCommentData);
      router.refresh(); // recarga todos desde el servidor
    } catch (error) {
      console.error("Failed to add comment:", error);
    }
  };

  return (
    <section className="border-t pt-8 mt-12">
      <h2 className="text-2xl font-bold mb-4">
        Comentarios ({initialComments.length})
      </h2>

      <div className="bg-white p-6 rounded-lg shadow-sm mb-8">
        <form ref={formRef} action={handleSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Correo electrónico
            </label>
            <input
              type="email"
              id="email"
              name="email"
              required
              className="text-black w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
            />
          </div>
          <div>
            <label
              htmlFor="content"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Comentario
            </label>
            <textarea
              id="content"
              name="content"
              rows={4}
              required
              className="text-black w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
            ></textarea>
          </div>
          <button
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
