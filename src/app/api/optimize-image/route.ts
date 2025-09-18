import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import sharp from "sharp";

export async function POST(req: NextRequest) {
  try {
    const { fileName } = await req.json();

    const imagePath = path.join(process.cwd(), "public", fileName);

    if (!fs.existsSync(imagePath)) {
      return NextResponse.json(
        { ok: false, error: "El archivo no existe en /public" },
        { status: 404 }
      );
    }

    const buffer = await sharp(imagePath)
      .resize({ width: 900 })
      .png({ quality: 80, compressionLevel: 9 }) // PNG comprimido
      .toBuffer();

    await fs.promises.writeFile(imagePath, buffer);

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ ok: false, error: String(err) }, { status: 500 });
  }
}
