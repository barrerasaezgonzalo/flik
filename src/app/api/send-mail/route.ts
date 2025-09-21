import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { record } = body;
    // Supabase manda { type, table, record, schema }

    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: "Flik <hola@flik.cl>", // cambia luego a tu dominio verificado
        to: "barrerasaezgonzalo@gmail.com",
        subject: `💬 Nuevo comentario en el post ${record.postid}`,
        html: `
          <p><b>${record.email}</b> comentó:</p>
          <p>${record.content}</p>
        `,
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      return NextResponse.json({ error }, { status: 500 });
    }

    return NextResponse.json({ success: true });

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
