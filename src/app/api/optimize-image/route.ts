import { NextRequest, NextResponse } from "next/server";
import path from "path";
import fs from "fs/promises";
import sharp from "sharp";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json(
        { ok: false, error: "No se envió archivo" },
        { status: 400 },
      );
    }

    // Convertir File → Buffer
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Crear carpeta /public/uploads si no existe
    const uploadsDir = path.join(process.cwd(), "public", "uploads");
    await fs.mkdir(uploadsDir, { recursive: true });

    // Nombre único (ej: timestamp + nombre original limpio)
    const fileName = `${Date.now()}-${file.name.replace(/\s+/g, "-")}`;
    const outPath = path.join(uploadsDir, fileName);

    // Optimizar con Sharp
    await sharp(buffer)
      .resize({ width: 900 })
      .png({ quality: 80, compressionLevel: 9 })
      .toFile(outPath);

    // URL pública
    const url = `/uploads/${fileName}`;

    return NextResponse.json({ ok: true, url });
  } catch (err) {
    console.error("Error en optimize-image:", err);
    return NextResponse.json(
      { ok: false, error: String(err) },
      { status: 500 },
    );
  }
}
