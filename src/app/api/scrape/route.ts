// app/api/scrape/route.ts
import { NextResponse } from "next/server";
import * as cheerio from "cheerio";

function slugify(text: string) {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");
}

function absolutize(src?: string | null, base?: string) {
  if (!src) return null;
  try {
    return new URL(src, base).href;
  } catch {
    return src;
  }
}

export async function POST(req: Request) {
  try {
    const { url } = await req.json();
    if (!url) return NextResponse.json({ error: "Falta URL" }, { status: 400 });

    const res = await fetch(url);
    const html = await res.text();
    const $ = cheerio.load(html);

    const title =
      $("h1").first().text().trim() ||
      $('meta[property="og:title"]').attr("content") ||
      "";

    // Raíz de contenido
    const root = $("article").first().length
      ? $("article").first()
      : $("main").first();

    // Clonar y LIMPIAR antes de extraer texto
    const $clone = root.clone();

    // Quita JS, estilos, ads, shares, comentarios, embeds
    $clone
      .find(
        `
      script, style, noscript, template, iframe, svg, video, audio, form, button,
      .ad, .ads, [class*="ad-"], .advert, .advertisement,
      .share, .social, .comments, .comment, .related, .banner, .cookie,
      [data-component*="share"], [role="button"], .js-whatsapp
    `,
      )
      .remove();

    // Texto compacto
    const content = $clone.text().replace(/\s+/g, " ").trim();

    // Imagen: og:image -> 1ª del contenido limpio
    const ogImg = $('meta[property="og:image"]').attr("content");
    const imgInContent = $clone.find("img").first().attr("src");
    const image = absolutize(ogImg || imgInContent || null, url);

    const excerpt = content.slice(0, 200) + (content.length > 200 ? "…" : "");
    const slug = slugify(title);

    return NextResponse.json({
      title,
      slug,
      excerpt,
      content: content.slice(0, 5000),
      image,
      source: url,
    });
  } catch (e) {
    return NextResponse.json(
      { error: "Error al procesar la URL" },
      { status: 500 },
    );
  }
}
