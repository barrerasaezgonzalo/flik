// File: constants.test.ts
import { describe, it, expect } from "vitest";
import {
  SITE_URL,
  SITE_TITLE,
  SITE_DESCRIPTION,
  SITE_OG_IMAGE,
} from "./constants"; // Ajusta la ruta según donde esté tu archivo
import React from "react";

describe("Site constants", () => {
  it("should have the correct values", () => {
    expect(SITE_URL).toBe("https://flik.cl");
    expect(SITE_TITLE).toBe("Flik: Blog de tecnología, programación, AI y más");
    expect(SITE_DESCRIPTION).toBe(
      "Descubre tutoriales, guías, noticias y novedades en tecnología, programación, inteligencia artificial, testing y seguridad. Aprende sobre tendencias digitales y explora contenidos innovadores en español con Flik.",
    );
    expect(SITE_OG_IMAGE).toBe(`${SITE_URL}/og_logo.png`);
  });
});
