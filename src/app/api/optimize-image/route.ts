import { NextRequest, NextResponse } from "next/server";
import path from "path";
import fs from "fs/promises";
import sharp from "sharp";

export async function POST(req: NextRequest) {
  try {
    const { fileName } = await req.json();

    if (!fileName) {
      return NextResponse.json(
        { ok: false, error: "Falta fileName" },
        { status: 400 },
      );
    }

    // Ruta de entrada (ej: public/posts/imagen.png)
    const inPath = path.join(process.cwd(), "public", fileName);

    // Leer archivo original
    const buffer = await fs.readFile(inPath);

    // Crear carpeta de salida
    const uploadsDir = path.join(process.cwd(), "public", "uploads");
    await fs.mkdir(uploadsDir, { recursive: true });

    // Nombre optimizado
    const baseName = path.basename(fileName).replace(/\s+/g, "-");
    const outPath = path.join(uploadsDir, `opt-${Date.now()}-${baseName}`);

    // Optimizar con Sharp
    await sharp(buffer)
      .resize({ width: 900 })
      .png({ quality: 80, compressionLevel: 9 })
      .toFile(outPath);

    const url = `/uploads/${path.basename(outPath)}`;

    return NextResponse.json({ ok: true, url });
  } catch (err) {
    console.error("Error en optimize-image:", err);
    return NextResponse.json(
      { ok: false, error: String(err) },
      { status: 500 },
    );
  }
}
