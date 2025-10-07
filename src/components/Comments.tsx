"use client";
import React, { useState, useRef, useEffect } from "react";
import { supabase } from "@/lib/supabaseClient";
import { formatDate } from "@/lib/utils";
import type {
  CommentFormProps,
  CommentsErrors,
  Comment,
} from "@/types/comment";

export default function CommentForm({ postId }: CommentFormProps) {
  const [email, setEmail] = useState("");
  const [body, setBody] = useState("");
  const [sending, setSending] = useState(false);
  const [ok, setOk] = useState(false);
  const [errors, setErrors] = useState<CommentsErrors>({});
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const hp = useRef(""); // honeypot
  const max = 500;

  const obf = (e: string) => {
    if (!e) return "";
    const [u, d] = e.split("@");
    return `${u?.slice(0, 2) || ""}***@${d || ""}`;
  };

  // ✅ validación parametrizable (no depende de state)
  function validateLive(nextEmail = email, nextBody = body) {
    const e: CommentsErrors = {};

    const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(nextEmail);
    if (!emailOk) e.email = "Ingresa un correo válido.";

    const len = nextBody.trim().length;
    if (len === 0) e.body = "El comentario no puede estar vacío.";
    else if (len >= max) e.body = `Máximo ${max} caracteres.`;

    setErrors(e);
    return Object.keys(e).length === 0;
  }

  useEffect(() => {
    const fetchComments = async () => {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from("comments")
          .select("*")
          .eq("postId", postId)
          .order("date", { ascending: false });
        if (error) throw error;
        setComments(data ?? []);
      } catch (err: any) {
        setError(err.message || "Error cargando comentarios");
      } finally {
        setLoading(false);
      }
    };
    fetchComments();
  }, [postId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateLive() || hp.current) return;

    try {
      setSending(true);
      setError(null);

      const { data, error } = await supabase
        .from("comments")
        .insert({ postId, email, content: body })
        .select()
        .single();

      if (error) throw error;
      setComments((prev) => [data, ...prev]);
      setOk(true);
      setEmail("");
      setBody("");
      setErrors({});

      setTimeout(() => setOk(false), 3000);
    } catch (err: any) {
      console.error("Error al enviar comentario:", err);
      setError(err.message || "Error enviando comentario");
    } finally {
      setSending(false);
    }
  };

  // ✅ ahora pasan el valor actualizado
  const handleEmailChange = (v: string) => {
    setEmail(v);
    validateLive(v, body);
  };

  const handleBodyChange = (v: string) => {
    setBody(v);
    validateLive(email, v);
  };

  const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const bodyOk = body.trim().length > 0 && body.trim().length <= max;
  const hasErrors = Object.keys(errors).length > 0;
  const formDisabled = sending || hasErrors || !emailOk || !bodyOk;

  return (
    <>
      <form
        onSubmit={handleSubmit}
        className="mt-8 rounded-2xl border border-zinc-800 bg-zinc-900/60 p-6 text-zinc-200"
        noValidate
      >
        <input
          type="text"
          tabIndex={-1}
          autoComplete="off"
          className="hidden"
          onChange={(e) => (hp.current = e.target.value)}
        />

        {/* Email */}
        <div className="mb-4">
          <label className="mb-1 block text-sm text-zinc-300">
            Correo electrónico
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => handleEmailChange(e.target.value)}
            placeholder="tu@correo.com"
            className={`w-full rounded-lg border bg-zinc-950/60 p-3 outline-none transition ${
              errors.email
                ? "border-red-500 focus:ring-2 ring-red-500/40"
                : "border-zinc-700 focus:ring-2 ring-emerald-500/30"
            }`}
          />
          <p className="mt-1 h-4 text-xs text-red-400" aria-live="polite">
            {errors.email || " "}
          </p>
        </div>

        {/* Comentario */}
        <div className="mb-4">
          <label className="mb-1 block text-sm text-zinc-300">Comentario</label>
          <textarea
            value={body}
            onChange={(e) => {
              handleBodyChange(e.target.value);
              e.target.style.height = "auto";
              e.target.style.height = e.target.scrollHeight + "px";
            }}
            placeholder="¿Qué te pareció?"
            rows={4}
            className={`w-full resize-none rounded-lg border bg-zinc-950/60 p-3 outline-none transition ${
              errors.body
                ? "border-red-500 focus:ring-2 ring-red-500/40"
                : "border-zinc-700 focus:ring-2 ring-emerald-500/30"
            }`}
          />
          <div className="mt-1 flex items-center justify-between text-xs">
            <span className="h-4 text-red-400">{errors.body || " "}</span>
            <span
              className={`${
                body.length >= 470
                  ? "text-red-400 font-semibold"
                  : "text-zinc-400"
              }`}
            >
              {body.length}/{max}
            </span>
          </div>
        </div>

        <button
          type="submit"
          disabled={formDisabled}
          className="inline-flex items-center gap-2 rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-emerald-500 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {sending ? (
            <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-white/70 border-t-transparent" />
          ) : (
            "Enviar comentario"
          )}
        </button>

        {ok && (
          <div className="mt-3 text-sm text-emerald-400">
            ¡Gracias! Tu comentario quedó enviado.
          </div>
        )}

        {error && <div className="mt-3 text-sm text-red-400">{error}</div>}
      </form>

      {/* Lista de comentarios */}
      <section className="mt-8">
        <h3 className="mb-3 text-base font-medium text-zinc-200">
          Comentarios
        </h3>
        {loading ? (
          <p>Cargando comentarios...</p>
        ) : error ? (
          <p>Error: {error}</p>
        ) : (
          <ul className="space-y-4">
            {comments.map((comment: Comment) => (
              <li
                key={comment.id}
                className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-4"
              >
                <div className="mb-1 flex items-center justify-between text-xs text-zinc-400">
                  <span>{obf(comment.email)}</span>
                  <time dateTime={comment.date}>
                    {formatDate(comment.date)}
                  </time>
                </div>
                <p className="whitespace-pre-wrap text-sm text-zinc-200">
                  {comment.content}
                </p>
              </li>
            ))}
          </ul>
        )}
      </section>
    </>
  );
}
