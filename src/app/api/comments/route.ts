import { supabase } from "@/lib/supabaseClient";
import { NextResponse } from "next/server";

export const revalidate = 0; // desactiva cache

export async function GET() {
  const { data, error } = await supabase
    .from("comments")
    .select("*")
    .order("date", { ascending: false });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data, {
    headers: { "Cache-Control": "no-store" },
  });
}

export async function POST(req: Request) {
  const body = await req.json();

  if (!body.postId || !body.email || !body.content) {
    return NextResponse.json(
      { error: "Faltan campos obligatorios" },
      { status: 400 },
    );
  }

  const { data, error } = await supabase
    .from("comments")
    .insert({
      postId: body.postId,
      email: body.email,
      content: body.content,
    })
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data, { status: 201 });
}
