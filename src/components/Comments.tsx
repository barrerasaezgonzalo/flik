"use client";

import { useState, useRef } from "react";
import { formatDate } from "@/lib/utils";
import { addComment } from "@/lib/comments";
import { useRouter } from 'next/navigation';
import type { CommentFormProps, CommentsErrors, Comment } from "@/types/comment";

export default function CommentForm({ postId, comments }: CommentFormProps) {
  const [email, setEmail] = useState("");
  const [body, setBody] = useState("");
  const [sending, setSending] = useState(false);
  const [ok, setOk] = useState(false);
  const [errors, setErrors] = useState<CommentsErrors>({});
  const hp = useRef("");
  const router = useRouter();
  const max = 500;
  const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const bodyOk = body.trim().length > 0 && body.length <= max;
  const formOk = emailOk && bodyOk && !sending;

  function validateLive() {
    const e: CommentsErrors = {};
    if (!emailOk) e.email = "Ingresa un correo válido.";
    if (!bodyOk) e.body = body.trim() ? "Máximo 500 caracteres." : "El comentario no puede estar vacío.";
    setErrors(e);
  }

  async function handleSubmit(e: { preventDefault: () => void }) {
    e.preventDefault();
    validateLive();
    if (!formOk) return;
    if (hp.current) return; // honeypot

    try {
      setSending(true);
      await addComment({ postId, email, content: body });
      setOk(true);
      setEmail("");
      setBody("");
      setErrors({});
      router.refresh(); 
    } finally {
      setSending(false);
      setTimeout(() => setOk(false), 3000);
    }
  }

  const obf = (e: string) => {
    if (!e) return "";
    const [u, d] = e.split("@");
    return `${u?.slice(0, 2) || ""}***@${d || ""}`;
  };

  return (
    <>
      <form
        onSubmit={handleSubmit}
        className="mt-8 rounded-2xl border border-zinc-800 bg-zinc-900/60 p-6 text-zinc-200"
        noValidate
      >
        {/* honeypot */}
        <input
          type="text"
          tabIndex={-1}
          autoComplete="off"
          className="hidden"
          onChange={(e) => (hp.current = e.target.value)}
        />

        <div className="mb-4">
          <label className="mb-1 block text-sm text-zinc-300">Correo electrónico</label>
          <input
            type="email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              validateLive();
            }}
            placeholder="tu@correo.com"
            className={`w-full rounded-lg border bg-zinc-950/60 p-3 outline-none transition ${errors.email ? "border-red-500 focus:ring-2 ring-red-500/40" : "border-zinc-700 focus:ring-2 ring-emerald-500/30"
              }`}
          />
          <p aria-live="polite" className="mt-1 h-4 text-xs text-red-400">
            {errors.email || " "}
          </p>
        </div>

        <div className="mb-4">
          <label className="mb-1 block text-sm text-zinc-300">Comentario</label>
          <textarea
            value={body}
            onChange={(e) => {
              setBody(e.target.value);
              e.target.style.height = "auto";
              e.target.style.height = e.target.scrollHeight + "px";
              validateLive();
            }}
            placeholder="¿Qué te pareció?"
            rows={4}
            maxLength={max}
            className={`w-full resize-none rounded-lg border bg-zinc-950/60 p-3 outline-none transition ${errors.body ? "border-red-500 focus:ring-2 ring-red-500/40" : "border-zinc-700 focus:ring-2 ring-emerald-500/30"
              }`}
          />
          <div className="mt-1 flex items-center justify-between text-xs">
            <span aria-live="polite" className="h-4 text-red-400">
              {errors.body || " "}
            </span>
            <span className="text-zinc-400">
              {body.length}/{max}
            </span>
          </div>
        </div>

        <button
          type="submit"
          disabled={!formOk}
          className="inline-flex items-center gap-2 rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-emerald-500 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {sending ? (
            <>
              <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-white/70 border-t-transparent" />
              Enviando…
            </>
          ) : (
            "Enviar comentario"
          )}
        </button>

        {ok && <div className="mt-3 text-sm text-emerald-400">¡Gracias! Tu comentario quedó enviado.</div>}
      </form>

      <section className="mt-8">
        <h3 className="mb-3 text-base font-medium text-zinc-200">Comentarios</h3>
        <ul className="space-y-4">
          {comments?.map((comment: Comment) => (
            <li key={comment.id} className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-4">
              <div className="mb-1 flex items-center justify-between text-xs text-zinc-400">
                <span>{obf(comment.email)}</span>
                <time dateTime={comment.date}>{formatDate(comment.date)}</time>
              </div>
              <p className="whitespace-pre-wrap text-sm text-zinc-200">{comment.content}</p>
            </li>
          ))}
        </ul>
      </section>
    </>
  );
}
