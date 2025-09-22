import { NextResponse } from "next/server";
import { Resend } from "resend";
import { createClient } from "@supabase/supabase-js";

// ⚠️ Variables de entorno (en Vercel → Settings → Environment Variables)
const resend = new Resend(process.env.RESEND_API_KEY);

// 👇 Usa la Service Role Key, solo en backend
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: Request) {
  try {
    const body = await req.json();
    console.log("Webhook recibido:", JSON.stringify(body, null, 2));

    const { type, table, record } = body;

    if (type !== "INSERT" || table !== "comments") {
      return NextResponse.json(
        { ok: false, reason: "Evento no soportado" },
        { status: 400 }
      );
    }

    // Buscar info del post relacionado
    const { data: post, error } = await supabase
      .from("posts")
      .select("slug, title")
      .eq("id", record.postId)
      .single();

    if (error) {
      console.error("Error buscando post:", error);
    }

    const postLabel = post?.title || post?.slug || record.postId;

    // Enviar correo con Resend
    const data = await resend.emails.send({
      from: "Flik <onboarding@resend.dev>", // o dominio validado
      to: "barrerasaezgonzalo@gmail.com", // 👈 poné tu email real
      subject: `Nuevo comentario en ${postLabel}`,
      html: `
        <h2>💬 Nuevo comentario en Flik</h2>
        <p><strong>Post:</strong> ${postLabel}</p>
        <p><strong>Email:</strong> ${record.email}</p>
        <p><strong>Contenido:</strong></p>
        <blockquote>${record.content}</blockquote>
      `,
      text: `💬 Nuevo comentario en Flik
Post: ${postLabel}
Email: ${record.email}
Contenido: ${record.content}`,
    });

    return NextResponse.json({ ok: true, data });
  } catch (error) {
    console.error("Error en send-email:", error);
    return NextResponse.json(
      { ok: false, error: String(error) },
      { status: 500 }
    );
  }
}
